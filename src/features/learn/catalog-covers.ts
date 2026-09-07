export const CATALOG_COVER_FILENAME = "card-cover.jpg";

export function catalogCoverObjectPath(namespace: string) {
  return `learn/${namespace}/${CATALOG_COVER_FILENAME}`;
}

export const CATALOG_COVER_DIR =
  process.env.COURSE_COVER_DIR ?? "/tmp/bac-course-covers";

export const CATALOG_COVER_PIXELS = {
  width: 1280,
  height: 720,
} as const;
