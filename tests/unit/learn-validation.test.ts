import { describe, expect, it } from "vitest";

import {
  attemptInputSchema,
  lessonInputSchema,
  questionInputSchema,
  reviewTransitionSchema,
} from "@/lib/validation/learn";

const ids = {
  courseId: "11111111-1111-4111-8111-111111111111",
  moduleId: "22222222-2222-4222-8222-222222222222",
};

describe("learn validation", () => {
  it("accepts an original lesson with plain text", () => {
    const parsed = lessonInputSchema.safeParse({
      ...ids,
      namespace: "ap-csp",
      slug: "bits-and-bytes",
      position: 0,
      title: "Bits and bytes",
      bodyPlain: "A bit is the smallest unit of digital information.",
      estimatedMinutes: 12,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects HTML in lesson title and body", () => {
    expect(
      lessonInputSchema.safeParse({
        ...ids,
        namespace: "ap-csp",
        slug: "unsafe",
        position: 0,
        title: "Intro <script>alert(1)</script>",
        bodyPlain: "Plain",
      }).success,
    ).toBe(false);
    expect(
      lessonInputSchema.safeParse({
        ...ids,
        namespace: "ap-csp",
        slug: "unsafe-body",
        position: 0,
        title: "Safe title",
        bodyPlain: "Read <b>this</b>",
      }).success,
    ).toBe(false);
  });

  it("requires ORIGINAL questions and rejects HTML prompts", () => {
    const valid = questionInputSchema.safeParse({
      courseId: ids.courseId,
      namespace: "ap-csa",
      slug: "types-1",
      prompt: "Which type stores a whole number?",
      questionType: "multiple_choice",
      choices: [
        { id: "a", text: "int" },
        { id: "b", text: "boolean" },
      ],
      answerKey: { choiceId: "a" },
      sourceBasis: "ORIGINAL",
    });
    expect(valid.success).toBe(true);

    expect(
      questionInputSchema.safeParse({
        courseId: ids.courseId,
        namespace: "ap-csa",
        slug: "types-2",
        prompt: "Which type stores a whole number?",
        questionType: "multiple_choice",
        choices: [
          { id: "a", text: "int" },
          { id: "b", text: "boolean" },
        ],
        answerKey: { choiceId: "a" },
        sourceBasis: "LICENSED_EXTERNAL",
      }).success,
    ).toBe(false);

    expect(
      questionInputSchema.safeParse({
        courseId: ids.courseId,
        namespace: "ap-csa",
        slug: "types-3",
        prompt: "Choose <img src=x onerror=alert(1)>",
        questionType: "multiple_choice",
        choices: [
          { id: "a", text: "int" },
          { id: "b", text: "boolean" },
        ],
        answerKey: { choiceId: "a" },
        sourceBasis: "ORIGINAL",
      }).success,
    ).toBe(false);
  });

  it("rejects mixed or empty attempt payloads", () => {
    expect(
      attemptInputSchema.safeParse({
        questionId: ids.courseId,
        courseId: ids.courseId,
      }).success,
    ).toBe(false);
    expect(
      attemptInputSchema.safeParse({
        questionId: ids.courseId,
        courseId: ids.courseId,
        choiceId: "a",
        text: "also text",
      }).success,
    ).toBe(false);
    expect(
      attemptInputSchema.safeParse({
        questionId: ids.courseId,
        courseId: ids.courseId,
        choiceId: "a",
      }).success,
    ).toBe(true);
  });

  it("accepts review transitions with plain notes only", () => {
    const parsed = reviewTransitionSchema.safeParse({
      courseId: ids.courseId,
      toStatus: "approved",
      notes: "Objectives match the public CED codes.",
    });
    expect(parsed.success).toBe(true);
    expect(
      reviewTransitionSchema.safeParse({
        courseId: ids.courseId,
        toStatus: "published",
        notes: "Approve <script>nope</script>",
      }).success,
    ).toBe(false);
  });
});
