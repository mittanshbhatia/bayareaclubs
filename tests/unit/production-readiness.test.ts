import { describe, expect, it } from "vitest";

import {
  escapePostgrestFilterValue,
  postgrestIlikeOr,
} from "@/lib/supabase/postgrest-filter";
import { isMimeAllowedForBucket } from "@/lib/validation/media";

describe("postgrest filter escaping", () => {
  it("neutralizes filter metacharacters", () => {
    const escaped = escapePostgrestFilterValue("a,b.or(id.eq.1)");
    expect(escaped).not.toContain(",");
    expect(escaped).not.toContain(".");
    expect(escapePostgrestFilterValue("100%_done")).toBe("100\\%\\_done");
  });

  it("builds safe ilike or fragments", () => {
    const filter = postgrestIlikeOr(["title", "category"], "robotics,evil");
    expect(filter).toBe("title.ilike.%robotics evil%,category.ilike.%robotics evil%");
  });

  it("returns null for empty search after escaping", () => {
    expect(postgrestIlikeOr(["title"], "   ")).toBeNull();
  });
});

describe("branding mime allowlist", () => {
  it("rejects SVG uploads", () => {
    expect(isMimeAllowedForBucket("club-branding", "image/svg+xml")).toBe(false);
    expect(isMimeAllowedForBucket("club-media", "image/svg+xml")).toBe(false);
    expect(isMimeAllowedForBucket("club-branding", "image/png")).toBe(true);
  });
});
