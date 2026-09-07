/**
 * Original lessons for Acids and Bases.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const acidsAndBasesLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "acids-and-bases",
    slug: "strong-weak-and-ph",
    title: "Strong Acids, Weak Acids, and pH",
    position: 15,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SAP-9.A", "SAP-9.B", "SAP-9.C", "SAP-9.F"],
    bodyPlain: [
      "Arrhenius acids increase [H+] in water; Arrhenius bases increase [OH-]. Brønsted-Lowry acids donate protons; bases accept them. Every Brønsted acid has a conjugate base missing that proton. Water can do both, so it is amphiprotic. Autoionization is 2 H2O ⇌ H3O+ + OH- with Kw = 1.0 x 10^-14 at 25 °C, so [H3O+][OH-] = 1.0 x 10^-14. Neutral water then has [H3O+] = 1.0 x 10^-7 M and pH = 7.00. Temperature changes Kw, so \"neutral\" is not always pH 7.",
      "pH = -log[H3O+] and pOH = -log[OH-], with pH + pOH = 14.00 at 25 °C. Strong acids (HCl, HBr, HI, HNO3, H2SO4 first proton, HClO4) donate essentially all their acidic protons in water. A 0.025 M HCl solution has [H3O+] = 0.025 M and pH = 1.60. Strong bases (group 1 hydroxides and heavier group 2 hydroxides) supply OH- completely. Weak acids only partly dissociate. Their Ka is small, and an ICE table is required: Ka = [H3O+][A-]/[HA].",
      "A typical weak-acid estimate uses x = [H3O+] ≈ sqrt(Ka [HA]0) when x is much smaller than the initial concentration. For 0.10 M acetic acid with Ka = 1.8 x 10^-5, x ≈ 1.3 x 10^-3 M and pH ≈ 2.89. The percent ionization is 1.3%, which is not \"strong.\" Diluting a weak acid increases percent ionization even as pH rises (becomes less acidic). Weak bases use Kb and [OH-]. For a conjugate pair, Ka Kb = Kw.",
      "Molecular structure explains strength. More polar H-A bonds and more stable conjugate bases make stronger acids. Binary acids get stronger down a group as bond length grows (HI is stronger than HF). Oxoacids get stronger with more oxygens or a more electronegative central atom because the conjugate anion spreads out charge. Homestead students comparing HOCl and HClO3 are looking at that extra oxygen, not at a mysterious extra proton hiding in the formula.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "acids-and-bases",
    slug: "buffers-and-titrations",
    title: "Buffers and Acid-Base Titrations",
    position: 16,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SAP-9.D", "SAP-9.E", "SAP-10.A", "SAP-10.B", "SAP-10.C", "SAP-10.D"],
    bodyPlain: [
      "A buffer is a mixture that resists pH change when small amounts of strong acid or strong base are added. The usual recipe is a weak acid and its conjugate base in comparable amounts. Added H3O+ is consumed by A-. Added OH- is consumed by HA. A solution of only strong acid is not a buffer; its pH jumps when base is added. Castilleja's biochemistry club stores a pH 4.7 acetate buffer so an enzyme assay does not drift when CO2 from the air dissolves.",
      "The Henderson-Hasselbalch equation is pH = pKa + log([A-]/[HA]) for a conjugate pair. It is the Ka expression in log form, useful when both species are present in reasonable amounts. If [A-] = [HA], pH = pKa. A buffer with 0.20 M HA and 0.30 M A- and pKa = 4.74 has pH = 4.92. The ratio, not the absolute concentrations, sets the pH; the absolute concentrations set the buffer capacity. More concentrated buffers absorb more added acid or base before the pH slides.",
      "Titration curves plot pH versus milliliters of titrant. Strong acid with strong base starts low, rises through a steep jump at equivalence (pH 7 at 25 °C), and finishes high. Weak acid with strong base starts higher than the strong-acid curve, shows a buffer region before equivalence, and has equivalence pH above 7 because the salt is a weak base. The half-equivalence point of a weak-acid titration is the buffer where [HA] = [A-], so pH = pKa. That point is the practical way to read pKa from a curve.",
      "Indicator choice follows the steep region. The indicator should change color near the equivalence pH, not near the starting pH. For a weak acid titrated with strong base, phenolphthalein (color change in the basic range) is a better match than an indicator that changes at pH 4. Polyprotic acids have more than one equivalence point. Always convert milliliters to liters before computing moles, and remember that the flask volume grows as titrant is added if you need a concentration after the equivalence point.",
    ].join("\n\n"),
  },
];
