import type {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
  ApPhysics2UnitSlug,
} from "@/features/learn/courses/ap-physics-2/manifest";

export type ApPhysics2Lesson = {
  namespace: typeof AP_PHYSICS_2_NAMESPACE;
  unitSlug: ApPhysics2UnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_PHYSICS_2_SOURCE_BASIS;
  objectiveCodes: readonly string[];
  bodyPlain: string;
};
