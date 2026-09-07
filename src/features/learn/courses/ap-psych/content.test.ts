import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-psych/content";
import {
  AP_PSYCH_OFFICIAL_UNITS,
  AP_PSYCH_SOURCE_BASIS,
  AP_PSYCH_STATUS,
  manifest,
} from "@/features/learn/courses/ap-psych/manifest";
import { overview } from "@/features/learn/courses/ap-psych/overview";
import { questions } from "@/features/learn/courses/ap-psych/questions";
import { AP_PSYCH_TOOL_KINDS, tools } from "@/features/learn/courses/ap-psych/tools";

const HTML_MARK = /<[a-zA-Z/]|<\/|&lt;|&gt;/;

function lessonUnit(slug: string) {
  const lesson = lessons.find((row) => row.slug === slug);
  return lesson?.unitSlug ?? null;
}

describe("ap-psych course content", () => {
  it("is ORIGINAL with original_course status", () => {
    expect(AP_PSYCH_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(AP_PSYCH_STATUS).toBe("original_course");
    expect(manifest.status).toBe("original_course");
    expect(manifest.frameworkCode).toBe("AP-PSYCH");
    expect(manifest.frameworkYear).toBe(2024);
    expect(manifest.discipline).toBe("other");
    expect(manifest.namespace).toBe("ap-psych");
  });

  it("ships at least the five official 2024 units", () => {
    expect(manifest.units.length).toBeGreaterThanOrEqual(5);
    expect(AP_PSYCH_OFFICIAL_UNITS).toHaveLength(5);
    const slugs = manifest.units.map((unit) => unit.slug);
    for (const official of AP_PSYCH_OFFICIAL_UNITS) {
      expect(slugs).toContain(official);
    }
  });

  it("has at least two lessons per official unit", () => {
    for (const unit of manifest.units) {
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      const bodies = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(bodies.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps unit, lesson, and question slugs unique", () => {
    const unitSlugs = manifest.units.map((unit) => unit.slug);
    expect(new Set(unitSlugs).size).toBe(unitSlugs.length);

    const lessonSlugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(lessonSlugs).size).toBe(lessonSlugs.length);
    expect(lessonSlugs).toEqual(
      manifest.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.slug)),
    );

    const questionSlugs = questions.map((question) => question.slug);
    expect(new Set(questionSlugs).size).toBe(questionSlugs.length);
  });

  it("ships at least twenty original multiple-choice items with four choices", () => {
    expect(questions.length).toBeGreaterThanOrEqual(20);
    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    for (const question of questions) {
      expect(question.questionType).toBe("multiple_choice");
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.choices).toHaveLength(4);
      const ids = question.choices.map((choice) => choice.id);
      expect(ids).toEqual(["a", "b", "c", "d"]);
      expect(ids).toContain(question.answerId);
      expect(question.prompt.length).toBeGreaterThan(20);
      expect(question.explanation.length).toBeGreaterThan(20);
    }
  });

  it("has at least four questions tied to each official unit", () => {
    for (const unit of manifest.units) {
      const unitQuestions = questions.filter((question) => {
        if (!question.lessonSlug) return false;
        return lessonUnit(question.lessonSlug) === unit.slug;
      });
      expect(unitQuestions.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("uses plain text with no HTML in lessons, questions, and overview", () => {
    expect(HTML_MARK.test(overview)).toBe(false);
    for (const lesson of lessons) {
      expect(lesson.sourceBasis).toBe("ORIGINAL");
      expect(HTML_MARK.test(lesson.title)).toBe(false);
      expect(HTML_MARK.test(lesson.bodyPlain)).toBe(false);
      expect(lesson.bodyPlain.split("\n\n").length).toBeGreaterThanOrEqual(3);
    }
    for (const question of questions) {
      expect(HTML_MARK.test(question.prompt)).toBe(false);
      expect(HTML_MARK.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(HTML_MARK.test(choice.text)).toBe(false);
      }
    }
  });

  it("includes all five BayAreaClubs tools", () => {
    const kinds = tools.map((tool) => tool.kind);
    expect(kinds).toEqual([...AP_PSYCH_TOOL_KINDS]);
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(5);
    for (const tool of tools) {
      expect(tool.title.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(20);
    }
    const questionSlugSet = new Set(questions.map((question) => question.slug));
    const lessonSlugSet = new Set(lessons.map((lesson) => lesson.slug));
    for (const tool of tools) {
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugSet.has(slug)).toBe(true);
      }
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugSet.has(slug)).toBe(true);
      }
    }
  });
});
