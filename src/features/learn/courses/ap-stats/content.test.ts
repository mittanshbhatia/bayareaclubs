import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-stats/content";
import {
  AP_STATS_OFFICIAL_UNITS,
  AP_STATS_SOURCE_BASIS,
  AP_STATS_STATUS,
  loadApStatsCourse,
  manifest,
} from "@/features/learn/courses/ap-stats/manifest";
import { overview } from "@/features/learn/courses/ap-stats/overview";
import { questions } from "@/features/learn/courses/ap-stats/questions";
import { tools } from "@/features/learn/courses/ap-stats/tools";

const HTML_MARK = /<\/?[a-z][\s\S]*>/i;
const CED_CODE = /^(VAR|UNC|DAT|PRO)-\d+\.[A-Z]$/;

describe("ap-stats original course", () => {
  it("is ORIGINAL with original_course status", () => {
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(AP_STATS_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(AP_STATS_STATUS).toBe("original_course");
    expect(overview.sourceBasis).toBe("ORIGINAL");
    expect(manifest.namespace).toBe("ap-stats");
    expect(manifest.frameworkCode).toBe("AP-STAT");
    expect(manifest.frameworkYear).toBe(2019);
    expect(manifest.discipline).toBe("mathematics");
  });

  it("ships all nine official units", () => {
    expect(AP_STATS_OFFICIAL_UNITS.length).toBeGreaterThanOrEqual(9);
    expect(manifest.units.length).toBeGreaterThanOrEqual(9);
    const shipped = manifest.units.map((unit) => unit.slug);
    for (const official of AP_STATS_OFFICIAL_UNITS) {
      expect(shipped).toContain(official.slug);
    }
  });

  it("has unique unit and lesson slugs and at least two lessons per unit", () => {
    const unitSlugs = manifest.units.map((unit) => unit.slug);
    expect(new Set(unitSlugs).size).toBe(unitSlugs.length);

    const lessonSlugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(lessonSlugs).size).toBe(lessonSlugs.length);
    expect(lessons.length).toBeGreaterThanOrEqual(18);

    for (const unit of manifest.units) {
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length).toBeGreaterThanOrEqual(2);
      for (const listed of unit.lessons) {
        expect(lessonSlugs).toContain(listed.slug);
      }
    }
  });

  it("uses original plain-text lessons without HTML", () => {
    expect(overview.bodyPlain.length).toBeGreaterThan(120);
    expect(overview.bodyPlain).not.toMatch(HTML_MARK);

    for (const lesson of lessons) {
      expect(lesson.sourceBasis).toBe("ORIGINAL");
      expect(lesson.bodyPlain.split("\n\n").length).toBeGreaterThanOrEqual(3);
      expect(lesson.bodyPlain).not.toMatch(HTML_MARK);
      expect(lesson.objectiveCodes.length).toBeGreaterThan(0);
      for (const code of lesson.objectiveCodes) {
        expect(code).toMatch(CED_CODE);
      }
    }
  });

  it("has at least 36 original multiple-choice questions with four choices", () => {
    expect(questions.length).toBeGreaterThanOrEqual(36);
    const slugs = questions.map((question) => question.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    for (const unit of manifest.units) {
      const lessonSlugs = new Set<string>(unit.lessons.map((lesson) => lesson.slug));
      const unitQuestions = questions.filter(
        (question) => question.lessonSlug !== null && lessonSlugs.has(question.lessonSlug),
      );
      expect(unitQuestions.length).toBeGreaterThanOrEqual(4);
    }

    for (const question of questions) {
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      const ids = question.choices.map((choice) => choice.id);
      expect(new Set(ids).size).toBe(4);
      expect(ids).toContain(question.answerId);
      expect(question.prompt).not.toMatch(HTML_MARK);
      expect(question.explanation).not.toMatch(HTML_MARK);
      for (const choice of question.choices) {
        expect(choice.text).not.toMatch(HTML_MARK);
      }
      expect(question.objectiveCodes.length).toBeGreaterThan(0);
      for (const code of question.objectiveCodes) {
        expect(code).toMatch(CED_CODE);
      }
    }
  });

  it("exports all five tool kinds with known slugs", () => {
    const kinds = tools.map((tool) => tool.kind);
    expect(kinds).toEqual(
      expect.arrayContaining(["practice", "quiz", "review", "notes", "readiness"]),
    );
    expect(new Set(kinds).size).toBe(5);

    const questionSlugs = new Set<string>(questions.map((question) => question.slug));
    const lessonSlugs = new Set<string>(lessons.map((lesson) => lesson.slug));

    for (const tool of tools) {
      expect(tool.title.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(20);
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugs.has(slug)).toBe(true);
      }
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("loadApStatsCourse returns manifest, lessons, questions, and tools", async () => {
    const bundle = await loadApStatsCourse();
    expect(bundle.manifest.namespace).toBe("ap-stats");
    expect(bundle.manifest.discipline).toBe("mathematics");
    expect(bundle.lessons?.length).toBe(lessons.length);
    expect(bundle.questions?.length).toBe(questions.length);
    expect(bundle.tools?.length).toBe(5);
  });
});
