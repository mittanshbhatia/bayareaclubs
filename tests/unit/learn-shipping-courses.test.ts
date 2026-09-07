import { describe, expect, it } from "vitest";

import { listRegisteredCourseNamespaces } from "@/features/learn/courses/loader";
import { listShippingNamespaces } from "@/features/learn/courses/registry";
import { loadCourseNamespace } from "@/features/learn/courses/loader";

const OFFICIAL_UNITS: Record<string, number> = {
  "ap-csp": 5,
  "ap-csa": 4,
  "ap-calc-ab": 8,
  "ap-calc-bc": 10,
  "ap-stats": 9,
  "ap-precalc": 4,
  "ap-physics-1": 8,
  "ap-physics-2": 7,
  "ap-chem": 9,
  "ap-bio": 8,
  "ap-envsci": 9,
  "ap-psych": 5,
};

describe("shipping AP course loaders", () => {
  it("registers a loader for every shipping namespace", () => {
    expect(listRegisteredCourseNamespaces()).toEqual(
      listShippingNamespaces().toSorted(),
    );
  });

  it.each(Object.entries(OFFICIAL_UNITS))(
    "%s ships official units, original questions, and five tools",
    async (namespace, officialUnits) => {
      const bundle = await loadCourseNamespace(namespace);
      expect(bundle).not.toBeNull();
      if (!bundle) return;
      expect(bundle.manifest.units.length).toBeGreaterThanOrEqual(officialUnits);
      expect(bundle.lessons?.length ?? 0).toBeGreaterThanOrEqual(officialUnits * 2);
      expect(bundle.questions?.length ?? 0).toBeGreaterThanOrEqual(officialUnits * 4);
      expect(bundle.questions?.every((question) => question.prompt.length > 0)).toBe(true);
      const kinds = new Set((bundle.tools ?? []).map((tool) => tool.kind));
      expect([...kinds].sort()).toEqual([
        "notes",
        "practice",
        "quiz",
        "readiness",
        "review",
      ]);
    },
  );
});
