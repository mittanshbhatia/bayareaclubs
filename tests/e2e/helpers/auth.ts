import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import { expect, type Page } from "@playwright/test";

const STUDENT_EMAIL = "bhatiamittansh@gmail.com";
const ADMIN_EMAIL = "demo.platform-admin@bayareaclubs.test";

function parseEnvFile(path: string) {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function loadLocalEnv() {
  const fileEnv = parseEnvFile(resolve(process.cwd(), ".env.local"));
  return {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      fileEnv.NEXT_PUBLIC_SUPABASE_URL ??
      "",
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      fileEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      "",
    secretKey:
      process.env.SUPABASE_SECRET_KEY ?? fileEnv.SUPABASE_SECRET_KEY ?? "",
    adminPassword:
      process.env.E2E_ADMIN_PASSWORD ??
      fileEnv.E2E_ADMIN_PASSWORD ??
      "BayAreaClubsDemo2026!",
  };
}

function projectRef(url: string) {
  const host = new URL(url).hostname;
  return host.split(".")[0] ?? "";
}

function encodeSessionCookie(session: object) {
  const json = JSON.stringify(session);
  const encoded = `base64-${Buffer.from(json, "utf8").toString("base64url")}`;
  const cookieName = `sb-${projectRef(loadLocalEnv().url)}-auth-token`;
  const chunkSize = 3180;
  if (encoded.length <= chunkSize) {
    return [{ name: cookieName, value: encoded }];
  }
  const cookies = [];
  for (let index = 0, cursor = 0; cursor < encoded.length; index += 1) {
    cookies.push({
      name: `${cookieName}.${index}`,
      value: encoded.slice(cursor, cursor + chunkSize),
    });
    cursor += chunkSize;
  }
  return cookies;
}

export async function signInWithPassword(
  page: Page,
  email: string,
  password: string,
) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/(dashboard|admin|account-pending|complete-profile)/, {
    timeout: 30_000,
  });
}

async function signInWithMagicLink(page: Page, email: string) {
  const env = loadLocalEnv();
  if (!env.url || !env.secretKey) {
    throw new Error("Supabase admin credentials are required for student e2e.");
  }

  const admin = createClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: "http://localhost:3100/auth/callback?next=/dashboard",
    },
  });
  if (error || !data.properties) {
    throw new Error("Could not start an authenticated student session.");
  }

  if (!data.properties.hashed_token) {
    throw new Error("Could not verify the student session.");
  }

  const anon = createClient(env.url, env.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const verified = await anon.auth.verifyOtp({
    token_hash: data.properties.hashed_token,
    type: "magiclink",
  });
  if (verified.error || !verified.data.session) {
    throw new Error("Could not verify the student session.");
  }

  await page.context().clearCookies();
  await page.context().addCookies(
    encodeSessionCookie(verified.data.session).map((cookie) => ({
      ...cookie,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax" as const,
    })),
  );

  await page.goto("/dashboard");
  await expect(page).not.toHaveURL(/\/sign-in/);
}

export async function signInAsStudent(page: Page) {
  await signInWithMagicLink(page, STUDENT_EMAIL);
}

export async function signInAsAdmin(page: Page) {
  const env = loadLocalEnv();
  await signInWithPassword(page, ADMIN_EMAIL, env.adminPassword);
}

export async function signOut(page: Page) {
  const signOutButton = page.getByRole("button", { name: "Sign out" });
  if ((await signOutButton.count()) > 0) {
    await signOutButton.first().click();
  }
  await page.context().clearCookies();
  await page.goto("/sign-in");
}

export const e2eAccounts = {
  studentEmail: STUDENT_EMAIL,
  adminEmail: ADMIN_EMAIL,
};
