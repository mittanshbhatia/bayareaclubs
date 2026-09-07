/**
 * AP Computer Science Principles — published skeleton catalog.
 * source_basis: ORIGINAL. framework: AP-CSP, public CED year 2020.
 * Objective codes below are public CED identifiers only (no CED prose).
 * Registers with Agent 09 via registerCourseLoader.
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_CSP_NAMESPACE = "ap-csp" as const;
export const AP_CSP_FRAMEWORK_CODE = "AP-CSP" as const;
export const AP_CSP_FRAMEWORK_YEAR = 2020 as const;
export const AP_CSP_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_CSP_STATUS = "published_skeleton" as const;

export type ApCspSourceBasis = typeof AP_CSP_SOURCE_BASIS;
export type ApCspCourseStatus = typeof AP_CSP_STATUS;

export type ApCspManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApCspManifestUnit = {
  slug: string;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApCspManifestLesson[];
};

export type ApCspManifest = {
  namespace: typeof AP_CSP_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_CSP_FRAMEWORK_CODE;
  frameworkYear: typeof AP_CSP_FRAMEWORK_YEAR;
  sourceBasis: ApCspSourceBasis;
  status: ApCspCourseStatus;
  units: readonly ApCspManifestUnit[];
};

export const manifest = {
  namespace: AP_CSP_NAMESPACE,
  title: "AP Computer Science Principles",
  slug: "ap-csp",
  description:
    "Published skeleton of original BayAreaClubs lessons and multiple-choice practice for AP Computer Science Principles. Objective codes cite the public Fall 2020 CED as metadata only. This is not a complete AP course and is not College Board material.",
  frameworkCode: AP_CSP_FRAMEWORK_CODE,
  frameworkYear: AP_CSP_FRAMEWORK_YEAR,
  sourceBasis: AP_CSP_SOURCE_BASIS,
  status: AP_CSP_STATUS,
  units: [
    {
      slug: "computing-ideas-in-practice",
      title: "Computing Ideas in Practice",
      description:
        "A short original introduction to program purpose, iteration, and bit representation. This is a published skeleton, not a full AP CSP unit.",
      position: 1,
      estimatedMinutes: 36,
      lessons: [
        {
          slug: "purpose-users-and-iteration",
          title: "Purpose, Users, and Iteration",
          position: 1,
          estimatedMinutes: 18,
        },
        {
          slug: "bits-patterns-and-meaning",
          title: "Bits, Patterns, and Meaning",
          position: 2,
          estimatedMinutes: 18,
        },
      ],
    },
  ],
} as const satisfies ApCspManifest;

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

export async function loadApCspCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }] = await Promise.all([
    import("@/features/learn/courses/ap-csp/content"),
    import("@/features/learn/courses/ap-csp/questions"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
  };
}

export default manifest;
