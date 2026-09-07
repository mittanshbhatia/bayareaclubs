/**
 * AP Statistics — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-STAT, public CED year 2019.
 * Objective codes are public CED identifiers only (VAR-*, UNC-*, DAT-*).
 * This file is not College Board, Stellar, or Unlimited Voices material.
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_STATS_NAMESPACE = "ap-stats" as const;
export const AP_STATS_FRAMEWORK_CODE = "AP-STAT" as const;
export const AP_STATS_FRAMEWORK_YEAR = 2019 as const;
export const AP_STATS_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_STATS_STATUS = "original_course" as const;
export const AP_STATS_DISCIPLINE = "mathematics" as const;

export const AP_STATS_OFFICIAL_UNITS = [
  {
    slug: "exploring-one-variable",
    title: "Exploring One-Variable Data",
  },
  {
    slug: "exploring-two-variable",
    title: "Exploring Two-Variable Data",
  },
  {
    slug: "collecting-data",
    title: "Collecting Data",
  },
  {
    slug: "probability-random-variables",
    title: "Probability, Random Variables, and Probability Distributions",
  },
  {
    slug: "sampling-distributions",
    title: "Sampling Distributions",
  },
  {
    slug: "inference-proportions",
    title: "Inference for Categorical Data: Proportions",
  },
  {
    slug: "inference-means",
    title: "Inference for Quantitative Data: Means",
  },
  {
    slug: "inference-chi-square",
    title: "Inference for Categorical Data: Chi-Square",
  },
  {
    slug: "inference-slopes",
    title: "Inference for Quantitative Data: Slopes",
  },
] as const;

export type ApStatsSourceBasis = typeof AP_STATS_SOURCE_BASIS;
export type ApStatsCourseStatus = typeof AP_STATS_STATUS;

export type ApStatsManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApStatsManifestUnit = {
  slug: string;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApStatsManifestLesson[];
};

export type ApStatsManifest = {
  namespace: typeof AP_STATS_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_STATS_FRAMEWORK_CODE;
  frameworkYear: typeof AP_STATS_FRAMEWORK_YEAR;
  discipline: typeof AP_STATS_DISCIPLINE;
  sourceBasis: ApStatsSourceBasis;
  status: ApStatsCourseStatus;
  units: readonly ApStatsManifestUnit[];
};

export const manifest = {
  namespace: AP_STATS_NAMESPACE,
  title: "AP Statistics",
  slug: AP_STATS_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Statistics. Club data scenarios use invented robotics times, bake-sale counts, and other school-club numbers. Objective codes cite the public 2019 CED as metadata only. This is not College Board material.",
  frameworkCode: AP_STATS_FRAMEWORK_CODE,
  frameworkYear: AP_STATS_FRAMEWORK_YEAR,
  discipline: AP_STATS_DISCIPLINE,
  sourceBasis: AP_STATS_SOURCE_BASIS,
  status: AP_STATS_STATUS,
  units: [
    {
      slug: "exploring-one-variable",
      title: "Exploring One-Variable Data",
      description:
        "Individuals, variables, graphs, and numerical summaries for one categorical or quantitative variable, including the normal model.",
      position: 1,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "variables-and-one-variable-graphs",
          title: "Variables and One-Variable Graphs",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "center-spread-and-the-normal-curve",
          title: "Center, Spread, and the Normal Curve",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "exploring-two-variable",
      title: "Exploring Two-Variable Data",
      description:
        "Two-way tables, association, scatterplots, correlation, residuals, and the least-squares line.",
      position: 2,
      estimatedMinutes: 42,
      lessons: [
        {
          slug: "two-way-tables-and-association",
          title: "Two-Way Tables and Association",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "scatterplots-correlation-and-least-squares",
          title: "Scatterplots, Correlation, and Least Squares",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "collecting-data",
      title: "Collecting Data",
      description:
        "Sampling methods, bias, observational studies, experiments, random assignment, and the scope of inference.",
      position: 3,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "sampling-surveys-and-bias",
          title: "Sampling, Surveys, and Bias",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "experiments-random-assignment-and-scope",
          title: "Experiments, Random Assignment, and Scope",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "probability-random-variables",
      title: "Probability, Random Variables, and Probability Distributions",
      description:
        "Probability rules, independence, discrete random variables, and the binomial and geometric models.",
      position: 4,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "probability-rules-and-independence",
          title: "Probability Rules and Independence",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "random-variables-binomial-and-geometric",
          title: "Random Variables, Binomial, and Geometric",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "sampling-distributions",
      title: "Sampling Distributions",
      description:
        "Statistics versus parameters and the sampling distributions of a sample proportion and a sample mean.",
      position: 5,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "sampling-distributions-of-proportions",
          title: "Sampling Distributions of Proportions",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "sampling-distributions-of-means",
          title: "Sampling Distributions of Means",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "inference-proportions",
      title: "Inference for Categorical Data: Proportions",
      description:
        "One- and two-sample z procedures for proportions, conditions, confidence intervals, and significance tests.",
      position: 6,
      estimatedMinutes: 42,
      lessons: [
        {
          slug: "confidence-intervals-for-proportions",
          title: "Confidence Intervals for Proportions",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "significance-tests-for-proportions",
          title: "Significance Tests for Proportions",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "inference-means",
      title: "Inference for Quantitative Data: Means",
      description:
        "t procedures for a mean and for a difference of means, including paired data and conditions.",
      position: 7,
      estimatedMinutes: 42,
      lessons: [
        {
          slug: "t-intervals-for-means",
          title: "t Intervals for Means",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "t-tests-for-means-and-differences",
          title: "t Tests for Means and Differences",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "inference-chi-square",
      title: "Inference for Categorical Data: Chi-Square",
      description:
        "Chi-square goodness-of-fit, homogeneity, and independence, including expected counts and degrees of freedom.",
      position: 8,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "chi-square-goodness-of-fit",
          title: "Chi-Square Goodness of Fit",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "chi-square-homogeneity-and-independence",
          title: "Chi-Square Homogeneity and Independence",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "inference-slopes",
      title: "Inference for Quantitative Data: Slopes",
      description:
        "Conditions, confidence intervals, and significance tests for the slope of a least-squares line.",
      position: 9,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "regression-slope-confidence-intervals",
          title: "Regression Slope Confidence Intervals",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "inference-for-slope-and-conditions",
          title: "Inference for Slope and Conditions",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
  ],
} as const satisfies ApStatsManifest;

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

export async function loadApStatsCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }] = await Promise.all([
    import("@/features/learn/courses/ap-stats/content"),
    import("@/features/learn/courses/ap-stats/questions"),
    import("@/features/learn/courses/ap-stats/tools"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
    tools,
  };
}

export default manifest;
