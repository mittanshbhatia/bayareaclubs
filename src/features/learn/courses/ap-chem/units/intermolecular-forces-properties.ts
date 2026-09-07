/**
 * Original lessons for Intermolecular Forces and Properties.
 * source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemLesson,
} from "@/features/learn/courses/ap-chem/manifest";

export const intermolecularForcesLessons: readonly ApChemLesson[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "intermolecular-forces-properties",
    slug: "imfs-phases-and-gases",
    title: "Intermolecular Forces, Phases, and Gases",
    position: 5,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SAP-5.A", "SAP-5.B", "SAP-6.A", "SAP-7.A", "SAP-7.B", "SAP-7.C"],
    bodyPlain: [
      "Intermolecular forces are attractions between separate particles, not the covalent bonds inside a molecule. London dispersion forces arise from temporary dipoles and grow with more electrons and more surface contact. Dipole-dipole forces appear between permanent dipoles. Hydrogen bonding is a strong, directional attraction when H is bound to N, O, or F and approaches another N, O, or F lone pair. Ion-dipole forces hold ionic solids in water. A Lynbrook lab comparing hexane, acetone, and water is ranking those attractions, not ranking C-H versus C=O bond strengths.",
      "Phase and many bulk properties follow the same ranking. Stronger attractions raise boiling point, melting point, viscosity, and surface tension, and they lower vapor pressure. Molecular solids have molecules on the lattice points and melt at modest temperatures. Ionic solids and network covalent solids (diamond, SiO2) need much more energy to break the lattice. Metallic solids conduct. A candle-wax molecular solid and a quartz network solid can both look like \"rocks\" in a drawer; the bonding model, not the appearance, predicts which one melts in hot water.",
      "Gases at ordinary conditions are mostly empty space, so the ideal gas law PV = nRT is a useful first model. Pressure, volume, temperature (kelvin), and mole count are linked. Sequoia High's environmental club collects 2.00 L of CO2 over a demonstration at 298 K and 1.00 atm. Using R = 0.08206 L·atm/mol·K gives n = 0.0817 mol. Kinetic molecular theory says the particles move in straight lines, collide elastically, and have a distribution of speeds that shifts higher as temperature rises. Average kinetic energy depends only on temperature, not on molar mass. Lighter particles move faster at the same T.",
      "Real gases deviate when particles occupy significant volume or attract each other. High pressure and low temperature make those effects matter. A gas with strong attractions exerts a lower pressure than the ideal prediction because collisions with the wall are softened. A gas whose particles have large volume occupies more space than the empty-container assumption. Van der Waals corrections encode those two ideas. For AP work, the first response is still the ideal law, followed by a sentence about which assumption failed.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    unitSlug: "intermolecular-forces-properties",
    slug: "solutions-separation-and-spectroscopy",
    title: "Solutions, Separation, and Spectroscopy",
    position: 6,
    estimatedMinutes: 22,
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    objectiveCodes: ["SPQ-3.A", "SPQ-3.B", "SPQ-3.C", "SAP-8.A", "SAP-8.B", "SAP-8.C"],
    bodyPlain: [
      "A solution is a homogeneous mixture. Molarity is moles of solute per liter of solution, not per liter of solvent. Dilution keeps mole count constant: M1V1 = M2V2. Particulate drawings should show solvent particles surrounding solute particles, with ions separated if the solute is soluble and ionic. Like dissolves like is a polarity statement: methanol mixes with water; oil does not. A cup of instant broth at a Palo Alto Chemistry Club potluck is a solution whose concentration changes if someone adds water, even though the amount of salt is unchanged.",
      "Chromatography and filtration separate mixtures by exploiting different attractions or particle sizes. In paper chromatography, a more polar dye sticks to polar paper and travels a shorter distance with a less polar solvent. The retention factor is distance traveled by the component divided by distance traveled by the solvent front. Distillation uses boiling-point differences. These methods do not create new substances; they sort what is already there. A club that reports a single Rf for a three-spot ink has averaged away the data.",
      "Electromagnetic radiation carries energy in photons. Frequency and wavelength are inverse: c = λν. Photon energy is E = hν. Ultraviolet photons can promote valence electrons; infrared photons typically excite vibrations; microwaves excite rotations. The photoelectric effect shows that electrons are ejected from a metal only when the photon energy exceeds a threshold. Extra energy becomes kinetic energy of the electron. Intensity (more photons) changes how many electrons leave, not the energy of each photon.",
      "Beer-Lambert law turns absorbance into concentration: A = εℓc. Absorbance is dimensionless, path length is usually 1.00 cm in a cuvette, and ε is a constant for a given solute and wavelength. A Mission High Science Olympiad team measures A = 0.48 for a food-dye solution with ε = 1.2 x 10^4 L/mol·cm and ℓ = 1.00 cm, so c = 4.0 x 10^-5 M. The law fails at high concentration when molecules interact or stray light reaches the detector. Choose a wavelength the solute actually absorbs, zero the instrument with a blank, and stay in the linear range.",
    ].join("\n\n"),
  },
];
