/**
 * Original lessons for Chemical Reactions.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const chemicalReactionsLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "chemical-reactions",
    slug: "reaction-types-and-net-ionic",
    title: "Reaction Types and Net Ionic Equations",
    position: 7,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["TRA-1.A", "TRA-1.B", "TRA-1.C", "TRA-1.D", "TRA-2.A", "TRA-2.B", "TRA-2.C"],
    bodyPlain: [
      "A chemical reaction rearranges atoms into new substances. Evidence includes a lasting color change, gas formation that is not just boiling, a precipitate, or a temperature change that is not from a hot plate. Physical changes rearrange particles without changing identity: ice melting, salt dissolving, acetone evaporating. Dissolving an ionic solid separates ions already present; it does not create them. Berkeley High's AP section writes both a molecular equation and a particulate sentence so that \"NaCl(aq)\" is not mistaken for intact formula units floating in water.",
      "Soluble ionic compounds and strong acids are written as separated ions in a complete ionic equation. Spectator ions appear on both sides and drop out of the net ionic equation. Mixing aqueous silver nitrate with aqueous sodium chloride produces solid AgCl. The net change is Ag+(aq) + Cl-(aq) → AgCl(s). Nitrate and sodium never participate. Precipitation, neutralization, and gas-forming double replacements all become clearer once spectators are removed.",
      "Common reaction types on this course are precipitation, acid-base, oxidation-reduction, and synthesis or decomposition. Acid-base reactions transfer protons. In water, a strong acid donates H+ to water or directly to a base. Redox reactions transfer electrons. Oxidation numbers rise for the species that is oxidized and fall for the species that is reduced. A zinc strip in copper(II) sulfate at Oakland Tech plates copper on the zinc because zinc is oxidized and Cu2+ is reduced. The sulfate ion is a spectator.",
      "Representations must stay consistent. A balanced equation conserves atoms and charge. A particulate drawing should show the same mole ratio and the same physical states. If the net ionic equation has two Ag+ ions combining with two Cl- ions, the drawing should not show one lonely ion pair. Coefficients are amounts in moles, not instructions to draw that many molecules unless the prompt asks for a particle view. Students who can move among words, symbols, and pictures for the same reaction are ready for stoichiometry.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "chemical-reactions",
    slug: "stoichiometry-and-titration",
    title: "Stoichiometry and Titration",
    position: 8,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SPQ-4.A", "SPQ-4.B"],
    bodyPlain: [
      "Stoichiometry converts a measured amount of one species into the amount of another using the mole ratio from the balanced equation. Grams become moles with molar mass, solutions become moles with M times V (liters), and gases become moles with PV = nRT when T and P are known. The coefficient ratio is the only legal bridge between substances. Irvington's chemistry club needs 0.150 mol of H2 from Zn + 2 HCl → ZnCl2 + H2, so it must supply at least 0.150 mol of zinc and 0.300 mol of HCl. Mass guesses that skip the mole step are not stoichiometry.",
      "A limiting reactant is the reactant that produces the smaller amount of product. The leftover reactant is in excess. After the reaction, the mixture contains product plus unused excess reactant—never leftover limiting reactant if the reaction went to completion. If 0.100 L of 0.250 M HCl meets 0.080 L of 0.200 M NaOH, the acid supplies 0.0250 mol H+ and the base supplies 0.0160 mol OH-. After neutralization, 0.0090 mol H+ remains in 0.180 L, so [H+] = 0.050 M. That leftover acid is the excess reagent in a 1:1 neutralization.",
      "Titration is a controlled stoichiometry experiment. A solution of known concentration (the titrant) is added until the analyte is just consumed. The equivalence point is the mole-ratio point from the balanced equation. For a strong acid with a strong base, that point is also where [H+] equals [OH-] from water, so the pH is 7 at 25 °C. An indicator or a pH probe marks the endpoint, which should be close to the equivalence point. Volume readings belong in liters for mole calculations even if the buret is marked in milliliters.",
      "A typical club titration: 25.00 mL of unknown HCl requires 18.40 mL of 0.110 M NaOH. Moles of base are 0.002024 mol, which equals moles of acid at equivalence, so the acid is 0.0810 M. Rinsing the buret with water instead of titrant dilutes the first milliliters and makes the unknown look more concentrated than it is. Rinsing the flask with the analyte adds extra analyte and has the same effect. Those technique errors are stoichiometry errors, not \"indicator problems.\"",
    ].join("\n\n"),
  },
];
