import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  CATALOG_COVER_DIR,
  CATALOG_COVER_PIXELS,
  catalogCoverObjectPath,
} from "@/features/learn/catalog-covers";
import { FEATURED_NAMESPACES } from "@/features/learn/catalog-model";
import { courseCardSvgMarkup } from "@/features/learn/components/course-card-art";
import { hydrateShippingCourse } from "@/features/learn/courses/from-loader";
import { listShippingNamespaces } from "@/features/learn/courses/registry";
import { loaderCourseId } from "@/features/learn/courses/ids";
import type { LearningDatabase } from "@/features/learn/database";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database.generated";
import type { SupabaseClient } from "@supabase/supabase-js";

const STORAGE_BUCKET = "course-assets";

function catalogCoverBytes(namespace: string): {
  bytes: Uint8Array;
  mime: string;
  storagePath: string;
  width: number;
  height: number;
} {
  const candidates = [
    { ext: ".webp", mime: "image/webp" },
    { ext: ".jpg", mime: "image/jpeg" },
    { ext: ".jpeg", mime: "image/jpeg" },
    { ext: ".png", mime: "image/png" },
  ] as const;
  for (const candidate of candidates) {
    const filePath = resolve(CATALOG_COVER_DIR, `${namespace}${candidate.ext}`);
    if (!existsSync(filePath)) continue;
    return {
      bytes: readFileSync(filePath),
      mime: candidate.mime,
      storagePath:
        candidate.ext === ".jpg" || candidate.ext === ".jpeg"
          ? catalogCoverObjectPath(namespace)
          : `learn/${namespace}/card-cover${candidate.ext}`,
      width: CATALOG_COVER_PIXELS.width,
      height: CATALOG_COVER_PIXELS.height,
    };
  }
  const svg = courseCardSvgMarkup(namespace);
  return {
    bytes: new TextEncoder().encode(svg),
    mime: "image/svg+xml",
    storagePath: `learn/${namespace}/card-cover.svg`,
    width: 1152,
    height: 640,
  };
}

export async function persistShippingCatalog() {
  const admin = createAdminClient();
  const learn = admin as unknown as SupabaseClient<LearningDatabase>;
  const { data: actor, error: actorError } = await admin
    .from("platform_role_assignments")
    .select("user_id")
    .eq("role", "platform_admin")
    .is("revoked_at", null)
    .limit(1)
    .maybeSingle();
  let uploaderId = actor?.user_id ?? null;
  if (!uploaderId) {
    const { data: profile } = await admin.from("profiles").select("id").limit(1).maybeSingle();
    uploaderId = profile?.id ?? null;
  }
  if (!uploaderId) {
    throw new Error(
      `A profile is required to persist the catalog${actorError?.message ? `: ${actorError.message}` : "."}`,
    );
  }

  const { data: school, error: schoolError } = await admin
    .from("schools")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (schoolError || !school?.id) {
    throw new Error("A school row is required for course-assets metadata.");
  }

  const namespaces = listShippingNamespaces();
  const results: Array<{ namespace: string; courseId: string; questions: number; lessons: number }> =
    [];

  for (const namespace of namespaces) {
    const hydrated = await hydrateShippingCourse(namespace);
    if (!hydrated) continue;
    const courseId = loaderCourseId(namespace);
    const cover = catalogCoverBytes(namespace);
    const { bytes, mime, storagePath, width, height } = cover;

    const { error: uploadError } = await admin.storage.from(STORAGE_BUCKET).upload(storagePath, bytes, {
      contentType: mime,
      upsert: true,
    });
    if (uploadError) throw new Error(`${namespace} art upload failed: ${uploadError.message}`);

    const thumbnailId = crypto.randomUUID();
    const { error: mediaError } = await admin.from("media_assets").upsert({
      id: thumbnailId,
      school_id: school.id,
      title: `${hydrated.course.title} card art`,
      description: "Original BayAreaClubs catalog cover.",
      media_type: "image",
      mime_type: mime,
      storage_bucket: STORAGE_BUCKET,
      storage_path: storagePath,
      size_bytes: bytes.byteLength,
      width,
      height,
      visibility: "private",
      consent_required: false,
      uploader_id: uploaderId,
    });
    if (mediaError) {
      const { data: existing } = await admin
        .from("media_assets")
        .select("id")
        .eq("storage_bucket", STORAGE_BUCKET)
        .eq("storage_path", storagePath)
        .maybeSingle();
      if (!existing) throw new Error(`${namespace} media_assets failed: ${mediaError.message}`);
    }

    const { data: existingThumb } = await admin
      .from("media_assets")
      .select("id")
      .eq("storage_bucket", STORAGE_BUCKET)
      .eq("storage_path", storagePath)
      .maybeSingle();

    const { data: existingCourse } = await admin
      .from("stem_courses")
      .select("id, status")
      .eq("id", courseId)
      .maybeSingle();

    const featured = FEATURED_NAMESPACES.includes(
      namespace as (typeof FEATURED_NAMESPACES)[number],
    );
    const courseFields = {
      slug: namespace,
      course_namespace: namespace,
      title: hydrated.course.title,
      description: hydrated.course.description,
      discipline: hydrated.course.discipline,
      grade_bands: hydrated.course.grade_bands,
      difficulty: hydrated.course.difficulty,
      format: hydrated.course.format,
      estimated_minutes: hydrated.course.estimated_minutes,
      thumbnail_asset_id: existingThumb?.id ?? null,
      framework_code: hydrated.course.framework_code,
      framework_year: hydrated.course.framework_year,
      source_basis: "ORIGINAL" as const,
      course_kind: "ap" as const,
      is_free: true,
      provider_name: "BayAreaClubs",
      source_url: "https://bayareaclubs.vercel.app/dashboard/learn/ap",
      license_name: "Original BayAreaClubs material",
    };

    if (!existingCourse) {
      const { error: insertError } = await admin.from("stem_courses").insert({
        id: courseId,
        ...courseFields,
        status: "draft",
        created_by: uploaderId,
      });
      if (insertError) throw new Error(`${namespace} course insert failed: ${insertError.message}`);
      for (const next of ["review", "approved", "published"] as const) {
        const { error } = await admin.from("stem_courses").update({ status: next }).eq("id", courseId);
        if (error) throw new Error(`${namespace} could not move to ${next}: ${error.message}`);
      }
    } else {
      const { error: updateError } = await admin
        .from("stem_courses")
        .update(courseFields)
        .eq("id", courseId);
      if (updateError) throw new Error(`${namespace} course update failed: ${updateError.message}`);
    }

    const { error: featuredError } = await admin
      .from("stem_courses")
      .update({ is_featured: featured })
      .eq("id", courseId);
    if (featuredError) {
      throw new Error(`${namespace} featured flag failed: ${featuredError.message}`);
    }

    for (const unit of hydrated.units) {
      const { error } = await learn.from("stem_course_modules").upsert({
        id: unit.id,
        course_id: courseId,
        position: unit.position,
        title: unit.title,
        description: unit.description,
        estimated_minutes: unit.estimated_minutes,
        is_published: true,
        slug: unit.slug,
      });
      if (error) throw new Error(`${namespace} unit ${unit.slug} failed: ${error.message}`);
    }

    for (const lesson of hydrated.lessons) {
      const { error } = await learn.from("learning_lessons").upsert({
        id: lesson.id,
        course_id: courseId,
        module_id: lesson.module_id,
        namespace,
        slug: lesson.slug,
        position: lesson.position,
        title: lesson.title,
        body_plain: lesson.body_plain,
        estimated_minutes: lesson.estimated_minutes,
        status: "published",
        created_by: uploaderId,
      });
      if (error) throw new Error(`${namespace} lesson ${lesson.slug} failed: ${error.message}`);
    }

    for (const question of hydrated.questions) {
      const keyed = hydrated.keyedQuestions.find((row) => row.id === question.id);
      const { error } = await learn.from("learning_questions").upsert({
        id: question.id,
        course_id: courseId,
        namespace,
        module_id: question.module_id,
        lesson_id: question.lesson_id,
        slug: question.slug,
        prompt: question.prompt,
        choices: question.choices as Json,
        answer_key: { choiceId: keyed?.answerId ?? "a" },
        explanation: keyed?.explanation ?? null,
        question_type: question.question_type,
        objective_codes: question.objective_codes,
        difficulty: question.difficulty,
        source_basis: "ORIGINAL",
        status: "published",
        created_by: uploaderId,
      });
      if (error) throw new Error(`${namespace} question ${question.slug} failed: ${error.message}`);
    }

    results.push({
      namespace,
      courseId,
      questions: hydrated.questions.length,
      lessons: hydrated.lessons.length,
    });
  }

  return results;
}
