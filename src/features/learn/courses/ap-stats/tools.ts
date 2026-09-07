/**
 * BayAreaClubs practice tools for AP Statistics.
 * Five kinds required by the authoring contract. Original chrome, not cloned.
 * source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

import { AP_STATS_NAMESPACE, AP_STATS_SOURCE_BASIS } from "@/features/learn/courses/ap-stats/manifest";

export const AP_STATS_TOOLS_SOURCE_BASIS = AP_STATS_SOURCE_BASIS;

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "club-data-practice-set",
    title: "Club Data Practice Set",
    description:
      "Untimed original multiple-choice items drawn from Peninsula Robotics times, bake-sale counts, and other invented club numbers. Use after each unit to check a single idea before mixing topics.",
    questionSlugs: [
      "robotics-variable-type",
      "bake-sale-two-way-joint",
      "lunch-line-convenience-bias",
      "brownie-complement-rule",
      "membership-phat-center",
      "saturday-build-ci-interpret",
      "autonomous-t-interval-why",
      "flavor-gof-hypotheses",
      "hours-slope-interval-meaning",
    ],
  },
  {
    kind: "quiz",
    slug: "nine-unit-checkpoint-quiz",
    title: "Nine-Unit Checkpoint Quiz",
    description:
      "A mixed original quiz with one harder item from later units. No published exam tables. Answers stay on the server; this tool only names the items.",
    questionSlugs: [
      "histogram-vs-bar-choice",
      "least-squares-residual-sign",
      "playlist-experiment-confounding",
      "climb-binomial-conditions",
      "bake-sale-clt-mean",
      "two-prop-interval-parameter",
      "paired-vs-two-sample-times",
      "homogeneity-expected-count",
      "slope-test-null",
    ],
  },
  {
    kind: "review",
    slug: "procedure-choice-review",
    title: "Procedure Choice Review",
    description:
      "A guided pass through the nine official units that asks which graph, model, or inference procedure matches a club scenario. Links the review lessons in course order.",
    lessonSlugs: [
      "variables-and-one-variable-graphs",
      "two-way-tables-and-association",
      "sampling-surveys-and-bias",
      "probability-rules-and-independence",
      "sampling-distributions-of-proportions",
      "confidence-intervals-for-proportions",
      "t-intervals-for-means",
      "chi-square-goodness-of-fit",
      "regression-slope-confidence-intervals",
    ],
  },
  {
    kind: "notes",
    slug: "conditions-and-interpretations-notes",
    title: "Conditions and Interpretations Notes",
    description:
      "Student-owned notes for writing interval and test conclusions in context. The notes tool stores the student's words; it does not paste College Board language.",
    lessonSlugs: [
      "center-spread-and-the-normal-curve",
      "scatterplots-correlation-and-least-squares",
      "experiments-random-assignment-and-scope",
      "random-variables-binomial-and-geometric",
      "sampling-distributions-of-means",
      "significance-tests-for-proportions",
      "t-tests-for-means-and-differences",
      "chi-square-homogeneity-and-independence",
      "inference-for-slope-and-conditions",
    ],
  },
  {
    kind: "readiness",
    slug: "ap-stats-readiness-check",
    title: "AP Statistics Readiness Check",
    description:
      "A short original readiness mix covering graphs, design, probability, sampling distributions, and inference. Use when a club study group wants to see which official unit still needs work.",
    questionSlugs: [
      "z-score-bake-sale-cookies",
      "correlation-not-slope",
      "srs-vs-stratified-clubs",
      "geometric-first-success",
      "phat-standard-deviation",
      "type-i-error-club-vote",
      "mean-df-one-sample-t",
      "independence-vs-homogeneity",
      "slope-conditions-residual",
    ],
  },
] as const;

export const toolsMeta = {
  namespace: AP_STATS_NAMESPACE,
  sourceBasis: AP_STATS_SOURCE_BASIS,
  kinds: ["practice", "quiz", "review", "notes", "readiness"] as const,
};

export default tools;
