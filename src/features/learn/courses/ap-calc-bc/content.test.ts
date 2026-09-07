import { describe, expect, it } from "vitest";

import { CourseCardArt } from "@/features/learn/courses/ap-calc-bc/card";
import { lessons } from "@/features/learn/courses/ap-calc-bc/content";
import {
  AP_CALC_BC_DISCIPLINE,
  AP_CALC_BC_FRAMEWORK_CODE,
  AP_CALC_BC_FRAMEWORK_YEAR,
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_OFFICIAL_UNITS,
  AP_CALC_BC_SOURCE_BASIS,
  AP_CALC_BC_STATUS,
  loadApCalcBcCourse,
  manifest,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import { overview } from "@/features/learn/courses/ap-calc-bc/overview";
import { questions } from "@/features/learn/courses/ap-calc-bc/questions";
import { tools } from "@/features/learn/courses/ap-calc-bc/tools";

const HTML_TAG = /<[a-z][\s\S]*?>/i;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

describe("ap-calc-bc course", () => {
  it("is an original AP Calculus BC course on the 2019 public CED", () => {
    expect(AP_CALC_BC_NAMESPACE).toBe("ap-calc-bc");
    expect(AP_CALC_BC_FRAMEWORK_CODE).toBe("AP-CALC-BC");
    expect(AP_CALC_BC_FRAMEWORK_YEAR).toBe(2019);
    expect(AP_CALC_BC_SOURCE_BASIS).toBe("ORIGINAL");
    expect(AP_CALC_BC_STATUS).toBe("original_course");
    expect(AP_CALC_BC_DISCIPLINE).toBe("mathematics");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(overview.sourceBasis).toBe("ORIGINAL");
    expect(lessons.every((lesson) => lesson.sourceBasis === "ORIGINAL")).toBe(
      true,
    );
    expect(questions.every((question) => question.sourceBasis === "ORIGINAL")).toBe(
      true,
    );
  });

  it("ships every official unit with unique slugs", () => {
    const shipped = manifest.units.map((unit) => unit.slug);
    expect(shipped.length).toBeGreaterThanOrEqual(10);
    expect(shipped).toEqual([...AP_CALC_BC_OFFICIAL_UNITS]);
    expect(unique(shipped)).toHaveLength(shipped.length);
    expect(unique(lessons.map((lesson) => lesson.slug))).toHaveLength(
      lessons.length,
    );
    expect(lessons.length).toBeGreaterThanOrEqual(20);
    for (const unit of manifest.units) {
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons).toHaveLength(unit.lessons.length);
    }
  });

  it("has at least forty original multiple-choice items with four valid choices", () => {
    expect(questions.length).toBeGreaterThanOrEqual(40);
    expect(unique(questions.map((question) => question.slug))).toHaveLength(
      questions.length,
    );
    const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    for (const unit of manifest.units) {
      const unitLessonSlugs = new Set(
        lessons
          .filter((lesson) => lesson.unitSlug === unit.slug)
          .map((lesson) => lesson.slug),
      );
      const unitQuestions = questions.filter(
        (question) =>
          question.lessonSlug !== null && unitLessonSlugs.has(question.lessonSlug),
      );
      expect(unitQuestions.length).toBeGreaterThanOrEqual(4);
    }

    for (const question of questions) {
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(unique(question.choices.map((choice) => choice.id))).toHaveLength(4);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(
        true,
      );
      expect(
        question.lessonSlug === null || lessonSlugs.has(question.lessonSlug),
      ).toBe(true);
      expect(question.objectiveCodes.length).toBeGreaterThan(0);
    }
  });

  it("uses plain text with no HTML in lessons, questions, and overview", () => {
    expect(HTML_TAG.test(overview.bodyPlain)).toBe(false);
    for (const lesson of lessons) {
      expect(lesson.bodyPlain.split("\n\n").length).toBeGreaterThanOrEqual(3);
      expect(HTML_TAG.test(lesson.bodyPlain)).toBe(false);
    }
    for (const question of questions) {
      expect(HTML_TAG.test(question.prompt)).toBe(false);
      expect(HTML_TAG.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(HTML_TAG.test(choice.text)).toBe(false);
      }
    }
  });

  it("exposes all five BayAreaClubs tools with live slugs", () => {
    const kinds = tools.map((tool) => tool.kind);
    expect(kinds).toEqual(
      expect.arrayContaining(["practice", "quiz", "review", "notes", "readiness"]),
    );
    expect(unique(kinds)).toHaveLength(5);
    const questionSlugs = new Set(questions.map((question) => question.slug));
    const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
    for (const tool of tools) {
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugs.has(slug)).toBe(true);
      }
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("loads a complete course bundle and exports original card art", () => {
    expect(typeof CourseCardArt).toBe("function");
    return loadApCalcBcCourse().then((bundle) => {
      expect(bundle.manifest.namespace).toBe(AP_CALC_BC_NAMESPACE);
      expect(bundle.manifest.discipline).toBe("mathematics");
      expect(bundle.lessons).toHaveLength(lessons.length);
      expect(bundle.questions).toHaveLength(questions.length);
      expect(bundle.tools).toHaveLength(tools.length);
    });
  });
});
