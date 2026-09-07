/**
 * Original BayAreaClubs lesson bodies for AP Physics 1.
 * Plain text only. source_basis: ORIGINAL. Algebra-based teaching.
 */

import {
  AP_PHYSICS_1_FRAMEWORK_CODE,
  AP_PHYSICS_1_FRAMEWORK_YEAR,
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import { energyMomentumRotatingSystemsLessons } from "@/features/learn/courses/ap-physics-1/units/energy-momentum-rotating-systems";
import { fluidsLessons } from "@/features/learn/courses/ap-physics-1/units/fluids";
import { forceAndTranslationalDynamicsLessons } from "@/features/learn/courses/ap-physics-1/units/force-and-translational-dynamics";
import { kinematicsLessons } from "@/features/learn/courses/ap-physics-1/units/kinematics";
import { linearMomentumLessons } from "@/features/learn/courses/ap-physics-1/units/linear-momentum";
import { oscillationsLessons } from "@/features/learn/courses/ap-physics-1/units/oscillations";
import { torqueAndRotationalDynamicsLessons } from "@/features/learn/courses/ap-physics-1/units/torque-and-rotational-dynamics";
import { workEnergyPowerLessons } from "@/features/learn/courses/ap-physics-1/units/work-energy-power";

export type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const lessons = [
  ...kinematicsLessons,
  ...forceAndTranslationalDynamicsLessons,
  ...workEnergyPowerLessons,
  ...linearMomentumLessons,
  ...torqueAndRotationalDynamicsLessons,
  ...energyMomentumRotatingSystemsLessons,
  ...oscillationsLessons,
  ...fluidsLessons,
] as const;

export const content = {
  namespace: AP_PHYSICS_1_NAMESPACE,
  sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
  frameworkCode: AP_PHYSICS_1_FRAMEWORK_CODE,
  frameworkYear: AP_PHYSICS_1_FRAMEWORK_YEAR,
  lessons,
};

export default content;
