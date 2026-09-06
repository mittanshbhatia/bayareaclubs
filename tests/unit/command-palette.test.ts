import { describe, expect, it } from "vitest";

import { commandPaletteQuerySchema } from "@/lib/validation/command-palette";

describe("command palette validation", () => {
  it("defaults empty query and bounded limit", () => {
    const parsed = commandPaletteQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.query).toBe("");
      expect(parsed.data.limit).toBe(24);
    }
  });

  it("rejects oversized queries", () => {
    expect(
      commandPaletteQuerySchema.safeParse({
        query: "x".repeat(121),
      }).success,
    ).toBe(false);
  });
});
