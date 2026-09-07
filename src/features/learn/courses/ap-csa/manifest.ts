/**
 * AP Computer Science A published skeleton.
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
export const AP_CSA_STATUS = "published_skeleton" as const;

export type ApCsaSourceBasis = typeof AP_CSA_SOURCE_BASIS;
export type ApCsaCourseStatus = typeof AP_CSA_STATUS;

export type ApCsaManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApCsaManifestUnit = {
  slug: string;
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
  sourceBasis: ApCsaSourceBasis;
  status: ApCsaCourseStatus;
  units: readonly ApCsaManifestUnit[];
};

export const manifest = {
  namespace: AP_CSA_NAMESPACE,
  title: "AP Computer Science A",
  slug: AP_CSA_NAMESPACE,
  description:
    "Published skeleton of original BayAreaClubs lessons and multiple-choice practice for AP Computer Science A. Objective codes cite the public Fall 2025 CED as metadata only. This is not a complete AP course and is not College Board material.",
  frameworkCode: AP_CSA_FRAMEWORK_CODE,
  frameworkYear: AP_CSA_FRAMEWORK_YEAR,
  sourceBasis: AP_CSA_SOURCE_BASIS,
  status: AP_CSA_STATUS,
  units: [
    {
      slug: "java-foundations",
      title: "Java foundations",
      description:
        "A short original introduction to primitive values, objects, and first control-flow ideas. This is a published skeleton, not a full AP Computer Science A unit.",
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
  const [{ lessons }, { questions }] = await Promise.all([
    import("@/features/learn/courses/ap-csa/content"),
    import("@/features/learn/courses/ap-csa/questions"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
  };
}

export default manifest;
