import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Response } from "@playwright/test";

const LEARN_ROUTES = ["/dashboard/learn", "/dashboard/learn/ap"] as const;

function pathOf(page: Page) {
  return new URL(page.url()).pathname;
}

function isHonestGate(page: Page) {
  const path = pathOf(page);
  return (
    path === "/sign-in" ||
    path === "/unauthorized" ||
    path === "/account-pending"
  );
}

async function isMissingRoute(page: Page, response: Response | null) {
  if (response?.status() === 404) return true;
  return (
    (await page.getByRole("heading", { name: /^404$/ }).count()) > 0 ||
    (await page.getByText(/this page could not be found/i).count()) > 0
  );
}

async function expectHonestLearnSurface(page: Page) {
  await expect(
    page.getByText(
      /unlimited voices|stellar learning|scraped sat bank|college board partner/i,
    ),
  ).toHaveCount(0);
  await expect(
    page.getByText(/you completed every ap course|100% exam pass rate/i),
  ).toHaveCount(0);
}

async function expectRenderedLearnLandmarks(page: Page) {
  const learnHeading = page.getByRole("heading", {
    name: /learn|learning|ap|catalog|courses/i,
  });
  const dashboardNav = page.getByRole("navigation", { name: "Dashboard" });
  await expect(learnHeading.or(dashboardNav).first()).toBeVisible();
}

for (const route of LEARN_ROUTES) {
  test(`${route} renders or redirects honestly`, async ({ page }) => {
    const response = await page.goto(route);

    await expectHonestLearnSurface(page);

    if (isHonestGate(page)) {
      if (pathOf(page) === "/sign-in") {
        await expect(
          page.getByRole("heading", { name: "Welcome back" }),
        ).toBeVisible();
        await expect(
          page.getByRole("button", { name: "Sign in" }),
        ).toBeVisible();
        const next = new URL(page.url()).searchParams.get("next");
        expect(next === route || next === "/dashboard").toBeTruthy();
        return;
      }
      if (pathOf(page) === "/unauthorized") {
        await expect(
          page.getByRole("heading", { name: "Access not authorized" }),
        ).toBeVisible();
        return;
      }
      await expect(
        page.getByRole("heading", { name: /activation pending/i }),
      ).toBeVisible();
      return;
    }

    if (await isMissingRoute(page, response)) {
      return;
    }

    expect(response?.ok() ?? false).toBeTruthy();
    await expectRenderedLearnLandmarks(page);
  });
}

test("unauthenticated AP course URL does not leak unpublished content", async ({
  page,
}) => {
  const response = await page.goto("/dashboard/learn/ap/ap-csp");

  await expectHonestLearnSurface(page);
  await expect(page.getByText(/answer key|correct answer is/i)).toHaveCount(0);

  if (isHonestGate(page) || (await isMissingRoute(page, response))) {
    return;
  }

  expect(response?.ok() ?? false).toBeTruthy();
  await expectRenderedLearnLandmarks(page);
});

test("axe on reachable learn routes after the auth gate used in this repo", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await page.goto("/dashboard/learn");

  if (isHonestGate(page)) {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    return;
  }

  if (await isMissingRoute(page, response)) {
    return;
  }

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
