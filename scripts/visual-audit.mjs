/**
 * Visual QA capture script (local only). Outputs under tests/visual-output/.
 * Not a production asset. Do not commit large PNG/WebM dumps by default.
 *
 * Usage (with local Next on :3100):
 *   node scripts/visual-audit.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3100";
const OUT = join(process.cwd(), "tests/visual-output");
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const publicPages = [
  { name: "home", path: "/" },
  { name: "resources", path: "/resources" },
  { name: "signin", path: "/sign-in" },
  { name: "start-a-club-redirect", path: "/start-a-club" },
  { name: "dashboard-redirect", path: "/dashboard" },
  { name: "admin-redirect", path: "/admin" },
];

const browser = await chromium.launch({ headless: true });
const findings = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const route of publicPages) {
    const label = `${route.name}_${vp.name}`;
    try {
      await page.goto(`${BASE}${route.path}`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: join(OUT, `${label}.png`),
        fullPage: true,
      });
      findings.push({ label, ok: true });
    } catch (error) {
      findings.push({
        label,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Homepage scroll motion samples at 1440 only (and mobile)
  if (vp.name === "1440x900" || vp.name === "375x812") {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60_000 });
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    for (const pct of [0, 25, 50, 75, 100]) {
      const y = Math.floor(((scrollHeight - vp.height) * pct) / 100);
      await page.evaluate((top) => window.scrollTo(0, top), Math.max(0, y));
      await page.waitForTimeout(350);
      await page.screenshot({
        path: join(OUT, `home_scroll_${pct}_${vp.name}.png`),
        fullPage: false,
      });
    }

    // Interaction: open mobile menu when present
    if (vp.name === "375x812") {
      const menu = page.getByRole("button", { name: /open menu/i });
      if (await menu.isVisible().catch(() => false)) {
        await menu.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: join(OUT, `home_mobile_menu_${vp.name}.png`),
          fullPage: false,
        });
      }
    }

    // Reduced motion scroll sample
    await context.close();
    const rmContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60_000 });
    await rmPage.waitForTimeout(200);
    await rmPage.screenshot({
      path: join(OUT, `home_reduced_motion_${vp.name}.png`),
      fullPage: false,
    });
    await rmContext.close();
    continue;
  }

  await context.close();
}

// Homepage video capture (pacing / CLS) — not a production asset
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: join(OUT, "video"), size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60_000 });
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i <= 8; i += 1) {
    const y = Math.floor(((scrollHeight - 900) * i) / 8);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "smooth" }), Math.max(0, y));
    await page.waitForTimeout(450);
  }
  // Click workflow steps if present
  const steps = page.locator('[aria-label="Animated club launch workflow preview"] button');
  const count = await steps.count();
  for (let i = 0; i < Math.min(count, 3); i += 1) {
    await steps.nth(i).click();
    await page.waitForTimeout(500);
  }
  await context.close();
}

writeFileSync(join(OUT, "findings.json"), JSON.stringify(findings, null, 2));
console.log(`Wrote ${findings.length} captures to ${OUT}`);
const failed = findings.filter((f) => !f.ok);
if (failed.length) {
  console.error(failed);
  process.exitCode = 1;
}

await browser.close();
