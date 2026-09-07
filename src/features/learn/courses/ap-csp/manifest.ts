/**
 * AP Computer Science Principles — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-CSP, public CED year 2020.
 * Objective codes are public CED identifiers only (no CED prose).
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
export const AP_CSP_STATUS = "original_course" as const;

export type ApCspSourceBasis = typeof AP_CSP_SOURCE_BASIS;
export type ApCspCourseStatus = typeof AP_CSP_STATUS;

export const OFFICIAL_UNIT_SLUGS = [
  "creative-development",
  "data",
  "algorithms-and-programming",
  "computing-systems-and-networks",
  "impact-of-computing",
] as const;

export type ApCspOfficialUnitSlug = (typeof OFFICIAL_UNIT_SLUGS)[number];

export type ApCspManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApCspManifestUnit = {
  slug: ApCspOfficialUnitSlug;
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
    "Original BayAreaClubs lessons and multiple-choice practice for AP Computer Science Principles, organized by the five Fall 2020 CED Big Ideas. Objective codes cite public CED identifiers as metadata only. This is not College Board material.",
  frameworkCode: AP_CSP_FRAMEWORK_CODE,
  frameworkYear: AP_CSP_FRAMEWORK_YEAR,
  sourceBasis: AP_CSP_SOURCE_BASIS,
  status: AP_CSP_STATUS,
  units: [
    {
      slug: "creative-development",
      title: "Creative Development",
      description:
        "Purpose statements, users, iteration, and collaboration on club software.",
      position: 1,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "purpose-users-and-iteration",
          title: "Purpose, Users, and Iteration",
          position: 1,
          estimatedMinutes: 18,
        },
        {
          slug: "collaboration-and-shared-drafts",
          title: "Collaboration and Shared Drafts",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "data",
      title: "Data",
      description:
        "Bits, encodings, compression, datasets, metadata, charts, and collection bias.",
      position: 2,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "bits-patterns-and-meaning",
          title: "Bits, Patterns, and Meaning",
          position: 1,
          estimatedMinutes: 18,
        },
        {
          slug: "datasets-bias-and-charts",
          title: "Datasets, Bias, and Charts",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "algorithms-and-programming",
      title: "Algorithms and Programming",
      description:
        "Sequence, selection, iteration, lists, procedures, and simple simulations.",
      position: 3,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "sequences-selection-and-loops",
          title: "Sequences, Selection, and Loops",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "lists-procedures-and-simulations",
          title: "Lists, Procedures, and Simulations",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "computing-systems-and-networks",
      title: "Computing Systems and Networks",
      description:
        "Packets, paths, redundancy, protocols, bandwidth, and split work.",
      position: 4,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "packets-paths-and-redundancy",
          title: "Packets, Paths, and Redundancy",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "protocols-bandwidth-and-open-internet",
          title: "Protocols, Bandwidth, and the Open Internet",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "impact-of-computing",
      title: "Impact of Computing",
      description:
        "Beneficial and harmful effects, crowdsourcing, legal limits, and privacy.",
      position: 5,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "computing-innovations-and-effects",
          title: "Computing Innovations and Effects",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "crowdsourcing-legal-and-ethical-limits",
          title: "Crowdsourcing, Legal, and Ethical Limits",
          position: 2,
          estimatedMinutes: 22,
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
    discipline: "computer_science",
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
  const [{ lessons }, { questions }, { tools }] = await Promise.all([
    import("@/features/learn/courses/ap-csp/content"),
    import("@/features/learn/courses/ap-csp/questions"),
    import("@/features/learn/courses/ap-csp/tools"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
    tools,
  };
}

export default manifest;
