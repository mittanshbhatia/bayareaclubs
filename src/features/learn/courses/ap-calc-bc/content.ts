/**
 * Original BayAreaClubs lesson bodies for AP Calculus BC.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_CALC_BC_FRAMEWORK_CODE,
  AP_CALC_BC_FRAMEWORK_YEAR,
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";
import { analyticalDifferentiationLessons } from "@/features/learn/courses/ap-calc-bc/units/analytical-differentiation";
import { applicationsOfIntegrationLessons } from "@/features/learn/courses/ap-calc-bc/units/applications-of-integration";
import { contextualDifferentiationLessons } from "@/features/learn/courses/ap-calc-bc/units/contextual-differentiation";
import { differentialEquationsLessons } from "@/features/learn/courses/ap-calc-bc/units/differential-equations";
import { differentiationCompositeLessons } from "@/features/learn/courses/ap-calc-bc/units/differentiation-composite";
import { differentiationDefinitionLessons } from "@/features/learn/courses/ap-calc-bc/units/differentiation-definition";
import { infiniteSequencesSeriesLessons } from "@/features/learn/courses/ap-calc-bc/units/infinite-sequences-series";
import { integrationAccumulationLessons } from "@/features/learn/courses/ap-calc-bc/units/integration-accumulation";
import { limitsAndContinuityLessons } from "@/features/learn/courses/ap-calc-bc/units/limits-and-continuity";
import { parametricPolarVectorLessons } from "@/features/learn/courses/ap-calc-bc/units/parametric-polar-vector";

export type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const lessons: readonly ApCalcBcLesson[] = [
  ...limitsAndContinuityLessons,
  ...differentiationDefinitionLessons,
  ...differentiationCompositeLessons,
  ...contextualDifferentiationLessons,
  ...analyticalDifferentiationLessons,
  ...integrationAccumulationLessons,
  ...differentialEquationsLessons,
  ...applicationsOfIntegrationLessons,
  ...parametricPolarVectorLessons,
  ...infiniteSequencesSeriesLessons,
];

export const content = {
  namespace: AP_CALC_BC_NAMESPACE,
  sourceBasis: AP_CALC_BC_SOURCE_BASIS,
  frameworkCode: AP_CALC_BC_FRAMEWORK_CODE,
  frameworkYear: AP_CALC_BC_FRAMEWORK_YEAR,
  lessons,
} as const;

export default content;
