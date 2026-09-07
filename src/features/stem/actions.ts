"use server";

import { revalidatePath } from "next/cache";

import {
  AuthorizationError,
  requireActiveUser,
  requireClubManager,
  requirePlatformAdmin,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  adminCourseSchema,
  adminCourseStatusSchema,
  archiveCollectionSchema,
  collectionFormSchema,
  markResourceProgressSchema,
  recommendCourseSchema,
  removeRecommendationSchema,
  subscribeCourseSchema,
} from "@/lib/validation/stem";
import type { ActionResult } from "@/types/action-result";
import type { Database } from "@/types/database.generated";
import { emitNotificationToClubMembers } from "@/features/notifications/queries";

function validationFailure(
  fieldErrors: Record<string, string[] | undefined>,
): ActionResult<never> {
  return {
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Check the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    },
  };
}

function failure(code: string, message: string): ActionResult<never> {
  return { ok: false, error: { code, message } };
}

async function clubSlug(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("clubs").select("slug").eq("id", clubId).maybeSingle();
  return data?.slug ?? null;
}

function revalidateStem(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

export async function subscribeToCourse(
  input: unknown,
): Promise<ActionResult<{ subscriptionId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = subscribeCourseSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

    const supabase = await createClient();
    const { data: course } = await supabase
      .from("published_stem_courses")
      .select("id, slug, is_free")
      .eq("id", parsed.data.courseId)
      .maybeSingle();
    if (!course) return failure("NOT_FOUND", "Published free course not found.");
    if (course.is_free === false) {
      return failure("NOT_FREE", "Paid courses cannot be labeled or added as free.");
    }

    const { data, error } = await supabase
      .from("course_subscriptions")
      .upsert(
        {
          course_id: parsed.data.courseId,
          user_id: user.id,
          status: "active",
          completed_at: null,
        },
        { onConflict: "course_id,user_id" },
      )
      .select("id")
      .single();
    if (error || !data) return failure("SUBSCRIBE_FAILED", error?.message ?? "Could not subscribe.");

    revalidateStem([
      "/courses",
      "/dashboard/learn",
      "/dashboard",
      `/resources/${course.slug}`,
      "/resources",
    ]);
    return { ok: true, data: { subscriptionId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("stem.subscribe_failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not add course to your dashboard.");
  }
}

export async function markResourceProgress(
  input: unknown,
): Promise<ActionResult<{ progressId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = markResourceProgressSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    const supabase = await createClient();

    const { data: subscription } = await supabase
      .from("course_subscriptions")
      .select("id, status")
      .eq("course_id", parsed.data.courseId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!subscription) {
      return failure("NOT_SUBSCRIBED", "Add this course to your dashboard first.");
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("course_progress")
      .upsert(
        {
          subscription_id: subscription.id,
          resource_id: parsed.data.resourceId,
          completed: parsed.data.completed,
          progress_percent: parsed.data.completed ? 100 : 0,
          started_at: now,
          completed_at: parsed.data.completed ? now : null,
        },
        { onConflict: "subscription_id,resource_id" },
      )
      .select("id")
      .single();
    if (error || !data) {
      return failure("PROGRESS_FAILED", error?.message ?? "Could not update progress.");
    }

    if (parsed.data.completed) {
      const detail = await supabase
        .from("published_stem_resources")
        .select("id, module_id")
        .eq("id", parsed.data.resourceId)
        .maybeSingle();
      if (detail.data?.module_id) {
        const { data: modules } = await supabase
          .from("published_stem_course_modules")
          .select("id")
          .eq("course_id", parsed.data.courseId);
        const moduleIds = (modules ?? []).map((row) => row.id);
        const { data: allResources } = moduleIds.length
          ? await supabase
              .from("published_stem_resources")
              .select("id")
              .in("module_id", moduleIds)
          : { data: [] };
        const { data: completed } = await supabase
          .from("course_progress")
          .select("resource_id")
          .eq("subscription_id", subscription.id)
          .eq("completed", true);
        const completedSet = new Set((completed ?? []).map((row) => row.resource_id));
        completedSet.add(parsed.data.resourceId);
        const allDone =
          (allResources ?? []).length > 0 &&
          (allResources ?? []).every((row) => row.id && completedSet.has(row.id));
        if (allDone) {
          await supabase
            .from("course_subscriptions")
            .update({ status: "completed", completed_at: now })
            .eq("id", subscription.id);
        }
      }
    }

    revalidateStem(["/courses", "/dashboard/learn", "/dashboard"]);
    return { ok: true, data: { progressId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not update lesson progress.");
  }
}

export async function recommendCourseToClub(
  input: unknown,
): Promise<ActionResult<{ recommendationId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = recommendCourseSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("club_resource_recommendations")
      .upsert(
        {
          club_id: parsed.data.clubId,
          course_id: parsed.data.courseId,
          recommended_by: user.id,
          note: parsed.data.note || null,
        },
        { onConflict: "club_id,course_id" },
      )
      .select("id")
      .single();
    if (error || !data) {
      return failure("RECOMMEND_FAILED", error?.message ?? "Could not recommend course.");
    }

    const [{ data: course }, slug] = await Promise.all([
      supabase
        .from("stem_courses")
        .select("title, slug")
        .eq("id", parsed.data.courseId)
        .maybeSingle(),
      clubSlug(parsed.data.clubId),
    ]);
    try {
      await emitNotificationToClubMembers({
        clubId: parsed.data.clubId,
        type: "course_recommendation",
        title: "Course recommendation",
        body: `${course?.title ?? "A STEM course"} was recommended to your club.`,
        actionUrl: course?.slug
          ? `/resources/${course.slug}`
          : slug
            ? `/clubs/${slug}/resources`
            : "/resources",
        entityType: "stem_courses",
        entityId: parsed.data.courseId,
        excludeUserId: user.id,
        payload: { note: parsed.data.note || null },
      });
    } catch (notifyError) {
      logger.error("stem.recommend.notify_failed", {
        error: notifyError instanceof Error ? notifyError.message : "unknown",
      });
    }

    if (slug) revalidateStem([`/clubs/${slug}/resources`]);
    return { ok: true, data: { recommendationId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not save recommendation.");
  }
}

export async function removeClubRecommendation(
  input: unknown,
): Promise<ActionResult<{ recommendationId: string }>> {
  try {
    const parsed = removeRecommendationSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("club_resource_recommendations")
      .delete()
      .eq("id", parsed.data.recommendationId)
      .eq("club_id", parsed.data.clubId);
    if (error) return failure("DELETE_FAILED", error.message);
    const slug = await clubSlug(parsed.data.clubId);
    if (slug) revalidateStem([`/clubs/${slug}/resources`]);
    return { ok: true, data: { recommendationId: parsed.data.recommendationId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not remove recommendation.");
  }
}

export async function saveLearningCollection(
  input: unknown,
): Promise<ActionResult<{ collectionId: string }>> {
  try {
    const user = await requireActiveUser();
    const parsed = collectionFormSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    let collectionId = parsed.data.collectionId;
    if (collectionId) {
      const { error } = await supabase
        .from("club_learning_collections")
        .update({
          title: parsed.data.title,
          description: parsed.data.description || null,
        })
        .eq("id", collectionId)
        .eq("club_id", parsed.data.clubId);
      if (error) return failure("SAVE_FAILED", error.message);
    } else {
      const { data, error } = await supabase
        .from("club_learning_collections")
        .insert({
          club_id: parsed.data.clubId,
          title: parsed.data.title,
          description: parsed.data.description || null,
          created_by: user.id,
        })
        .select("id")
        .single();
      if (error || !data) return failure("SAVE_FAILED", error?.message ?? "Could not create collection.");
      collectionId = data.id;
    }

    await supabase
      .from("club_learning_collection_items")
      .delete()
      .eq("collection_id", collectionId);

    if (parsed.data.courseIds.length) {
      const { error: itemsError } = await supabase
        .from("club_learning_collection_items")
        .insert(
          parsed.data.courseIds.map((courseId, position) => ({
            collection_id: collectionId!,
            course_id: courseId,
            position,
          })),
        );
      if (itemsError) return failure("ITEMS_FAILED", itemsError.message);
    }

    const slug = await clubSlug(parsed.data.clubId);
    if (slug) revalidateStem([`/clubs/${slug}/resources`]);
    return { ok: true, data: { collectionId: collectionId! } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not save learning collection.");
  }
}

export async function archiveLearningCollection(
  input: unknown,
): Promise<ActionResult<{ collectionId: string }>> {
  try {
    const parsed = archiveCollectionSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("club_learning_collections")
      .update({ is_archived: true })
      .eq("id", parsed.data.collectionId)
      .eq("club_id", parsed.data.clubId);
    if (error) return failure("ARCHIVE_FAILED", error.message);
    const slug = await clubSlug(parsed.data.clubId);
    if (slug) revalidateStem([`/clubs/${slug}/resources`]);
    return { ok: true, data: { collectionId: parsed.data.collectionId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not archive collection.");
  }
}

export async function saveAdminCourse(
  input: unknown,
): Promise<ActionResult<{ courseId: string }>> {
  try {
    const user = await requirePlatformAdmin();
    const parsed = adminCourseSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    if (!parsed.data.isFree) {
      return failure("NOT_FREE", "Only free courses may be published in STEM Resources.");
    }

    const supabase = await createClient();
    const courseRow = {
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description,
      discipline: parsed.data.discipline as Database["public"]["Enums"]["stem_discipline"],
      grade_bands: parsed.data.gradeBands as Database["public"]["Enums"]["age_band"][],
      difficulty: parsed.data.difficulty as Database["public"]["Enums"]["course_difficulty"],
      format: parsed.data.format as Database["public"]["Enums"]["course_format"],
      estimated_minutes: parsed.data.estimatedMinutes ?? null,
      provider_name: parsed.data.providerName,
      source_url: parsed.data.sourceUrl,
      license_name: parsed.data.licenseName,
      license_url: parsed.data.licenseUrl || null,
      is_free: true as const,
      last_verified_at: parsed.data.lastVerifiedAt,
      created_by: user.id,
      status: "draft" as Database["public"]["Enums"]["publication_status"],
    };

    const { created_by, ...courseFields } = courseRow;
    void created_by;

    let courseId = parsed.data.courseId;
    if (courseId) {
      const { data: existing } = await supabase
        .from("stem_courses")
        .select("status")
        .eq("id", courseId)
        .maybeSingle();
      const { error } = await supabase
        .from("stem_courses")
        .update({
          ...courseFields,
          status: existing?.status ?? "draft",
        })
        .eq("id", courseId);
      if (error) return failure("SAVE_FAILED", error.message);
    } else {
      const { data, error } = await supabase
        .from("stem_courses")
        .insert(courseRow)
        .select("id")
        .single();
      if (error || !data) return failure("SAVE_FAILED", error?.message ?? "Could not create course.");
      courseId = data.id;
    }

    const { data: existingModules } = await supabase
      .from("stem_course_modules")
      .select("id")
      .eq("course_id", courseId);
    const existingModuleIds = (existingModules ?? []).map((row) => row.id);
    if (existingModuleIds.length) {
      await supabase.from("stem_resources").delete().in("module_id", existingModuleIds);
      await supabase.from("stem_course_modules").delete().eq("course_id", courseId);
    }

    for (const [moduleIndex, module] of parsed.data.modules.entries()) {
      const { data: moduleRow, error: moduleError } = await supabase
        .from("stem_course_modules")
        .insert({
          course_id: courseId,
          position: moduleIndex,
          title: module.title,
          description: module.description || null,
          estimated_minutes: module.estimatedMinutes ?? null,
          is_published: true,
        })
        .select("id")
        .single();
      if (moduleError || !moduleRow) {
        return failure("MODULE_FAILED", moduleError?.message ?? "Could not save module.");
      }

      const resourceRows = module.resources.map((resource, resourceIndex) => {
        if (!resource.externalUrl) {
          throw new Error("Each lesson needs an https external URL or owned media asset.");
        }
        return {
          module_id: moduleRow.id,
          position: resourceIndex,
          resource_type: resource.resourceType as Database["public"]["Enums"]["resource_type"],
          title: resource.title,
          description: resource.description || null,
          external_url: resource.externalUrl,
          estimated_minutes: resource.estimatedMinutes ?? null,
          is_published: true,
        };
      });
      const { error: resourcesError } = await supabase.from("stem_resources").insert(resourceRows);
      if (resourcesError) return failure("RESOURCE_FAILED", resourcesError.message);
    }

    revalidateStem(["/admin/resources", "/dashboard/platform/stem", "/resources", `/resources/${parsed.data.slug}`]);
    return { ok: true, data: { courseId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("stem.admin_save_failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return failure(
      "UNEXPECTED",
      error instanceof Error ? error.message : "Could not save course.",
    );
  }
}

export async function setAdminCourseStatus(
  input: unknown,
): Promise<ActionResult<{ courseId: string }>> {
  try {
    await requirePlatformAdmin();
    const parsed = adminCourseStatusSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    const supabase = await createClient();
    const { data: course, error } = await supabase
      .from("stem_courses")
      .update({
        status: parsed.data.status as Database["public"]["Enums"]["publication_status"],
      })
      .eq("id", parsed.data.courseId)
      .select("id, slug")
      .single();
    if (error || !course) return failure("STATUS_FAILED", error?.message ?? "Could not update status.");

    await supabase.from("audit_logs").insert({
      actor_id: (await requireActiveUser()).id,
      action: `stem_course.${parsed.data.status}`,
      entity_type: "stem_courses",
      entity_id: course.id,
      metadata: { status: parsed.data.status },
    });

    revalidateStem([
      "/admin/resources",
      "/dashboard/platform/stem",
      "/resources",
      course.slug ? `/resources/${course.slug}` : "/resources",
    ]);
    return { ok: true, data: { courseId: course.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not change course status.");
  }
}
