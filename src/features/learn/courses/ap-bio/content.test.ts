import { describe, expect, it } from "vitest";

import { ApBioCourseCard } from "@/features/learn/courses/ap-bio/card";
import { lessons } from "@/features/learn/courses/ap-bio/content";
import {
  AP_BIO_FRAMEWORK_CODE,
  AP_BIO_FRAMEWORK_YEAR,
  AP_BIO_NAMESPACE,
  AP_BIO_OFFICIAL_UNITS,
  AP_BIO_SOURCE_BASIS,
  AP_BIO_STATUS,
  loadApBioCourse,
  manifest,
  toCourseManifest,
} from "@/features/learn/courses/ap-bio/manifest";
import { AP_BIO_OVERVIEW } from "@/features/learn/courses/ap-bio/overview";
import { questions } from "@/features/learn/courses/ap-bio/questions";
import { tools } from "@/features/learn/courses/ap-bio/tools";

const HTML_MARK = /<[^>]+>/;
const OBJECTIVE = /^(IST|ENE|EVO|SYI)-\d+[A-Z]?(\.[A-Z])?$/;

function lessonSlugsForUnit(unitSlug: string) {
  return lessons.filter((lesson) => lesson.unitSlug === unitSlug).map((lesson) => lesson.slug);
}

describe("ap-bio original course", () => {
  it("is ORIGINAL AP-BIO 2020 with original_course status", () => {
    expect(AP_BIO_NAMESPACE).toBe("ap-bio");
    expect(AP_BIO_FRAMEWORK_CODE).toBe("AP-BIO");
    expect(AP_BIO_FRAMEWORK_YEAR).toBe(2020);
    expect(AP_BIO_SOURCE_BASIS).toBe("ORIGINAL");
    expect(AP_BIO_STATUS).toBe("original_course");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(manifest.discipline).toBe("biology");
    expect(toCourseManifest().discipline).toBe("biology");
  });

  it("ships all eight official units", () => {
    expect(AP_BIO_OFFICIAL_UNITS.length).toBeGreaterThanOrEqual(8);
    expect(manifest.units.length).toBeGreaterThanOrEqual(8);
    expect(manifest.units.map((unit) => unit.slug)).toEqual([...AP_BIO_OFFICIAL_UNITS]);
  });

  it("has unique unit and lesson slugs and at least two lessons per unit", () => {
    const unitSlugs = manifest.units.map((unit) => unit.slug);
    expect(new Set(unitSlugs).size).toBe(unitSlugs.length);

    const lessonSlugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(lessonSlugs).size).toBe(lessonSlugs.length);
    expect(lessons.length).toBeGreaterThanOrEqual(16);

    for (const unit of manifest.units) {
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      const bodies = lessonSlugsForUnit(unit.slug);
      expect(bodies.length).toBeGreaterThanOrEqual(2);
      expect(bodies).toEqual(unit.lessons.map((lesson) => lesson.slug));
    }
  });

  it("writes real plain-text lessons without HTML", () => {
    for (const lesson of lessons) {
      expect(lesson.sourceBasis).toBe("ORIGINAL");
      expect(lesson.bodyPlain.length).toBeGreaterThan(400);
      expect(lesson.bodyPlain.split("\n\n").length).toBeGreaterThanOrEqual(3);
      expect(lesson.bodyPlain).not.toMatch(HTML_MARK);
      expect(lesson.title).not.toMatch(HTML_MARK);
      for (const code of lesson.objectiveCodes) {
        expect(code).toMatch(OBJECTIVE);
      }
    }
  });

  it("includes at least 32 original four-choice items with valid answers", () => {
    expect(questions.length).toBeGreaterThanOrEqual(32);
    const slugs = questions.map((question) => question.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    const questionsByUnit = new Map<string, number>();
    for (const question of questions) {
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(question.choices.map((choice) => choice.id).sort()).toEqual(["a", "b", "c", "d"]);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(true);
      expect(question.prompt).not.toMatch(HTML_MARK);
      expect(question.explanation).not.toMatch(HTML_MARK);
      for (const choice of question.choices) {
        expect(choice.text).not.toMatch(HTML_MARK);
      }
      for (const code of question.objectiveCodes) {
        expect(code).toMatch(OBJECTIVE);
      }
      const lesson = lessons.find((row) => row.slug === question.lessonSlug);
      expect(lesson).toBeDefined();
      if (lesson) {
        questionsByUnit.set(lesson.unitSlug, (questionsByUnit.get(lesson.unitSlug) ?? 0) + 1);
      }
    }

    for (const unitSlug of AP_BIO_OFFICIAL_UNITS) {
      expect(questionsByUnit.get(unitSlug) ?? 0).toBeGreaterThanOrEqual(4);
    }
  });

  it("exports all five tool kinds with known slugs", () => {
    expect(tools.map((tool) => tool.kind).sort()).toEqual([
      "notes",
      "practice",
      "quiz",
      "readiness",
      "review",
    ]);
    const questionSlugSet = new Set(questions.map((question) => question.slug));
    const lessonSlugSet = new Set(lessons.map((lesson) => lesson.slug));
    for (const tool of tools) {
      expect(tool.title.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.description).not.toMatch(HTML_MARK);
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugSet.has(slug)).toBe(true);
      }
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugSet.has(slug)).toBe(true);
      }
    }
  });

  it("loads a complete bundle and keeps overview and card original", () => {
    expect(AP_BIO_OVERVIEW).not.toMatch(HTML_MARK);
    expect(AP_BIO_OVERVIEW.toLowerCase()).toContain("original");
    expect(typeof ApBioCourseCard).toBe("function");
    return loadApBioCourse().then((bundle) => {
      expect(bundle.manifest.namespace).toBe("ap-bio");
      expect(bundle.manifest.units.length).toBeGreaterThanOrEqual(8);
      expect(bundle.lessons?.length).toBeGreaterThanOrEqual(16);
      expect(bundle.questions?.length).toBeGreaterThanOrEqual(32);
      expect(bundle.tools?.length).toBe(5);
    });
  });
});
