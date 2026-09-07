import "server-only";

import {
  continueLesson,
  courseProgress,
  featuredRegistryEntries,
  recentResults,
  weakAreas,
} from "@/features/learn/catalog-model";
import { hydrateShippingCourse } from "@/features/learn/courses/from-loader";
import { getRegistryEntry, listShippingNamespaces } from "@/features/learn/courses/registry";
import {
  createLearnClient,
  type LearningAttempt,
  type LearningAttemptAggregate,
  type LearningCourse,
  type LearningLesson,
  type LearningModule,
  type LearningReviewEvent,
  type PublishedApCourse,
  type StudentQuestion,
} from "@/features/learn/database";
import { requireActiveUser, requirePlatformAdmin } from "@/lib/auth/authorization";
import { LEARNING_CATALOG_PAGE_SIZE } from "@/lib/validation/learn";

export type PublishedApCatalogPage = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  courses: PublishedApCourse[];
  coverUrls: Readonly<Record<string, string>>;
};

export async function listPublishedApCatalog(
  page = 1,
  pageSize = LEARNING_CATALOG_PAGE_SIZE,
): Promise<PublishedApCatalogPage> {
  await requireActiveUser();
  const supabase = await createLearnClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("published_ap_courses")
    .select("*", { count: "exact" })
    .order("title", { ascending: true })
    .range(from, to);

  let courses = !error && data ? (data as PublishedApCourse[]) : [];
  if (error || courses.length === 0) {
    const shipping = await Promise.all(
      listShippingNamespaces().map((namespace) => hydrateShippingCourse(namespace)),
    );
    const fallback = shipping
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .map((row) => row.course);
    const seen = new Set(courses.map((course) => course.course_namespace));
    courses = [...courses, ...fallback.filter((course) => !seen.has(course.course_namespace))];
  }

  const total = count && count > 0 ? count : courses.length;
  const paged = courses.slice(from, to + 1);
  return {
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    courses: paged,
    coverUrls: await signCatalogCoverUrls(paged),
  };
}

export async function signCatalogCoverUrls(
  courses: readonly Pick<PublishedApCourse, "course_namespace" | "thumbnail_asset_id">[],
): Promise<Readonly<Record<string, string>>> {
  const ids = [
    ...new Set(
      courses
        .map((course) => course.thumbnail_asset_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  if (ids.length === 0) return {};

  const supabase = await createLearnClient();
  const { data: assets } = await supabase
    .from("media_assets")
    .select("id, storage_bucket, storage_path")
    .in("id", ids)
    .is("deleted_at", null);
  if (!assets?.length) return {};

  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const signed = await Promise.all(
    courses.map(async (course) => {
      const asset = course.thumbnail_asset_id
        ? byId.get(course.thumbnail_asset_id)
        : undefined;
      if (!asset) return null;
      const { data } = await supabase.storage
        .from(asset.storage_bucket)
        .createSignedUrl(asset.storage_path, 60 * 60);
      return data?.signedUrl
        ? ([course.course_namespace, data.signedUrl] as const)
        : null;
    }),
  );
  return Object.fromEntries(
    signed.filter((row): row is readonly [string, string] => Boolean(row)),
  );
}

export async function getCourseByNamespace(
  namespace: string,
  options: { admin?: boolean } = {},
) {
  const user = await requireActiveUser();
  const supabase = await createLearnClient();

  let isAdmin = options.admin === true;
  if (isAdmin) {
    try {
      await requirePlatformAdmin();
    } catch {
      isAdmin = false;
    }
  }

  const courseQuery = isAdmin
    ? supabase
        .from("stem_courses")
        .select("*")
        .eq("course_kind", "ap")
        .eq("course_namespace", namespace)
        .maybeSingle()
    : supabase
        .from("published_ap_courses")
        .select("*")
        .eq("course_namespace", namespace)
        .maybeSingle();

  const { data: course, error } = await courseQuery;
  if (error || !course) {
    const hydrated = await hydrateShippingCourse(namespace);
    if (hydrated) {
      return {
        actorId: user.id,
        isAdmin,
        registry: getRegistryEntry(namespace),
        course: hydrated.course,
        units: hydrated.units,
        lessons: hydrated.lessons,
      };
    }
    return {
      actorId: user.id,
      isAdmin,
      registry: getRegistryEntry(namespace),
      course: null as LearningCourse | PublishedApCourse | null,
      units: [] as LearningModule[],
      lessons: [] as LearningLesson[],
    };
  }

  const courseId = course.id;
  let unitsQuery = supabase
    .from("stem_course_modules")
    .select("*")
    .eq("course_id", courseId)
    .order("position", { ascending: true });
  if (!isAdmin) unitsQuery = unitsQuery.eq("is_published", true);

  const { data: units, error: unitsError } = await unitsQuery;
  if (unitsError) throw unitsError;

  let lessonsQuery = supabase
    .from("learning_lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("namespace", namespace)
    .order("position", { ascending: true });
  if (!isAdmin) lessonsQuery = lessonsQuery.eq("status", "published");

  const { data: lessons, error: lessonsError } = await lessonsQuery;
  if (lessonsError) throw lessonsError;

  return {
    actorId: user.id,
    isAdmin,
    registry: getRegistryEntry(namespace),
    course: course as LearningCourse | PublishedApCourse,
    units: (units ?? []) as LearningModule[],
    lessons: (lessons ?? []) as LearningLesson[],
  };
}

export async function getUnitBySlug(namespace: string, unitSlug: string) {
  const bundle = await getCourseByNamespace(namespace);
  const unit = bundle.units.find((row) => row.slug === unitSlug) ?? null;
  const lessons = unit
    ? bundle.lessons.filter((lesson) => lesson.module_id === unit.id)
    : [];
  return { ...bundle, unit, lessons };
}

export async function getLessonBySlug(
  namespace: string,
  unitSlug: string,
  lessonSlug: string,
) {
  const bundle = await getUnitBySlug(namespace, unitSlug);
  const lesson = bundle.lessons.find((row) => row.slug === lessonSlug) ?? null;
  return { ...bundle, lesson };
}

export async function listStudentQuestions(namespace: string, lessonId?: string) {
  await requireActiveUser();
  const supabase = await createLearnClient();
  let query = supabase
    .from("learning_questions_student")
    .select("*")
    .eq("namespace", namespace)
    .eq("status", "published")
    .order("slug", { ascending: true });
  if (lessonId) query = query.eq("lesson_id", lessonId);
  const { data, error } = await query;
  if (!error && data && data.length > 0) {
    return data as StudentQuestion[];
  }

  const hydrated = await hydrateShippingCourse(namespace);
  if (!hydrated) return [];
  if (!lessonId) return hydrated.questions;
  return hydrated.questions.filter((question) => question.lesson_id === lessonId);
}

export async function listMyAttempts(courseId: string, userId: string) {
  await requireActiveUser();
  const supabase = await createLearnClient();
  const { data, error } = await supabase
    .from("learning_attempts")
    .select("id, user_id, question_id, course_id, response, is_correct, created_at")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as LearningAttempt[];
}

export async function listCourseAttemptAggregates(courseId: string) {
  await requireActiveUser();
  const supabase = await createLearnClient();
  const { data, error } = await supabase
    .from("learning_attempt_aggregates")
    .select("*")
    .eq("course_id", courseId);
  if (error) throw error;
  return (data ?? []) as LearningAttemptAggregate[];
}

export async function listReviewQueue() {
  await requirePlatformAdmin();
  const supabase = await createLearnClient();
  const { data, error } = await supabase
    .from("stem_courses")
    .select(
      "id, slug, title, course_namespace, status, course_kind, source_basis, updated_at, approved_at",
    )
    .eq("course_kind", "ap")
    .in("status", ["draft", "review", "approved", "published"])
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function listReviewEvents(courseId: string) {
  await requirePlatformAdmin();
  const supabase = await createLearnClient();
  const { data, error } = await supabase
    .from("learning_review_events")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return (data ?? []) as LearningReviewEvent[];
}

export async function getMyLearnProgress() {
  const user = await requireActiveUser();
  const supabase = await createLearnClient();
  const { data: attempts, error } = await supabase
    .from("learning_attempts")
    .select("course_id, is_correct, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return [];

  const courseIds = [...new Set((attempts ?? []).map((row) => row.course_id))];
  const { data: courses } = courseIds.length
    ? await supabase
        .from("published_ap_courses")
        .select("id, title, course_namespace")
        .in("id", courseIds)
    : { data: [] };

  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));
  return (attempts ?? []).reduce<
    Array<{
      courseId: string;
      title: string;
      namespace: string;
      attemptCount: number;
      correctCount: number;
    }>
  >((acc, attempt) => {
    const existing = acc.find((row) => row.courseId === attempt.course_id);
    if (existing) {
      existing.attemptCount += 1;
      existing.correctCount += attempt.is_correct ? 1 : 0;
      return acc;
    }
    const course = courseMap.get(attempt.course_id);
    acc.push({
      courseId: attempt.course_id,
      title: course?.title ?? "Course",
      namespace: course?.course_namespace ?? "",
      attemptCount: 1,
      correctCount: attempt.is_correct ? 1 : 0,
    });
    return acc;
  }, []);
}

export async function listLearnHub(family: "all" | "cs" | "math" | "science" | "social" = "all") {
  const [catalog, progress] = await Promise.all([
    listPublishedApCatalog(1, 48),
    getMyLearnProgress(),
  ]);
  const featured = featuredRegistryEntries();
  return { catalog, progress, featured, family };
}

export async function getCourseWorkspace(namespace: string) {
  const bundle = await getCourseByNamespace(namespace);
  const questions = bundle.course ? await listStudentQuestions(namespace) : [];
  const attempts = bundle.course
    ? await listMyAttempts(bundle.course.id, bundle.actorId).catch(() => [])
    : [];

  const workspaceAttempts = attempts.map((attempt) => ({
    questionId: attempt.question_id,
    isCorrect: attempt.is_correct,
    createdAt: attempt.created_at,
  }));
  const workspaceLessons = bundle.lessons.map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    moduleId: lesson.module_id,
  }));
  const workspaceUnits = bundle.units.map((unit) => ({
    id: unit.id,
    slug: unit.slug,
    title: unit.title,
  }));
  const workspaceQuestions = questions.map((question) => ({
    id: question.id,
    slug: question.slug,
    lessonId: question.lesson_id,
    prompt: question.prompt,
  }));

  return {
    ...bundle,
    questions,
    attempts,
    continueTarget: continueLesson({
      namespace,
      units: workspaceUnits,
      lessons: workspaceLessons,
      questions: workspaceQuestions,
      attempts: workspaceAttempts,
    }),
    progress: courseProgress({
      lessons: workspaceLessons,
      questions: workspaceQuestions,
      attempts: workspaceAttempts,
    }),
    weakAreas: weakAreas({
      namespace,
      units: workspaceUnits,
      lessons: workspaceLessons,
      questions: workspaceQuestions,
      attempts: workspaceAttempts,
    }),
    recentResults: recentResults({
      questions: workspaceQuestions,
      attempts: workspaceAttempts,
    }),
  };
}
