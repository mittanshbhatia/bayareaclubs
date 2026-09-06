import { describe, expect, it } from "vitest";

import {
  chartCssVars,
  chartSeriesKeys,
  containerWidths,
  designSystemMeta,
  motionDurations,
  zIndex,
} from "@/lib/design-tokens";

describe("design-tokens", () => {
  it("exposes Design System v1 metadata", () => {
    expect(designSystemMeta.name).toBe("BayAreaClubs Design System");
    expect(designSystemMeta.version).toBe("1.0.0");
    expect(designSystemMeta.codename).toBe("Peninsula");
  });

  it("mirrors motion, containers, z-index, and chart series", () => {
    expect(motionDurations.fast).toBe(120);
    expect(motionDurations.base).toBe(200);
    expect(motionDurations.slow).toBe(320);
    expect(containerWidths.page).toBe("72rem");
    expect(zIndex.modal).toBe(70);
    expect(chartSeriesKeys).toHaveLength(6);
    expect(chartCssVars["chart-1"]).toBe("var(--chart-1)");
  });
});
