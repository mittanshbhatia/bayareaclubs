import type { LoaderQuestion } from "@/features/learn/courses/types";

export function originalItem(input: {
  slug: string;
  lessonSlug: string;
  prompt: string;
  choices: readonly [string, string, string, string];
  answer: "a" | "b" | "c" | "d";
  explanation: string;
  codes: readonly string[];
}): LoaderQuestion {
  const ids = ["a", "b", "c", "d"] as const;
  return {
    slug: input.slug,
    lessonSlug: input.lessonSlug,
    prompt: input.prompt,
    choices: input.choices.map((text, index) => ({ id: ids[index], text })),
    answerId: input.answer,
    explanation: input.explanation,
    questionType: "multiple_choice",
    objectiveCodes: input.codes,
    difficulty: "advanced",
  };
}
