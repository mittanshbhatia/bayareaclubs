import "server-only";

import { requireActiveUser, requirePlatformAdmin } from "@/lib/auth/authorization";
import { postgrestIlikeOr } from "@/lib/supabase/postgrest-filter";
import { createClient } from "@/lib/supabase/server";
import type { CatalogFilters } from "@/lib/validation/stem";
import type { Database } from "@/types/database.generated";

type CourseRow = Database["public"]["Views"]["published_stem_courses"]["Row"];

function effortBounds(effort?: CatalogFilters["effort"]) {
  if (effort === "under_60") return { min: 1, max: 59 };
  if (effort === "60_300") return { min: 60, max: 300 };
  if (effort === "over_300") return { min: 301, max: null };
  return null;
}

export async function listPublishedCourses(filters: CatalogFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("published_stem_courses")
    .select("*")
    .order("title", { ascending: true })
    .limit(100);

  if (filters.discipline) query = query.eq("discipline", filters.discipline);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
  if (filters.format) query = query.eq("format", filters.format);
  if (filters.gradeBand) query = query.contains("grade_bands", [filters.gradeBand]);
  if (filters.q) {
    const orFilter = postgrestIlikeOr(
      ["title", "description", "provider_name"],
      filters.q,
    );
    if (orFilter) query = query.or(orFilter);
  }

  const bounds = effortBounds(filters.effort);
  if (bounds) {
    query = query.gte("estimated_minutes", bounds.min);
    if (bounds.max != null) query = query.lte("estimated_minutes", bounds.max);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CourseRow[];
}

export async function getPublishedCourseBySlug(slug: string) {
  const supabase = await createClient();
  const { data: course, error } = await supabase
    .from("published_stem_courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!course?.id) return null;

  const { data: modules, error: modulesError } = await supabase
    .from("published_stem_course_modules")
    .select("*")
    .eq("course_id", course.id)
    .order("position", { ascending: true });
  if (modulesError) throw modulesError;

  const moduleIds = (modules ?? [])
    .map((row) => row.id)
    .filter((id): id is string => Boolean(id));
  const { data: resources, error: resourcesError } = moduleIds.length
    ? await supabase
        .from("published_stem_resources")
        .select("*")
        .in("module_id", moduleIds)
        .order("position", { ascending: true })
    : { data: [], error: null };
  if (resourcesError) throw resourcesError;

  return {
    course,
    modules: modules ?? [],
    resources: resources ?? [],
  };
}

export async function getMySubscription(courseId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_subscriptions")
    .select("id, status, subscribed_at, completed_at")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMyLearning(userId: string) {
  await requireActiveUser();
  const supabase = await createClient();
  const { data: subscriptions, error } = await supabase
    .from("course_subscriptions")
    .select("id, status, subscribed_at, completed_at, course_id")
    .eq("user_id", userId)
    .in("status", ["active", "completed", "paused"])
    .order("subscribed_at", { ascending: false })
    .limit(40);
  if (error) throw error;

  const courseIds = (subscriptions ?? []).map((row) => row.course_id);
  const { data: courses } = courseIds.length
    ? await supabase
        .from("published_stem_courses")
        .select("id, slug, title, provider_name, discipline, difficulty, estimated_minutes")
        .in("id", courseIds)
    : { data: [] };

  const subscriptionIds = (subscriptions ?? []).map((row) => row.id);
  const { data: progress } = subscriptionIds.length
    ? await supabase
        .from("course_progress")
        .select("subscription_id, resource_id, completed, progress_percent, started_at, completed_at, updated_at")
        .in("subscription_id", subscriptionIds)
    : { data: [] };

  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));

  const detail = await Promise.all(
    (subscriptions ?? []).map(async (subscription) => {
      const course = courseMap.get(subscription.course_id) ?? null;
      const subProgress = (progress ?? []).filter(
        (row) => row.subscription_id === subscription.id,
      );
      let nextResource: {
        id: string;
        title: string;
        moduleTitle: string;
      } | null = null;

      if (course) {
        const detail = await getPublishedCourseBySlug(course.slug!);
        if (detail) {
          const completedIds = new Set(
            subProgress.filter((row) => row.completed).map((row) => row.resource_id),
          );
          for (const courseModule of detail.modules) {
            const moduleResources = detail.resources.filter(
              (resource) => resource.module_id === courseModule.id,
            );
            const upcoming = moduleResources.find(
              (resource) => resource.id && !completedIds.has(resource.id),
            );
            if (upcoming?.id) {
              nextResource = {
                id: upcoming.id,
                title: upcoming.title ?? "Next lesson",
                moduleTitle: courseModule.title ?? "Module",
              };
              break;
            }
          }
        }
      }

      const completedCount = subProgress.filter((row) => row.completed).length;
      const recent = [...subProgress]
        .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
        .slice(0, 3);

      return {
        subscription,
        course,
        completedCount,
        progressCount: subProgress.length,
        nextResource,
        recentActivity: recent,
      };
    }),
  );

  return detail;
}

export async function listClubRecommendations(clubId: string) {
  await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_resource_recommendations")
    .select("id, note, created_at, course_id, recommended_by")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const courseIds = (data ?? []).map((row) => row.course_id);
  const { data: courses } = courseIds.length
    ? await supabase.from("published_stem_courses").select("*").in("id", courseIds)
    : { data: [] };
  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));

  return (data ?? []).map((row) => ({
    ...row,
    course: courseMap.get(row.course_id) ?? null,
  }));
}

export async function listClubLearningCollections(clubId: string) {
  const supabase = await createClient();
  const { data: collections, error } = await supabase
    .from("club_learning_collections")
    .select("id, title, description, is_archived, created_at, created_by")
    .eq("club_id", clubId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const collectionIds = (collections ?? []).map((row) => row.id);
  const { data: items } = collectionIds.length
    ? await supabase
        .from("club_learning_collection_items")
        .select("id, collection_id, course_id, position, note")
        .in("collection_id", collectionIds)
        .order("position", { ascending: true })
    : { data: [] };

  const courseIds = [...new Set((items ?? []).map((item) => item.course_id))];
  const { data: courses } = courseIds.length
    ? await supabase
        .from("published_stem_courses")
        .select("id, slug, title, provider_name, discipline")
        .in("id", courseIds)
    : { data: [] };
  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));

  return (collections ?? []).map((collection) => ({
    ...collection,
    items: (items ?? [])
      .filter((item) => item.collection_id === collection.id)
      .map((item) => ({
        ...item,
        course: courseMap.get(item.course_id) ?? null,
      })),
  }));
}

export async function listAdminCourses() {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stem_courses")
    .select(
      "id, slug, title, provider_name, discipline, difficulty, format, status, is_free, last_verified_at, published_at, archived_at, estimated_minutes, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw error;

  const ids = (data ?? []).map((row) => row.id);
  const { data: metrics } = ids.length
    ? await supabase.from("stem_course_metrics").select("*").in("course_id", ids)
    : { data: [] };
  const metricsMap = new Map((metrics ?? []).map((row) => [row.course_id, row]));

  return (data ?? []).map((course) => ({
    ...course,
    metrics: metricsMap.get(course.id) ?? null,
  }));
}

export async function getAdminCourse(courseId: string) {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const { data: course, error } = await supabase
    .from("stem_courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;

  const { data: modules } = await supabase
    .from("stem_course_modules")
    .select("*")
    .eq("course_id", courseId)
    .order("position", { ascending: true });
  const moduleIds = (modules ?? []).map((module) => module.id);
  const { data: resources } = moduleIds.length
    ? await supabase
        .from("stem_resources")
        .select("*")
        .in("module_id", moduleIds)
        .order("position", { ascending: true })
    : { data: [] };
  const { data: metrics } = await supabase
    .from("stem_course_metrics")
    .select("*")
    .eq("course_id", courseId)
    .maybeSingle();

  return { course, modules: modules ?? [], resources: resources ?? [], metrics };
}
