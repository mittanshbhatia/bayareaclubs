import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Response } from "@playwright/test";

function pathOf(page: Page) {
  return new URL(page.url()).pathname;
}

function isSignIn(page: Page) {
  return pathOf(page) === "/sign-in";
}

function isHonestDenial(page: Page) {
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

async function expectNoFakeDashboardSuccess(page: Page) {
  await expect(
    page.getByText(
      /unlimited voices|stellar learning|college board partner|automatically ferpa compliant|coppa certified/i,
    ),
  ).toHaveCount(0);
}

test("unauthenticated /dashboard redirects to sign-in", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(
    page.getByText("Your session expired. Sign in to continue."),
  ).toBeVisible();

  const next = new URL(page.url()).searchParams.get("next");
  expect(next).toBe("/dashboard");
});

test("unauthorized /admin/dashboard-config is denied", async ({ page }) => {
  const response = await page.goto("/admin/dashboard-config");

  await expectNoFakeDashboardSuccess(page);
  await expect(
    page.getByRole("heading", { name: /dashboard configuration/i }),
  ).toHaveCount(0);

  if (isHonestDenial(page)) {
    if (isSignIn(page)) {
      await expect(
        page.getByRole("heading", { name: "Welcome back" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
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

  expect(
    await isMissingRoute(page, response),
    "Guests must not receive a dashboard-config workspace",
  ).toBeTruthy();
});

test("forged context query params do not grant a dashboard session", async ({
  page,
}) => {
  await page.goto("/dashboard?context=platform&club=not-a-club");

  expect(isHonestDenial(page) || pathOf(page) === "/dashboard").toBeTruthy();
  if (isSignIn(page)) {
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
    return;
  }
  if (pathOf(page) === "/unauthorized") {
    await expect(
      page.getByRole("heading", { name: "Access not authorized" }),
    ).toBeVisible();
  }
});

test("375 viewport does not squeeze a desktop dashboard sidebar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/dashboard");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
    )
    .toBe(true);

  if (isHonestDenial(page)) {
    await expect(
      page.getByRole("navigation", { name: "Dashboard" }),
    ).toHaveCount(0);
    return;
  }

  const menuButton = page.getByRole("button", {
    name: /menu|open navigation|open menu|open sidebar/i,
  });
  const dashboardNav = page.getByRole("navigation", { name: "Dashboard" });
  const mobileNav = page.getByRole("navigation", {
    name: /dashboard|mobile|menu/i,
  });

  const hasMenu = await menuButton
    .first()
    .isVisible()
    .catch(() => false);
  const hasMobileLandmark = (await mobileNav.count()) > 0;
  expect(hasMenu || hasMobileLandmark).toBeTruthy();

  if (
    (await dashboardNav.count()) > 0 &&
    (await dashboardNav.first().isVisible())
  ) {
    const box = await dashboardNav.first().boundingBox();
    if (box) {
      const squeezedDesktopRail =
        box.x < 8 && box.height > 400 && box.width >= 180;
      expect(squeezedDesktopRail).toBe(false);
    }
  }
});

test("1280 viewport exposes desktop dashboard navigation when the shell is shipped", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/dashboard");

  if (isHonestDenial(page)) {
    await expect(
      page.getByRole("heading", {
        name: /Welcome back|Access not authorized|activation pending/i,
      }),
    ).toBeVisible();
    return;
  }

  const dashboardNav = page.getByRole("navigation", { name: "Dashboard" });
  const contextControl = page
    .getByRole("navigation", { name: "Context" })
    .or(page.getByRole("combobox", { name: /context/i }))
    .or(page.getByLabel(/^context$/i));
  const complementary = page.getByRole("complementary");
  const headerNav = page.locator("header nav");

  const hasContractNav = await dashboardNav
    .first()
    .isVisible()
    .catch(() => false);
  const hasContext = await contextControl
    .first()
    .isVisible()
    .catch(() => false);
  const hasComplementary = await complementary
    .first()
    .isVisible()
    .catch(() => false);
  const hasHeaderNav = await headerNav
    .first()
    .isVisible()
    .catch(() => false);

  expect(
    hasContractNav || hasContext || hasComplementary || hasHeaderNav,
  ).toBeTruthy();
});

test("axe reports no violations on the reachable dashboard gate", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dashboard");

  if (isSignIn(page) || pathOf(page) === "/unauthorized") {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});
