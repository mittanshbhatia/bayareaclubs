/**
 * BayAreaClubs practice tools for AP Precalculus.
 * Original copy. Not cloned third-party chrome. source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "precalc-mixed-practice",
    title: "Mixed practice",
    description:
      "Work original items from all four units: rates and rationals, exponentials and logs, sine and polar graphs, and optional parametric, vector, and matrix functions.",
    questionSlugs: [
      "bake-sale-average-rate",
      "compost-geometric-next",
      "sine-amplitude-and-period",
      "drone-parametric-point",
      "canceled-factor-hole",
      "polar-to-rectangular-point",
    ],
    lessonSlugs: [
      "change-rates-and-polynomial-shape",
      "exponential-change-and-log-inverses",
      "periodic-sine-and-transforms",
      "parametric-motion-in-the-plane",
    ],
  },
  {
    kind: "quiz",
    slug: "precalc-checkpoint-quiz",
    title: "Checkpoint quiz",
    description:
      "A short original quiz that samples each official unit. Use it after you can compute an average rate, rewrite a log, read a sine transform, and evaluate a parametric point.",
    questionSlugs: [
      "cubic-end-behavior",
      "exponential-evaluation",
      "sine-fundamental-period",
      "vector-magnitude-three-four",
      "matching-degree-horizontal",
    ],
  },
  {
    kind: "review",
    slug: "precalc-unit-review",
    title: "Unit review",
    description:
      "Revisit the classification mistakes that show up in club models: holes versus vertical asymptotes, arithmetic versus geometric change, period versus amplitude, and invertible versus singular matrices.",
    questionSlugs: [
      "canceled-factor-hole",
      "log-base-two-of-thirty-two",
      "tide-midline-and-phase",
      "two-by-two-determinant",
      "semi-log-linear-test",
    ],
    lessonSlugs: [
      "rational-graphs-zeros-and-holes",
      "composition-equations-and-semi-log",
      "polar-graphs-and-polar-rates",
      "vectors-and-matrix-functions",
    ],
  },
  {
    kind: "notes",
    slug: "precalc-worked-notes",
    title: "Worked notes",
    description:
      "Plain-language notes aligned to every lesson. Record the interval you used for a rate, the canceled factor in a rational, the base of an exponential, and the t-interval of a parametric path.",
    lessonSlugs: [
      "change-rates-and-polynomial-shape",
      "rational-graphs-zeros-and-holes",
      "exponential-change-and-log-inverses",
      "composition-equations-and-semi-log",
      "periodic-sine-and-transforms",
      "polar-graphs-and-polar-rates",
      "parametric-motion-in-the-plane",
      "vectors-and-matrix-functions",
    ],
  },
  {
    kind: "readiness",
    slug: "precalc-exam-readiness",
    title: "Exam readiness",
    description:
      "A mixed original diagnostic before a mock sitting. Unit 4 items are included even though that unit is optional on the AP exam, so you can choose whether to practice those skills.",
    questionSlugs: [
      "matching-degree-horizontal",
      "semi-log-linear-test",
      "tide-midline-and-phase",
      "two-by-two-determinant",
      "polar-to-rectangular-point",
      "diagonal-matrix-action",
    ],
  },
];

export default tools;
