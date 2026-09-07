import { describe, expect, it } from "vitest";

import {
  COURSE_HOME_SECTIONS,
  COURSE_TOOLS_INVENTORY,
  FEATURED_NAMESPACES,
  LEARN_HUB_SECTIONS,
  availableCatalogEntries,
  continueLesson,
  courseProgress,
  featuredRegistryEntries,
  groupedAvailableCatalog,
  recentResults,
  weakAreas,
} from "@/features/learn/catalog-model";
import { AP_COURSE_REGISTRY } from "@/features/learn/courses/registry";

describe("learn hub and course workspace model", () => {
  it("keeps catalog section types and featured originals", () => {
    expect(LEARN_HUB_SECTIONS).toEqual(["filters", "progress", "featured", "families"]);
    expect(COURSE_HOME_SECTIONS).toEqual([
      "header",
      "progress",
      "continue",
      "practice",
      "unit-map",
      "weak-areas",
      "recent-results",
      "tools",
    ]);
    expect(COURSE_TOOLS_INVENTORY).toEqual([
      "practice",
      "quiz",
      "review",
      "notes",
      "readiness",
    ]);
    expect(FEATURED_NAMESPACES).toEqual(["ap-csa", "ap-calc-bc", "ap-bio"]);
    expect(featuredRegistryEntries().map((row) => row.namespace)).toEqual([
      ...FEATURED_NAMESPACES,
    ]);
  });

  it("lists shipping courses without planned Physics C titles", () => {
    const available = availableCatalogEntries(AP_COURSE_REGISTRY, "all");
    expect(available.every((entry) => entry.status !== "planned")).toBe(true);
    expect(available.map((entry) => entry.namespace)).not.toContain("ap-physics-c-mech");
    expect(availableCatalogEntries(AP_COURSE_REGISTRY, "cs").map((row) => row.namespace)).toEqual(
      ["ap-csp", "ap-csa"],
    );
    expect(groupedAvailableCatalog(AP_COURSE_REGISTRY, "all").map((row) => row.family)).toEqual([
      "cs",
      "math",
      "science",
      "social",
    ]);
    expect(
      groupedAvailableCatalog(AP_COURSE_REGISTRY, "math").flatMap((group) =>
        group.entries.map((entry) => entry.namespace),
      ),
    ).toEqual(["ap-calc-ab", "ap-calc-bc", "ap-stats", "ap-precalc"]);
  });

  it("continues into the first untouched lesson", () => {
    const next = continueLesson({
      namespace: "ap-csa",
      units: [
        { id: "u1", slug: "using-objects-and-methods", title: "Using Objects and Methods" },
      ],
      lessons: [
        { id: "l1", slug: "primitive-values-and-expressions", title: "Primitives", moduleId: "u1" },
        { id: "l2", slug: "objects-methods-and-control", title: "Objects", moduleId: "u1" },
      ],
      questions: [
        { id: "q1", slug: "one", lessonId: "l1", prompt: "A" },
        { id: "q2", slug: "two", lessonId: "l2", prompt: "B" },
      ],
      attempts: [{ questionId: "q1", isCorrect: true, createdAt: "2026-09-06T00:00:00Z" }],
    });
    expect(next.href).toBe(
      "/dashboard/learn/ap/ap-csa/using-objects-and-methods/objects-methods-and-control",
    );
    expect(next.title).toBe("Objects");
  });

  it("computes progress, weak units, and recent results from attempts", () => {
    const progress = courseProgress({
      lessons: [{ id: "l1", slug: "a", title: "A", moduleId: "u1" }],
      questions: [
        { id: "q1", slug: "one", lessonId: "l1", prompt: "A" },
        { id: "q2", slug: "two", lessonId: "l1", prompt: "B" },
      ],
      attempts: [
        { questionId: "q1", isCorrect: true, createdAt: "2026-09-06T01:00:00Z" },
        { questionId: "q2", isCorrect: false, createdAt: "2026-09-06T02:00:00Z" },
      ],
    });
    expect(progress.questionsCorrect).toBe(1);
    expect(progress.percent).toBe(50);

    const weak = weakAreas({
      namespace: "ap-csa",
      units: [{ id: "u1", slug: "using-objects-and-methods", title: "Using Objects" }],
      lessons: [{ id: "l1", slug: "a", title: "A", moduleId: "u1" }],
      questions: [
        { id: "q1", slug: "one", lessonId: "l1", prompt: "A" },
        { id: "q2", slug: "two", lessonId: "l1", prompt: "B" },
      ],
      attempts: [
        { questionId: "q1", isCorrect: false, createdAt: "2026-09-06T01:00:00Z" },
        { questionId: "q2", isCorrect: false, createdAt: "2026-09-06T02:00:00Z" },
      ],
    });
    expect(weak[0]?.title).toBe("Using Objects");
    expect(weak[0]?.href).toBe("/dashboard/learn/ap/ap-csa/using-objects-and-methods");

    const recent = recentResults({
      questions: [{ id: "q2", slug: "two", lessonId: "l1", prompt: "Trace the leftover seats." }],
      attempts: [{ questionId: "q2", isCorrect: false, createdAt: "2026-09-06T02:00:00Z" }],
    });
    expect(recent[0]?.prompt).toContain("leftover seats");
    expect(recent[0]?.isCorrect).toBe(false);
  });
});
