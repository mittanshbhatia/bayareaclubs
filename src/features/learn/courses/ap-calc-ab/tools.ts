/**
 * BayAreaClubs practice tools for AP Calculus AB. source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "calc-ab-mixed-practice",
    title: "Mixed practice",
    description:
      "Original multiple-choice items from every official unit, meant for untimed work with the lesson notes open.",
    questionSlugs: [
      "lim-nearby-voltage",
      "lim-cancel-factor",
      "diff-average-velocity",
      "diff-power-rule",
      "comp-chain-identify",
      "comp-chain-compute",
      "ctx-related-setup",
      "ctx-linearization",
      "anl-critical-point",
      "anl-first-derivative-test",
      "int-riemann-rain",
      "int-evaluate-polynomial",
      "de-slope-field-read",
      "de-exponential-form",
      "app-area-setup",
      "app-area-value",
    ],
  },
  {
    kind: "quiz",
    slug: "calc-ab-checkpoint-quiz",
    title: "Checkpoint quiz",
    description:
      "A shorter original set mixing easy and medium items. Use it after a unit, not as a first read.",
    questionSlugs: [
      "lim-ivt-creek",
      "diff-product-rule",
      "comp-inverse-reciprocal",
      "ctx-lhospital-sine",
      "anl-mvt-trail",
      "int-antiderivative-power",
      "de-particular-vs-general",
      "app-displacement-vs-distance",
    ],
  },
  {
    kind: "review",
    slug: "calc-ab-exam-review",
    title: "Exam review",
    description:
      "Harder original items plus the full lesson list for a late-course pass through limits, derivatives, integrals, and applications.",
    lessonSlugs: [
      "approaching-a-value",
      "continuity-and-existence",
      "difference-quotients-and-the-derivative",
      "power-product-and-quotient-rules",
      "chain-rule-in-layers",
      "implicit-and-inverse-derivatives",
      "related-rates-in-context",
      "linearization-and-indeterminate-limits",
      "extrema-and-the-first-derivative",
      "concavity-and-optimization",
      "riemann-sums-and-definite-integrals",
      "antiderivatives-and-the-ftc",
      "slope-fields-and-solutions",
      "separable-equations-and-growth",
      "area-between-curves",
      "volume-and-accumulated-change",
    ],
    questionSlugs: [
      "lim-piecewise-hole",
      "diff-definition-match",
      "comp-implicit-circle",
      "ctx-rope-related",
      "anl-optimize-poster",
      "int-ftc-chain",
      "de-separable-ivp",
      "app-disk-volume",
    ],
  },
  {
    kind: "notes",
    slug: "calc-ab-study-notes",
    title: "Study notes",
    description:
      "The original lesson sequence in official unit order. Read these before the quiz or readiness check.",
    lessonSlugs: [
      "approaching-a-value",
      "continuity-and-existence",
      "difference-quotients-and-the-derivative",
      "power-product-and-quotient-rules",
      "chain-rule-in-layers",
      "implicit-and-inverse-derivatives",
      "related-rates-in-context",
      "linearization-and-indeterminate-limits",
      "extrema-and-the-first-derivative",
      "concavity-and-optimization",
      "riemann-sums-and-definite-integrals",
      "antiderivatives-and-the-ftc",
      "slope-fields-and-solutions",
      "separable-equations-and-growth",
      "area-between-curves",
      "volume-and-accumulated-change",
    ],
  },
  {
    kind: "readiness",
    slug: "calc-ab-readiness-check",
    title: "Readiness check",
    description:
      "One original item from each official unit. Use this when you want a single pass/fail snapshot before a mock exam.",
    questionSlugs: [
      "lim-cancel-factor",
      "diff-definition-match",
      "comp-chain-compute",
      "ctx-rope-related",
      "anl-first-derivative-test",
      "int-evaluate-polynomial",
      "de-separable-ivp",
      "app-area-value",
    ],
  },
];

export default tools;
