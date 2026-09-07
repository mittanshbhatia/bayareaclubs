import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-envsci/content";
import {
  AP_ENVSCI_OFFICIAL_UNIT_SLUGS,
  AP_ENVSCI_SOURCE_BASIS,
  AP_ENVSCI_STATUS,
  loadApEnvsciCourse,
  manifest,
} from "@/features/learn/courses/ap-envsci/manifest";
import { overview } from "@/features/learn/courses/ap-envsci/overview";
import { questions } from "@/features/learn/courses/ap-envsci/questions";
import { tools } from "@/features/learn/courses/ap-envsci/tools";

const HTML_MARK = /<[^>]+>/;
const TOOL_KINDS = ["practice", "quiz", "review", "notes", "readiness"] as const;

function unique(values: readonly string[]) {
  return new Set(values).size === values.length;
}

describe("ap-envsci original course", () => {
  it("is ORIGINAL with the public 2019 framework identity", () => {
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(AP_ENVSCI_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(AP_ENVSCI_STATUS).toBe("original_course");
    expect(manifest.namespace).toBe("ap-envsci");
    expect(manifest.frameworkCode).toBe("AP-ENVS");
    expect(manifest.frameworkYear).toBe(2019);
    expect(manifest.discipline).toBe("earth_science");
    expect(overview.sourceBasis).toBe("ORIGINAL");
  });

  it("ships all nine official units", () => {
    expect(manifest.units.length).toBeGreaterThanOrEqual(9);
    expect(manifest.units.map((unit) => unit.slug)).toEqual([
      ...AP_ENVSCI_OFFICIAL_UNIT_SLUGS,
    ]);
  });

  it("has unique lesson and question slugs", () => {
    expect(unique(lessons.map((lesson) => lesson.slug))).toBe(true);
    expect(unique(questions.map((question) => question.slug))).toBe(true);
    expect(unique(manifest.units.map((unit) => unit.slug))).toBe(true);
  });

  it("has at least two original lessons per official unit", () => {
    for (const unit of manifest.units) {
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length).toBeGreaterThanOrEqual(2);
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      expect(unitLessons.map((lesson) => lesson.slug).sort()).toEqual(
        unit.lessons.map((lesson) => lesson.slug).sort(),
      );
    }
  });

  it("has at least 36 questions and four per unit", () => {
    expect(questions.length).toBeGreaterThanOrEqual(36);
    const lessonUnit = new Map(lessons.map((lesson) => [lesson.slug, lesson.unitSlug]));
    for (const unit of manifest.units) {
      const unitQuestions = questions.filter((question) => {
        return question.lessonSlug !== null && lessonUnit.get(question.lessonSlug) === unit.slug;
      });
      expect(unitQuestions.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps four choices, a valid answer, and mixed difficulty", () => {
    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    for (const question of questions) {
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(question.choices.map((choice) => choice.id)).toEqual(["a", "b", "c", "d"]);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(true);
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.objectiveCodes.length).toBeGreaterThan(0);
      expect(
        question.objectiveCodes.every((code) => /^(ERT|EIN|STB)-\d+\.[A-Z]$/.test(code)),
      ).toBe(true);
    }
  });

  it("rejects HTML in lessons, questions, and overview", () => {
    expect(HTML_MARK.test(overview.bodyPlain)).toBe(false);
    for (const lesson of lessons) {
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

  it("ships all five BayAreaClubs tools with live slugs", () => {
    expect(tools.map((tool) => tool.kind).sort()).toEqual([...TOOL_KINDS].sort());
    const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
    const questionSlugs = new Set(questions.map((question) => question.slug));
    for (const tool of tools) {
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugs.has(slug)).toBe(true);
      }
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("loads a complete original bundle", async () => {
    const bundle = await loadApEnvsciCourse();
    expect(bundle.manifest.namespace).toBe("ap-envsci");
    expect(bundle.manifest.discipline).toBe("earth_science");
    expect(bundle.lessons).toHaveLength(lessons.length);
    expect(bundle.questions?.length).toBeGreaterThanOrEqual(questions.length);
    expect(bundle.tools).toHaveLength(5);
  });
});
