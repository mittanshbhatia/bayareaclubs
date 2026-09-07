import "server-only";

import {
  loaderCourseId,
  loaderLessonId,
  loaderQuestionId,
  loaderUnitId,
} from "@/features/learn/courses/ids";
import { loadCourseNamespace } from "@/features/learn/courses/loader";
import { getRegistryEntry } from "@/features/learn/courses/registry";
import type { CourseContentBundle } from "@/features/learn/courses/types";
import type {
  LearningCourse,
  LearningLesson,
  LearningModule,
  PublishedApCourse,
  StudentQuestion,
} from "@/features/learn/database";

export type LoaderHydratedCourse = {
  course: LearningCourse & PublishedApCourse;
  units: LearningModule[];
  lessons: LearningLesson[];
  questions: StudentQuestion[];
  keyedQuestions: Array<{
    id: string;
    slug: string;
    lessonSlug: string | null;
    answerId: string;
    explanation: string;
  }>;
};

export async function hydrateShippingCourse(
  namespace: string,
): Promise<LoaderHydratedCourse | null> {
  const registry = getRegistryEntry(namespace);
  if (registry && registry.status !== "shipping") return null;

  const bundle = await loadCourseNamespace(namespace);
  if (!bundle) return null;
  return mapBundle(namespace, bundle);
}

function mapBundle(
  namespace: string,
  bundle: CourseContentBundle,
): LoaderHydratedCourse {
  const courseId = loaderCourseId(namespace);
  const now = new Date().toISOString();
  const minutes = bundle.manifest.units.reduce(
    (sum, unit) => sum + (unit.estimatedMinutes ?? 0),
    0,
  );

  const course = {
    id: courseId,
    slug: namespace,
    course_namespace: namespace,
    title: bundle.manifest.title,
    description: bundle.manifest.description,
    discipline: "computer_science",
    grade_bands: ["age_13_17", "adult"],
    difficulty: "intermediate",
    format: "mixed",
    estimated_minutes: minutes || null,
    thumbnail_asset_id: null,
    framework_code: bundle.manifest.frameworkCode ?? null,
    framework_year: bundle.manifest.frameworkYear ?? null,
    source_basis: "ORIGINAL",
    published_at: now,
    course_kind: "ap",
    status: "published",
    is_published: true,
    is_free: true,
    provider_name: "BayAreaClubs",
    source_url: "https://bayareaclubs.vercel.app/dashboard/learn/ap",
    license_name: "Original BayAreaClubs material",
    license_url: null,
    created_by: courseId,
    created_at: now,
    updated_at: now,
    approved_at: now,
    approved_by: null,
  } as LoaderHydratedCourse["course"];

  const units: LearningModule[] = bundle.manifest.units.map((unit, index) => ({
    id: loaderUnitId(namespace, unit.slug),
    course_id: courseId,
    position: index,
    title: unit.title,
    description: unit.description ?? null,
    estimated_minutes: unit.estimatedMinutes ?? null,
    is_published: true,
    created_at: now,
    updated_at: now,
    slug: unit.slug,
  }));

  const unitIdBySlug = new Map(units.map((unit) => [unit.slug, unit.id]));
  const lessonRows = bundle.lessons ?? [];

  const lessons: LearningLesson[] = lessonRows.map((lesson) => ({
    id: loaderLessonId(namespace, lesson.slug),
    course_id: courseId,
    module_id: unitIdBySlug.get(lesson.unitSlug) ?? loaderUnitId(namespace, lesson.unitSlug),
    namespace,
    slug: lesson.slug,
    position: lesson.position,
    title: lesson.title,
    body_plain: lesson.bodyPlain,
    estimated_minutes: lesson.estimatedMinutes ?? null,
    status: "published",
    media_asset_id: null,
    created_by: courseId,
    created_at: now,
    updated_at: now,
  }));

  const lessonIdBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.id]));

  const questions: StudentQuestion[] = (bundle.questions ?? []).map((question) => ({
    id: loaderQuestionId(namespace, question.slug),
    course_id: courseId,
    namespace,
    module_id: null,
    lesson_id: question.lessonSlug
      ? (lessonIdBySlug.get(question.lessonSlug) ?? null)
      : null,
    slug: question.slug,
    prompt: question.prompt,
    choices: question.choices.map((choice) => ({ id: choice.id, text: choice.text })),
    question_type: question.questionType ?? "multiple_choice",
    objective_codes: [...(question.objectiveCodes ?? [])],
    difficulty: question.difficulty === "advanced" || question.difficulty === "hard"
      ? "advanced"
      : question.difficulty === "beginner" || question.difficulty === "easy"
        ? "beginner"
        : "intermediate",
    source_basis: "ORIGINAL",
    status: "published",
    version: 1,
  }));

  const keyedQuestions = (bundle.questions ?? []).map((question) => ({
    id: loaderQuestionId(namespace, question.slug),
    slug: question.slug,
    lessonSlug: question.lessonSlug,
    answerId: question.answerId,
    explanation: question.explanation,
  }));

  return { course, units, lessons, questions, keyedQuestions };
}

export async function gradeLoaderAttempt(input: {
  courseId: string;
  questionId: string;
  choiceId?: string;
}): Promise<{
  namespace: string;
  isCorrect: boolean;
  explanation: string | null;
} | null> {
  for (const namespace of ["ap-csp", "ap-csa"]) {
    if (loaderCourseId(namespace) !== input.courseId) continue;
    const hydrated = await hydrateShippingCourse(namespace);
    if (!hydrated) return null;
    const question = hydrated.keyedQuestions.find((row) => row.id === input.questionId);
    if (!question) return null;
    return {
      namespace,
      isCorrect: input.choiceId === question.answerId,
      explanation: question.explanation,
    };
  }
  return null;
}
