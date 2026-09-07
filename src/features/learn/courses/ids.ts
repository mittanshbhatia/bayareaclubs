import { createHash } from "node:crypto";

/** Deterministic UUID v5-style id so loader-backed skeletons can use Zod uuid fields. */
export function stableUuid(key: string): string {
  const hex = createHash("sha1").update(key).digest("hex");
  const timeHi = `5${hex.slice(13, 16)}`;
  const clock = ((Number.parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80)
    .toString(16)
    .padStart(2, "0");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    timeHi,
    `${clock}${hex.slice(18, 20)}`,
    hex.slice(20, 32),
  ].join("-");
}

export function loaderCourseId(namespace: string) {
  return stableUuid(`bac-learn-course:${namespace}`);
}

export function loaderUnitId(namespace: string, unitSlug: string) {
  return stableUuid(`bac-learn-unit:${namespace}:${unitSlug}`);
}

export function loaderLessonId(namespace: string, lessonSlug: string) {
  return stableUuid(`bac-learn-lesson:${namespace}:${lessonSlug}`);
}

export function loaderQuestionId(namespace: string, questionSlug: string) {
  return stableUuid(`bac-learn-question:${namespace}:${questionSlug}`);
}
