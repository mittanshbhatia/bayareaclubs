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
 * P1 AP catalog. Only ap-csp and ap-csa are shipping skeletons.
 * Agents 10/11 own lesson/question content under courses/<namespace>/.
 * Do not mark planned courses published.
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
    status: "planned",
    icon: "calculator",
  },
  {
    namespace: "ap-calc-bc",
    title: "AP Calculus BC",
    description: "Series, parametric motion, and advanced integration techniques.",
    frameworkCode: "CALC-BC",
    status: "planned",
    icon: "sigma",
  },
  {
    namespace: "ap-stats",
    title: "AP Statistics",
    description: "Exploring data, sampling, probability, and inference.",
    frameworkCode: "STAT",
    status: "planned",
    icon: "sigma",
  },
  {
    namespace: "ap-precalc",
    title: "AP Precalculus",
    description: "Polynomial, exponential, trigonometric, and polar functions.",
    frameworkCode: "PRECALC",
    status: "planned",
    icon: "calculator",
  },
  {
    namespace: "ap-physics-1",
    title: "AP Physics 1",
    description: "Algebra-based mechanics, waves, and introductory circuits.",
    frameworkCode: "PHYS1",
    status: "planned",
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
    status: "planned",
    icon: "flask",
  },
  {
    namespace: "ap-bio",
    title: "AP Biology",
    description: "Evolution, energetics, information storage, and systems.",
    frameworkCode: "BIO",
    status: "planned",
    icon: "leaf",
  },
  {
    namespace: "ap-envsci",
    title: "AP Environmental Science",
    description: "Earth systems, resources, pollution, and global change.",
    frameworkCode: "ENVS",
    status: "planned",
    icon: "leaf",
  },
  {
    namespace: "ap-psych",
    title: "AP Psychology",
    description: "Biological bases, cognition, development, and social psychology.",
    frameworkCode: "PSYCH",
    status: "planned",
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
