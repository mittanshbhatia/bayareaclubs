import type { LoaderQuestion } from "@/features/learn/courses/types";

export function mergeCourseQuestions(
  base: readonly LoaderQuestion[],
  extra: readonly LoaderQuestion[] = [],
): LoaderQuestion[] {
  const seen = new Set(base.map((question) => question.slug));
  return [
    ...base,
    ...extra.filter((question) => {
      if (seen.has(question.slug)) return false;
      seen.add(question.slug);
      return true;
    }),
  ];
}
