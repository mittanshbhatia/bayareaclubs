import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-csp/content";
import {
  AP_CSP_SOURCE_BASIS,
  OFFICIAL_UNIT_SLUGS,
  loadApCspCourse,
  manifest,
} from "@/features/learn/courses/ap-csp/manifest";
import { questions } from "@/features/learn/courses/ap-csp/questions";
import { tools } from "@/features/learn/courses/ap-csp/tools";

const HTML_MARK = /<[^>]+>/;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

describe("ap-csp original course", () => {
  it("declares ORIGINAL source basis and five official units", () => {
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(AP_CSP_SOURCE_BASIS).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(manifest.frameworkCode).toBe("AP-CSP");
    expect(manifest.frameworkYear).toBe(2020);
    expect(manifest.units.length).toBeGreaterThanOrEqual(5);
    expect(manifest.units.map((unit) => unit.slug)).toEqual([...OFFICIAL_UNIT_SLUGS]);
  });

  it("ships at least two lessons per unit with unique slugs and no HTML", () => {
    const lessonSlugs = lessons.map((lesson) => lesson.slug);
    expect(unique(lessonSlugs)).toHaveLength(lessonSlugs.length);

    for (const unit of manifest.units) {
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length, unit.slug).toBeGreaterThanOrEqual(2);
      expect(unit.lessons.length, unit.slug).toBeGreaterThanOrEqual(2);
    }

    for (const lesson of lessons) {
      expect(lesson.sourceBasis).toBe("ORIGINAL");
      expect(lesson.bodyPlain).toBeTruthy();
      expect(lesson.bodyPlain).not.toMatch(HTML_MARK);
      expect(lesson.title).not.toMatch(HTML_MARK);
    }
  });

  it("keeps four-choice original items with valid answers and no HTML", () => {
    expect(questions.length).toBeGreaterThanOrEqual(20);
    const slugs = questions.map((question) => question.slug);
    expect(unique(slugs)).toHaveLength(slugs.length);

    const difficulties = new Set(questions.map((question) => question.difficulty));
    expect(difficulties.has("easy")).toBe(true);
    expect(difficulties.has("medium")).toBe(true);
    expect(difficulties.has("hard")).toBe(true);

    for (const question of questions) {
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      expect(question.choices.map((choice) => choice.id)).toEqual(["a", "b", "c", "d"]);
      expect(question.choices.some((choice) => choice.id === question.answerId)).toBe(
        true,
      );
      expect(question.prompt).not.toMatch(HTML_MARK);
      expect(question.explanation).not.toMatch(HTML_MARK);
      for (const choice of question.choices) {
        expect(choice.text).not.toMatch(HTML_MARK);
      }
    }
  });

  it("covers each official unit with at least four original MC items", () => {
    const lessonUnit = new Map(lessons.map((lesson) => [lesson.slug, lesson.unitSlug]));

    for (const unitSlug of OFFICIAL_UNIT_SLUGS) {
      const attached = questions.filter((question) => {
        if (question.lessonSlug && lessonUnit.get(question.lessonSlug) === unitSlug) {
          return true;
        }
        const prefix = unitSlugPrefix(unitSlug);
        return question.objectiveCodes.some((code) => code.startsWith(prefix));
      });
      expect(attached.length, unitSlug).toBeGreaterThanOrEqual(4);
    }
  });

  it("exports all five tool kinds pointing at known slugs", () => {
    const kinds = tools.map((tool) => tool.kind).sort();
    expect(kinds).toEqual(["notes", "practice", "quiz", "readiness", "review"]);

    const lessonSlugs = new Set<string>(lessons.map((lesson) => lesson.slug));
    const questionSlugs = new Set<string>(questions.map((question) => question.slug));

    for (const tool of tools) {
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugs.has(slug), slug).toBe(true);
      }
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugs.has(slug), slug).toBe(true);
      }
    }
  });

  it("loadApCspCourse returns manifest, lessons, questions, and tools", async () => {
    const bundle = await loadApCspCourse();
    expect(bundle.manifest.namespace).toBe("ap-csp");
    expect(bundle.manifest.discipline).toBe("computer_science");
    expect(bundle.lessons?.length).toBe(lessons.length);
    expect(bundle.questions?.length).toBe(questions.length);
    expect(bundle.tools?.length).toBe(5);
  });
});

function unitSlugPrefix(unitSlug: (typeof OFFICIAL_UNIT_SLUGS)[number]): string {
  switch (unitSlug) {
    case "creative-development":
      return "CRD-";
    case "data":
      return "DAT-";
    case "algorithms-and-programming":
      return "AAP-";
    case "computing-systems-and-networks":
      return "CSN-";
    case "impact-of-computing":
      return "IOC-";
    default: {
      const _never: never = unitSlug;
      return _never;
    }
  }
}
