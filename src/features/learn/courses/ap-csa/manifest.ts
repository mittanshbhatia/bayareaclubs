/**
 * AP Computer Science A original course.
 * source_basis: ORIGINAL. framework: AP-CSA, public CED year 2025.
 * Objective codes are public CED identifiers only (no CED prose).
 * Registers with Agent 09 via registerCourseLoader.
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_CSA_NAMESPACE = "ap-csa" as const;
export const AP_CSA_FRAMEWORK_CODE = "AP-CSA" as const;
export const AP_CSA_FRAMEWORK_YEAR = 2025 as const;
export const AP_CSA_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_CSA_STATUS = "original_course" as const;
export const AP_CSA_DISCIPLINE = "computer_science" as const;

export const AP_CSA_OFFICIAL_UNIT_SLUGS = [
  "using-objects-and-methods",
  "selection-and-iteration",
  "class-creation",
  "data-collections",
] as const;

export type ApCsaSourceBasis = typeof AP_CSA_SOURCE_BASIS;
export type ApCsaCourseStatus = typeof AP_CSA_STATUS;
export type ApCsaOfficialUnitSlug = (typeof AP_CSA_OFFICIAL_UNIT_SLUGS)[number];

export type ApCsaLessonSlug =
  | "primitive-values-and-expressions"
  | "objects-methods-and-control"
  | "boolean-choices-and-branches"
  | "loops-and-tracing"
  | "writing-classes-and-constructors"
  | "encapsulation-and-methods"
  | "arrays-and-arraylists"
  | "two-d-arrays-and-recursion-tracing";

export type ApCsaManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApCsaManifestUnit = {
  slug: ApCsaOfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApCsaManifestLesson[];
};

export type ApCsaManifest = {
  namespace: typeof AP_CSA_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_CSA_FRAMEWORK_CODE;
  frameworkYear: typeof AP_CSA_FRAMEWORK_YEAR;
  discipline: typeof AP_CSA_DISCIPLINE;
  sourceBasis: ApCsaSourceBasis;
  status: ApCsaCourseStatus;
  units: readonly ApCsaManifestUnit[];
};

export const manifest = {
  namespace: AP_CSA_NAMESPACE,
  title: "AP Computer Science A",
  slug: AP_CSA_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Computer Science A. Objective codes cite the public Fall 2025 CED as metadata only. This is not College Board material.",
  frameworkCode: AP_CSA_FRAMEWORK_CODE,
  frameworkYear: AP_CSA_FRAMEWORK_YEAR,
  discipline: AP_CSA_DISCIPLINE,
  sourceBasis: AP_CSA_SOURCE_BASIS,
  status: AP_CSA_STATUS,
  units: [
    {
      slug: "using-objects-and-methods",
      title: "Using Objects and Methods",
      description:
        "Primitive values, expressions, objects, and the methods you call on them. The earlier Java foundations lessons live here as the opening pair.",
      position: 1,
      estimatedMinutes: 45,
      lessons: [
        {
          slug: "primitive-values-and-expressions",
          title: "Primitive values and expressions",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "objects-methods-and-control",
          title: "Objects, methods, and first control flow",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
    {
      slug: "selection-and-iteration",
      title: "Selection and Iteration",
      description:
        "Boolean tests, if and else chains, while and for loops, and nested repetition.",
      position: 2,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "boolean-choices-and-branches",
          title: "Boolean choices and branches",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "loops-and-tracing",
          title: "Loops and tracing",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "class-creation",
      title: "Class Creation",
      description:
        "Writing a class, constructors, accessors, mutators, and static members. Inheritance is outside this course.",
      position: 3,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "writing-classes-and-constructors",
          title: "Writing classes and constructors",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "encapsulation-and-methods",
          title: "Encapsulation and methods",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "data-collections",
      title: "Data Collections",
      description:
        "One-dimensional arrays, ArrayList, two-dimensional tables, and tracing recursive methods you are given.",
      position: 4,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "arrays-and-arraylists",
          title: "Arrays and ArrayLists",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "two-d-arrays-and-recursion-tracing",
          title: "Two-dimensional arrays and recursion tracing",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
  ],
} as const satisfies ApCsaManifest;

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

export async function loadApCsaCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }] = await Promise.all([
    import("@/features/learn/courses/ap-csa/content"),
    import("@/features/learn/courses/ap-csa/questions"),
    import("@/features/learn/courses/ap-csa/tools"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
    tools,
  };
}

export default manifest;
