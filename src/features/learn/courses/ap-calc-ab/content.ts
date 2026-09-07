/**
 * Original BayAreaClubs lesson bodies for AP Calculus AB.
 * Plain text only. source_basis: ORIGINAL.
 */

import { lessons as analyticalDifferentiation } from "@/features/learn/courses/ap-calc-ab/units/analytical-differentiation";
import { lessons as applicationsOfIntegration } from "@/features/learn/courses/ap-calc-ab/units/applications-of-integration";
import { lessons as contextualDifferentiation } from "@/features/learn/courses/ap-calc-ab/units/contextual-differentiation";
import { lessons as differentialEquations } from "@/features/learn/courses/ap-calc-ab/units/differential-equations";
import { lessons as differentiationComposite } from "@/features/learn/courses/ap-calc-ab/units/differentiation-composite";
import { lessons as differentiationDefinition } from "@/features/learn/courses/ap-calc-ab/units/differentiation-definition";
import { lessons as integrationAccumulation } from "@/features/learn/courses/ap-calc-ab/units/integration-accumulation";
import { lessons as limitsAndContinuity } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";
import {
  AP_CALC_AB_FRAMEWORK_CODE,
  AP_CALC_AB_FRAMEWORK_YEAR,
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";

export const lessons = [
  ...limitsAndContinuity,
  ...differentiationDefinition,
  ...differentiationComposite,
  ...contextualDifferentiation,
  ...analyticalDifferentiation,
  ...integrationAccumulation,
  ...differentialEquations,
  ...applicationsOfIntegration,
] as const;

export const content = {
  namespace: AP_CALC_AB_NAMESPACE,
  sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  frameworkCode: AP_CALC_AB_FRAMEWORK_CODE,
  frameworkYear: AP_CALC_AB_FRAMEWORK_YEAR,
  lessons,
};

export default content;
