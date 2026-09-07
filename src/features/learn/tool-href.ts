import type { CourseToolKind } from "@/features/learn/courses/types";

export function toolHref(namespace: string, kind: CourseToolKind) {
  if (kind === "practice") return `/dashboard/learn/ap/${namespace}/practice`;
  return `/dashboard/learn/ap/${namespace}/${kind}`;
}
