import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
  type ApCalcBcOfficialUnitSlug,
} from "@/features/learn/courses/ap-calc-bc/manifest";

export type ApCalcBcLesson = {
  namespace: typeof AP_CALC_BC_NAMESPACE;
  unitSlug: ApCalcBcOfficialUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_CALC_BC_SOURCE_BASIS;
  objectiveCodes: readonly string[];
  bodyPlain: string;
};
