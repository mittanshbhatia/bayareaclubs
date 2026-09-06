import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "tests/visual-output");

test.beforeAll(() => {
  fs.mkdirSync(outputDir, { recursive: true });
});

test.describe("marketing homepage visuals", () => {
  test("desktop homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /BayAreaClubs/i }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(outputDir, "homepage-desktop.png"),
      fullPage: true,
    });
  });

  test("tablet homepage", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /BayAreaClubs/i }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(outputDir, "homepage-tablet.png"),
      fullPage: true,
    });
  });

  test("mobile homepage", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Start a Club" }).first()).toBeVisible();
    await page.screenshot({
      path: path.join(outputDir, "homepage-mobile.png"),
      fullPage: true,
    });
  });
});
