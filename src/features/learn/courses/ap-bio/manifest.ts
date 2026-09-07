/**
 * AP Biology — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-BIO, public CED year 2020.
 * Objective codes are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_BIO_NAMESPACE = "ap-bio" as const;
export const AP_BIO_FRAMEWORK_CODE = "AP-BIO" as const;
export const AP_BIO_FRAMEWORK_YEAR = 2020 as const;
export const AP_BIO_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_BIO_STATUS = "original_course" as const;
export const AP_BIO_DISCIPLINE = "biology" as const;

export const AP_BIO_OFFICIAL_UNITS = [
  "chemistry-of-life",
  "cell-structure-function",
  "cellular-energetics",
  "cell-communication-cycle",
  "heredity",
  "gene-expression-regulation",
  "natural-selection",
  "ecology",
] as const;

export type ApBioOfficialUnitSlug = (typeof AP_BIO_OFFICIAL_UNITS)[number];
export type ApBioSourceBasis = typeof AP_BIO_SOURCE_BASIS;
export type ApBioCourseStatus = typeof AP_BIO_STATUS;

export type ApBioManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApBioManifestUnit = {
  slug: ApBioOfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApBioManifestLesson[];
};

export type ApBioManifest = {
  namespace: typeof AP_BIO_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_BIO_FRAMEWORK_CODE;
  frameworkYear: typeof AP_BIO_FRAMEWORK_YEAR;
  discipline: typeof AP_BIO_DISCIPLINE;
  sourceBasis: ApBioSourceBasis;
  status: ApBioCourseStatus;
  units: readonly ApBioManifestUnit[];
};

export const manifest = {
  namespace: AP_BIO_NAMESPACE,
  title: "AP Biology",
  slug: AP_BIO_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for AP Biology. Units follow the public 2020 CED list. Objective codes cite public IST, ENE, EVO, and SYI identifiers as metadata only. This is not College Board material.",
  frameworkCode: AP_BIO_FRAMEWORK_CODE,
  frameworkYear: AP_BIO_FRAMEWORK_YEAR,
  discipline: AP_BIO_DISCIPLINE,
  sourceBasis: AP_BIO_SOURCE_BASIS,
  status: AP_BIO_STATUS,
  units: [
    {
      slug: "chemistry-of-life",
      title: "Chemistry of Life",
      description:
        "Water, carbon scaffolds, and the monomers that build living systems.",
      position: 1,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "water-polarity-and-carbon-scaffolds",
          title: "Water polarity and carbon scaffolds",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "monomers-polymers-and-information-molecules",
          title: "Monomers, polymers, and information molecules",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "cell-structure-function",
      title: "Cell Structure and Function",
      description:
        "Organelles, membranes, and the traffic that keeps a cell's interior distinct.",
      position: 2,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "organelles-and-compartments",
          title: "Organelles and compartments",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "membranes-gradients-and-transport",
          title: "Membranes, gradients, and transport",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "cellular-energetics",
      title: "Cellular Energetics",
      description:
        "Enzymes, free energy, photosynthesis, and respiration as coupled energy paths.",
      position: 3,
      estimatedMinutes: 42,
      lessons: [
        {
          slug: "enzymes-and-free-energy",
          title: "Enzymes and free energy",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "photosynthesis-and-cellular-respiration",
          title: "Photosynthesis and cellular respiration",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "cell-communication-cycle",
      title: "Cell Communication and Cell Cycle",
      description:
        "Signal reception, transduction, and the checkpoints that pace division.",
      position: 4,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "signal-reception-and-transduction",
          title: "Signal reception and transduction",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "cell-cycle-and-checkpoints",
          title: "Cell cycle and checkpoints",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "heredity",
      title: "Heredity",
      description:
        "Meiosis, independent assortment, and inheritance patterns students can model.",
      position: 5,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "meiosis-and-genetic-variation",
          title: "Meiosis and genetic variation",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "inheritance-patterns-in-clubs",
          title: "Inheritance patterns in clubs",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "gene-expression-regulation",
      title: "Gene Expression and Regulation",
      description:
        "From DNA sequence to protein, plus regulation and lab tools clubs actually use.",
      position: 6,
      estimatedMinutes: 42,
      lessons: [
        {
          slug: "transcription-and-translation",
          title: "Transcription and translation",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "gene-regulation-and-biotech-tools",
          title: "Gene regulation and biotech tools",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "natural-selection",
      title: "Natural Selection",
      description:
        "Evidence for descent with modification, allele change, speciation, and trees.",
      position: 7,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "selection-evidence-and-allele-change",
          title: "Selection, evidence, and allele change",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "speciation-and-phylogeny",
          title: "Speciation and phylogeny",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
    {
      slug: "ecology",
      title: "Ecology",
      description:
        "Energy flow, populations, community interactions, and disruption around the Bay.",
      position: 8,
      estimatedMinutes: 40,
      lessons: [
        {
          slug: "energy-flow-and-population-change",
          title: "Energy flow and population change",
          position: 1,
          estimatedMinutes: 20,
        },
        {
          slug: "communities-disruption-and-biodiversity",
          title: "Communities, disruption, and biodiversity",
          position: 2,
          estimatedMinutes: 20,
        },
      ],
    },
  ],
} as const satisfies ApBioManifest;

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

export async function loadApBioCourse(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }, extra] = await Promise.all([
    import("@/features/learn/courses/ap-bio/content"),
    import("@/features/learn/courses/ap-bio/questions"),
    import("@/features/learn/courses/ap-bio/tools"),
    import("@/features/learn/courses/ap-bio/questions-advanced"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions: [...questions, ...extra.questions],
    tools,
  };
}

export default manifest;
