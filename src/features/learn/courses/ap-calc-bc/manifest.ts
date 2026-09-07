/**
 * AP Calculus BC — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-CALC-BC, public CED year 2019.
 * Objective codes are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_CALC_BC_NAMESPACE = "ap-calc-bc" as const;
export const AP_CALC_BC_FRAMEWORK_CODE = "AP-CALC-BC" as const;
export const AP_CALC_BC_FRAMEWORK_YEAR = 2019 as const;
export const AP_CALC_BC_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_CALC_BC_STATUS = "original_course" as const;
export const AP_CALC_BC_DISCIPLINE = "mathematics" as const;

export const AP_CALC_BC_OFFICIAL_UNITS = [
  "limits-and-continuity",
  "differentiation-definition",
  "differentiation-composite",
  "contextual-differentiation",
  "analytical-differentiation",
  "integration-accumulation",
  "differential-equations",
  "applications-of-integration",
  "parametric-polar-vector",
  "infinite-sequences-series",
] as const;

export type ApCalcBcOfficialUnitSlug =
  (typeof AP_CALC_BC_OFFICIAL_UNITS)[number];
export type ApCalcBcSourceBasis = typeof AP_CALC_BC_SOURCE_BASIS;
export type ApCalcBcCourseStatus = typeof AP_CALC_BC_STATUS;

export type ApCalcBcManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApCalcBcManifestUnit = {
  slug: ApCalcBcOfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApCalcBcManifestLesson[];
};

export type ApCalcBcManifest = {
  namespace: typeof AP_CALC_BC_NAMESPACE;
  title: string;
  slug: typeof AP_CALC_BC_NAMESPACE;
  description: string;
  frameworkCode: typeof AP_CALC_BC_FRAMEWORK_CODE;
  frameworkYear: typeof AP_CALC_BC_FRAMEWORK_YEAR;
  discipline: typeof AP_CALC_BC_DISCIPLINE;
  sourceBasis: ApCalcBcSourceBasis;
  status: ApCalcBcCourseStatus;
  units: readonly ApCalcBcManifestUnit[];
};

export const manifest = {
  namespace: AP_CALC_BC_NAMESPACE,
  title: "AP Calculus BC",
  slug: AP_CALC_BC_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Calculus BC. Objective codes cite the public 2019 CED as metadata only. This is not College Board material.",
  frameworkCode: AP_CALC_BC_FRAMEWORK_CODE,
  frameworkYear: AP_CALC_BC_FRAMEWORK_YEAR,
  discipline: AP_CALC_BC_DISCIPLINE,
  sourceBasis: AP_CALC_BC_SOURCE_BASIS,
  status: AP_CALC_BC_STATUS,
  units: [
    {
      slug: "limits-and-continuity",
      title: "Limits and Continuity",
      description:
        "Limit language, algebraic evaluation, continuity, and infinite behavior as the foundation for later series and improper-integral work.",
      position: 1,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "limit-language-and-algebraic-gateways",
          title: "Limit language and algebraic gateways",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "continuity-jumps-and-infinite-limits",
          title: "Continuity, jumps, and infinite limits",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "differentiation-definition",
      title: "Differentiation: Definition and Fundamental Properties",
      description:
        "Difference quotients, first derivative rules, and the distinction between continuity and differentiability.",
      position: 2,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "difference-quotient-as-instantaneous-rate",
          title: "The difference quotient as an instantaneous rate",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "derivative-rules-and-smoothness",
          title: "Derivative rules and smoothness",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "differentiation-composite",
      title: "Differentiation: Composite, Implicit, and Inverse Functions",
      description:
        "Chain rule for nested rates, implicit curves, and derivatives of inverse and inverse-trigonometric functions.",
      position: 3,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "chain-rule-for-nested-motions",
          title: "Chain rule for nested motions",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "implicit-curves-and-inverse-rates",
          title: "Implicit curves and inverse rates",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "contextual-differentiation",
      title: "Contextual Applications of Differentiation",
      description:
        "Related rates, particle motion, local linearization, and L'Hospital's rule for indeterminate forms.",
      position: 4,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "related-rates-in-club-settings",
          title: "Related rates in club settings",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "linearization-and-indeterminate-forms",
          title: "Linearization and indeterminate forms",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "analytical-differentiation",
      title: "Analytical Applications of Differentiation",
      description:
        "Mean Value Theorem, extrema, concavity, and optimization on closed intervals.",
      position: 5,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "mean-value-extrema-and-candidates",
          title: "Mean Value Theorem, extrema, and candidates",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "concavity-optimization-and-graphs",
          title: "Concavity, optimization, and graphs",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "integration-accumulation",
      title: "Integration and Accumulation of Change",
      description:
        "Riemann sums, the Fundamental Theorem, and BC techniques: parts, partial fractions, and improper integrals.",
      position: 6,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "riemann-accumulation-and-ftc",
          title: "Riemann sums, accumulation, and the FTC",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "parts-partial-fractions-and-improper",
          title: "Parts, partial fractions, and improper integrals",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "differential-equations",
      title: "Differential Equations",
      description:
        "Slope fields, separable models, Euler's method, and logistic growth.",
      position: 7,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "slope-fields-and-separable-models",
          title: "Slope fields and separable models",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "euler-steps-and-logistic-growth",
          title: "Euler steps and logistic growth",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
    {
      slug: "applications-of-integration",
      title: "Applications of Integration",
      description:
        "Area, volume, accumulated change, average value, and arc length of a smooth graph.",
      position: 8,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "area-volume-and-accumulated-change",
          title: "Area, volume, and accumulated change",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "arc-length-and-average-value",
          title: "Arc length and average value",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
    {
      slug: "parametric-polar-vector",
      title: "Parametric Equations, Polar Coordinates, and Vector-Valued Functions",
      description:
        "Parametric and vector motion, speed, and polar slopes and area.",
      position: 9,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "parametric-paths-and-vector-velocity",
          title: "Parametric paths and vector velocity",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "polar-slopes-and-swept-area",
          title: "Polar slopes and swept area",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "infinite-sequences-series",
      title: "Infinite Sequences and Series",
      description:
        "Convergence tests, geometric series, Taylor polynomials, and remainder bounds.",
      position: 10,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "sequences-series-and-convergence-tests",
          title: "Sequences, series, and convergence tests",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "taylor-polynomials-and-error-bounds",
          title: "Taylor polynomials and error bounds",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
  ],
} as const satisfies ApCalcBcManifest;

export function toCourseManifest(
  source: typeof manifest = manifest,
): CourseManifest {
  return {
    namespace: source.namespace,
    title: source.title,
    description: source.description,
    frameworkCode: source.frameworkCode,
    frameworkYear: source.frameworkYear,
    discipline: source.discipline,
    units: source.units.map((unit) => ({
      slug: unit.slug,
      title: unit.title,
      description: unit.description,
      estimatedMinutes: unit.estimatedMinutes,
      lessons: unit.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        estimatedMinutes: lesson.estimatedMinutes,
      })),
    })),
  };
}

export async function loadApCalcBcCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }] = await Promise.all([
    import("@/features/learn/courses/ap-calc-bc/content"),
    import("@/features/learn/courses/ap-calc-bc/questions"),
    import("@/features/learn/courses/ap-calc-bc/tools"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
    tools,
  };
}

export default manifest;
