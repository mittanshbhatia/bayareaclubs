/** Authenticated AP catalog. Course lessons stay under /dashboard/learn/ap. */
export const COURSES_CATALOG_PATH = "/courses";
export const LEARN_LEGACY_HUB_PATH = "/dashboard/learn";
export const LEARN_COURSE_ROOT = "/dashboard/learn/ap";

export function coursesCatalogHref(family?: string | null) {
  if (family && family !== "all") {
    return `${COURSES_CATALOG_PATH}?family=${encodeURIComponent(family)}`;
  }
  return COURSES_CATALOG_PATH;
}

export function isCoursesNavPath(pathname: string) {
  return (
    pathname === COURSES_CATALOG_PATH ||
    pathname.startsWith(`${COURSES_CATALOG_PATH}/`) ||
    pathname === LEARN_LEGACY_HUB_PATH ||
    pathname.startsWith(`${LEARN_LEGACY_HUB_PATH}/`) ||
    pathname === "/dashboard/learning" ||
    pathname.startsWith("/dashboard/learning/")
  );
}

export function courseContentHref(namespace: string, ...segments: string[]) {
  const extra = segments.length ? `/${segments.join("/")}` : "";
  return `${LEARN_COURSE_ROOT}/${namespace}${extra}`;
}
