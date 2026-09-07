import "server-only";

import { hydrateShippingCourse } from "@/features/learn/courses/from-loader";
import type { CourseTool, CourseToolKind } from "@/features/learn/courses/types";
import type { LearningLesson, StudentQuestion } from "@/features/learn/database";
import { getCourseByNamespace, listStudentQuestions } from "@/features/learn/queries";
import { toolHref } from "@/features/learn/tool-href";

export { toolHref };

const DEFAULT_TOOLS: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "practice",
    title: "Practice",
    description: "Work original items one at a time. Results stay on your account.",
  },
  {
    kind: "quiz",
    slug: "quiz",
    title: "Quiz",
    description: "A shorter original set for a focused check.",
  },
  {
    kind: "review",
    slug: "review",
    title: "Review",
    description: "Revisit mixed items across published units.",
  },
  {
    kind: "notes",
    slug: "notes",
    title: "Notes",
    description: "Read original lesson summaries for this course.",
  },
  {
    kind: "readiness",
    slug: "readiness",
    title: "Readiness",
    description: "A mixed-difficulty check against published original items.",
  },
];

export async function listCourseTools(namespace: string): Promise<CourseTool[]> {
  const hydrated = await hydrateShippingCourse(namespace);
  if (hydrated?.tools.length) return hydrated.tools;
  return [...DEFAULT_TOOLS];
}

export async function listToolQuestions(
  namespace: string,
  kind: CourseToolKind,
): Promise<{ courseId: string | null; questions: StudentQuestion[] }> {
  const bundle = await getCourseByNamespace(namespace);
  if (!bundle.course) return { courseId: null, questions: [] };

  const questions = await listStudentQuestions(namespace);
  const hydrated = await hydrateShippingCourse(namespace);
  const tool = (hydrated?.tools ?? DEFAULT_TOOLS).find((row) => row.kind === kind);
  const slugs = new Set(tool?.questionSlugs ?? []);

  let selected = questions;
  if (slugs.size > 0) {
    selected = questions.filter((question) => slugs.has(question.slug));
  } else if (kind === "quiz") {
    selected = questions.slice(0, Math.min(8, questions.length));
  } else if (kind === "readiness") {
    const hard = questions.filter((question) => question.difficulty === "advanced");
    const mid = questions.filter((question) => question.difficulty === "intermediate");
    const easy = questions.filter((question) => question.difficulty === "beginner");
    selected = [...easy.slice(0, 2), ...mid.slice(0, 3), ...hard.slice(0, 3)];
    if (selected.length < 6) selected = questions.slice(0, 8);
  }

  return { courseId: bundle.course.id, questions: selected };
}

export async function listToolNotes(
  namespace: string,
): Promise<{ title: string; lessons: LearningLesson[] }> {
  const bundle = await getCourseByNamespace(namespace);
  return {
    title: bundle.course?.title ?? namespace,
    lessons: bundle.lessons,
  };
}
