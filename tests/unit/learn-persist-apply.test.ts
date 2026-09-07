import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function loadLocalEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

describe("persist original AP catalog", () => {
  it("upserts shipping courses and original card art when asked", async () => {
    loadLocalEnv();
    if (process.env.PERSIST_AP_CATALOG !== "1" || !process.env.SUPABASE_SECRET_KEY) {
      expect(true).toBe(true);
      return;
    }
    const { persistShippingCatalog } = await import(
      "@/features/learn/persist-catalog"
    );
    const results = await persistShippingCatalog();
    expect(results.length).toBe(12);
    expect(results.every((row) => row.questions > 0 && row.lessons > 0)).toBe(true);
  }, 180_000);
});
