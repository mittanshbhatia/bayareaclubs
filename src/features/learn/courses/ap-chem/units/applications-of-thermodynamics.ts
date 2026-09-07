/**
 * Original lessons for Applications of Thermodynamics.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const applicationsOfThermodynamicsLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "applications-of-thermodynamics",
    slug: "entropy-gibbs-and-favorability",
    title: "Entropy, Gibbs Energy, and Favorability",
    position: 17,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["ENE-4.A", "ENE-4.B", "ENE-4.C", "ENE-4.D", "ENE-5.A", "ENE-5.B"],
    bodyPlain: [
      "Entropy S measures how energy and matter are dispersed. Gases have more entropy than liquids, which have more than solids of the same substance. More particles on the product side of a gas-producing reaction usually increase entropy. Heating a sample increases entropy because more microstates become available. Absolute entropies S° are tabulated; unlike ΔHf°, the entropy of an element is not zero. ΔS° for a reaction is sum of S° of products minus sum of S° of reactants.",
      "The second law says the entropy of the universe increases for a thermodynamically favored process: ΔSuniverse = ΔSsystem + ΔSsurroundings > 0. The surroundings entropy change is often estimated as -ΔHsystem/T when heat leaves or enters reversibly at constant T. An exothermic reaction can drive a decrease in system entropy and still be favored because the surroundings gain more entropy. An endothermic reaction needs a sufficiently positive ΔSsystem, especially at high T.",
      "Gibbs free energy packages those ideas at constant T and P: ΔG = ΔH - TΔS. A negative ΔG means the process is thermodynamically favored (product-favored as written). If ΔH = -80 kJ and ΔS = -150 J/K at 298 K, convert entropy to kJ: ΔG = -80 - (298)(-0.150) = -35 kJ, so the process is favored at that temperature. The -TΔS term grows with temperature. Processes that are enthalpy-favored and entropy-opposed become less favored when heated and can change sign at T = ΔH/ΔS.",
      "Thermodynamic favorability is not speed. A reaction with ΔG << 0 can be immeasurably slow if the activation energy is huge (diamond staying diamond). Kinetic control versus thermodynamic control is the choice between the faster product and the more stable product. ΔG° also links to the equilibrium constant: ΔG° = -RT ln K. A negative ΔG° means K > 1. Coupled reactions matter in cells and in club demos that use a favored reaction to pull an unfavored one: add the ΔG values; if the sum is negative, the pair can proceed.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "applications-of-thermodynamics",
    slug: "electrochemistry-and-cell-potential",
    title: "Electrochemistry and Cell Potential",
    position: 18,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["ENE-6.A", "ENE-6.B", "ENE-6.C"],
    bodyPlain: [
      "A galvanic (voltaic) cell uses a thermodynamically favored redox reaction to push electrons through a wire. Oxidation occurs at the anode; reduction occurs at the cathode. Electrons travel anode to cathode in the external circuit. Ions move through a salt bridge to keep each half-cell electrically neutral. Cell notation writes anode | anode solution || cathode solution | cathode. A Fremont robotics battery workshop that builds a Zn | Zn2+ || Cu2+ | Cu cell is running oxidation of zinc and reduction of copper(II).",
      "Standard reduction potentials E° are tabulated for half-reactions as reductions. The standard cell potential is E°cell = E°cathode - E°anode, or E°(reduction at cathode) plus E°(oxidation at anode), where the oxidation value is the reverse of the table entry. A positive E°cell matches a thermodynamically favored reaction under standard conditions. ΔG° = -n F E°cell. For n = 2 mol e-, E° = 0.34 V, and F = 96500 C/mol, ΔG° = -66 kJ. The signs must agree: positive E° with negative ΔG°.",
      "Nonstandard conditions use Q. The Nernst idea is that E decreases as Q grows toward K. At equilibrium, E = 0 and Q = K. Concentrating products or diluting reactants lowers the driving force. A dead battery is a cell that has approached equilibrium, not a cell that ran out of \"voltage fluid.\" Changing the metal surface area can change the current (rate) without changing E°.",
      "Electrolytic cells force a nonspontaneous redox reaction with an external power supply. The anode is still oxidation, but it is now the positive electrode attached to the supply. Faraday's law converts charge to moles of electrons to moles of product: moles e- = (current in A × time in s) / F. Plating copper for a club trophy, charging a rechargeable cell, and splitting water are electrolytic processes. Mass of metal plated is limited by the ion that is actually reduced and by the number of electrons in that half-reaction, not by a wishful reading of the overall cell drawing.",
    ].join("\n\n"),
  },
];
