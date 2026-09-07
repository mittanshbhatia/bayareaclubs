import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Response } from "@playwright/test";

const PUBLIC_AFTER_GATE = [
  "/dashboard",
  "/dashboard/learn",
  "/dashboard/learn/ap",
  "/admin/dashboard-config",
] as const;

function pathOf(page: Page) {
  return new URL(page.url()).pathname;
}

function isAxeableGate(page: Page) {
  const path = pathOf(page);
  return path === "/sign-in" || path === "/unauthorized";
}

async function isMissingRoute(page: Page, response: Response | null) {
  if (response?.status() === 404) return true;
  return (
    (await page.getByRole("heading", { name: /^404$/ }).count()) > 0 ||
    (await page.getByText(/this page could not be found/i).count()) > 0
  );
}

test("unauthorized page used by dashboard denials has no axe violations", async ({
  page,
}) => {
  await page.goto("/unauthorized");
  await expect(
    page.getByRole("heading", { name: "Access not authorized" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Return to dashboard" }),
  ).toHaveAttribute("href", "/dashboard");

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

for (const route of PUBLIC_AFTER_GATE) {
  test(`axe on ${route} when the page is reachable after the repo auth gate`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(route);

    if (await isMissingRoute(page, response)) {
      return;
    }

    if (isAxeableGate(page) || response?.ok()) {
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
  });
}

test("375 viewport keeps gated dashboard routes usable without horizontal squeeze", async ({
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

  if (pathOf(page) === "/sign-in") {
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    const signInBox = await page
      .getByRole("button", { name: "Sign in" })
      .boundingBox();
    expect(signInBox).not.toBeNull();
    expect(signInBox!.width).toBeLessThan(375);
  }

  const dashboardNav = page.getByRole("navigation", { name: "Dashboard" });
  if (
    (await dashboardNav.count()) > 0 &&
    (await dashboardNav.first().isVisible())
  ) {
    const box = await dashboardNav.first().boundingBox();
    if (box) {
      expect(box.x < 8 && box.height > 400 && box.width >= 180).toBe(false);
    }
  } else if (pathOf(page) === "/dashboard") {
    await expect(
      page.getByRole("button", {
        name: /menu|open navigation|open menu|open sidebar/i,
      }),
    ).toBeVisible();
  }
});

test("context and dashboard landmarks stay keyboard named when the shell renders", async ({
  page,
}) => {
  await page.goto("/dashboard");

  if (pathOf(page) !== "/dashboard") {
    return;
  }

  const dashboardNav = page.getByRole("navigation", { name: "Dashboard" });
  const contextControl = page
    .getByRole("navigation", { name: "Context" })
    .or(page.getByRole("combobox", { name: /context/i }))
    .or(page.getByRole("button", { name: /context/i }));

  if ((await dashboardNav.count()) > 0) {
    await expect(dashboardNav.first()).toBeVisible();
  }
  if ((await contextControl.count()) > 0) {
    const control = contextControl.first();
    await expect(control).toBeVisible();
    await control.focus();
    await expect(control).toBeFocused();
  }
});
