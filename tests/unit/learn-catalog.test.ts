import { describe, expect, it } from "vitest";

import {
  catalogCardProgressPercent,
  catalogInventory,
} from "@/features/learn/catalog-inventory";
import { catalogCoverObjectPath } from "@/features/learn/catalog-covers";
import {
  COURSE_CARD_MEASURE,
  ORIGINAL_CARD_NAMESPACES,
  SUBJECT_OVERLAY_NAMESPACES,
  courseCardSvgMarkup,
} from "@/features/learn/components/course-card-art";
import {
  AP_COURSE_REGISTRY,
  catalogFamilyFor,
  filterRegistryByFamily,
} from "@/features/learn/courses/registry";
import { toolHref } from "@/features/learn/tool-href";
import { catalogPageSchema } from "@/lib/validation/learn";

describe("AP catalog families and original card art", () => {
  it("groups namespaces into subject families", () => {
    expect(catalogFamilyFor("ap-csp")).toBe("cs");
    expect(catalogFamilyFor("ap-calc-bc")).toBe("math");
    expect(catalogFamilyFor("ap-bio")).toBe("science");
    expect(catalogFamilyFor("ap-psych")).toBe("social");
    expect(filterRegistryByFamily(AP_COURSE_REGISTRY, "cs").map((row) => row.namespace)).toEqual(
      ["ap-csp", "ap-csa"],
    );
  });

  it("accepts family query params and rejects unknown families", () => {
    expect(catalogPageSchema.parse({ family: "math" }).family).toBe("math");
    expect(catalogPageSchema.safeParse({ family: "stellar" }).success).toBe(false);
  });

  it("ships original card art for every registry namespace", () => {
    for (const entry of AP_COURSE_REGISTRY) {
      expect(ORIGINAL_CARD_NAMESPACES).toContain(entry.namespace);
      expect(SUBJECT_OVERLAY_NAMESPACES).toContain(entry.namespace);
    }
    expect(ORIGINAL_CARD_NAMESPACES).toHaveLength(AP_COURSE_REGISTRY.length);
    expect(SUBJECT_OVERLAY_NAMESPACES).toHaveLength(AP_COURSE_REGISTRY.length);
  });

  it("uses measured catalog card geometry for photo covers", () => {
    expect(COURSE_CARD_MEASURE.cssWidth).toBe(288);
    expect(COURSE_CARD_MEASURE.cssHeight).toBe(248);
    expect(COURSE_CARD_MEASURE.mediaCssWidth).toBe(248);
    expect(COURSE_CARD_MEASURE.mediaCssHeight).toBe(83);
    expect(COURSE_CARD_MEASURE.mediaAspectWidth / COURSE_CARD_MEASURE.mediaAspectHeight).toBe(3);
    expect(COURSE_CARD_MEASURE.artWidth).toBe(1152);
    expect(COURSE_CARD_MEASURE.artHeight).toBe(640);
    expect(COURSE_CARD_MEASURE.radiusPx).toBe(14);
    expect(COURSE_CARD_MEASURE.titlePx).toBe(16);
    expect(COURSE_CARD_MEASURE.bodyPx).toBe(14);
    expect(COURSE_CARD_MEASURE.chipHeightPx).toBe(40);
    expect(courseCardSvgMarkup("ap-csa")).toContain("1152");
    expect(courseCardSvgMarkup("ap-csa")).toContain("#f8fafc");
    expect(courseCardSvgMarkup("ap-csa")).not.toMatch(/stellar|unsplash/i);
    expect(catalogCoverObjectPath("ap-calc-ab")).toBe(
      "learn/ap-calc-ab/card-cover.jpg",
    );
  });

  it("counts units and lessons from original manifests only", () => {
    expect(catalogInventory("ap-csp").unitCount).toBe(5);
    expect(catalogInventory("ap-csp").moduleCount).toBeGreaterThanOrEqual(10);
    expect(catalogInventory("ap-physics-c-mech")).toEqual({
      unitCount: 0,
      moduleCount: 0,
    });
    expect(catalogCardProgressPercent({ attemptCount: 0, moduleCount: 10 })).toBe(0);
    expect(catalogCardProgressPercent({ attemptCount: 5, moduleCount: 10 })).toBe(50);
    expect(catalogCardProgressPercent({ attemptCount: 40, moduleCount: 10 })).toBe(100);
  });

  it("maps the five BayAreaClubs tools to working routes", () => {
    expect(toolHref("ap-csp", "practice")).toBe("/dashboard/learn/ap/ap-csp/practice");
    expect(toolHref("ap-csp", "quiz")).toBe("/dashboard/learn/ap/ap-csp/quiz");
    expect(toolHref("ap-csp", "review")).toBe("/dashboard/learn/ap/ap-csp/review");
    expect(toolHref("ap-csp", "notes")).toBe("/dashboard/learn/ap/ap-csp/notes");
    expect(toolHref("ap-csp", "readiness")).toBe("/dashboard/learn/ap/ap-csp/readiness");
  });
});
