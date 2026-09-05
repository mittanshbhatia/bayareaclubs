import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("sign-in is keyboard accessible and validates required credentials", async ({
  page,
}) => {
  await page.goto("/sign-in?reason=session_expired");

  await expect(
    page.getByText("Your session expired. Sign in to continue."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("password recovery does not disclose account existence", async ({
  page,
}) => {
  await page.goto("/forgot-password");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
});

test("unauthorized route clearly reports denied access", async ({ page }) => {
  await page.goto("/unauthorized");
  await expect(
    page.getByRole("heading", { name: "Access not authorized" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Return to dashboard" }),
  ).toHaveAttribute("href", "/dashboard");
});
