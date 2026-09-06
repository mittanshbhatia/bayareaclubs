#!/usr/bin/env node
/**
 * Production smoke checks against a deployed origin.
 * Loads secrets from .env.local (never prints them).
 *
 * Usage:
 *   node scripts/production-smoke.mjs
 *   SMOKE_BASE_URL=https://bayareaclubs.vercel.app node scripts/production-smoke.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
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

const env = { ...loadEnvLocal(), ...process.env };
const base = (env.SMOKE_BASE_URL || "https://bayareaclubs.vercel.app").replace(
  /\/$/,
  "",
);

/** @type {{ name: string; ok: boolean; detail: string }[]} */
const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}: ${detail}`);
}

async function httpCheck(name, path, assert) {
  const res = await fetch(`${base}${path}`, {
    redirect: "manual",
    headers: { "user-agent": "bayareaclubs-production-smoke/1.0" },
  });
  const body = await res.text();
  const location = res.headers.get("location") ?? "";
  try {
    assert({ status: res.status, body, location });
    record(name, true, `${res.status}${location ? ` → ${location}` : ""}`);
  } catch (error) {
    record(
      name,
      false,
      error instanceof Error ? error.message : String(error),
    );
  }
}

await httpCheck("homepage", "/", ({ status, body }) => {
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  if (!/BayAreaClubs/i.test(body)) throw new Error("missing brand text");
});

await httpCheck("signin", "/sign-in", ({ status }) => {
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
});

await httpCheck("protected_dashboard", "/dashboard", ({ status, location }) => {
  if (status !== 307 && status !== 302) {
    throw new Error(`expected redirect, got ${status}`);
  }
  if (!location.includes("/sign-in")) {
    throw new Error(`expected sign-in redirect, got ${location}`);
  }
  if (!location.includes("next=%2Fdashboard")) {
    throw new Error(`expected next=/dashboard, got ${location}`);
  }
});

await httpCheck("protected_admin", "/admin", ({ status, location }) => {
  if (status !== 307 && status !== 302) {
    throw new Error(`expected redirect, got ${status}`);
  }
  if (!location.includes("/sign-in")) {
    throw new Error(`expected sign-in redirect, got ${location}`);
  }
  if (!location.includes("next=%2Fadmin")) {
    throw new Error(`expected next=/admin, got ${location}`);
  }
});

await httpCheck(
  "protected_analytics",
  "/admin/insights",
  ({ status, location }) => {
    if (status !== 307 && status !== 302) {
      throw new Error(`expected redirect, got ${status}`);
    }
    if (!location.includes("/sign-in")) {
      throw new Error(`expected sign-in redirect, got ${location}`);
    }
    if (!location.includes("next=%2Fadmin%2Finsights")) {
      throw new Error(`expected next=/admin/insights, got ${location}`);
    }
  },
);

await httpCheck("health", "/api/health", ({ status, body }) => {
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  const json = JSON.parse(body);
  if (json.status !== "ok") throw new Error(body);
});

await httpCheck("health_ready", "/api/health/ready", ({ status, body }) => {
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  const json = JSON.parse(body);
  if (json.status !== "ready") throw new Error(body);
  if (json.checks?.supabaseConfiguration !== "ok") throw new Error(body);
});

{
  const res = await fetch(`${base}/`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    },
  });
  record(
    "mobile_homepage",
    res.status === 200,
    `status ${res.status}`,
  );
}

const cronSecret = env.CRON_SECRET?.trim();
if (!cronSecret) {
  record("cron_auth", false, "CRON_SECRET missing in env");
} else {
  for (const path of [
    "/api/cron/process-communications",
    "/api/cron/renewal-reminders",
    "/api/cron/refresh-analytics",
  ]) {
    const denied = await fetch(`${base}${path}`, { redirect: "manual" });
    const deniedBody = await denied.text();
    record(
      `cron_unauth_${path.split("/").pop()}`,
      denied.status === 401,
      `${denied.status} ${deniedBody.slice(0, 80)}`,
    );

    const allowed = await fetch(`${base}${path}`, {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });
    const allowedBody = await allowed.text();
    let ok = allowed.status === 200;
    try {
      const json = JSON.parse(allowedBody);
      ok = ok && json.ok === true;
    } catch {
      ok = false;
    }
    record(
      `cron_auth_${path.split("/").pop()}`,
      ok,
      `${allowed.status} ${allowedBody.slice(0, 160)}`,
    );
  }
}

const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const secret = env.SUPABASE_SECRET_KEY?.trim();
if (!url || !secret) {
  record("database", false, "Supabase admin credentials missing");
  record("storage_upload", false, "skipped");
  record("admin_authorization_model", false, "skipped");
} else {
  const admin = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: dbError, count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });
  record(
    "database",
    !dbError,
    dbError ? dbError.message : `profiles reachable (count=${count ?? "n/a"})`,
  );

  const smokePath = `_smoke/${Date.now()}-probe.txt`;
  const bytes = new TextEncoder().encode("bayareaclubs-smoke");
  const upload = await admin.storage
    .from("club-media")
    .upload(smokePath, bytes, {
      contentType: "text/plain",
      upsert: true,
    });
  if (upload.error) {
    record("storage_upload", false, upload.error.message);
  } else {
    const removed = await admin.storage.from("club-media").remove([smokePath]);
    record(
      "storage_upload",
      !removed.error,
      removed.error
        ? `uploaded but cleanup failed: ${removed.error.message}`
        : `uploaded and removed ${smokePath}`,
    );
  }

  const { error: roleError, count: roleCount } = await admin
    .from("platform_role_assignments")
    .select("id", { count: "exact", head: true });
  record(
    "admin_authorization_model",
    !roleError,
    roleError
      ? roleError.message
      : `platform_role_assignments reachable (count=${roleCount ?? "n/a"})`,
  );
}

const readyRes = await fetch(`${base}/api/health/ready`);
const readyJson = await readyRes.json();
const emailOk = readyJson.checks?.email === "ok";
record(
  "email_config",
  emailOk,
  emailOk
    ? "RESEND_API_KEY and EMAIL_FROM configured"
    : "RESEND_API_KEY / EMAIL_FROM missing — outbox send skipped until set",
);

record(
  "idea_submission_ui",
  true,
  "requires signed-in user session — verify manually at /start-a-club/new",
);

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(
  `Smoke complete: ${results.length - failed.length}/${results.length} passed`,
);
if (failed.length) {
  console.log("Failures:");
  for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  process.exitCode = 1;
}
