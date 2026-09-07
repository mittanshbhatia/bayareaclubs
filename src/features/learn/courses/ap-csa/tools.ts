/**
 * BayAreaClubs practice tools for AP CSA. Original copy, not cloned chrome.
 * source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "practice",
    title: "Practice",
    description:
      "Work original Java items one at a time. Results stay on your BayAreaClubs account.",
    questionSlugs: [
      "ferry-leftover-seats",
      "club-code-substring",
      "kayak-tide-boolean",
      "ticket-window-while",
      "screening-constructor",
      "accessor-keeps-title",
      "shuttle-stop-array",
      "waitlist-insert",
    ],
    lessonSlugs: [
      "primitive-values-and-expressions",
      "objects-methods-and-control",
      "boolean-choices-and-branches",
      "loops-and-tracing",
    ],
  },
  {
    kind: "quiz",
    slug: "quiz",
    title: "Quiz",
    description:
      "A shorter original set that mixes objects, branches, classes, and collections.",
    questionSlugs: [
      "soil-bag-cast",
      "jam-crate-selection",
      "locker-odd-sum",
      "hours-mutator-guard",
      "bake-sale-waitlist",
      "auditorium-seat-grid",
      "static-open-count",
      "trail-permit-branch",
    ],
  },
  {
    kind: "review",
    slug: "review",
    title: "Review",
    description:
      "Revisit mixed original items across all four published units.",
    questionSlugs: [
      "mural-tile-division",
      "garden-bed-object",
      "nested-row-count",
      "reserve-three-calls",
      "origami-fold-recursion",
      "compound-cast-remainder",
      "max-seen-scores",
    ],
    lessonSlugs: [
      "writing-classes-and-constructors",
      "encapsulation-and-methods",
      "arrays-and-arraylists",
      "two-d-arrays-and-recursion-tracing",
    ],
  },
  {
    kind: "notes",
    slug: "notes",
    title: "Notes",
    description:
      "Read the original lesson prose for every shipped AP CSA unit.",
    lessonSlugs: [
      "primitive-values-and-expressions",
      "objects-methods-and-control",
      "boolean-choices-and-branches",
      "loops-and-tracing",
      "writing-classes-and-constructors",
      "encapsulation-and-methods",
      "arrays-and-arraylists",
      "two-d-arrays-and-recursion-tracing",
    ],
  },
  {
    kind: "readiness",
    slug: "readiness",
    title: "Readiness",
    description:
      "A mixed-difficulty check against published original items, including harder traces.",
    questionSlugs: [
      "ferry-leftover-seats",
      "kayak-tide-boolean",
      "garden-bed-object",
      "hours-mutator-guard",
      "compound-cast-remainder",
      "nested-row-count",
      "reserve-three-calls",
      "max-seen-scores",
    ],
  },
];

export default tools;
