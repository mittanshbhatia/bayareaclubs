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
  await expect(page.locator('a[href="/sign-in"]').first()).toHaveAttribute(
    "href",
    "/sign-in",
  );
  for (const school of [
    "Bellarmine College Preparatory",
    "BASIS Independent Silicon Valley",
    "The Harker School",
    "Homestead High School",
    "Cupertino High School",
  ]) {
    await expect(
      page.getByRole("link", {
        name: `Visit ${school} official website`,
      }),
    ).toBeAttached();
  }
  await expect(
    page.getByRole("heading", { name: "Participating schools" }),
  ).toHaveCount(0);
});

test("keeps the idea-to-club story in the natural page scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const story = page.locator("#idea-story");
  const geometry = await story.evaluate((section) => ({
    height: section.getBoundingClientRect().height,
    viewportHeight: window.innerHeight,
    innerPosition: window.getComputedStyle(section.firstElementChild as Element)
      .position,
  }));

  expect(geometry.innerPosition).not.toBe("sticky");
  expect(geometry.height).toBeLessThan(geometry.viewportHeight * 1.5);

  await page
    .getByRole("heading", { name: /Everything your club needs.*Connected/i })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", {
      name: /Everything your club needs.*Connected/i,
    }),
  ).toBeVisible();
});

test("reports liveness without exposing configuration", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    service: "bayareaclubs",
  });
});
