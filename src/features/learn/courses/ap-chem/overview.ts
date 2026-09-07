/**
 * Original course overview for AP Chemistry.
 * Plain text. source_basis: ORIGINAL.
 */

import {
  AP_CHEM_FRAMEWORK_YEAR,
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
} from "@/features/learn/courses/ap-chem/manifest";

export const overviewTitle = "AP Chemistry at BayAreaClubs";

export const OVERVIEW_PLAIN = [
  "This course is original BayAreaClubs teaching material for AP Chemistry. It follows the nine public 2019 unit titles: atomic structure, compound structure, intermolecular forces, chemical reactions, kinetics, thermodynamics, equilibrium, acids and bases, and applications of thermodynamics.",
  "Lessons use club and school-lab situations from the Bay Area so that mole counts, spectra, titrations, and cells stay attached to a real measurement. Objective codes such as SAP-1.A or TRA-3.B are public CED identifiers used only as metadata. They are not College Board prose, free-response items, or released exams.",
  "Practice tools include mixed items, a timed-style quiz, a review path through every unit, note prompts, and a readiness check. Work the calculations with a pencil. The course does not replace a supervised laboratory program and does not copy any commercial lab manual.",
].join("\n\n");

export const overview = OVERVIEW_PLAIN;

export const courseOverview = {
  namespace: AP_CHEM_NAMESPACE,
  sourceBasis: AP_CHEM_SOURCE_BASIS,
  frameworkYear: AP_CHEM_FRAMEWORK_YEAR,
  title: overviewTitle,
  bodyPlain: OVERVIEW_PLAIN,
};

export default OVERVIEW_PLAIN;
