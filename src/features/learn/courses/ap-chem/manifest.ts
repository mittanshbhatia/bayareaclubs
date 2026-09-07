/**
 * AP Chemistry — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-CHEM, public CED year 2019.
 * Objective codes are public CED identifiers only (SAP, SPQ, ENE, TRA).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_CHEM_NAMESPACE = "ap-chem" as const;
export const AP_CHEM_FRAMEWORK_CODE = "AP-CHEM" as const;
export const AP_CHEM_FRAMEWORK_YEAR = 2019 as const;
export const AP_CHEM_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_CHEM_STATUS = "original_course" as const;
export const AP_CHEM_DISCIPLINE = "chemistry" as const;

export type ApChemSourceBasis = typeof AP_CHEM_SOURCE_BASIS;
export type ApChemCourseStatus = typeof AP_CHEM_STATUS;

export const AP_CHEM_OFFICIAL_UNITS = [
  {
    slug: "atomic-structure-properties",
    title: "Atomic Structure and Properties",
  },
  {
    slug: "compound-structure-properties",
    title: "Molecular and Ionic Compound Structure and Properties",
  },
  {
    slug: "intermolecular-forces-properties",
    title: "Intermolecular Forces and Properties",
  },
  { slug: "chemical-reactions", title: "Chemical Reactions" },
  { slug: "kinetics", title: "Kinetics" },
  { slug: "thermodynamics", title: "Thermodynamics" },
  { slug: "equilibrium", title: "Equilibrium" },
  { slug: "acids-and-bases", title: "Acids and Bases" },
  {
    slug: "applications-of-thermodynamics",
    title: "Applications of Thermodynamics",
  },
] as const;

export type ApChemOfficialUnitSlug =
  (typeof AP_CHEM_OFFICIAL_UNITS)[number]["slug"];

export type ApChemLesson = {
  namespace: typeof AP_CHEM_NAMESPACE;
  unitSlug: ApChemOfficialUnitSlug;
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  sourceBasis: ApChemSourceBasis;
  objectiveCodes: readonly string[];
  bodyPlain: string;
};

export type ApChemChoiceId = "a" | "b" | "c" | "d";

export type ApChemChoice = {
  id: ApChemChoiceId;
  text: string;
};

export type ApChemDifficulty = "easy" | "medium" | "hard";

export type ApChemQuestion = {
  namespace: typeof AP_CHEM_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApChemChoice, ApChemChoice, ApChemChoice, ApChemChoice];
  answerId: ApChemChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApChemDifficulty;
  sourceBasis: ApChemSourceBasis;
  version: 1;
};

export type ApChemManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApChemManifestUnit = {
  slug: ApChemOfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApChemManifestLesson[];
};

export type ApChemManifest = {
  namespace: typeof AP_CHEM_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_CHEM_FRAMEWORK_CODE;
  frameworkYear: typeof AP_CHEM_FRAMEWORK_YEAR;
  discipline: typeof AP_CHEM_DISCIPLINE;
  sourceBasis: ApChemSourceBasis;
  status: ApChemCourseStatus;
  units: readonly ApChemManifestUnit[];
};

export const manifest = {
  namespace: AP_CHEM_NAMESPACE,
  title: "AP Chemistry",
  slug: AP_CHEM_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Chemistry. Objective codes cite the public 2019 CED as metadata only. This is not College Board material.",
  frameworkCode: AP_CHEM_FRAMEWORK_CODE,
  frameworkYear: AP_CHEM_FRAMEWORK_YEAR,
  discipline: AP_CHEM_DISCIPLINE,
  sourceBasis: AP_CHEM_SOURCE_BASIS,
  status: AP_CHEM_STATUS,
  units: [
    {
      slug: "atomic-structure-properties",
      title: "Atomic Structure and Properties",
      description:
        "Moles, mass spectra, electron arrangements, photoelectron data, and periodic trends.",
      position: 1,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "moles-mass-spectra-and-composition",
          title: "Moles, Mass Spectra, and Composition",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "electrons-pes-and-periodic-trends",
          title: "Electrons, PES, and Periodic Trends",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "compound-structure-properties",
      title: "Molecular and Ionic Compound Structure and Properties",
      description:
        "Bond types, lattices, metals, Lewis models, resonance, and molecular geometry.",
      position: 2,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "bonding-lattices-and-metals",
          title: "Bonding, Lattices, and Metals",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "lewis-vsepr-and-hybridization",
          title: "Lewis Models, VSEPR, and Hybridization",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "intermolecular-forces-properties",
      title: "Intermolecular Forces and Properties",
      description:
        "Intermolecular attractions, phases, gases, solutions, separation, and spectroscopy.",
      position: 3,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "imfs-phases-and-gases",
          title: "Intermolecular Forces, Phases, and Gases",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "solutions-separation-and-spectroscopy",
          title: "Solutions, Separation, and Spectroscopy",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "chemical-reactions",
      title: "Chemical Reactions",
      description:
        "Reaction representations, net ionic equations, stoichiometry, and titration.",
      position: 4,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "reaction-types-and-net-ionic",
          title: "Reaction Types and Net Ionic Equations",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "stoichiometry-and-titration",
          title: "Stoichiometry and Titration",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "kinetics",
      title: "Kinetics",
      description:
        "Rates, rate laws, collision models, mechanisms, and catalysis.",
      position: 5,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "rates-and-rate-laws",
          title: "Rates and Rate Laws",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "mechanisms-collision-and-catalysis",
          title: "Mechanisms, Collision Theory, and Catalysis",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "thermodynamics",
      title: "Thermodynamics",
      description:
        "Heat, calorimetry, energy diagrams, enthalpy, bond energies, and Hess's law.",
      position: 6,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "heat-calorimetry-and-energy-diagrams",
          title: "Heat, Calorimetry, and Energy Diagrams",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "enthalpy-bonds-and-hess",
          title: "Enthalpy, Bond Energies, and Hess's Law",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "equilibrium",
      title: "Equilibrium",
      description:
        "Equilibrium constants, reaction quotients, Le Chatelier shifts, and solubility.",
      position: 7,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "k-q-and-equilibrium-calculations",
          title: "K, Q, and Equilibrium Calculations",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "le-chatelier-and-solubility",
          title: "Le Chatelier and Solubility Equilibria",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "acids-and-bases",
      title: "Acids and Bases",
      description:
        "Strong and weak acids, pH, molecular structure, buffers, and titrations.",
      position: 8,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "strong-weak-and-ph",
          title: "Strong Acids, Weak Acids, and pH",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "buffers-and-titrations",
          title: "Buffers and Acid-Base Titrations",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "applications-of-thermodynamics",
      title: "Applications of Thermodynamics",
      description:
        "Entropy, Gibbs energy, thermodynamic favorability, and electrochemistry.",
      position: 9,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "entropy-gibbs-and-favorability",
          title: "Entropy, Gibbs Energy, and Favorability",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "electrochemistry-and-cell-potential",
          title: "Electrochemistry and Cell Potential",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
  ],
} as const satisfies ApChemManifest;

export function toCourseManifest(
  source: typeof manifest = manifest,
): CourseManifest {
  return {
    namespace: source.namespace,
    title: source.title,
    description: source.description,
    frameworkCode: source.frameworkCode,
    frameworkYear: source.frameworkYear,
    discipline: source.discipline,
    units: source.units.map((unit) => ({
      slug: unit.slug,
      title: unit.title,
      description: unit.description,
      estimatedMinutes: unit.estimatedMinutes,
      lessons: unit.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        estimatedMinutes: lesson.estimatedMinutes,
      })),
    })),
  };
}

export async function loadApChemCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }, extra] = await Promise.all([
    import("@/features/learn/courses/ap-chem/content"),
    import("@/features/learn/courses/ap-chem/questions"),
    import("@/features/learn/courses/ap-chem/tools"),
    import("@/features/learn/courses/ap-chem/questions-advanced"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions: [...questions, ...extra.questions],
    tools,
  };
}

export default manifest;
