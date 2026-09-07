import { describe, expect, it } from "vitest";

import { lessons } from "@/features/learn/courses/ap-physics-1/content";
import {
  AP_PHYSICS_1_DISCIPLINE,
  AP_PHYSICS_1_FRAMEWORK_CODE,
  AP_PHYSICS_1_FRAMEWORK_YEAR,
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_OFFICIAL_UNITS,
  AP_PHYSICS_1_SOURCE_BASIS,
  AP_PHYSICS_1_STATUS,
  loadApPhysics1Course,
  manifest,
  toCourseManifest,
} from "@/features/learn/courses/ap-physics-1/manifest";
import { overview } from "@/features/learn/courses/ap-physics-1/overview";
import { questions } from "@/features/learn/courses/ap-physics-1/questions";
import { tools } from "@/features/learn/courses/ap-physics-1/tools";

const HTML_TAG = /<[^>]+>/;

describe("ap-physics-1 original course", () => {
  it("declares ORIGINAL source basis and the 2024 Physics 1 framework", () => {
    expect(AP_PHYSICS_1_NAMESPACE).toBe("ap-physics-1");
    expect(AP_PHYSICS_1_SOURCE_BASIS).toBe("ORIGINAL");
    expect(AP_PHYSICS_1_STATUS).toBe("original_course");
    expect(AP_PHYSICS_1_FRAMEWORK_CODE).toBe("AP-PHYS1");
    expect(AP_PHYSICS_1_FRAMEWORK_YEAR).toBe(2024);
    expect(AP_PHYSICS_1_DISCIPLINE).toBe("physics");
    expect(manifest.sourceBasis).toBe("ORIGINAL");
    expect(manifest.status).toBe("original_course");
    expect(overview.sourceBasis).toBe("ORIGINAL");
  });

  it("ships at least the eight official 2024 units", () => {
    expect(AP_PHYSICS_1_OFFICIAL_UNITS.length).toBeGreaterThanOrEqual(8);
    expect(manifest.units.length).toBeGreaterThanOrEqual(8);
    const shipped = manifest.units.map((unit) => unit.slug);
    for (const official of AP_PHYSICS_1_OFFICIAL_UNITS) {
      expect(shipped).toContain(official);
    }
  });

  it("includes at least two original lessons per official unit", () => {
    for (const unit of manifest.units) {
      expect(unit.lessons.length).toBeGreaterThanOrEqual(2);
      const unitLessons = lessons.filter((lesson) => lesson.unitSlug === unit.slug);
      expect(unitLessons.length).toBeGreaterThanOrEqual(2);
    }
    expect(lessons.length).toBeGreaterThanOrEqual(16);
  });

  it("keeps lesson slugs unique and free of HTML", () => {
    const slugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const lesson of lessons) {
      expect(lesson.sourceBasis).toBe("ORIGINAL");
      expect(HTML_TAG.test(lesson.title)).toBe(false);
      expect(HTML_TAG.test(lesson.bodyPlain)).toBe(false);
      expect(lesson.bodyPlain.split("\n\n").length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes at least 32 original multiple-choice items with four choices", () => {
    expect(questions.length).toBeGreaterThanOrEqual(32);
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

    const lessonSlugSet = new Set(lessons.map((lesson) => lesson.slug));
    for (const question of questions) {
      expect(question.sourceBasis).toBe("ORIGINAL");
      expect(question.questionType).toBe("multiple_choice");
      expect(question.choices).toHaveLength(4);
      const choiceIds = question.choices.map((choice) => choice.id);
      expect(new Set(choiceIds).size).toBe(4);
      expect(choiceIds).toContain(question.answerId);
      expect(HTML_TAG.test(question.prompt)).toBe(false);
      expect(HTML_TAG.test(question.explanation)).toBe(false);
      for (const choice of question.choices) {
        expect(HTML_TAG.test(choice.text)).toBe(false);
      }
      if (question.lessonSlug !== null) {
        expect(lessonSlugSet.has(question.lessonSlug)).toBe(true);
      }
    }
  });

  it("exports all five BayAreaClubs tool kinds", () => {
    const kinds = tools.map((tool) => tool.kind);
    expect(kinds).toEqual(
      expect.arrayContaining(["practice", "quiz", "review", "notes", "readiness"]),
    );
    expect(new Set(kinds).size).toBe(5);
    const questionSlugSet = new Set(questions.map((question) => question.slug));
    const lessonSlugSet = new Set(lessons.map((lesson) => lesson.slug));
    for (const tool of tools) {
      expect(tool.slug.length).toBeGreaterThan(0);
      expect(HTML_TAG.test(tool.title)).toBe(false);
      expect(HTML_TAG.test(tool.description)).toBe(false);
      for (const slug of tool.questionSlugs ?? []) {
        expect(questionSlugSet.has(slug)).toBe(true);
      }
      for (const slug of tool.lessonSlugs ?? []) {
        expect(lessonSlugSet.has(slug)).toBe(true);
      }
    }
  });

  it("loads a complete ORIGINAL bundle", async () => {
    const bundle = await loadApPhysics1Course();
    const courseManifest = toCourseManifest();
    expect(bundle.manifest.namespace).toBe(AP_PHYSICS_1_NAMESPACE);
    expect(bundle.manifest.discipline).toBe("physics");
    expect(bundle.manifest.units.length).toBe(courseManifest.units.length);
    expect(bundle.lessons?.length).toBe(lessons.length);
    expect(bundle.questions?.length).toBe(questions.length);
    expect(bundle.tools?.length).toBe(5);
    expect(HTML_TAG.test(overview.bodyPlain)).toBe(false);
  });
});
