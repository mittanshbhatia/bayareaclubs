import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-precalc/content";
import {
  AP_PRECALC_DISCIPLINE,
  AP_PRECALC_FRAMEWORK_CODE,
  AP_PRECALC_FRAMEWORK_YEAR,
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_OFFICIAL_UNITS,
  AP_PRECALC_SOURCE_BASIS,
  AP_PRECALC_STATUS,
  loadApPrecalcCourse,
  manifest,
} from "@/features/learn/courses/ap-precalc/manifest";
import { overview } from "@/features/learn/courses/ap-precalc/overview";
import { questions } from "@/features/learn/courses/ap-precalc/questions";
import { tools } from "@/features/learn/courses/ap-precalc/tools";

const htmlLike = /<[^>]+>/;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

describe("ap-precalc original course", () => {
  it("is original BayAreaClubs material with the public 2023 framework", () => {
    expect(AP_PRECALC_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(AP_PRECALC_STATUS).toBe("original_course");
    expect(manifest.namespace).toBe("ap-precalc");
    expect(AP_PRECALC_NAMESPACE).toBe("ap-precalc");
    expect(manifest.frameworkCode).toBe("AP-PRECALC");
    expect(AP_PRECALC_FRAMEWORK_CODE).toBe("AP-PRECALC");
    expect(manifest.frameworkYear).toBe(2023);
    expect(AP_PRECALC_FRAMEWORK_YEAR).toBe(2023);
    expect(manifest.discipline).toBe("mathematics");
    expect(AP_PRECALC_DISCIPLINE).toBe("mathematics");
  });

  it("ships all four official units", () => {
    expect(AP_PRECALC_OFFICIAL_UNITS.length).toBeGreaterThanOrEqual(4);
    expect(manifest.units.length).toBeGreaterThanOrEqual(4);
    expect(manifest.units.map((unit) => unit.slug)).toEqual([
      ...AP_PRECALC_OFFICIAL_UNITS,
    ]);
  });

  it("has unique unit, lesson, question, and tool slugs", () => {
    const unitSlugs = manifest.units.map((unit) => unit.slug);
    const lessonSlugs = lessons.map((lesson) => lesson.slug);
    const questionSlugs = questions.map((question) => question.slug);
    const toolSlugs = tools.map((tool) => tool.slug);

    expect(unique(unitSlugs)).toEqual(unitSlugs);
    expect(unique(lessonSlugs)).toEqual(lessonSlugs);
    expect(unique(questionSlugs)).toEqual(questionSlugs);
    expect(unique(toolSlugs)).toEqual(toolSlugs);
  });

  it("includes at least two original lessons per official unit", () => {
    for (const unit of manifest.units) {
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length).toBeGreaterThanOrEqual(2);
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      expect(unitLessons.every((lesson) => lesson.sourceBasis === "ORIGINAL")).toBe(
        true,
      );
      expect(
        unitLessons.every(
          (lesson) => lesson.bodyPlain.split("\n\n").length >= 3,
        ),
      ).toBe(true);
    }
  });

  it("includes at least 16 questions and four per unit", () => {
    expect(questions.length).toBeGreaterThanOrEqual(16);

    const lessonUnit = new Map(lessons.map((lesson) => [lesson.slug, lesson.unitSlug]));
    for (const unit of manifest.units) {
      const unitQuestions = questions.filter(
        (question) => lessonUnit.get(question.lessonSlug) === unit.slug,
      );
      expect(unitQuestions.length).toBeGreaterThanOrEqual(4);
    }

    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);
  });

  it("uses four choices and a valid answer on every item", () => {
    for (const question of questions) {
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(unique(question.choices.map((choice) => choice.id))).toHaveLength(4);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(
        true,
      );
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(lessons.some((lesson) => lesson.slug === question.lessonSlug)).toBe(
        true,
      );
    }
  });

  it("keeps lesson and question prose free of HTML", () => {
    for (const lesson of lessons) {
      expect(htmlLike.test(lesson.bodyPlain)).toBe(false);
    }
    for (const question of questions) {
      expect(htmlLike.test(question.prompt)).toBe(false);
      expect(htmlLike.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(htmlLike.test(choice.text)).toBe(false);
      }
    }
    expect(htmlLike.test(overview.bodyPlain)).toBe(false);
  });

  it("exposes all five BayAreaClubs tools", () => {
    const kinds = tools.map((tool) => tool.kind).sort();
    expect(kinds).toEqual(["notes", "practice", "quiz", "readiness", "review"]);
    expect(tools).toHaveLength(5);
  });

  it("loads a complete original bundle", async () => {
    const bundle = await loadApPrecalcCourse();
    expect(bundle.manifest.namespace).toBe("ap-precalc");
    expect(bundle.manifest.discipline).toBe("mathematics");
    expect(bundle.lessons?.length).toBeGreaterThanOrEqual(8);
    expect(bundle.questions?.length).toBeGreaterThanOrEqual(16);
    expect(bundle.tools?.length).toBe(5);
  });
});
