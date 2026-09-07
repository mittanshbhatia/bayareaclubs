/**
 * BayAreaClubs study tools for AP Calculus BC.
 * Original descriptions. Not cloned third-party chrome.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "bc-skills-practice",
    title: "BC skills practice",
    description:
      "Original mixed practice across limits, derivatives, BC integration techniques, Euler and logistic models, polar area, and series tests.",
    questionSlugs: [
      "cancelable-quadratic-limit",
      "difference-quotient-parabola",
      "chain-rule-sine-triple",
      "sqrt-linearization-at-nine",
      "ftc-upper-limit-x",
      "integration-by-parts-x-exp",
      "euler-one-step-linear",
      "area-line-minus-parabola",
      "parametric-slope-power",
      "geometric-half-series",
    ],
  },
  {
    kind: "quiz",
    slug: "bc-checkpoint-quiz",
    title: "BC checkpoint quiz",
    description:
      "A short timed-style mix with harder items: implicit slope, related rates, improper integrals, logistic growth, arc length, and radius of convergence.",
    questionSlugs: [
      "implicit-circle-slope",
      "related-rates-circle-area",
      "closed-interval-candidates",
      "improper-p-two-converges",
      "logistic-fastest-growth",
      "arc-length-integrand-linear",
      "polar-area-full-circle",
      "ratio-test-radius-power",
    ],
  },
  {
    kind: "review",
    slug: "bc-unit-review",
    title: "Ten-unit review path",
    description:
      "Revisit one lesson from each official BC unit, including parts and improper integrals, Euler and logistic growth, arc length, polar area, and Taylor remainders.",
    lessonSlugs: [
      "limit-language-and-algebraic-gateways",
      "difference-quotient-as-instantaneous-rate",
      "chain-rule-for-nested-motions",
      "related-rates-in-club-settings",
      "mean-value-extrema-and-candidates",
      "parts-partial-fractions-and-improper",
      "euler-steps-and-logistic-growth",
      "arc-length-and-average-value",
      "polar-slopes-and-swept-area",
      "taylor-polynomials-and-error-bounds",
    ],
  },
  {
    kind: "notes",
    slug: "bc-working-notes",
    title: "Working notes",
    description:
      "Core teaching notes for BC extras: integration by parts, partial fractions, improper integrals, Euler steps, logistic models, arc length, parametric and polar motion, and series remainder bounds.",
    lessonSlugs: [
      "parts-partial-fractions-and-improper",
      "euler-steps-and-logistic-growth",
      "arc-length-and-average-value",
      "parametric-paths-and-vector-velocity",
      "polar-slopes-and-swept-area",
      "sequences-series-and-convergence-tests",
      "taylor-polynomials-and-error-bounds",
    ],
  },
  {
    kind: "readiness",
    slug: "bc-exam-readiness",
    title: "Exam readiness check",
    description:
      "A readiness sweep that pairs late-unit lessons with items on L'Hospital, the FTC, logistic carrying capacity, vector speed, and Maclaurin polynomials.",
    lessonSlugs: [
      "linearization-and-indeterminate-forms",
      "riemann-accumulation-and-ftc",
      "euler-steps-and-logistic-growth",
      "parametric-paths-and-vector-velocity",
      "taylor-polynomials-and-error-bounds",
    ],
    questionSlugs: [
      "lhospital-zero-over-zero",
      "ftc-upper-limit-x",
      "logistic-carrying-capacity",
      "vector-speed-three-four",
      "maclaurin-exp-degree-two",
      "nth-term-test-nonzero",
    ],
  },
];

export default tools;
