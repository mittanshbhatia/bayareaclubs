import type { CourseLoaderStatus } from "@/features/learn/courses/types";

export type ApCourseRegistryEntry = {
  namespace: string;
  title: string;
  description: string;
  frameworkCode: string;
  status: CourseLoaderStatus;
  icon: "binary" | "code" | "calculator" | "sigma" | "atom" | "flask" | "leaf" | "brain";
};

/**
 * Shipping namespaces have original loaders with official CED unit coverage.
 * Planned titles were not completed by their course agents.
 */
export const AP_COURSE_REGISTRY: readonly ApCourseRegistryEntry[] = [
  {
    namespace: "ap-csp",
    title: "AP Computer Science Principles",
    description: "Computing systems, data, algorithms, and the impact of computing. Original BayAreaClubs lessons.",
    frameworkCode: "CSP",
    status: "shipping",
    icon: "binary",
  },
  {
    namespace: "ap-csa",
    title: "AP Computer Science A",
    description: "Java programming, object-oriented design, and algorithm analysis. Original BayAreaClubs lessons.",
    frameworkCode: "CSA",
    status: "shipping",
    icon: "code",
  },
  {
    namespace: "ap-calc-ab",
    title: "AP Calculus AB",
    description: "Limits, derivatives, and integrals aligned to public CED objective codes.",
    frameworkCode: "CALC-AB",
    status: "shipping",
    icon: "calculator",
  },
  {
    namespace: "ap-calc-bc",
    title: "AP Calculus BC",
    description: "Series, parametric motion, and advanced integration techniques.",
    frameworkCode: "CALC-BC",
    status: "shipping",
    icon: "sigma",
  },
  {
    namespace: "ap-stats",
    title: "AP Statistics",
    description: "Exploring data, sampling, probability, and inference.",
    frameworkCode: "STAT",
    status: "shipping",
    icon: "sigma",
  },
  {
    namespace: "ap-precalc",
    title: "AP Precalculus",
    description: "Polynomial, exponential, trigonometric, and polar functions.",
    frameworkCode: "PRECALC",
    status: "shipping",
    icon: "calculator",
  },
  {
    namespace: "ap-physics-1",
    title: "AP Physics 1",
    description: "Algebra-based mechanics, waves, and introductory circuits.",
    frameworkCode: "PHYS1",
    status: "shipping",
    icon: "atom",
  },
  {
    namespace: "ap-physics-2",
    title: "AP Physics 2",
    description: "Fluids, thermodynamics, electricity and magnetism, optics.",
    frameworkCode: "PHYS2",
    status: "planned",
    icon: "atom",
  },
  {
    namespace: "ap-physics-c-mech",
    title: "AP Physics C: Mechanics",
    description: "Calculus-based Newtonian mechanics.",
    frameworkCode: "PHYS-C-MECH",
    status: "planned",
    icon: "atom",
  },
  {
    namespace: "ap-physics-c-em",
    title: "AP Physics C: Electricity and Magnetism",
    description: "Calculus-based electrostatics, circuits, and magnetism.",
    frameworkCode: "PHYS-C-EM",
    status: "planned",
    icon: "atom",
  },
  {
    namespace: "ap-chem",
    title: "AP Chemistry",
    description: "Atomic structure, bonding, thermodynamics, and equilibrium.",
    frameworkCode: "CHEM",
    status: "shipping",
    icon: "flask",
  },
  {
    namespace: "ap-bio",
    title: "AP Biology",
    description: "Evolution, energetics, information storage, and systems.",
    frameworkCode: "BIO",
    status: "shipping",
    icon: "leaf",
  },
  {
    namespace: "ap-envsci",
    title: "AP Environmental Science",
    description: "Earth systems, resources, pollution, and global change.",
    frameworkCode: "ENVS",
    status: "shipping",
    icon: "leaf",
  },
  {
    namespace: "ap-psych",
    title: "AP Psychology",
    description: "Biological bases, cognition, development, and social psychology.",
    frameworkCode: "PSYCH",
    status: "shipping",
    icon: "brain",
  },
] as const;

export function getRegistryEntry(namespace: string) {
  return AP_COURSE_REGISTRY.find((entry) => entry.namespace === namespace) ?? null;
}

export function listShippingNamespaces() {
  return AP_COURSE_REGISTRY.filter((entry) => entry.status === "shipping").map(
    (entry) => entry.namespace,
  );
}

export function listPlannedNamespaces() {
  return AP_COURSE_REGISTRY.filter((entry) => entry.status === "planned").map(
    (entry) => entry.namespace,
  );
}

export type CatalogFamily = "all" | "cs" | "math" | "science" | "social";

const FAMILY_NAMESPACES: Record<Exclude<CatalogFamily, "all">, readonly string[]> = {
  cs: ["ap-csp", "ap-csa"],
  math: ["ap-calc-ab", "ap-calc-bc", "ap-stats", "ap-precalc"],
  science: [
    "ap-physics-1",
    "ap-physics-2",
    "ap-physics-c-mech",
    "ap-physics-c-em",
    "ap-chem",
    "ap-bio",
    "ap-envsci",
  ],
  social: ["ap-psych"],
};

export function catalogFamilyFor(namespace: string): Exclude<CatalogFamily, "all"> | null {
  for (const [family, namespaces] of Object.entries(FAMILY_NAMESPACES)) {
    if (namespaces.includes(namespace)) return family as Exclude<CatalogFamily, "all">;
  }
  return null;
}

export function filterRegistryByFamily(
  entries: readonly ApCourseRegistryEntry[],
  family: CatalogFamily,
) {
  if (family === "all") return [...entries];
  return entries.filter((entry) => FAMILY_NAMESPACES[family].includes(entry.namespace));
}
