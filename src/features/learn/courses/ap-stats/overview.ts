/**
 * Original course overview for AP Statistics.
 * Plain text. source_basis: ORIGINAL.
 */

import {
  AP_STATS_FRAMEWORK_CODE,
  AP_STATS_FRAMEWORK_YEAR,
  AP_STATS_NAMESPACE,
  AP_STATS_SOURCE_BASIS,
} from "@/features/learn/courses/ap-stats/manifest";

export const overview = {
  namespace: AP_STATS_NAMESPACE,
  sourceBasis: AP_STATS_SOURCE_BASIS,
  frameworkCode: AP_STATS_FRAMEWORK_CODE,
  frameworkYear: AP_STATS_FRAMEWORK_YEAR,
  title: "AP Statistics",
  bodyPlain: [
    "This course teaches AP Statistics with original BayAreaClubs lessons. Every example is a school-club situation we invented: Peninsula Robotics autonomous times, Mission Bake Sale tray counts, Harbor Coding Club hackathon hours, and similar numbers that do not come from a published exam table.",
    "The nine official units follow the public 2019 AP Statistics course outline. You start by graphing one variable, then two. You learn how a survey or experiment was built before you trust a claim. Probability and sampling distributions explain why a sample statistic moves. The last four units turn those ideas into intervals and tests for proportions, means, categorical tables, and regression slopes.",
    "Objective codes such as VAR-1.A or UNC-4.B are public CED identifiers stored as metadata. Lesson prose is original teaching text. This is not College Board, Stellar, or Unlimited Voices material, and it does not reproduce CED paragraphs or released free-response items.",
  ].join("\n\n"),
} as const;

export default overview;
