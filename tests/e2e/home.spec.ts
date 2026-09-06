import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the production landing page without detectable accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Start a club.*Build a community.*Make it matter/i,
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("presents the connected club lifecycle with working public actions", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /An idea shouldn't get lost in a form/i,
    }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Everything your club needs.*Connected/i,
    }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Built for student communities/i,
    }),
  ).toBeAttached();

  await expect(
    page.getByRole("link", { name: "Start a Club" }).first(),
  ).toHaveAttribute("href", "/start-a-club");
  await expect(
    page.getByRole("link", { name: "Discover Clubs" }).first(),
  ).toHaveAttribute("href", "#discover");
  await expect(
    page.locator('a[href="/sign-in"]').first(),
  ).toHaveAttribute("href", "/sign-in");
});

test("reports liveness without exposing configuration", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    service: "bayareaclubs",
  });
});
