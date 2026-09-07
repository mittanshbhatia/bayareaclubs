/**
 * BayAreaClubs study tools for AP CSP. Original chrome, not cloned.
 * source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: CourseTool[] = [
  {
    kind: "practice",
    slug: "csp-mixed-practice",
    title: "Mixed practice",
    description:
      "Original multiple-choice items drawn from all five Big Ideas. Use after reading a lesson, not as a College Board exam.",
    questionSlugs: [
      "soldering-iron-purpose",
      "same-bits-three-meanings",
      "expired-card-selection",
      "interview-split-into-packets",
      "pothole-map-representation",
      "eight-bit-temperature-range",
      "pair-roles-during-merge",
    ],
  },
  {
    kind: "quiz",
    slug: "csp-unit-check-quiz",
    title: "Unit check quiz",
    description:
      "A short original quiz spanning purpose, data encodings, algorithms, networks, and impact.",
    questionSlugs: [
      "iteration-after-hallway-test",
      "yearbook-poster-file-size",
      "compound-boolean-tool-checkout",
      "backup-path-livestream",
      "hall-pass-public-screen",
      "courtyard-sensor-bias",
    ],
  },
  {
    kind: "review",
    slug: "csp-exam-review",
    title: "Harder review set",
    description:
      "Original harder items on simulations, parallel joins, and training-data bias. Explanations are teaching notes, not scoring keys from any bank.",
    questionSlugs: [
      "dance-line-simulation-assumption",
      "parallel-encode-shared-drive",
      "recommended-clubs-training-bias",
      "timezone-assumption-docs",
      "bandwidth-vs-latency-upload",
      "yearbook-photo-not-free",
    ],
  },
  {
    kind: "notes",
    slug: "csp-lesson-notes",
    title: "Lesson notes",
    description:
      "Read the original lesson bodies in order. Each unit has two teaching notes written for Bay Area club scenarios.",
    lessonSlugs: [
      "purpose-users-and-iteration",
      "collaboration-and-shared-drafts",
      "bits-patterns-and-meaning",
      "datasets-bias-and-charts",
      "sequences-selection-and-loops",
      "lists-procedures-and-simulations",
      "packets-paths-and-redundancy",
      "protocols-bandwidth-and-open-internet",
      "computing-innovations-and-effects",
      "crowdsourcing-legal-and-ethical-limits",
    ],
  },
  {
    kind: "readiness",
    slug: "csp-readiness-check",
    title: "Readiness check",
    description:
      "A readiness sweep: one or two original items per Big Idea to see which unit to restudy.",
    questionSlugs: [
      "soldering-iron-purpose",
      "same-bits-three-meanings",
      "locker-code-iteration",
      "snack-inventory-procedure",
      "backup-path-livestream",
      "hall-pass-public-screen",
      "procedure-parameter-stock",
      "carpool-exclusion-effect",
    ],
    lessonSlugs: [
      "purpose-users-and-iteration",
      "bits-patterns-and-meaning",
      "sequences-selection-and-loops",
      "packets-paths-and-redundancy",
      "computing-innovations-and-effects",
    ],
  },
];

export default tools;
