import "server-only";

import { loadApCsaCourse } from "@/features/learn/courses/ap-csa/manifest";
import { loadApCspCourse } from "@/features/learn/courses/ap-csp/manifest";
import { getRegistryEntry } from "@/features/learn/courses/registry";
import type { CourseContentBundle, CourseLoader } from "@/features/learn/courses/types";

/**
 * Agents 10/11 register a loader from `courses/<namespace>/manifest.ts`.
 * Do not add ap-csp / ap-csa lesson or question content here.
 */
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

if (!hasCourseLoader("ap-csa")) {
  registerCourseLoader("ap-csa", loadApCsaCourse);
}
if (!hasCourseLoader("ap-csp")) {
  registerCourseLoader("ap-csp", loadApCspCourse);
}
