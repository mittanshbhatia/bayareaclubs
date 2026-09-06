import { describe, expect, it } from "vitest";

import { safeNextPath } from "@/lib/auth/safe-next-path";

describe("safeNextPath", () => {
  it("allows same-origin relative paths", () => {
    expect(safeNextPath("/admin")).toBe("/admin");
    expect(safeNextPath("/admin/insights")).toBe("/admin/insights");
  });

  it("rejects open redirects", () => {
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("/\\evil")).toBe("/dashboard");
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath(null)).toBe("/dashboard");
  });
});
