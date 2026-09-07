/**
 * Original BayAreaClubs lesson bodies for AP Precalculus.
 * Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_PRECALC_FRAMEWORK_CODE,
  AP_PRECALC_FRAMEWORK_YEAR,
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";
import { exponentialLogarithmicLessons } from "@/features/learn/courses/ap-precalc/units/exponential-logarithmic";
import { parametricVectorsMatricesLessons } from "@/features/learn/courses/ap-precalc/units/parametric-vectors-matrices";
import { polynomialRationalLessons } from "@/features/learn/courses/ap-precalc/units/polynomial-rational";
import { trigonometricPolarLessons } from "@/features/learn/courses/ap-precalc/units/trigonometric-polar";

export type ApPrecalcUnitSlug =
  | "polynomial-rational"
  | "exponential-logarithmic"
  | "trigonometric-polar"
  | "parametric-vectors-matrices";

export type ApPrecalcLesson = {
  namespace: typeof AP_PRECALC_NAMESPACE;
  unitSlug: ApPrecalcUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: typeof AP_PRECALC_SOURCE_BASIS;
  /** Official public CED identifiers only. */
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export const lessons: readonly ApPrecalcLesson[] = [
  ...polynomialRationalLessons,
  ...exponentialLogarithmicLessons,
  ...trigonometricPolarLessons,
  ...parametricVectorsMatricesLessons,
];

export const content = {
  namespace: AP_PRECALC_NAMESPACE,
  sourceBasis: AP_PRECALC_SOURCE_BASIS,
  frameworkCode: AP_PRECALC_FRAMEWORK_CODE,
  frameworkYear: AP_PRECALC_FRAMEWORK_YEAR,
  lessons,
} as const;

export default content;
