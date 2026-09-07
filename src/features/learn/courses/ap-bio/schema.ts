import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
  type ApBioOfficialUnitSlug,
} from "@/features/learn/courses/ap-bio/manifest";

export type ApBioChoiceId = "a" | "b" | "c" | "d";

export type ApBioChoice = {
  id: ApBioChoiceId;
  text: string;
};

export type ApBioDifficulty = "easy" | "medium" | "hard";

export type ApBioLesson = {
  namespace: typeof AP_BIO_NAMESPACE;
  unitSlug: ApBioOfficialUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_BIO_SOURCE_BASIS;
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export type ApBioQuestion = {
  namespace: typeof AP_BIO_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApBioChoice, ApBioChoice, ApBioChoice, ApBioChoice];
  answerId: ApBioChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApBioDifficulty;
  sourceBasis: typeof AP_BIO_SOURCE_BASIS;
  version: 1;
};
