/**
 * BayAreaClubs practice tools for AP Chemistry.
 * source_basis: ORIGINAL. Not cloned third-party chrome.
 */

import type { CourseTool } from "@/features/learn/courses/types";

export const tools: readonly CourseTool[] = [
  {
    kind: "practice",
    slug: "ap-chem-mixed-practice",
    title: "Mixed practice",
    description:
      "Work original multiple-choice items from every AP Chemistry unit. Use these when you want feedback without a full quiz clock.",
    questionSlugs: [
      "cu-hydrate-mole-count",
      "chlorine-mass-spectrum-average",
      "ionic-versus-covalent-sort",
      "water-vsepr-shape",
      "hexane-acetone-water-imf",
      "beer-lambert-dye-concentration",
      "agcl-net-ionic",
      "hcl-naoh-leftover-acid",
      "dye-fade-half-life",
      "slow-step-rate-law",
      "water-calorimeter-heat",
      "hess-two-step-target",
      "ammonia-q-versus-k",
      "agcl-common-ion",
      "strong-hcl-ph",
      "acetate-buffer-ph",
      "gibbs-sign-at-298",
      "zn-cu-cell-anode",
    ],
  },
  {
    kind: "quiz",
    slug: "ap-chem-unit-check-quiz",
    title: "Nine-unit check quiz",
    description:
      "A shorter original quiz with one harder item from several units. Grade yourself, then read the explanation before moving on.",
    questionSlugs: [
      "sulfur-pes-peak-pattern",
      "lattice-energy-mgo-nacl",
      "co2-moles-from-pvnrt",
      "unknown-hcl-titration",
      "clock-reaction-orders",
      "bond-enthalpy-estimate",
      "n2o4-pressure-shift",
      "weak-acid-ice-ph",
      "faraday-copper-plating",
    ],
  },
  {
    kind: "review",
    slug: "ap-chem-full-review",
    title: "Full-course review",
    description:
      "Walk the official unit sequence from moles through electrochemistry. Use this in the week before a mock exam.",
    lessonSlugs: [
      "moles-mass-spectra-and-composition",
      "electrons-pes-and-periodic-trends",
      "bonding-lattices-and-metals",
      "lewis-vsepr-and-hybridization",
      "imfs-phases-and-gases",
      "solutions-separation-and-spectroscopy",
      "reaction-types-and-net-ionic",
      "stoichiometry-and-titration",
      "rates-and-rate-laws",
      "mechanisms-collision-and-catalysis",
      "heat-calorimetry-and-energy-diagrams",
      "enthalpy-bonds-and-hess",
      "k-q-and-equilibrium-calculations",
      "le-chatelier-and-solubility",
      "strong-weak-and-ph",
      "buffers-and-titrations",
      "entropy-gibbs-and-favorability",
      "electrochemistry-and-cell-potential",
    ],
  },
  {
    kind: "notes",
    slug: "ap-chem-working-notes",
    title: "Working notes",
    description:
      "Write a one-page note for each unit: one particulate picture, one equation, and one calculation you can redo without looking.",
    lessonSlugs: [
      "moles-mass-spectra-and-composition",
      "electrons-pes-and-periodic-trends",
      "lewis-vsepr-and-hybridization",
      "imfs-phases-and-gases",
      "stoichiometry-and-titration",
      "rates-and-rate-laws",
      "enthalpy-bonds-and-hess",
      "k-q-and-equilibrium-calculations",
      "buffers-and-titrations",
      "electrochemistry-and-cell-potential",
    ],
  },
  {
    kind: "readiness",
    slug: "ap-chem-readiness-check",
    title: "Readiness check",
    description:
      "A compact original set spanning easy through hard items. Use it to decide whether to review a unit or keep moving.",
    questionSlugs: [
      "periodic-ionization-trend",
      "nitrate-resonance-formal-charge",
      "paper-chromatography-rf",
      "zinc-copper-redox",
      "catalyst-equilibrium-claim",
      "endothermic-cold-pack",
      "ksp-agcl-solubility",
      "half-equivalence-pka",
      "nernst-q-increases",
    ],
  },
];

export default tools;
