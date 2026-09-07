/**
 * BayAreaClubs study tools for AP Environmental Science.
 * Original titles and descriptions. Not cloned third-party chrome.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "marsh-warmup-practice",
    title: "Marsh warmup practice",
    description:
      "Untimed original items from ecosystems, biodiversity, and populations. Use this when the club needs a first pass, not a scored quiz.",
    questionSlugs: [
      "pickleweed-and-mutualism",
      "energy-lost-between-trophic-steps",
      "bottleneck-after-a-levee-breach",
      "specialist-in-a-shrinking-marsh",
    ],
  },
  {
    kind: "quiz",
    slug: "nine-unit-checkpoint-quiz",
    title: "Nine-unit checkpoint quiz",
    description:
      "A scored mix drawn from every official unit so officers can see which public CED topic still needs a second lesson.",
    questionSlugs: [
      "nitrogen-fixation-in-mud",
      "island-size-and-species-count",
      "pyramid-age-structure",
      "clay-silt-sand-and-irrigation",
      "flood-irrigation-loss",
      "heat-rate-of-a-gas-plant",
      "inversion-traps-wildfire-smoke",
      "dead-zone-after-a-first-flush",
      "albedo-after-early-snowmelt",
    ],
  },
  {
    kind: "review",
    slug: "missed-concept-review",
    title: "Missed-concept review",
    description:
      "Harder original items that target common mix-ups: cycles, ENSO, photochemical smog, and climate feedbacks.",
    questionSlugs: [
      "phosphorus-has-no-gas-phase",
      "la-nina-and-sierra-snowpack",
      "ozone-is-not-a-primary-pollutant",
      "permafrost-feedback",
    ],
  },
  {
    kind: "notes",
    slug: "field-notebook",
    title: "Field notebook",
    description:
      "Lesson set for a club notebook: one wetland, one city, one air, and one climate reading. Plain text only.",
    lessonSlugs: [
      "wetland-partners-and-resource-limits",
      "cities-footprints-and-smarter-farms",
      "smog-inversions-and-wildfire-smoke",
      "ozone-greenhouse-and-climate-feedbacks",
    ],
  },
  {
    kind: "readiness",
    slug: "exam-week-readiness",
    title: "Exam-week readiness",
    description:
      "A late-course check that mixes energy tradeoffs, aquatic toxins, ozone, and habitat-loss responses.",
    questionSlugs: [
      "solar-land-use-tradeoff",
      "bioaccumulation-in-striped-bass",
      "cfc-and-stratospheric-ozone",
      "corridor-beats-a-single-preserve",
      "cap-and-trade-is-not-a-ban",
      "ld50-on-a-lab-poster",
    ],
  },
] as const;

export default tools;
