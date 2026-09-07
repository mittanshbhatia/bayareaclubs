import type { LearningPublicationStatus } from "@/lib/validation/learn";

export const LEARNING_LIFECYCLE = [
  "draft",
  "review",
  "approved",
  "published",
  "archived",
] as const satisfies readonly LearningPublicationStatus[];

const ALLOWED_TRANSITIONS: Record<
  LearningPublicationStatus,
  readonly LearningPublicationStatus[]
> = {
  draft: ["review"],
  review: ["approved", "draft"],
  approved: ["published", "review"],
  published: ["archived"],
  archived: [],
};

export function canTransitionLearningStatus(
  from: LearningPublicationStatus,
  to: LearningPublicationStatus,
): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertLearningTransition(
  from: LearningPublicationStatus,
  to: LearningPublicationStatus,
): { ok: true } | { ok: false; code: string; message: string } {
  if (from === to) {
    return { ok: false, code: "NOOP", message: "Course is already in that status." };
  }
  if (to === "published" && from === "draft") {
    return {
      ok: false,
      code: "CANNOT_SKIP",
      message: "Courses cannot be published from draft. Submit for review, then approve.",
    };
  }
  if (to === "published" && from !== "approved") {
    return {
      ok: false,
      code: "CANNOT_SKIP",
      message: "Only an approved course may be published.",
    };
  }
  if (to === "approved" && from !== "review") {
    return {
      ok: false,
      code: "CANNOT_SKIP",
      message: "Courses cannot skip review before approval.",
    };
  }
  if (to === "review" && from !== "draft" && from !== "approved") {
    return {
      ok: false,
      code: "INVALID_TRANSITION",
      message: "Submit for review from draft, or return an approved course to review.",
    };
  }
  if (!canTransitionLearningStatus(from, to)) {
    return {
      ok: false,
      code: "INVALID_TRANSITION",
      message: `Cannot move from ${from} to ${to}. Required path: draft → review → approved → published → archived.`,
    };
  }
  return { ok: true };
}

export function isStudentVisibleStatus(status: LearningPublicationStatus) {
  return status === "published";
}
