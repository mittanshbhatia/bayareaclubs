/**
 * AP Physics 2 — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-PHYS2, public CED year 2024.
 * Objective codes are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_PHYSICS_2_NAMESPACE = "ap-physics-2" as const;
export const AP_PHYSICS_2_FRAMEWORK_CODE = "AP-PHYS2" as const;
export const AP_PHYSICS_2_FRAMEWORK_YEAR = 2024 as const;
export const AP_PHYSICS_2_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_PHYSICS_2_STATUS = "original_course" as const;
export const AP_PHYSICS_2_DISCIPLINE = "physics" as const;

/** Official 2024–25 AP Physics 2 unit slugs (CED Units 9–15). */
export const AP_PHYSICS_2_OFFICIAL_UNITS = [
  "thermodynamics",
  "electric-force-field-potential",
  "electric-circuits",
  "magnetism-and-electromagnetism",
  "geometric-optics",
  "waves-sound-physical-optics",
  "modern-physics",
] as const;

export type ApPhysics2SourceBasis = typeof AP_PHYSICS_2_SOURCE_BASIS;
export type ApPhysics2CourseStatus = typeof AP_PHYSICS_2_STATUS;
export type ApPhysics2UnitSlug = (typeof AP_PHYSICS_2_OFFICIAL_UNITS)[number];

export type ApPhysics2ManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApPhysics2ManifestUnit = {
  slug: ApPhysics2UnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApPhysics2ManifestLesson[];
};

export type ApPhysics2Manifest = {
  namespace: typeof AP_PHYSICS_2_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_PHYSICS_2_FRAMEWORK_CODE;
  frameworkYear: typeof AP_PHYSICS_2_FRAMEWORK_YEAR;
  discipline: typeof AP_PHYSICS_2_DISCIPLINE;
  sourceBasis: ApPhysics2SourceBasis;
  status: ApPhysics2CourseStatus;
  units: readonly ApPhysics2ManifestUnit[];
};

export const manifest = {
  namespace: AP_PHYSICS_2_NAMESPACE,
  title: "AP Physics 2",
  slug: AP_PHYSICS_2_NAMESPACE,
  description:
    "Original BayAreaClubs lessons and multiple-choice practice for algebra-based AP Physics 2. Students model gases and heat, electric force and potential, circuits, magnetism, images, waves, and modern physics using club-lab scenarios. Objective codes cite the public 2024 CED as identifiers only. This is not College Board material.",
  frameworkCode: AP_PHYSICS_2_FRAMEWORK_CODE,
  frameworkYear: AP_PHYSICS_2_FRAMEWORK_YEAR,
  discipline: AP_PHYSICS_2_DISCIPLINE,
  sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
  status: AP_PHYSICS_2_STATUS,
  units: [
    {
      slug: "thermodynamics",
      title: "Thermodynamics",
      description:
        "Kinetic theory, ideal gases, heat flow, the first law, and entropy in club-scale thermal systems.",
      position: 1,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "kinetic-theory-and-ideal-gas",
          title: "Kinetic theory and the ideal gas",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "first-law-entropy-and-heat-engines",
          title: "First law, entropy, and heat engines",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
    {
      slug: "electric-force-field-potential",
      title: "Electric Force, Field, and Potential",
      description:
        "Charge, Coulomb force, fields, potential energy, potential, and capacitors.",
      position: 2,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "charge-force-and-electric-fields",
          title: "Charge, force, and electric fields",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "potential-energy-potential-and-capacitors",
          title: "Potential, energy, and capacitors",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
    {
      slug: "electric-circuits",
      title: "Electric Circuits",
      description:
        "Current, resistance, series and parallel networks, Kirchhoff rules, and RC charging.",
      position: 3,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "current-resistance-and-simple-circuits",
          title: "Current, resistance, and simple circuits",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "kirchhoff-and-rc-circuits",
          title: "Kirchhoff rules and RC circuits",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
    {
      slug: "magnetism-and-electromagnetism",
      title: "Magnetism and Electromagnetism",
      description:
        "Magnetic fields, forces on moving charges and wires, and induced emf.",
      position: 4,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "magnetic-fields-and-moving-charges",
          title: "Magnetic fields and moving charges",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "induction-and-faraday",
          title: "Induction and Faraday's law",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
    {
      slug: "geometric-optics",
      title: "Geometric Optics",
      description:
        "Reflection, refraction, and image formation with mirrors and lenses.",
      position: 5,
      estimatedMinutes: 48,
      lessons: [
        {
          slug: "reflection-and-mirror-images",
          title: "Reflection and mirror images",
          position: 1,
          estimatedMinutes: 24,
        },
        {
          slug: "refraction-and-lens-images",
          title: "Refraction and lens images",
          position: 2,
          estimatedMinutes: 24,
        },
      ],
    },
    {
      slug: "waves-sound-physical-optics",
      title: "Waves, Sound, and Physical Optics",
      description:
        "Periodic waves, sound, Doppler shifts, interference, diffraction, and thin films.",
      position: 6,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "wave-properties-sound-and-doppler",
          title: "Wave properties, sound, and Doppler shifts",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "interference-diffraction-and-thin-films",
          title: "Interference, diffraction, and thin films",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
    {
      slug: "modern-physics",
      title: "Modern Physics",
      description:
        "Photons, spectra, the photoelectric effect, and nuclear energy changes.",
      position: 7,
      estimatedMinutes: 50,
      lessons: [
        {
          slug: "photons-photoelectric-and-spectra",
          title: "Photons, photoelectric effect, and spectra",
          position: 1,
          estimatedMinutes: 25,
        },
        {
          slug: "nuclear-decay-fission-and-fusion",
          title: "Nuclear decay, fission, and fusion",
          position: 2,
          estimatedMinutes: 25,
        },
      ],
    },
  ],
} as const satisfies ApPhysics2Manifest;

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

export async function loadApPhysics2Course(): Promise<CourseContentBundle> {
  return {
    manifest: toCourseManifest(),
    lessons: [],
    questions: [],
    tools: [],
  };
}

export default manifest;
