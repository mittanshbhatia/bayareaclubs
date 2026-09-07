import { describe, expect, it } from "vitest";

import {
  assertLearningTransition,
  canTransitionLearningStatus,
  isStudentVisibleStatus,
} from "@/features/learn/workflow";

describe("learn workflow", () => {
  it("allows only the next step on the happy path", () => {
    expect(assertLearningTransition("draft", "review")).toEqual({ ok: true });
    expect(assertLearningTransition("review", "approved")).toEqual({ ok: true });
    expect(assertLearningTransition("approved", "published")).toEqual({ ok: true });
    expect(assertLearningTransition("published", "archived")).toEqual({ ok: true });
  });

  it("cannot skip draft → review → approved → published", () => {
    expect(canTransitionLearningStatus("draft", "approved")).toBe(false);
    expect(canTransitionLearningStatus("draft", "published")).toBe(false);
    expect(canTransitionLearningStatus("review", "published")).toBe(false);
    expect(assertLearningTransition("draft", "approved").ok).toBe(false);
    expect(assertLearningTransition("review", "published").ok).toBe(false);
  });

  it("cannot publish from draft", () => {
    const result = assertLearningTransition("draft", "published");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("CANNOT_SKIP");
      expect(result.message).toMatch(/cannot be published from draft/i);
    }
  });

  it("keeps unpublished statuses off the student catalog", () => {
    expect(isStudentVisibleStatus("draft")).toBe(false);
    expect(isStudentVisibleStatus("review")).toBe(false);
    expect(isStudentVisibleStatus("approved")).toBe(false);
    expect(isStudentVisibleStatus("published")).toBe(true);
    expect(isStudentVisibleStatus("archived")).toBe(false);
  });
});
