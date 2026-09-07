/**
 * Original lessons for Atomic Structure and Properties.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const atomicStructureLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "atomic-structure-properties",
    slug: "moles-mass-spectra-and-composition",
    title: "Moles, Mass Spectra, and Composition",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SPQ-1.A", "SPQ-1.B", "SPQ-2.A", "SPQ-2.B"],
    bodyPlain: [
      "A mole is a counting unit: 6.022 x 10^23 particles of whatever you named. The molar mass on a periodic table converts grams to moles, and that conversion is the first move in almost every quantitative chemistry problem. Peninsula Robotics weighs 12.47 g of CuSO4 · 5H2O before a crystal-growing demo. Dividing by 249.7 g/mol gives 0.0499 mol of hydrate, which is also 0.0499 mol of copper(II) ions if the solid is pure. If the scale reading is off by a few tenths of a gram, every later concentration is off by the same relative amount. The mole concept does not hide experimental error; it multiplies it into particle counts and solution concentrations.",
      "Mass spectrometry sorts ions by mass-to-charge ratio. For an element, the spectrum is a set of peaks whose heights match the relative abundances of the naturally occurring isotopes. Chlorine shows major signals near 35 u and 37 u. The weighted average of those masses is the atomic mass printed on the table. A club that treats chlorine as if every atom were 35.45 u is using a convenient average, not a description of any single atom. When a sample is a compound, fragmentation and molecular-ion peaks appear; the important habit is to ask which particles produced each peak and whether the charge is +1, so mass-to-charge is just mass.",
      "Percent composition and empirical formulas come from the same mole arithmetic. If a dry sample from a Fremont Science Bowl prep is 40.00% C, 6.71% H, and 53.29% O by mass, a 100 g thought-sample contains 3.33 mol C, 6.66 mol H, and 3.33 mol O. Dividing through by the smallest count gives CH2O. That empirical formula could belong to formaldehyde, acetic acid, or glucose. A molar mass from a separate experiment chooses among those possibilities. Pure-substance composition is fixed by the formula; mixture composition is not.",
      "Mixtures require an extra bookkeeping step. A bottle labeled \"brass turnings\" is copper plus zinc, not a single compound. If a 2.00 g sample yields 1.34 g of copper after a displacement workup, the sample is 67% copper by mass. That percentage can change from bottle to bottle. Gravimetric and spectroscopic methods exist to measure those fractions, but they still report mass or mole ratios of components, not a new chemical formula. Students should say clearly whether a number describes a pure substance or a mixture before they write a formula.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "atomic-structure-properties",
    slug: "electrons-pes-and-periodic-trends",
    title: "Electrons, PES, and Periodic Trends",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SAP-1.A", "SAP-1.B", "SAP-2.A", "SAP-2.B"],
    bodyPlain: [
      "Electrons occupy orbitals that differ in energy and in how close they stay to the nucleus on average. The Aufbau filling order, Hund pairing, and the Pauli exclusion rule produce a ground-state configuration such as 1s2 2s2 2p6 3s2 3p4 for sulfur. Core electrons sit in completed inner shells. Valence electrons sit in the outer shell and are the ones that move, share, or transfer when atoms form compounds. A Los Altos Science Club poster that lists only valence electrons for an ion is useful for bonding, but it is not a complete picture of the atom's electrons.",
      "Photoelectron spectroscopy (PES) measures how much energy is required to eject electrons from each subshell. Each peak corresponds to a set of electrons with a similar binding energy. The peak farthest to the left (highest binding energy, if the axis is drawn that way) belongs to the 1s electrons. Peak areas are proportional to the number of electrons in that subshell. A PES trace with peaks in a 2:2:6:2:4 pattern matches the electron counts of sulfur, not oxygen. Reading PES is a way to check a configuration against data instead of reciting a memorized string.",
      "Periodic trends follow from effective nuclear charge and distance. Across a period, more protons pull the same valence shell inward, so atomic radius shrinks and first ionization energy generally rises. Down a group, a new shell is added, so radius grows and ionization energy falls. Electronegativity follows a similar left-to-right increase and top-to-bottom decrease. Exceptions exist—beryllium versus boron, nitrogen versus oxygen—because of subshell stability, but the first explanation to write is still charge and distance.",
      "Ionic compounds form when a metal with a low ionization energy transfers valence electrons to a nonmetal with a high electron affinity. The resulting cations and anions pack into a lattice. Sodium has one valence electron; chlorine needs one to complete its shell. The formula NaCl is the smallest whole-number ratio that keeps the crystal electrically neutral. Magnesium oxide uses Mg2+ and O2- for the same neutrality reason. Predicting an ionic formula is therefore a valence-electron and charge-balance problem, not a mole-mass problem.",
    ].join("\n\n"),
  },
];
