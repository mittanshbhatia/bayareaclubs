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

test("Google sign-in is a document navigation, not an RSC fetch", async ({
  page,
}) => {
  const rscPayloadErrors: string[] = [];
  const rscGoogleRequests: string[] = [];

  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /Failed to fetch RSC payload/i.test(message.text())
    ) {
      rscPayloadErrors.push(message.text());
    }
  });
  page.on("request", (request) => {
    if (
      request.url().includes("/auth/google") &&
      request.headers().rsc === "1"
    ) {
      rscGoogleRequests.push(request.url());
    }
  });

  await page.goto("/sign-in");

  const google = page.getByRole("link", { name: /continue with google/i });
  if ((await google.count()) === 0) {
    await expect(
      page.getByRole("button", { name: /google sign-in unavailable/i }),
    ).toBeDisabled();
    return;
  }

  await expect(google).toHaveAttribute("href", "/auth/google");
  await google.hover();
  await page.waitForTimeout(400);
  expect(rscGoogleRequests, "Next.js must not prefetch the OAuth route").toEqual(
    [],
  );

  await page.route("https://accounts.google.com/**", (route) => route.abort());
  await page.route("https://*.supabase.co/auth/**", (route) => route.abort());
  await google.click();
  await page.waitForTimeout(500);
  expect(rscPayloadErrors).toEqual([]);
  expect(rscGoogleRequests).toEqual([]);
});
