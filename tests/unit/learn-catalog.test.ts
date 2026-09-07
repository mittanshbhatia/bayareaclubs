import { describe, expect, it } from "vitest";

import { ORIGINAL_CARD_NAMESPACES } from "@/features/learn/components/course-card-art";
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
  });

  it("maps the five BayAreaClubs tools to working routes", () => {
    expect(toolHref("ap-csp", "practice")).toBe("/dashboard/learn/ap/ap-csp/practice");
    expect(toolHref("ap-csp", "quiz")).toBe("/dashboard/learn/ap/ap-csp/quiz");
    expect(toolHref("ap-csp", "review")).toBe("/dashboard/learn/ap/ap-csp/review");
    expect(toolHref("ap-csp", "notes")).toBe("/dashboard/learn/ap/ap-csp/notes");
    expect(toolHref("ap-csp", "readiness")).toBe("/dashboard/learn/ap/ap-csp/readiness");
  });
});
