/**
 * BayAreaClubs practice tools for AP Biology. Five kinds. source_basis: ORIGINAL.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "ap-bio-mixed-practice",
    title: "Mixed practice",
    description:
      "Original items drawn from every official unit so a club study night can rotate topics without leaving the course.",
    questionSlugs: [
      "water-cohesion-in-garden-hose",
      "mitochondria-surface-area",
      "enzyme-saturation-in-yeast-lab",
      "kinase-cascade-amplifies",
      "independent-assortment-seed-tray",
      "operon-repressor-on-plate",
      "allele-frequency-after-frost",
      "trophic-level-energy-loss",
    ],
  },
  {
    kind: "quiz",
    slug: "ap-bio-unit-quiz",
    title: "Unit quiz",
    description:
      "A short original quiz that samples one hard item from each later unit after students finish the first four.",
    questionSlugs: [
      "lipid-bilayer-selective-permeability",
      "photosystem-electron-path",
      "checkpoint-failure-in-culture",
      "x-linked-color-in-fruit-flies",
    ],
  },
  {
    kind: "review",
    slug: "ap-bio-weekend-review",
    title: "Weekend review",
    description:
      "Lesson recap path that walks water chemistry through ecology in the official unit order.",
    lessonSlugs: [
      "water-polarity-and-carbon-scaffolds",
      "organelles-and-compartments",
      "enzymes-and-free-energy",
      "signal-reception-and-transduction",
      "meiosis-and-genetic-variation",
      "transcription-and-translation",
      "selection-evidence-and-allele-change",
      "energy-flow-and-population-change",
    ],
  },
  {
    kind: "notes",
    slug: "ap-bio-lab-notebook",
    title: "Lab notebook prompts",
    description:
      "Guided notes tied to the second lesson of each unit so officers can assign a write-up after a lab or field day.",
    lessonSlugs: [
      "monomers-polymers-and-information-molecules",
      "membranes-gradients-and-transport",
      "photosynthesis-and-cellular-respiration",
      "cell-cycle-and-checkpoints",
      "inheritance-patterns-in-clubs",
      "gene-regulation-and-biotech-tools",
      "speciation-and-phylogeny",
      "communities-disruption-and-biodiversity",
    ],
  },
  {
    kind: "readiness",
    slug: "ap-bio-exam-readiness",
    title: "Exam readiness check",
    description:
      "Harder original items that ask students to choose a mechanism, not a memorized label, before a mock sitting.",
    questionSlugs: [
      "r-group-change-alters-fold",
      "na-k-pump-maintains-gradient",
      "uncoupler-effect-on-atp",
      "ligand-shape-blocks-receptor",
      "nondisjunction-in-anaphase-i",
      "splice-site-change-shortens-protein",
      "shared-derived-trait-on-tree",
      "keystone-otter-kelp-collapse",
    ],
  },
];

export default tools;
