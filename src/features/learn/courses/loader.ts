import "server-only";

import { loadApBioCourse } from "@/features/learn/courses/ap-bio/manifest";
import { loadApCalcAbCourse } from "@/features/learn/courses/ap-calc-ab/manifest";
import { loadApCalcBcCourse } from "@/features/learn/courses/ap-calc-bc/manifest";
import { loadApChemCourse } from "@/features/learn/courses/ap-chem/manifest";
import { loadApCsaCourse } from "@/features/learn/courses/ap-csa/manifest";
import { loadApCspCourse } from "@/features/learn/courses/ap-csp/manifest";
import { loadApEnvsciCourse } from "@/features/learn/courses/ap-envsci/manifest";
import { loadApPhysics1Course } from "@/features/learn/courses/ap-physics-1/manifest";
import { loadApPhysics2Course } from "@/features/learn/courses/ap-physics-2/manifest";
import { loadApPrecalcCourse } from "@/features/learn/courses/ap-precalc/manifest";
import { loadApPsychCourse } from "@/features/learn/courses/ap-psych/manifest";
import { loadApStatsCourse } from "@/features/learn/courses/ap-stats/manifest";
import { getRegistryEntry } from "@/features/learn/courses/registry";
import type { CourseContentBundle, CourseLoader } from "@/features/learn/courses/types";

const courseLoaders = new Map<string, CourseLoader>();

export function registerCourseLoader(namespace: string, loader: CourseLoader) {
  const existing = courseLoaders.get(namespace);
  if (existing) return;
  courseLoaders.set(namespace, loader);
}

export function hasCourseLoader(namespace: string) {
  return courseLoaders.has(namespace);
}

export async function loadCourseNamespace(
  namespace: string,
): Promise<CourseContentBundle | null> {
  const loader = courseLoaders.get(namespace);
  if (!loader) return null;
  return loader();
}

export function describeCourseNamespace(namespace: string) {
  const registry = getRegistryEntry(namespace);
  const loaded = courseLoaders.has(namespace);
  return {
    namespace,
    registry,
    hasLoader: loaded,
    status: registry?.status ?? (loaded ? "shipping" : "unknown"),
  };
}

export function listRegisteredCourseNamespaces() {
  return [...courseLoaders.keys()].sort();
}

const SHIPPING_LOADERS: Array<[string, CourseLoader]> = [
  ["ap-bio", loadApBioCourse],
  ["ap-calc-ab", loadApCalcAbCourse],
  ["ap-calc-bc", loadApCalcBcCourse],
  ["ap-chem", loadApChemCourse],
  ["ap-csa", loadApCsaCourse],
  ["ap-csp", loadApCspCourse],
  ["ap-envsci", loadApEnvsciCourse],
  ["ap-physics-1", loadApPhysics1Course],
  ["ap-physics-2", loadApPhysics2Course],
  ["ap-precalc", loadApPrecalcCourse],
  ["ap-psych", loadApPsychCourse],
  ["ap-stats", loadApStatsCourse],
];

for (const [namespace, loader] of SHIPPING_LOADERS) {
  if (!hasCourseLoader(namespace)) {
    registerCourseLoader(namespace, loader);
  }
}
