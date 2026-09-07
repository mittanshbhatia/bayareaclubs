import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-physics-2/content";
import {
  AP_PHYSICS_2_OFFICIAL_UNITS,
  AP_PHYSICS_2_SOURCE_BASIS,
  AP_PHYSICS_2_STATUS,
  manifest,
} from "@/features/learn/courses/ap-physics-2/manifest";
import { overview } from "@/features/learn/courses/ap-physics-2/overview";
import { questions } from "@/features/learn/courses/ap-physics-2/questions";
import { tools } from "@/features/learn/courses/ap-physics-2/tools";

const HTML_TAG = /<[^>]+>/;

function unique(values: readonly string[]) {
  return new Set(values).size === values.length;
}

describe("ap-physics-2 original course", () => {
  it("is ORIGINAL with original_course status", () => {
    expect(AP_PHYSICS_2_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(AP_PHYSICS_2_STATUS).toBe("original_course");
    expect(overview.sourceBasis).toBe("ORIGINAL");
    expect(lessons.every((lesson) => lesson.sourceBasis === "ORIGINAL")).toBe(
      true,
    );
    expect(questions.every((question) => question.sourceBasis === "ORIGINAL")).toBe(
      true,
    );
  });

  it("ships at least the 7 official 2024 units", () => {
    expect(AP_PHYSICS_2_OFFICIAL_UNITS.length).toBeGreaterThanOrEqual(7);
    expect(manifest.units.length).toBeGreaterThanOrEqual(7);
    expect(manifest.units.map((unit) => unit.slug)).toEqual([
      ...AP_PHYSICS_2_OFFICIAL_UNITS,
    ]);
  });

  it("has unique unit, lesson, and question slugs", () => {
    expect(unique(manifest.units.map((unit) => unit.slug))).toBe(true);
    expect(unique(lessons.map((lesson) => lesson.slug))).toBe(true);
    expect(unique(questions.map((question) => question.slug))).toBe(true);
  });

  it("has at least 2 lessons per official unit", () => {
    for (const unit of manifest.units) {
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length).toBeGreaterThanOrEqual(2);
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has at least 28 questions and 4 multiple-choice items per unit", () => {
    expect(questions.length).toBeGreaterThanOrEqual(28);
    const lessonUnit = new Map(lessons.map((lesson) => [lesson.slug, lesson.unitSlug]));
    for (const unit of manifest.units) {
      const unitQuestions = questions.filter(
        (question) => lessonUnit.get(question.lessonSlug) === unit.slug,
      );
      expect(unitQuestions.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("uses four choices and a valid answer on every item", () => {
    for (const question of questions) {
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(unique(question.choices.map((choice) => choice.id))).toBe(true);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(
        true,
      );
      expect(question.objectiveCodes.every((code) => /^\d+\.\d+\.[A-Z]$/.test(code))).toBe(
        true,
      );
    }
  });

  it("includes easy, medium, and hard items", () => {
    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);
  });

  it("contains no HTML in lessons, questions, or overview", () => {
    expect(HTML_TAG.test(overview.bodyPlain)).toBe(false);
    for (const lesson of lessons) {
      expect(HTML_TAG.test(lesson.title)).toBe(false);
      expect(HTML_TAG.test(lesson.bodyPlain)).toBe(false);
      expect(lesson.bodyPlain.split("\n\n").length).toBeGreaterThanOrEqual(3);
    }
    for (const question of questions) {
      expect(HTML_TAG.test(question.prompt)).toBe(false);
      expect(HTML_TAG.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(HTML_TAG.test(choice.text)).toBe(false);
      }
    }
  });

  it("ships all five tools with known slugs", () => {
    expect(tools.map((tool) => tool.kind).sort()).toEqual(
      ["notes", "practice", "quiz", "readiness", "review"].sort(),
    );
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
});
