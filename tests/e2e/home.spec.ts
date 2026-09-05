import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the production landing page without detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Give every great club a path from idea to impact.",
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("reports liveness without exposing configuration", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    service: "bayareaclubs",
  });
});
