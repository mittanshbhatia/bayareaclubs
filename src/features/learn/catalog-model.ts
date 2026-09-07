import {
  AP_COURSE_REGISTRY,
  catalogFamilyFor,
  filterRegistryByFamily,
  type ApCourseRegistryEntry,
  type CatalogFamily,
} from "@/features/learn/courses/registry";

export const FEATURED_NAMESPACES = ["ap-csa", "ap-calc-bc", "ap-bio"] as const;

export const LEARN_HUB_SECTIONS = [
  "filters",
  "families",
] as const;

export const CATALOG_FAMILY_ORDER: Array<Exclude<CatalogFamily, "all">> = [
  "cs",
  "math",
  "science",
  "social",
];

export const COURSE_HOME_SECTIONS = [
  "header",
  "progress",
  "continue",
  "practice",
  "unit-map",
  "weak-areas",
  "recent-results",
  "tools",
] as const;

export const COURSE_TOOLS_INVENTORY = [
  "practice",
  "quiz",
  "review",
  "notes",
  "readiness",
] as const;

export function featuredRegistryEntries(
  entries: readonly ApCourseRegistryEntry[] = AP_COURSE_REGISTRY,
) {
  return FEATURED_NAMESPACES.map((namespace) =>
    entries.find((entry) => entry.namespace === namespace),
  ).filter((entry): entry is ApCourseRegistryEntry => Boolean(entry));
}

export function availableCatalogEntries(
  entries: readonly ApCourseRegistryEntry[],
  family: CatalogFamily,
) {
  return filterRegistryByFamily(
    entries.filter((entry) => entry.status !== "planned"),
    family,
  );
}

export function plannedCatalogEntries(
  entries: readonly ApCourseRegistryEntry[],
  family: CatalogFamily,
) {
  return filterRegistryByFamily(
    entries.filter((entry) => entry.status === "planned"),
    family,
  );
}

export function groupedAvailableCatalog(
  entries: readonly ApCourseRegistryEntry[],
  family: CatalogFamily,
) {
  const available = availableCatalogEntries(entries, family);
  const families = family === "all" ? CATALOG_FAMILY_ORDER : [family];
  return families
    .map((key) => ({
      family: key,
      label: familyLabel(key),
      entries: available.filter((entry) => catalogFamilyFor(entry.namespace) === key),
    }))
    .filter((group) => group.entries.length > 0);
}

export type WorkspaceAttempt = {
  questionId: string;
  isCorrect: boolean;
  createdAt: string;
};

export type WorkspaceLesson = {
  id: string;
  slug: string;
  title: string;
  moduleId: string;
};

export type WorkspaceUnit = {
  id: string;
  slug: string | null;
  title: string;
};

export type WorkspaceQuestion = {
  id: string;
  slug: string;
  lessonId: string | null;
  prompt: string;
};

export function continueLesson(input: {
  namespace: string;
  units: readonly WorkspaceUnit[];
  lessons: readonly WorkspaceLesson[];
  questions: readonly WorkspaceQuestion[];
  attempts: readonly WorkspaceAttempt[];
}) {
  const firstUnit = input.units[0];
  const firstLesson = input.lessons[0];
  if (!firstLesson || !firstUnit?.slug) {
    return {
      href: `/dashboard/learn/ap/${input.namespace}/practice`,
      title: "Start practice",
      detail: "Open an original practice set for this course.",
    };
  }

  const attemptedQuestionIds = new Set(input.attempts.map((row) => row.questionId));
  const nextQuestion = input.questions.find((question) => !attemptedQuestionIds.has(question.id));
  const nextLesson =
    (nextQuestion?.lessonId
      ? input.lessons.find((lesson) => lesson.id === nextQuestion.lessonId)
      : null) ??
    input.lessons.find((lesson) => {
      const related = input.questions.filter((question) => question.lessonId === lesson.id);
      return related.some((question) => !attemptedQuestionIds.has(question.id));
    }) ??
    firstLesson;
  const unit =
    input.units.find((row) => row.id === nextLesson.moduleId && row.slug) ?? firstUnit;

  return {
    href: `/dashboard/learn/ap/${input.namespace}/${unit.slug}/${nextLesson.slug}`,
    title: nextLesson.title,
    detail: unit.title,
  };
}

export function courseProgress(input: {
  lessons: readonly WorkspaceLesson[];
  questions: readonly WorkspaceQuestion[];
  attempts: readonly WorkspaceAttempt[];
}) {
  const correctIds = new Set(
    input.attempts.filter((row) => row.isCorrect).map((row) => row.questionId),
  );
  const answeredIds = new Set(input.attempts.map((row) => row.questionId));
  const questionTotal = input.questions.length;
  const lessonTotal = input.lessons.length;
  const questionsCorrect = input.questions.filter((question) => correctIds.has(question.id)).length;
  const questionsTouched = input.questions.filter((question) => answeredIds.has(question.id)).length;
  const lessonsTouched = input.lessons.filter((lesson) => {
    const related = input.questions.filter((question) => question.lessonId === lesson.id);
    return related.some((question) => answeredIds.has(question.id));
  }).length;

  return {
    questionsCorrect,
    questionsTouched,
    questionTotal,
    lessonsTouched,
    lessonTotal,
    percent:
      questionTotal > 0 ? Math.round((questionsCorrect / questionTotal) * 100) : 0,
  };
}

export function weakAreas(input: {
  namespace: string;
  units: readonly WorkspaceUnit[];
  lessons: readonly WorkspaceLesson[];
  questions: readonly WorkspaceQuestion[];
  attempts: readonly WorkspaceAttempt[];
}) {
  return input.units
    .map((unit) => {
      const lessonIds = new Set(
        input.lessons.filter((lesson) => lesson.moduleId === unit.id).map((lesson) => lesson.id),
      );
      const questionIds = input.questions
        .filter((question) => question.lessonId && lessonIds.has(question.lessonId))
        .map((question) => question.id);
      const unitAttempts = input.attempts.filter((attempt) =>
        questionIds.includes(attempt.questionId),
      );
      const correct = unitAttempts.filter((attempt) => attempt.isCorrect).length;
      const accuracy = unitAttempts.length > 0 ? correct / unitAttempts.length : 1;
      return {
        unitId: unit.id,
        title: unit.title,
        href: unit.slug ? `/dashboard/learn/ap/${input.namespace}/${unit.slug}` : null,
        attemptCount: unitAttempts.length,
        accuracy,
      };
    })
    .filter((row) => row.attemptCount >= 2 && row.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);
}

export function recentResults(input: {
  questions: readonly WorkspaceQuestion[];
  attempts: readonly WorkspaceAttempt[];
}) {
  const byId = new Map(input.questions.map((question) => [question.id, question]));
  return [...input.attempts]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8)
    .map((attempt) => ({
      questionId: attempt.questionId,
      prompt: byId.get(attempt.questionId)?.prompt ?? "Practice item",
      isCorrect: attempt.isCorrect,
      createdAt: attempt.createdAt,
    }));
}

export function familyLabel(family: CatalogFamily) {
  switch (family) {
    case "cs":
      return "Computer science";
    case "math":
      return "Mathematics";
    case "science":
      return "Sciences";
    case "social":
      return "Social science";
    default:
      return "All AP";
  }
}

export function familyCategory(family: CatalogFamily) {
  switch (family) {
    case "cs":
      return "Formal science";
    case "math":
      return "Formal science";
    case "science":
      return "Natural science";
    case "social":
      return "Behavioral science";
    default:
      return "AP catalog";
  }
}

export function courseFamilyLabel(namespace: string) {
  const family = catalogFamilyFor(namespace);
  return family ? familyLabel(family) : "AP";
}
