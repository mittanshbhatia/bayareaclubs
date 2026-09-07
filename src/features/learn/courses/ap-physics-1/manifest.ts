/**
 * AP Physics 1 — original BayAreaClubs course.
 * source_basis: ORIGINAL. framework: AP-PHYS1, public CED year 2024.
 * Objective codes are public CED identifiers only (no CED prose).
 */

import type {
  CourseContentBundle,
  CourseManifest,
} from "@/features/learn/courses/types";

export const AP_PHYSICS_1_NAMESPACE = "ap-physics-1" as const;
export const AP_PHYSICS_1_FRAMEWORK_CODE = "AP-PHYS1" as const;
export const AP_PHYSICS_1_FRAMEWORK_YEAR = 2024 as const;
export const AP_PHYSICS_1_SOURCE_BASIS = "ORIGINAL" as const;
export const AP_PHYSICS_1_STATUS = "original_course" as const;
export const AP_PHYSICS_1_DISCIPLINE = "physics" as const;

export const AP_PHYSICS_1_OFFICIAL_UNITS = [
  "kinematics",
  "force-and-translational-dynamics",
  "work-energy-power",
  "linear-momentum",
  "torque-and-rotational-dynamics",
  "energy-momentum-rotating-systems",
  "oscillations",
  "fluids",
] as const;

export type ApPhysics1OfficialUnitSlug =
  (typeof AP_PHYSICS_1_OFFICIAL_UNITS)[number];
export type ApPhysics1SourceBasis = typeof AP_PHYSICS_1_SOURCE_BASIS;
export type ApPhysics1CourseStatus = typeof AP_PHYSICS_1_STATUS;

export type ApPhysics1ManifestLesson = {
  slug: string;
  title: string;
  position: number;
  estimatedMinutes: number;
};

export type ApPhysics1ManifestUnit = {
  slug: ApPhysics1OfficialUnitSlug;
  title: string;
  description: string;
  position: number;
  estimatedMinutes: number;
  lessons: readonly ApPhysics1ManifestLesson[];
};

export type ApPhysics1Manifest = {
  namespace: typeof AP_PHYSICS_1_NAMESPACE;
  title: string;
  slug: string;
  description: string;
  frameworkCode: typeof AP_PHYSICS_1_FRAMEWORK_CODE;
  frameworkYear: typeof AP_PHYSICS_1_FRAMEWORK_YEAR;
  discipline: typeof AP_PHYSICS_1_DISCIPLINE;
  sourceBasis: ApPhysics1SourceBasis;
  status: ApPhysics1CourseStatus;
  units: readonly ApPhysics1ManifestUnit[];
};

export const manifest = {
  namespace: AP_PHYSICS_1_NAMESPACE,
  title: "AP Physics 1",
  slug: AP_PHYSICS_1_NAMESPACE,
  description:
    "Original BayAreaClubs algebra-based lessons and multiple-choice practice for AP Physics 1. Units follow the public 2024 course outline. Objective codes cite public CED identifiers only. This is not College Board material.",
  frameworkCode: AP_PHYSICS_1_FRAMEWORK_CODE,
  frameworkYear: AP_PHYSICS_1_FRAMEWORK_YEAR,
  discipline: AP_PHYSICS_1_DISCIPLINE,
  sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
  status: AP_PHYSICS_1_STATUS,
  units: [
    {
      slug: "kinematics",
      title: "Kinematics",
      description:
        "Describe motion with scalars, vectors, graphs, relative frames, and two-dimensional paths using algebra only.",
      position: 1,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "scalars-vectors-and-one-d-motion",
          title: "Scalars, vectors, and one-dimensional motion",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "graphs-relative-motion-and-projectiles",
          title: "Graphs, relative motion, and projectiles",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "force-and-translational-dynamics",
      title: "Force and Translational Dynamics",
      description:
        "Connect net force to acceleration with free-body diagrams, friction, springs, and uniform circular motion.",
      position: 2,
      estimatedMinutes: 46,
      lessons: [
        {
          slug: "forces-free-body-diagrams-and-newtons-laws",
          title: "Forces, free-body diagrams, and Newton's laws",
          position: 1,
          estimatedMinutes: 23,
        },
        {
          slug: "friction-springs-and-circular-motion",
          title: "Friction, springs, and circular motion",
          position: 2,
          estimatedMinutes: 23,
        },
      ],
    },
    {
      slug: "work-energy-power",
      title: "Work, Energy, and Power",
      description:
        "Track work, kinetic energy, gravitational and spring potential energy, mechanical energy, and power.",
      position: 3,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "work-kinetic-energy-and-potential-energy",
          title: "Work, kinetic energy, and potential energy",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "mechanical-energy-conservation-and-power",
          title: "Mechanical energy conservation and power",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "linear-momentum",
      title: "Linear Momentum",
      description:
        "Use impulse, momentum change, conservation, and collision types to predict post-interaction velocities.",
      position: 4,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "impulse-and-momentum-change",
          title: "Impulse and momentum change",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "conservation-and-collisions",
          title: "Conservation and collisions",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "torque-and-rotational-dynamics",
      title: "Torque and Rotational Dynamics",
      description:
        "Relate angular kinematics, torque, rotational inertia, and Newton's second law for rotation.",
      position: 5,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "rotational-kinematics-and-torque",
          title: "Rotational kinematics and torque",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "rotational-inertia-and-newtons-second-for-rotation",
          title: "Rotational inertia and Newton's second law for rotation",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "energy-momentum-rotating-systems",
      title: "Energy and Momentum of Rotating Systems",
      description:
        "Apply rotational kinetic energy, work by torque, angular momentum, and conservation to spinning systems.",
      position: 6,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "rotational-kinetic-energy-and-work",
          title: "Rotational kinetic energy and work",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "angular-momentum-and-conservation",
          title: "Angular momentum and conservation",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
    {
      slug: "oscillations",
      title: "Oscillations",
      description:
        "Identify simple harmonic motion, relate period and frequency, and track energy in springs and pendulums.",
      position: 7,
      estimatedMinutes: 42,
      lessons: [
        {
          slug: "defining-simple-harmonic-motion",
          title: "Defining simple harmonic motion",
          position: 1,
          estimatedMinutes: 21,
        },
        {
          slug: "energy-and-period-of-oscillators",
          title: "Energy and period of oscillators",
          position: 2,
          estimatedMinutes: 21,
        },
      ],
    },
    {
      slug: "fluids",
      title: "Fluids",
      description:
        "Use density, pressure, buoyancy, continuity, and Bernoulli relations for still and flowing fluids.",
      position: 8,
      estimatedMinutes: 44,
      lessons: [
        {
          slug: "density-pressure-and-buoyancy",
          title: "Density, pressure, and buoyancy",
          position: 1,
          estimatedMinutes: 22,
        },
        {
          slug: "continuity-and-bernoulli",
          title: "Continuity and Bernoulli",
          position: 2,
          estimatedMinutes: 22,
        },
      ],
    },
  ],
} as const satisfies ApPhysics1Manifest;

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

export async function loadApPhysics1Course(): Promise<CourseContentBundle> {
  const [{ lessons }, { questions }, { tools }] = await Promise.all([
    import("@/features/learn/courses/ap-physics-1/content"),
    import("@/features/learn/courses/ap-physics-1/questions"),
    import("@/features/learn/courses/ap-physics-1/tools"),
  ]);

  return {
    manifest: toCourseManifest(),
    lessons,
    questions,
    tools,
  };
}

export default manifest;
