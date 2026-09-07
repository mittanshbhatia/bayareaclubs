/**
 * Original BayAreaClubs lesson bodies for AP Physics 2.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_FRAMEWORK_CODE,
  AP_PHYSICS_2_FRAMEWORK_YEAR,
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import { electricCircuitsLessons } from "@/features/learn/courses/ap-physics-2/units/electric-circuits";
import { electricForceFieldPotentialLessons } from "@/features/learn/courses/ap-physics-2/units/electric-force-field-potential";
import { geometricOpticsLessons } from "@/features/learn/courses/ap-physics-2/units/geometric-optics";
import { magnetismLessons } from "@/features/learn/courses/ap-physics-2/units/magnetism-and-electromagnetism";
import { modernPhysicsLessons } from "@/features/learn/courses/ap-physics-2/units/modern-physics";
import { thermodynamicsLessons } from "@/features/learn/courses/ap-physics-2/units/thermodynamics";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";
import { wavesSoundPhysicalOpticsLessons } from "@/features/learn/courses/ap-physics-2/units/waves-sound-physical-optics";

export type { ApPhysics2Lesson };

export const lessons: readonly ApPhysics2Lesson[] = [
  ...thermodynamicsLessons,
  ...electricForceFieldPotentialLessons,
  ...electricCircuitsLessons,
  ...magnetismLessons,
  ...geometricOpticsLessons,
  ...wavesSoundPhysicalOpticsLessons,
  ...modernPhysicsLessons,
];

export const content = {
  namespace: AP_PHYSICS_2_NAMESPACE,
  sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
  frameworkCode: AP_PHYSICS_2_FRAMEWORK_CODE,
  frameworkYear: AP_PHYSICS_2_FRAMEWORK_YEAR,
  lessons,
} as const;

export default content;
