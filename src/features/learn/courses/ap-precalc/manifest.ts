/**
 * AP Precalculus — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-PRECALC, public CED year 2023.
 * Objective codes are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_PRECALC_NAMESPACE = "ap-precalc" as const;
export const AP_PRECALC_FRAMEWORK_CODE = "AP-PRECALC" as const;
export const AP_PRECALC_FRAMEWORK_YEAR = 2023 as const;
export const AP_PRECALC_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_PRECALC_STATUS = "original_course" as const;
export const AP_PRECALC_DISCIPLINE = "mathematics" as const;

export const AP_PRECALC_OFFICIAL_UNITS = [
  "polynomial-rational",
  "exponential-logarithmic",
  "trigonometric-polar",
  "parametric-vectors-matrices",
] as const;

export type ApPrecalcSourceBasis = typeof AP_PRECALC_SOURCE_BASIS;
export type ApPrecalcCourseStatus = typeof AP_PRECALC_STATUS;

export type ApPrecalcManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApPrecalcManifestUnit = {
  slug: (typeof AP_PRECALC_OFFICIAL_UNITS)[number];
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApPrecalcManifestLesson[];
};

export type ApPrecalcManifest = {
  namespace: typeof AP_PRECALC_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_PRECALC_FRAMEWORK_CODE;
  frameworkYear: typeof AP_PRECALC_FRAMEWORK_YEAR;
  discipline: typeof AP_PRECALC_DISCIPLINE;
  sourceBasis: ApPrecalcSourceBasis;
  status: ApPrecalcCourseStatus;
  units: readonly ApPrecalcManifestUnit[];
};

export const manifest = {
  namespace: AP_PRECALC_NAMESPACE,
  title: "AP Precalculus",
  slug: AP_PRECALC_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Precalculus. Students model change with polynomials, rationals, exponentials, logs, trigonometric and polar graphs, and optional parametric, vector, and matrix functions. Objective codes cite the public 2023 CED as identifiers only. This is not College Board material.",
  frameworkCode: AP_PRECALC_FRAMEWORK_CODE,
  frameworkYear: AP_PRECALC_FRAMEWORK_YEAR,
  discipline: AP_PRECALC_DISCIPLINE,
  sourceBasis: AP_PRECALC_SOURCE_BASIS,
  status: AP_PRECALC_STATUS,
  units: [
    {
      slug: "polynomial-rational",
      title: "Polynomial and Rational Functions",
      description:
        "Average rates of change, polynomial shape and end behavior, and rational zeros, holes, and asymptotes.",
      position: 1,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "change-rates-and-polynomial-shape",
          title: "Rates of change and polynomial shape",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "rational-graphs-zeros-and-holes",
          title: "Rational graphs, zeros, and holes",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "exponential-logarithmic",
      title: "Exponential and Logarithmic Functions",
      description:
        "Geometric change, exponential models, inverse logarithms, composition, and semi-log checks.",
      position: 2,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "exponential-change-and-log-inverses",
          title: "Exponential change and logarithmic inverses",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "composition-equations-and-semi-log",
          title: "Composition, equations, and semi-log plots",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "trigonometric-polar",
      title: "Trigonometric and Polar Functions",
      description:
        "Periodic sine and cosine models, transformations, polar coordinates, and polar rates of change.",
      position: 3,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "periodic-sine-and-transforms",
          title: "Periodic sine models and transformations",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "polar-graphs-and-polar-rates",
          title: "Polar graphs and polar rates",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "parametric-vectors-matrices",
      title: "Functions Involving Parameters, Vectors, and Matrices",
      description:
        "Parametric planar motion, vectors, and matrices as functions. Unit 4 is optional on the AP exam; these lessons are still original and complete.",
      position: 4,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "parametric-motion-in-the-plane",
          title: "Parametric motion in the plane",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "vectors-and-matrix-functions",
          title: "Vectors and matrices as functions",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
  ],
} as const satisfies ApPrecalcManifest;

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

export async function loadApPrecalcCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }] = await Promise.all([
    import("@/features/learn/courses/ap-precalc/content"),
    import("@/features/learn/courses/ap-precalc/questions"),
    import("@/features/learn/courses/ap-precalc/tools"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
    tools,
  };
}

export default manifest;
