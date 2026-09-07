/**
 * Original MC items for AP Chemistry units 5–9.
 * source_basis: ORIGINAL. Not from College Board, Stellar, or lab manuals.
 */

import {
  AP_CHEM_NAMESPACE,
  AP_CHEM_SOURCE_BASIS,
  type ApChemQuestion,
} from "@/features/learn/courses/ap-chem/manifest";

export const questionsUnits5To9: readonly ApChemQuestion[] = [
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "dye-fade-half-life",
    lessonSlug: "rates-and-rate-laws",
    questionType: "multiple_choice",
    prompt:
      "A Lowell High bleach-fading dye is first order with k = 0.0231 min^-1. What is the half-life, and how much dye remains after two half-lives?",
    choices: [
      { id: "a", text: "15.0 min; one half remains" },
      { id: "b", text: "30.0 min; one quarter remains" },
      { id: "c", text: "30.0 min; none remains" },
      { id: "d", text: "0.693 min; one quarter remains" },
    ],
    answerId: "b",
    explanation:
      "t1/2 = 0.693/k = 30.0 min for first order. After two half-lives, (1/2)^2 = 1/4 of the original dye remains.",
    objectiveCodes: ["TRA-3.C"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "clock-reaction-orders",
    lessonSlug: "rates-and-rate-laws",
    questionType: "multiple_choice",
    prompt:
      "Menlo-Atherton records three clock-reaction trials. Trial 1: [A]=0.10 M, [B]=0.10 M, rate=0.012 M/s. Trial 2: [A]=0.20 M, [B]=0.10 M, rate=0.024 M/s. Trial 3: [A]=0.10 M, [B]=0.20 M, rate=0.012 M/s. What is the rate law?",
    choices: [
      { id: "a", text: "rate = k[A][B]" },
      { id: "b", text: "rate = k[A]^2[B]" },
      { id: "c", text: "rate = k[A]" },
      { id: "d", text: "rate = k[B]" },
    ],
    answerId: "c",
    explanation:
      "Doubling [A] doubles the rate (first order in A). Doubling [B] does not change the rate (zero order in B).",
    objectiveCodes: ["TRA-3.B"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "slow-step-rate-law",
    lessonSlug: "mechanisms-collision-and-catalysis",
    questionType: "multiple_choice",
    prompt:
      "A proposed mechanism is A + B → C (slow) then C → D (fast). Which experimental rate law is consistent with this mechanism?",
    choices: [
      { id: "a", text: "rate = k[C]" },
      { id: "b", text: "rate = k[A][B]" },
      { id: "c", text: "rate = k[D]" },
      { id: "d", text: "rate = k[A][B][C][D]" },
    ],
    answerId: "b",
    explanation:
      "The slow elementary step determines the rate law, so rate = k[A][B]. The intermediate C and product D do not belong in that rate law.",
    objectiveCodes: ["TRA-5.B"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "catalyst-equilibrium-claim",
    lessonSlug: "mechanisms-collision-and-catalysis",
    questionType: "multiple_choice",
    prompt:
      "A San Mateo biotech club claims that adding an enzyme will increase the equilibrium constant of a product-favored reaction. Why is the claim wrong?",
    choices: [
      {
        id: "a",
        text: "Catalysts change ΔH, which always decreases K.",
      },
      {
        id: "b",
        text: "A catalyst speeds forward and reverse paths and does not change K.",
      },
      {
        id: "c",
        text: "Enzymes only work on endothermic reactions.",
      },
      {
        id: "d",
        text: "K is defined only for uncatalyzed reactions in the gas phase.",
      },
    ],
    answerId: "b",
    explanation:
      "A catalyst lowers activation energy for both directions. Equilibrium amounts, and therefore K, stay the same; the system just gets there faster.",
    objectiveCodes: ["TRA-5.E"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "endothermic-cold-pack",
    lessonSlug: "heat-calorimetry-and-energy-diagrams",
    questionType: "multiple_choice",
    prompt:
      "Piedmont students activate an ammonium nitrate cold pack. The bag feels cold. Which description is correct?",
    choices: [
      {
        id: "a",
        text: "The dissolution is exothermic, so heat leaves the surroundings.",
      },
      {
        id: "b",
        text: "The dissolution is endothermic, so the process absorbs heat from the surroundings.",
      },
      {
        id: "c",
        text: "No heat flows; cold is a substance released by the salt.",
      },
      {
        id: "d",
        text: "The process is endothermic, so the bag must feel hotter than the room.",
      },
    ],
    answerId: "b",
    explanation:
      "An endothermic dissolution takes heat from your hand and the water, so the pack feels cold. Heat is transferred energy, not a separate substance.",
    objectiveCodes: ["ENE-2.A"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "water-calorimeter-heat",
    lessonSlug: "heat-calorimetry-and-energy-diagrams",
    questionType: "multiple_choice",
    prompt:
      "Marin Academy warms 50.0 g of water by 4.2 °C. Use c = 4.18 J/g·°C. How much heat did the water absorb?",
    choices: [
      { id: "a", text: "88 J" },
      { id: "b", text: "209 J" },
      { id: "c", text: "880 J" },
      { id: "d", text: "8800 J" },
    ],
    answerId: "c",
    explanation:
      "q = m c ΔT = 50.0 × 4.18 × 4.2 = 880 J. Dropping a factor of ten or forgetting mass produces the other choices.",
    objectiveCodes: ["ENE-2.D"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "hess-two-step-target",
    lessonSlug: "enthalpy-bonds-and-hess",
    questionType: "multiple_choice",
    prompt:
      "Cupertino Science Bowl is given A + B → D, ΔH = -40 kJ, and D + A → C, ΔH = +15 kJ. What is ΔH for 2 A + B → C?",
    choices: [
      { id: "a", text: "-55 kJ" },
      { id: "b", text: "-25 kJ" },
      { id: "c", text: "+25 kJ" },
      { id: "d", text: "+55 kJ" },
    ],
    answerId: "b",
    explanation:
      "Adding the two steps cancels D and yields 2 A + B → C. ΔH = -40 + 15 = -25 kJ.",
    objectiveCodes: ["ENE-3.D"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "bond-enthalpy-estimate",
    lessonSlug: "enthalpy-bonds-and-hess",
    questionType: "multiple_choice",
    prompt:
      "Estimate ΔH for H2 + Cl2 → 2 HCl using bond enthalpies H-H 436 kJ/mol, Cl-Cl 243 kJ/mol, and H-Cl 431 kJ/mol.",
    choices: [
      { id: "a", text: "-183 kJ" },
      { id: "b", text: "+183 kJ" },
      { id: "c", text: "-679 kJ" },
      { id: "d", text: "+862 kJ" },
    ],
    answerId: "a",
    explanation:
      "Energy in to break bonds is 436 + 243 = 679 kJ. Energy out forming two H-Cl is 862 kJ. ΔH ≈ 679 - 862 = -183 kJ.",
    objectiveCodes: ["ENE-3.B"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "ammonia-q-versus-k",
    lessonSlug: "k-q-and-equilibrium-calculations",
    questionType: "multiple_choice",
    prompt:
      "Lowell High mixes [N2] = 0.10 M, [H2] = 0.10 M, and [NH3] = 0.10 M for N2 + 3 H2 ⇌ 2 NH3. If Kc = 0.50 at that temperature, which way does the mixture shift?",
    choices: [
      {
        id: "a",
        text: "Q = 1.0, so the system is already at equilibrium",
      },
      {
        id: "b",
        text: "Q = 100, which is greater than K, so the reverse reaction is favored",
      },
      {
        id: "c",
        text: "Q = 0.010, which is less than K, so the forward reaction is favored",
      },
      {
        id: "d",
        text: "Q cannot be computed unless a catalyst is present",
      },
    ],
    answerId: "b",
    explanation:
      "Q = (0.10)^2 / ((0.10)(0.10)^3) = 100. Because Q > K, the reverse reaction consumes ammonia until Q falls to 0.50.",
    objectiveCodes: ["TRA-7.A"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "n2o4-pressure-shift",
    lessonSlug: "le-chatelier-and-solubility",
    questionType: "multiple_choice",
    prompt:
      "A closed flask holds N2O4(g) ⇌ 2 NO2(g) at equilibrium. The club decreases the volume at constant temperature. What happens?",
    choices: [
      {
        id: "a",
        text: "The equilibrium shifts toward N2O4, the side with fewer gas moles.",
      },
      {
        id: "b",
        text: "The equilibrium shifts toward NO2 because K increases.",
      },
      {
        id: "c",
        text: "No shift occurs because pressure changes never affect equilibria.",
      },
      {
        id: "d",
        text: "K becomes zero, so all color disappears.",
      },
    ],
    answerId: "a",
    explanation:
      "A smaller volume raises pressure. The system shifts toward fewer gas particles, here N2O4. Temperature was constant, so K is unchanged.",
    objectiveCodes: ["TRA-8.A"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "ksp-agcl-solubility",
    lessonSlug: "le-chatelier-and-solubility",
    questionType: "multiple_choice",
    prompt:
      "For AgCl, Ksp = 1.8 × 10^-10. What is the molar solubility of AgCl in pure water?",
    choices: [
      { id: "a", text: "1.8 × 10^-10 M" },
      { id: "b", text: "3.2 × 10^-20 M" },
      { id: "c", text: "1.3 × 10^-5 M" },
      { id: "d", text: "1.8 × 10^-5 M" },
    ],
    answerId: "c",
    explanation:
      "Ksp = s^2, so s = sqrt(1.8 × 10^-10) = 1.3 × 10^-5 M. Ksp itself is not the solubility.",
    objectiveCodes: ["SPQ-5.A"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "agcl-common-ion",
    lessonSlug: "le-chatelier-and-solubility",
    questionType: "multiple_choice",
    prompt:
      "San Mateo water testers add NaCl to a saturated AgCl mixture. What happens to the solubility of AgCl?",
    choices: [
      {
        id: "a",
        text: "Solubility increases because Q falls below Ksp.",
      },
      {
        id: "b",
        text: "Solubility decreases because the common Cl- ion shifts dissolution in reverse.",
      },
      {
        id: "c",
        text: "Solubility is unchanged because Ksp increased by the same factor.",
      },
      {
        id: "d",
        text: "AgCl becomes completely soluble; NaCl destroys Ksp.",
      },
    ],
    answerId: "b",
    explanation:
      "Added chloride is a common ion. Q starts larger, so some AgCl precipitates and the molar solubility of silver ion drops. Ksp itself is unchanged at constant T.",
    objectiveCodes: ["SPQ-5.B"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "strong-hcl-ph",
    lessonSlug: "strong-weak-and-ph",
    questionType: "multiple_choice",
    prompt:
      "What is the pH of 0.025 M HCl at 25 °C?",
    choices: [
      { id: "a", text: "0.025" },
      { id: "b", text: "1.60" },
      { id: "c", text: "2.50" },
      { id: "d", text: "12.40" },
    ],
    answerId: "b",
    explanation:
      "HCl is strong, so [H3O+] = 0.025 M. pH = -log(0.025) = 1.60. 12.40 would be the pOH if someone inverted the log.",
    objectiveCodes: ["SAP-9.B"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "weak-acid-ice-ph",
    lessonSlug: "strong-weak-and-ph",
    questionType: "multiple_choice",
    prompt:
      "Homestead prepares 0.10 M acetic acid with Ka = 1.8 × 10^-5. Using x ≈ sqrt(Ka [HA]0), which pH is closest?",
    choices: [
      { id: "a", text: "1.00" },
      { id: "b", text: "2.87" },
      { id: "c", text: "4.74" },
      { id: "d", text: "7.00" },
    ],
    answerId: "b",
    explanation:
      "x = sqrt(1.8 × 10^-6) = 1.3 × 10^-3 M = [H3O+]. pH = -log(1.3 × 10^-3) = 2.87. 4.74 is pKa, not the pH of the weak acid alone.",
    objectiveCodes: ["SAP-9.C"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "acetate-buffer-ph",
    lessonSlug: "buffers-and-titrations",
    questionType: "multiple_choice",
    prompt:
      "Castilleja's biochemistry club makes a buffer with 0.20 M HA and 0.30 M A-. If pKa = 4.74, what is the pH?",
    choices: [
      { id: "a", text: "4.56" },
      { id: "b", text: "4.74" },
      { id: "c", text: "4.92" },
      { id: "d", text: "7.00" },
    ],
    answerId: "c",
    explanation:
      "pH = pKa + log([A-]/[HA]) = 4.74 + log(0.30/0.20) = 4.74 + 0.18 = 4.92.",
    objectiveCodes: ["SAP-10.C"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "half-equivalence-pka",
    lessonSlug: "buffers-and-titrations",
    questionType: "multiple_choice",
    prompt:
      "On a weak-acid plus strong-base titration curve, what is true at the half-equivalence point?",
    choices: [
      {
        id: "a",
        text: "pH = 7.00 because [H3O+] always equals [OH-] there",
      },
      {
        id: "b",
        text: "pH = pKa because [HA] = [A-]",
      },
      {
        id: "c",
        text: "All HA has been converted to A-, so pH equals pKb",
      },
      {
        id: "d",
        text: "The indicator must be colorless because no buffer exists yet",
      },
    ],
    answerId: "b",
    explanation:
      "Halfway to equivalence, half the weak acid has been converted, so [HA] = [A-] and Henderson-Hasselbalch gives pH = pKa. Equivalence is later and is basic.",
    objectiveCodes: ["SAP-10.A"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "gibbs-sign-at-298",
    lessonSlug: "entropy-gibbs-and-favorability",
    questionType: "multiple_choice",
    prompt:
      "A process has ΔH = -80 kJ and ΔS = -150 J/K. What is ΔG at 298 K, and is the process thermodynamically favored?",
    choices: [
      { id: "a", text: "ΔG = -125 kJ; favored" },
      { id: "b", text: "ΔG = -35 kJ; favored" },
      { id: "c", text: "ΔG = +35 kJ; not favored" },
      { id: "d", text: "ΔG = +45 kJ; not favored" },
    ],
    answerId: "b",
    explanation:
      "Convert ΔS to -0.150 kJ/K. ΔG = ΔH - TΔS = -80 - (298)(-0.150) = -80 + 45 = -35 kJ. Negative ΔG means favored at 298 K.",
    objectiveCodes: ["ENE-4.C"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "zn-cu-cell-anode",
    lessonSlug: "electrochemistry-and-cell-potential",
    questionType: "multiple_choice",
    prompt:
      "Fremont robotics builds Zn | Zn2+ || Cu2+ | Cu. Where does oxidation occur, and which way do electrons travel in the wire?",
    choices: [
      {
        id: "a",
        text: "Oxidation at copper; electrons travel copper to zinc",
      },
      {
        id: "b",
        text: "Oxidation at zinc (anode); electrons travel zinc to copper",
      },
      {
        id: "c",
        text: "Oxidation at the salt bridge; electrons travel through the solution only",
      },
      {
        id: "d",
        text: "Both metals are oxidized; no electron flow occurs",
      },
    ],
    answerId: "b",
    explanation:
      "Zinc is the anode (oxidation). Electrons leave zinc, travel the wire to copper, and reduce Cu2+. Ions move in the salt bridge.",
    objectiveCodes: ["ENE-6.A"],
    difficulty: "easy",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "nernst-q-increases",
    lessonSlug: "electrochemistry-and-cell-potential",
    questionType: "multiple_choice",
    prompt:
      "A Zn-Cu cell runs and Q increases toward K. What happens to the cell potential E?",
    choices: [
      {
        id: "a",
        text: "E increases without limit because more product is better",
      },
      {
        id: "b",
        text: "E decreases and approaches zero as the cell nears equilibrium",
      },
      {
        id: "c",
        text: "E stays equal to E° at all concentrations",
      },
      {
        id: "d",
        text: "E becomes undefined because Faraday's constant changes",
      },
    ],
    answerId: "b",
    explanation:
      "As Q grows, the Nernst term subtracts more from E°. At equilibrium Q = K and E = 0. A used-up battery is near that point.",
    objectiveCodes: ["ENE-6.B"],
    difficulty: "medium",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_CHEM_NAMESPACE,
    slug: "faraday-copper-plating",
    lessonSlug: "electrochemistry-and-cell-potential",
    questionType: "multiple_choice",
    prompt:
      "A club plates copper with 1.50 A for 20.0 min. Cu2+ + 2 e- → Cu, F = 96500 C/mol, molar mass Cu = 63.55 g/mol. What mass of copper is plated?",
    choices: [
      { id: "a", text: "0.297 g" },
      { id: "b", text: "0.593 g" },
      { id: "c", text: "1.19 g" },
      { id: "d", text: "5.93 g" },
    ],
    answerId: "b",
    explanation:
      "Charge = 1.50 A × 1200 s = 1800 C. Moles e- = 1800/96500 = 0.01865. Moles Cu = 0.00933. Mass = 0.00933 × 63.55 = 0.593 g.",
    objectiveCodes: ["ENE-6.C"],
    difficulty: "hard",
    sourceBasis: AP_CHEM_SOURCE_BASIS,
    version: 1,
  },
];
