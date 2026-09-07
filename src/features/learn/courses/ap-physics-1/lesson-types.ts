import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
  type ApPhysics1OfficialUnitSlug,
} from "@/features/learn/courses/ap-physics-1/manifest";

export type ApPhysics1Lesson = {
  namespace: typeof AP_PHYSICS_1_NAMESPACE;
  unitSlug: ApPhysics1OfficialUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_PHYSICS_1_SOURCE_BASIS;
  objectiveCodes: readonly string[];
  bodyPlain: string;
};
