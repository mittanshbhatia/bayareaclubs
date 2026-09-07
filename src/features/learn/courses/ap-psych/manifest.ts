/**
 * AP Psychology — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-PSYCH, public CED year 2024.
 * Objective codes below are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_PSYCH_NAMESPACE = "ap-psych" as const;
export const AP_PSYCH_FRAMEWORK_CODE = "AP-PSYCH" as const;
export const AP_PSYCH_FRAMEWORK_YEAR = 2024 as const;
export const AP_PSYCH_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_PSYCH_STATUS = "original_course" as const;

export const AP_PSYCH_OFFICIAL_UNITS = [
  "biological-bases",
  "cognition",
  "development-and-learning",
  "social-and-personality",
  "mental-and-physical-health",
] as const;

export type ApPsychSourceBasis = typeof AP_PSYCH_SOURCE_BASIS;
export type ApPsychCourseStatus = typeof AP_PSYCH_STATUS;
export type ApPsychOfficialUnitSlug = (typeof AP_PSYCH_OFFICIAL_UNITS)[number];

export type ApPsychManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApPsychManifestUnit = {
  slug: ApPsychOfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApPsychManifestLesson[];
};

export type ApPsychManifest = {
  namespace: typeof AP_PSYCH_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_PSYCH_FRAMEWORK_CODE;
  frameworkYear: typeof AP_PSYCH_FRAMEWORK_YEAR;
  discipline: "other";
  sourceBasis: ApPsychSourceBasis;
  status: ApPsychCourseStatus;
  units: readonly ApPsychManifestUnit[];
};

export const manifest = {
  namespace: AP_PSYCH_NAMESPACE,
  title: "AP Psychology",
  slug: AP_PSYCH_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Psychology. Objective codes cite the public 2024 revised CED as metadata only. This is educational overview material, not College Board content and not clinical advice.",
  frameworkCode: AP_PSYCH_FRAMEWORK_CODE,
  frameworkYear: AP_PSYCH_FRAMEWORK_YEAR,
  discipline: "other",
  sourceBasis: AP_PSYCH_SOURCE_BASIS,
  status: AP_PSYCH_STATUS,
  units: [
    {
      slug: "biological-bases",
      title: "Biological Bases of Behavior",
      description:
        "How heredity, neurons, nervous systems, brain networks, sleep, and sensation support behavior and mental processes.",
      position: 1,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "neurons-signals-and-nervous-systems",
          title: "Neurons, Signals, and Nervous Systems",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "brain-sleep-and-sensation",
          title: "Brain Networks, Sleep, and Sensation",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "cognition",
      title: "Cognition",
      description:
        "Perception, judgment, memory systems, forgetting, and how psychologists talk about intelligence and achievement.",
      position: 2,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "perception-thinking-and-judgment",
          title: "Perception, Thinking, and Judgment",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "memory-systems-and-intelligence",
          title: "Memory Systems and Intelligence",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "development-and-learning",
      title: "Development and Learning",
      description:
        "Lifespan change plus classical, operant, and social-cognitive accounts of how people learn.",
      position: 3,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "development-across-the-lifespan",
          title: "Development Across the Lifespan",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "conditioning-and-social-learning",
          title: "Conditioning and Social Learning",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "social-and-personality",
      title: "Social Psychology and Personality",
      description:
        "Attribution, attitudes, social situations, personality theories, motivation, and emotion.",
      position: 4,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "attribution-attitudes-and-social-situations",
          title: "Attribution, Attitudes, and Social Situations",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "personality-motivation-and-emotion",
          title: "Personality, Motivation, and Emotion",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "mental-and-physical-health",
      title: "Mental and Physical Health",
      description:
        "Educational overview of health psychology, well-being research, classification, and treatment traditions. Not clinical advice.",
      position: 5,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "health-psychology-and-well-being",
          title: "Health Psychology and Well-Being",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "classification-and-treatment-traditions",
          title: "Classification and Treatment Traditions",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
  ],
} as const satisfies ApPsychManifest;

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

export async function loadApPsychCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }, extra] = await Promise.all([
    import("@/features/learn/courses/ap-psych/content"),
    import("@/features/learn/courses/ap-psych/questions"),
    import("@/features/learn/courses/ap-psych/tools"),
    import("@/features/learn/courses/ap-psych/questions-advanced"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions: [...questions, ...extra.questions],
    tools,
  };
}

export default manifest;
