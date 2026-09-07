import type {
  ApEnvsciOfficialUnitSlug,
  ApEnvsciSourceBasis,
} from "@/features/learn/courses/ap-envsci/manifest";

export type ApEnvsciLesson = {
  namespace: "ap-envsci";
  unitSlug: ApEnvsciOfficialUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: ApEnvsciSourceBasis;
  objectiveCodes: readonly string[];
  bodyPlain: string;
};
