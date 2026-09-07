/**
 * Original course overview. Plain text only. source_basis: ORIGINAL.
 */

import {
  AP_PRECALC_FRAMEWORK_CODE,
  AP_PRECALC_FRAMEWORK_YEAR,
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";

export const overview = {
  namespace: AP_PRECALC_NAMESPACE,
  frameworkCode: AP_PRECALC_FRAMEWORK_CODE,
  frameworkYear: AP_PRECALC_FRAMEWORK_YEAR,
  sourceBasis: AP_PRECALC_SOURCE_BASIS,
  title: "AP Precalculus at BayAreaClubs",
  bodyPlain: [
    "This course is original BayAreaClubs teaching for AP Precalculus. Students learn to describe how quantities change together, choose a function family that matches that change, and read a graph or table well enough to defend the choice.",
    "Unit 1 builds polynomial and rational models: average rates of change, end behavior, zeros, holes, and asymptotes. Unit 2 moves from geometric sequences to exponential and logarithmic equations, inverses, and semi-log checks. Unit 3 treats periodic sine and cosine models and polar coordinates. Unit 4, optional on the AP exam, still ships original lessons on parametric paths, vectors, and matrices as functions.",
    "Lessons use Bay Area club work—bake-sale pricing, compost logs, tide watches, drone paths, and stage lighting—so the math stays tied to a job a student might actually do. Objective codes are public 2023 CED identifiers only. Nothing here is copied from College Board, Stellar, or any other bank.",
  ].join("\n\n"),
} as const;

export default overview;
