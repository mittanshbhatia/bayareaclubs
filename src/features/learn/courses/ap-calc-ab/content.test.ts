import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-calc-ab/content";
import {
  AP_CALC_AB_DISCIPLINE,
  AP_CALC_AB_FRAMEWORK_CODE,
  AP_CALC_AB_FRAMEWORK_YEAR,
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_OFFICIAL_UNITS,
  AP_CALC_AB_SOURCE_BASIS,
  AP_CALC_AB_STATUS,
  manifest,
  toCourseManifest,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import { OVERVIEW_PLAIN } from "@/features/learn/courses/ap-calc-ab/overview";
import { questions } from "@/features/learn/courses/ap-calc-ab/questions";
import { tools } from "@/features/learn/courses/ap-calc-ab/tools";

const HTML_RE = /<\/?[a-z][\s\S]*>/i;
const TOOL_KINDS = ["notes", "practice", "quiz", "readiness", "review"] as const;

function unique(values: readonly string[]) {
  return new Set(values).size === values.length;
}

describe("AP Calculus AB original course", () => {
  it("declares ORIGINAL status, 2019 framework, and mathematics discipline", () => {
    expect(AP_CALC_AB_NAMESPACE).toBe("ap-calc-ab");
    expect(AP_CALC_AB_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(AP_CALC_AB_STATUS).toBe("original_course");
    expect(manifest.frameworkCode).toBe("AP-CALC-AB");
    expect(AP_CALC_AB_FRAMEWORK_CODE).toBe("AP-CALC-AB");
    expect(manifest.frameworkYear).toBe(2019);
    expect(AP_CALC_AB_FRAMEWORK_YEAR).toBe(2019);
    expect(manifest.discipline).toBe("mathematics");
    expect(AP_CALC_AB_DISCIPLINE).toBe("mathematics");
  });

  it("ships every official unit", () => {
    expect(manifest.units.length).toBeGreaterThanOrEqual(8);
    expect(AP_CALC_AB_OFFICIAL_UNITS).toHaveLength(8);
    expect(manifest.units.map((unit) => unit.slug)).toEqual([...AP_CALC_AB_OFFICIAL_UNITS]);
  });

  it("maps to CourseManifest with discipline and unit lessons", () => {
    const mapped = toCourseManifest();
    expect(mapped.namespace).toBe("ap-calc-ab");
    expect(mapped.discipline).toBe("mathematics");
    expect(mapped.frameworkCode).toBe("AP-CALC-AB");
    expect(mapped.frameworkYear).toBe(2019);
    expect(mapped.units).toHaveLength(manifest.units.length);
    for (const unit of mapped.units) {
      expect(unit.slug).toBeTruthy();
      expect(unit.title).toBeTruthy();
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      for (const lesson of unit.lessons) {
        expect(lesson.slug).toBeTruthy();
        expect(lesson.title).toBeTruthy();
      }
    }
  });

  it("has unique slugs and at least two LoaderLesson-shaped lessons per unit", () => {
    const lessonSlugs = lessons.map((lesson) => lesson.slug);
    const unitSlugs = manifest.units.map((unit) => unit.slug);
    expect(unique(lessonSlugs)).toBe(true);
    expect(unique(unitSlugs)).toBe(true);
    expect(lessons.length).toBeGreaterThanOrEqual(16);

    for (const unit of manifest.units) {
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length).toBeGreaterThanOrEqual(2);
      for (const lesson of unitLessons) {
        expect(lesson.title).toBeTruthy();
        expect(lesson.position).toBeGreaterThan(0);
        expect(lesson.bodyPlain.length).toBeGreaterThan(200);
        expect(HTML_RE.test(lesson.bodyPlain)).toBe(false);
      }
    }
  });

  it("has at least 32 original MC items with four choices, valid answers, and no HTML", () => {
    expect(questions.length).toBeGreaterThanOrEqual(32);
    expect(unique(questions.map((question) => question.slug))).toBe(true);
    expect(questions.some((question) => question.difficulty === "easy")).toBe(true);
    expect(questions.some((question) => question.difficulty === "medium")).toBe(true);
    expect(questions.some((question) => question.difficulty === "hard")).toBe(true);

    const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));
    const counts = new Map<string, number>();

    for (const question of questions) {
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(unique(question.choices.map((choice) => choice.id))).toBe(true);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(true);
      expect(HTML_RE.test(question.prompt)).toBe(false);
      expect(HTML_RE.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(choice.text.length).toBeGreaterThan(0);
        expect(HTML_RE.test(choice.text)).toBe(false);
      }
      expect(question.objectiveCodes?.every((code) => /^[A-Z]+-\d+\.[A-Z]$/.test(code))).toBe(
        true,
      );
      if (question.lessonSlug) {
        const lesson = lessonBySlug.get(question.lessonSlug);
        expect(lesson).toBeTruthy();
        if (lesson) {
          counts.set(lesson.unitSlug, (counts.get(lesson.unitSlug) ?? 0) + 1);
        }
      }
    }

    for (const unit of manifest.units) {
      expect(counts.get(unit.slug) ?? 0).toBeGreaterThanOrEqual(4);
    }
  });

  it("ships all five tools with known slugs", () => {
    expect(tools).toHaveLength(5);
    expect([...tools.map((tool) => tool.kind)].sort()).toEqual([...TOOL_KINDS]);
    const questionSlugs = new Set(questions.map((question) => question.slug));
    const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
    for (const tool of tools) {
      expect(tool.slug).toBeTruthy();
      expect(tool.title).toBeTruthy();
      expect(tool.description.length).toBeGreaterThan(20);
      expect(HTML_RE.test(tool.description)).toBe(false);
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugs.has(slug)).toBe(true);
      }
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("keeps the overview as original plain text", () => {
    expect(OVERVIEW_PLAIN.length).toBeGreaterThan(200);
    expect(HTML_RE.test(OVERVIEW_PLAIN)).toBe(false);
    expect(OVERVIEW_PLAIN.includes("<")).toBe(false);
  });
});
