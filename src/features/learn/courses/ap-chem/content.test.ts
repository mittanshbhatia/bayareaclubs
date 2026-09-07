import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-chem/content";
import {
  AP_CHEM_DISCIPLINE,
  AP_CHEM_FRAMEWORK_CODE,
  AP_CHEM_FRAMEWORK_YEAR,
  AP_CHEM_NAMESPACE,
  AP_CHEM_OFFICIAL_UNITS,
  AP_CHEM_SOURCE_BASIS,
  AP_CHEM_STATUS,
  loadApChemCourse,
  manifest,
} from "@/features/learn/courses/ap-chem/manifest";
import { OVERVIEW_PLAIN } from "@/features/learn/courses/ap-chem/overview";
import { questions } from "@/features/learn/courses/ap-chem/questions";
import { tools } from "@/features/learn/courses/ap-chem/tools";

const HTML_TAG =
  /<\s*\/?\s*(script|div|p|span|br|img|b|i|em|strong|a|html|body|ul|ol|li|h[1-6]|table)\b/i;

const UNIT_SLUGS = AP_CHEM_OFFICIAL_UNITS.map((unit) => unit.slug);

function unique(values: readonly string[]) {
  return new Set(values).size === values.length;
}

describe("ap-chem original course", () => {
  it("declares ORIGINAL source, 2019 AP-CHEM metadata, and original_course status", () => {
    expect(AP_CHEM_NAMESPACE).toBe("ap-chem");
    expect(AP_CHEM_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(AP_CHEM_STATUS).toBe("original_course");
    expect(manifest.status).toBe("original_course");
    expect(AP_CHEM_FRAMEWORK_CODE).toBe("AP-CHEM");
    expect(AP_CHEM_FRAMEWORK_YEAR).toBe(2019);
    expect(AP_CHEM_DISCIPLINE).toBe("chemistry");
    expect(manifest.discipline).toBe("chemistry");
  });

  it("ships all nine official units", () => {
    expect(AP_CHEM_OFFICIAL_UNITS.length).toBeGreaterThanOrEqual(9);
    expect(manifest.units.length).toBeGreaterThanOrEqual(9);
    expect(manifest.units.map((unit) => unit.slug)).toEqual(UNIT_SLUGS);
    expect(manifest.units.map((unit) => unit.title)).toEqual(
      AP_CHEM_OFFICIAL_UNITS.map((unit) => unit.title),
    );
  });

  it("ships at least 18 lessons with unique slugs and two per unit", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(18);
    expect(unique(lessons.map((lesson) => lesson.slug))).toBe(true);
    expect(unique(manifest.units.map((unit) => unit.slug))).toBe(true);
    for (const unit of UNIT_SLUGS) {
      expect(
        lessons.filter((lesson) => lesson.unitSlug === unit).length,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("ships at least 36 original multiple-choice items with unique slugs", () => {
    expect(questions.length).toBeGreaterThanOrEqual(36);
    expect(unique(questions.map((question) => question.slug))).toBe(true);
    expect(questions.every((question) => question.sourceBasis === "ORIGINAL")).toBe(
      true,
    );
    expect(
      questions.every((question) => question.questionType === "multiple_choice"),
    ).toBe(true);
  });

  it("keeps four choices and a valid answer on every item", () => {
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(unique(question.choices.map((choice) => choice.id))).toBe(true);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(
        true,
      );
      expect(question.objectiveCodes.length).toBeGreaterThan(0);
      for (const code of question.objectiveCodes) {
        expect(code).toMatch(/^(SAP|SPQ|ENE|TRA)-/);
      }
    }
  });

  it("includes easy, medium, and hard items and at least four questions per unit", () => {
    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    const unitByLesson = new Map(
      lessons.map((lesson) => [lesson.slug, lesson.unitSlug]),
    );
    for (const unit of UNIT_SLUGS) {
      const count = questions.filter((question) => {
        return (
          question.lessonSlug !== null &&
          unitByLesson.get(question.lessonSlug) === unit
        );
      }).length;
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });

  it("uses 3-6 plain-text paragraphs and no HTML in lesson or question copy", () => {
    for (const lesson of lessons) {
      const paragraphs = lesson.bodyPlain
        .split(/\n\n+/)
        .filter((part) => part.trim().length > 0);
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(paragraphs.length).toBeLessThanOrEqual(6);
      expect(HTML_TAG.test(lesson.bodyPlain)).toBe(false);
      expect(HTML_TAG.test(lesson.title)).toBe(false);
      expect(lesson.sourceBasis).toBe("ORIGINAL");
    }
    for (const question of questions) {
      expect(HTML_TAG.test(question.prompt)).toBe(false);
      expect(HTML_TAG.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(HTML_TAG.test(choice.text)).toBe(false);
      }
    }
    expect(HTML_TAG.test(OVERVIEW_PLAIN)).toBe(false);
    expect(OVERVIEW_PLAIN.trim().length).toBeGreaterThan(80);
  });

  it("exports the five BayAreaClubs tools with unique slugs", () => {
    expect(tools).toHaveLength(5);
    expect(tools.map((tool) => tool.kind)).toEqual([
      "practice",
      "quiz",
      "review",
      "notes",
      "readiness",
    ]);
    expect(unique(tools.map((tool) => tool.slug))).toBe(true);
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

  it("returns lessons, questions, and tools from loadApChemCourse", async () => {
    const bundle = await loadApChemCourse();
    expect(bundle.manifest.namespace).toBe("ap-chem");
    expect(bundle.manifest.discipline).toBe("chemistry");
    expect(bundle.manifest.units.length).toBeGreaterThanOrEqual(9);
    expect(bundle.lessons?.length).toBeGreaterThanOrEqual(18);
    expect(bundle.questions?.length).toBeGreaterThanOrEqual(36);
    expect(bundle.tools).toHaveLength(5);
  });

  it("uses an original 640 by 400 geometric card", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const svg = readFileSync(join(here, "card.tsx"), "utf8");
    expect(svg).toContain('viewBox="0 0 640 400"');
    expect(svg).toContain("CourseCardArt");
    expect(svg).toContain("#0f5c44");
    expect(svg).toContain("#086874");
    expect(svg).toContain("--course-accent");
    expect(svg).toContain("--primary");
    expect(svg).toContain("--accent");
    expect(svg).not.toMatch(/stellar|unsplash|collegeboard/i);
  });
});
