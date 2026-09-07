/**
 * Original MC items for AP Chemistry units 1–4.
 * source_basis: ORIGINAL. Not from College Board, Stellar, or lab manuals.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemQuestion,
} from "@/features/learn/courses/ap-chem/manifest";

export const questionsUnits1To4: readonly ApChemQuestion[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "cu-hydrate-mole-count",
    lessonSlug: "moles-mass-spectra-and-composition",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Robotics weighs 12.47 g of CuSO4 · 5H2O (249.7 g/mol) for a crystal demo. How many moles of the hydrate are present?",
    choices: [
      { id: "a", text: "0.0200 mol" },
      { id: "b", text: "0.0499 mol" },
      { id: "c", text: "3.11 mol" },
      { id: "d", text: "12.5 mol" },
    ],
    answerId: "b",
    explanation:
      "Moles = 12.47 g / 249.7 g/mol = 0.0499 mol. Multiplying by 249.7 or treating grams as moles skips the conversion.",
    objectiveCodes: ["SPQ-1.A"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "chlorine-mass-spectrum-average",
    lessonSlug: "moles-mass-spectra-and-composition",
    questionType: "multiple_choice",
    prompt:
      "A Fremont Science Bowl team records chlorine mass-spectrum peaks near 35 u and 37 u. What does the atomic mass 35.45 u on the periodic table represent?",
    choices: [
      { id: "a", text: "The mass of every chlorine atom in the sample" },
      { id: "b", text: "The mass of only the more abundant isotope" },
      {
        id: "c",
        text: "The abundance-weighted average mass of chlorine isotopes",
      },
      { id: "d", text: "The mass-to-charge ratio of Cl2+" },
    ],
    answerId: "c",
    explanation:
      "Atomic mass is the weighted average of isotope masses. Individual atoms are near 35 u or 37 u, not 35.45 u.",
    objectiveCodes: ["SPQ-1.B"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "sulfur-pes-peak-pattern",
    lessonSlug: "electrons-pes-and-periodic-trends",
    questionType: "multiple_choice",
    prompt:
      "Gunn High students compare PES traces. Which electron-count pattern of peak areas matches ground-state sulfur (16 electrons)?",
    choices: [
      { id: "a", text: "2 : 4" },
      { id: "b", text: "2 : 2 : 6" },
      { id: "c", text: "2 : 2 : 6 : 2 : 4" },
      { id: "d", text: "2 : 2 : 6 : 2 : 6" },
    ],
    answerId: "c",
    explanation:
      "Sulfur is 1s2 2s2 2p6 3s2 3p4, so the peak areas follow 2:2:6:2:4. The 2:2:6:2:6 pattern is argon, not sulfur.",
    objectiveCodes: ["SAP-1.B"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "periodic-ionization-trend",
    lessonSlug: "electrons-pes-and-periodic-trends",
    questionType: "multiple_choice",
    prompt:
      "Los Altos Science Club ranks first ionization energies for Na, Mg, and Cl. Which ranking is correct, and what is the main reason?",
    choices: [
      {
        id: "a",
        text: "Na > Mg > Cl, because sodium has the largest radius",
      },
      {
        id: "b",
        text: "Cl > Mg > Na, because effective nuclear charge rises across the period",
      },
      {
        id: "c",
        text: "Mg > Cl > Na, because magnesium is a metal",
      },
      {
        id: "d",
        text: "Cl > Na > Mg, because chlorine has more electron shells",
      },
    ],
    answerId: "b",
    explanation:
      "Across period 3, more protons pull the valence shell more tightly, so first ionization energy generally increases: Cl > Mg > Na.",
    objectiveCodes: ["SAP-2.A"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "ionic-versus-covalent-sort",
    lessonSlug: "bonding-lattices-and-metals",
    questionType: "multiple_choice",
    prompt:
      "A Homestead Robotics parts list includes NaCl, Cl2, and Cu. Which bonding model best describes each substance?",
    choices: [
      { id: "a", text: "NaCl covalent, Cl2 ionic, Cu metallic" },
      { id: "b", text: "NaCl ionic, Cl2 covalent, Cu metallic" },
      { id: "c", text: "NaCl metallic, Cl2 ionic, Cu covalent" },
      { id: "d", text: "NaCl ionic, Cl2 metallic, Cu covalent" },
    ],
    answerId: "b",
    explanation:
      "NaCl is an ionic lattice, Cl2 is a covalently bonded molecule, and copper is a metallic solid with delocalized valence electrons.",
    objectiveCodes: ["SAP-3.A"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "lattice-energy-mgo-nacl",
    lessonSlug: "bonding-lattices-and-metals",
    questionType: "multiple_choice",
    prompt:
      "Castilleja students compare lattice energies of MgO and NaCl. Why is the MgO lattice energy larger in magnitude?",
    choices: [
      {
        id: "a",
        text: "Magnesium oxide is a gas at room temperature.",
      },
      {
        id: "b",
        text: "Mg2+ and O2- have higher charges and are smaller than Na+ and Cl-.",
      },
      {
        id: "c",
        text: "NaCl has metallic bonding, which is always weaker.",
      },
      {
        id: "d",
        text: "Oxygen has a lower electronegativity than chlorine.",
      },
    ],
    answerId: "b",
    explanation:
      "Lattice energy grows with ion charge and shrinks with ion size. 2+/2- ions that are relatively small attract more strongly than Na+ and Cl-.",
    objectiveCodes: ["SAP-3.C"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "nitrate-resonance-formal-charge",
    lessonSlug: "lewis-vsepr-and-hybridization",
    questionType: "multiple_choice",
    prompt:
      "A club poster shows one nitrate ion with one N-O single bond and two N=O double bonds and no other contributors. What is wrong with that picture as a complete model?",
    choices: [
      {
        id: "a",
        text: "Nitrate has no oxygen atoms, so the bonds cannot exist.",
      },
      {
        id: "b",
        text: "The ion is better described as a resonance average of equivalent contributors.",
      },
      {
        id: "c",
        text: "Formal charge requires all bonds in nitrate to be single bonds only.",
      },
      {
        id: "d",
        text: "Nitrate is a metallic lattice, so Lewis diagrams do not apply.",
      },
    ],
    answerId: "b",
    explanation:
      "Nitrate has three equivalent resonance contributors. One localized drawing with unequal N-O bonds is a snapshot, not the ion.",
    objectiveCodes: ["SAP-4.B"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "water-vsepr-shape",
    lessonSlug: "lewis-vsepr-and-hybridization",
    questionType: "multiple_choice",
    prompt:
      "Gunn students assign VSEPR labels to H2O. Which pair is correct?",
    choices: [
      {
        id: "a",
        text: "Electron geometry linear; molecular geometry linear",
      },
      {
        id: "b",
        text: "Electron geometry tetrahedral; molecular geometry bent",
      },
      {
        id: "c",
        text: "Electron geometry trigonal planar; molecular geometry trigonal planar",
      },
      {
        id: "d",
        text: "Electron geometry octahedral; molecular geometry square planar",
      },
    ],
    answerId: "b",
    explanation:
      "Water has four electron domains (two bonds, two lone pairs), so the electron geometry is tetrahedral and the molecular shape is bent.",
    objectiveCodes: ["SAP-4.C"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "hexane-acetone-water-imf",
    lessonSlug: "imfs-phases-and-gases",
    questionType: "multiple_choice",
    prompt:
      "Lynbrook lab compares hexane (C6H14), acetone (CH3COCH3), and water. Which statement about the strongest attraction in each pure liquid is correct?",
    choices: [
      {
        id: "a",
        text: "Hexane has hydrogen bonding; water has only dispersion forces.",
      },
      {
        id: "b",
        text: "Water has hydrogen bonding; acetone has dipole-dipole plus dispersion; hexane has dispersion only.",
      },
      {
        id: "c",
        text: "All three are held together mainly by ionic bonds.",
      },
      {
        id: "d",
        text: "Acetone cannot have dipole-dipole forces because it is a liquid.",
      },
    ],
    answerId: "b",
    explanation:
      "Water has O-H hydrogen bonding. Acetone is polar but has no O-H or N-H. Hexane is nonpolar, so only dispersion forces.",
    objectiveCodes: ["SAP-5.A"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "co2-moles-from-pvnrt",
    lessonSlug: "imfs-phases-and-gases",
    questionType: "multiple_choice",
    prompt:
      "Sequoia High environmental club collects 2.00 L of CO2 at 298 K and 1.00 atm. Using R = 0.08206 L·atm/mol·K, how many moles of CO2 are present?",
    choices: [
      { id: "a", text: "0.0122 mol" },
      { id: "b", text: "0.0817 mol" },
      { id: "c", text: "0.500 mol" },
      { id: "d", text: "8.17 mol" },
    ],
    answerId: "b",
    explanation:
      "n = PV/RT = (1.00)(2.00)/(0.08206 × 298) = 0.0817 mol. Forgetting T in kelvin or dropping R by a factor of 10 produces the distractors.",
    objectiveCodes: ["SAP-7.A"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "paper-chromatography-rf",
    lessonSlug: "solutions-separation-and-spectroscopy",
    questionType: "multiple_choice",
    prompt:
      "A dye spot travels 3.6 cm while the solvent front travels 9.0 cm on paper chromatography. What is the retention factor, and what does a smaller Rf usually mean on polar paper with a less polar solvent?",
    choices: [
      {
        id: "a",
        text: "Rf = 2.5; the dye is less attracted to the paper",
      },
      {
        id: "b",
        text: "Rf = 0.40; the dye is more strongly attracted to the paper",
      },
      {
        id: "c",
        text: "Rf = 0.40; the dye has a higher boiling point than the solvent",
      },
      {
        id: "d",
        text: "Rf = 12.6; chromatography created a new compound",
      },
    ],
    answerId: "b",
    explanation:
      "Rf = 3.6/9.0 = 0.40. On polar paper, a smaller Rf means the component stuck more to the stationary phase.",
    objectiveCodes: ["SPQ-3.C"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "beer-lambert-dye-concentration",
    lessonSlug: "solutions-separation-and-spectroscopy",
    questionType: "multiple_choice",
    prompt:
      "Mission High Science Olympiad measures A = 0.48 for a dye with ε = 1.2 × 10^4 L/mol·cm in a 1.00 cm cuvette. What is the concentration?",
    choices: [
      { id: "a", text: "4.0 × 10^-5 M" },
      { id: "b", text: "4.0 × 10^-3 M" },
      { id: "c", text: "0.48 M" },
      { id: "d", text: "5.8 × 10^3 M" },
    ],
    answerId: "a",
    explanation:
      "c = A/(εℓ) = 0.48 / (1.2 × 10^4 × 1.00) = 4.0 × 10^-5 M. Absorbance is not itself a molarity.",
    objectiveCodes: ["SAP-8.C"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "agcl-net-ionic",
    lessonSlug: "reaction-types-and-net-ionic",
    questionType: "multiple_choice",
    prompt:
      "Berkeley High mixes aqueous AgNO3 with aqueous NaCl. Which net ionic equation describes the precipitation?",
    choices: [
      { id: "a", text: "Na+(aq) + NO3-(aq) → NaNO3(s)" },
      { id: "b", text: "Ag+(aq) + Cl-(aq) → AgCl(s)" },
      { id: "c", text: "AgNO3(aq) + NaCl(aq) → AgCl(aq) + NaNO3(aq)" },
      { id: "d", text: "Ag(s) + Cl2(g) → AgCl(s)" },
    ],
    answerId: "b",
    explanation:
      "AgCl is the insoluble product. Sodium and nitrate are spectators and do not appear in the net ionic equation.",
    objectiveCodes: ["TRA-1.B"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "zinc-copper-redox",
    lessonSlug: "reaction-types-and-net-ionic",
    questionType: "multiple_choice",
    prompt:
      "Oakland Tech places a zinc strip in CuSO4(aq). Copper plates onto the zinc. Which statement is correct?",
    choices: [
      {
        id: "a",
        text: "Zn is reduced and SO4^2- is oxidized.",
      },
      {
        id: "b",
        text: "Cu2+ is reduced and Zn is oxidized.",
      },
      {
        id: "c",
        text: "Both metals are oxidized; sulfate is reduced.",
      },
      {
        id: "d",
        text: "The process is only a physical change because copper is an element.",
      },
    ],
    answerId: "b",
    explanation:
      "Zinc atoms lose electrons (oxidation) and Cu2+ ions gain electrons (reduction). Sulfate is a spectator.",
    objectiveCodes: ["TRA-2.C"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "hcl-naoh-leftover-acid",
    lessonSlug: "stoichiometry-and-titration",
    questionType: "multiple_choice",
    prompt:
      "Irvington chemistry club mixes 0.100 L of 0.250 M HCl with 0.080 L of 0.200 M NaOH. After the 1:1 neutralization, what is [H+]?",
    choices: [
      { id: "a", text: "0.0090 M" },
      { id: "b", text: "0.0250 M" },
      { id: "c", text: "0.050 M" },
      { id: "d", text: "0.180 M" },
    ],
    answerId: "c",
    explanation:
      "Moles H+ = 0.0250; moles OH- = 0.0160; leftover H+ = 0.0090 mol in 0.180 L, so [H+] = 0.050 M.",
    objectiveCodes: ["SPQ-4.A"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "unknown-hcl-titration",
    lessonSlug: "stoichiometry-and-titration",
    questionType: "multiple_choice",
    prompt:
      "A club titration uses 25.00 mL of unknown HCl. It takes 18.40 mL of 0.110 M NaOH to reach equivalence. What is the HCl molarity?",
    choices: [
      { id: "a", text: "0.0404 M" },
      { id: "b", text: "0.0810 M" },
      { id: "c", text: "0.110 M" },
      { id: "d", text: "0.203 M" },
    ],
    answerId: "b",
    explanation:
      "Moles NaOH = 0.01840 L × 0.110 mol/L = 0.002024 mol, equal to moles HCl. [HCl] = 0.002024 / 0.02500 = 0.0810 M.",
    objectiveCodes: ["SPQ-4.B"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
];
