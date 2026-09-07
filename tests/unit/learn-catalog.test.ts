import { describe, expect, it } from "vitest";

import {
  COURSE_CARD_MEASURE,
  ORIGINAL_CARD_NAMESPACES,
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
    }
    expect(ORIGINAL_CARD_NAMESPACES).toHaveLength(AP_COURSE_REGISTRY.length);
  });

  it("uses measured catalog card geometry at 2× art density", () => {
    expect(COURSE_CARD_MEASURE.cssWidth).toBe(288);
    expect(COURSE_CARD_MEASURE.cssHeight).toBe(242);
    expect(COURSE_CARD_MEASURE.mediaCssWidth).toBe(254);
    expect(COURSE_CARD_MEASURE.mediaCssHeight).toBe(80);
    expect(COURSE_CARD_MEASURE.artWidth).toBe(592);
    expect(COURSE_CARD_MEASURE.artHeight).toBe(224);
    expect(COURSE_CARD_MEASURE.radiusPx).toBe(12);
    expect(COURSE_CARD_MEASURE.titlePx).toBe(12);
    expect(COURSE_CARD_MEASURE.bodyPx).toBe(12);
    expect(COURSE_CARD_MEASURE.chipHeightPx).toBe(40);
    expect(courseCardSvgMarkup("ap-csa")).toContain("592");
    expect(courseCardSvgMarkup("ap-csa")).toContain("#0f5c44");
    expect(courseCardSvgMarkup("ap-csa")).not.toMatch(/stellar|unsplash/i);
  });

  it("maps the five BayAreaClubs tools to working routes", () => {
    expect(toolHref("ap-csp", "practice")).toBe("/dashboard/learn/ap/ap-csp/practice");
    expect(toolHref("ap-csp", "quiz")).toBe("/dashboard/learn/ap/ap-csp/quiz");
    expect(toolHref("ap-csp", "review")).toBe("/dashboard/learn/ap/ap-csp/review");
    expect(toolHref("ap-csp", "notes")).toBe("/dashboard/learn/ap/ap-csp/notes");
    expect(toolHref("ap-csp", "readiness")).toBe("/dashboard/learn/ap/ap-csp/readiness");
  });
});
