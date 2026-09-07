/**
 * AP Calculus AB — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-CALC-AB, public CED year 2019.
 * Objective codes are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_CALC_AB_NAMESPACE = "ap-calc-ab" as const;
export const AP_CALC_AB_FRAMEWORK_CODE = "AP-CALC-AB" as const;
export const AP_CALC_AB_FRAMEWORK_YEAR = 2019 as const;
export const AP_CALC_AB_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_CALC_AB_STATUS = "original_course" as const;
export const AP_CALC_AB_DISCIPLINE = "mathematics" as const;

export const AP_CALC_AB_OFFICIAL_UNITS = [
  "limits-and-continuity",
  "differentiation-definition",
  "differentiation-composite",
  "contextual-differentiation",
  "analytical-differentiation",
  "integration-accumulation",
  "differential-equations",
  "applications-of-integration",
] as const;

export type ApCalcAbSourceBasis = typeof AP_CALC_AB_SOURCE_BASIS;
export type ApCalcAbCourseStatus = typeof AP_CALC_AB_STATUS;

export type ApCalcAbManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApCalcAbManifestUnit = {
  slug: string;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApCalcAbManifestLesson[];
};

export type ApCalcAbManifest = {
  namespace: typeof AP_CALC_AB_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_CALC_AB_FRAMEWORK_CODE;
  frameworkYear: typeof AP_CALC_AB_FRAMEWORK_YEAR;
  discipline: typeof AP_CALC_AB_DISCIPLINE;
  sourceBasis: ApCalcAbSourceBasis;
  status: ApCalcAbCourseStatus;
  units: readonly ApCalcAbManifestUnit[];
};

export const manifest = {
  namespace: AP_CALC_AB_NAMESPACE,
  title: "AP Calculus AB",
  slug: AP_CALC_AB_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Calculus AB. Objective codes cite the public 2019 CED as metadata only. This is not College Board material.",
  frameworkCode: AP_CALC_AB_FRAMEWORK_CODE,
  frameworkYear: AP_CALC_AB_FRAMEWORK_YEAR,
  discipline: AP_CALC_AB_DISCIPLINE,
  sourceBasis: AP_CALC_AB_SOURCE_BASIS,
  status: AP_CALC_AB_STATUS,
  units: [
    {
      slug: "limits-and-continuity",
      title: "Limits and Continuity",
      description:
        "What a limit claims, how to compute one, and how continuity and existence theorems use that claim.",
      position: 1,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "approaching-a-value",
          title: "Approaching a value",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "continuity-and-existence",
          title: "Continuity and existence",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "differentiation-definition",
      title: "Differentiation: Definition and Fundamental Properties",
      description:
        "Instantaneous rate from the difference quotient, then the first derivative shortcuts.",
      position: 2,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "difference-quotients-and-the-derivative",
          title: "Difference quotients and the derivative",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "power-product-and-quotient-rules",
          title: "Power, product, and quotient rules",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
    {
      slug: "differentiation-composite",
      title: "Differentiation: Composite, Implicit, and Inverse Functions",
      description:
        "Chain rule layers, implicit relations, and derivatives of inverse functions.",
      position: 3,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "chain-rule-in-layers",
          title: "Chain rule in layers",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "implicit-and-inverse-derivatives",
          title: "Implicit and inverse derivatives",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
    {
      slug: "contextual-differentiation",
      title: "Contextual Applications of Differentiation",
      description:
        "Related rates, linear approximation, and indeterminate limits in applied settings.",
      position: 4,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "related-rates-in-context",
          title: "Related rates in context",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "linearization-and-indeterminate-limits",
          title: "Linearization and indeterminate limits",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
    {
      slug: "analytical-differentiation",
      title: "Analytical Applications of Differentiation",
      description:
        "Extrema, concavity, the Mean Value Theorem, and optimization arguments.",
      position: 5,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "extrema-and-the-first-derivative",
          title: "Extrema and the first derivative",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "concavity-and-optimization",
          title: "Concavity and optimization",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "integration-accumulation",
      title: "Integration and Accumulation of Change",
      description:
        "Riemann sums, definite integrals, antiderivatives, and the Fundamental Theorem.",
      position: 6,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "riemann-sums-and-definite-integrals",
          title: "Riemann sums and definite integrals",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "antiderivatives-and-the-ftc",
          title: "Antiderivatives and the FTC",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "differential-equations",
      title: "Differential Equations",
      description:
        "Slope fields, separable equations, and exponential models of change.",
      position: 7,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "slope-fields-and-solutions",
          title: "Slope fields and solutions",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "separable-equations-and-growth",
          title: "Separable equations and growth",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "applications-of-integration",
      title: "Applications of Integration",
      description:
        "Area between curves, accumulated change, and volumes with known cross sections.",
      position: 8,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "area-between-curves",
          title: "Area between curves",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "volume-and-accumulated-change",
          title: "Volume and accumulated change",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
  ],
} as const satisfies ApCalcAbManifest;

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

export async function loadApCalcAbCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }, extra] = await Promise.all([
    import("@/features/learn/courses/ap-calc-ab/content"),
    import("@/features/learn/courses/ap-calc-ab/questions"),
    import("@/features/learn/courses/ap-calc-ab/tools"),
    import("@/features/learn/courses/ap-calc-ab/questions-advanced"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions: [...questions, ...extra.questions],
    tools,
  };
}

export default manifest;
