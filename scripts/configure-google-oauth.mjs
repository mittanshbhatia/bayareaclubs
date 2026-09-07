#!/usr/bin/env node
/**
 * Secret-safe Google OAuth activation for the linked hosted Supabase project.
 *
 * Credentials are read from the process environment or .env.local and are sent
 * only to the Supabase Management API. Values are never printed.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "kygrtkazmjjutswjbwag";
const productionOrigin = "https://bayareaclubs.vercel.app";
const supabaseCallback = `https://${projectRef}.supabase.co/auth/v1/callback`;
const callbackAllowList = [
  `${productionOrigin}/auth/callback`,
  "http://localhost:3000/auth/callback",
  "http://localhost:3100/auth/callback",
];

export function parseEnvFile(contents) {
  const result = {};
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

export function setEnvValue(contents, key, value) {
  const replacement = `${key}=${value}`;
  const lines = contents.split("\n");
  const index = lines.findIndex(
    (line) => line.trimStart().split("=", 1)[0] === key,
  );
  if (index >= 0) {
    lines[index] = replacement;
  } else {
    if (lines.at(-1) !== "") lines.push("");
    lines.push(replacement);
  }
  return lines.join("\n");
}

function readLocalEnv() {
  const path = resolve(root, ".env.local");
  return existsSync(path) ? parseEnvFile(readFileSync(path, "utf8")) : {};
}

function readSupabaseToken(env) {
  if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;

  const tokenPath = resolve(homedir(), ".supabase", "access-token");
  if (existsSync(tokenPath)) return readFileSync(tokenPath, "utf8").trim();

  if (process.platform === "darwin") {
    try {
      return execFileSync(
        "security",
        ["find-generic-password", "-s", "Supabase CLI", "-w"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      ).trim();
    } catch {
      // The actionable error is emitted by the caller.
    }
  }
  return "";
}

async function managementRequest(token, method, body) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    },
  );
  if (!response.ok) {
    throw new Error(
      `Supabase Management API returned ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

function providerSummary(config) {
  return {
    project_ref: projectRef,
    site_url: config.site_url,
    callback_allow_list_correct:
      config.uri_allow_list === callbackAllowList.join(","),
    google_enabled: config.external_google_enabled === true,
    google_client_id_present: Boolean(config.external_google_client_id),
    google_secret_present: Boolean(config.external_google_secret),
  };
}

function writeLocalEnableFlag() {
  const path = resolve(root, ".env.local");
  const current = existsSync(path) ? readFileSync(path, "utf8") : "";
  const updated = setEnvValue(
    current,
    "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED",
    "true",
  );
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, updated, { mode: 0o600 });
  renameSync(temporaryPath, path);
}

function readVercelAuthToken(env) {
  if (env.VERCEL_TOKEN) return env.VERCEL_TOKEN;
  for (const path of [
    resolve(homedir(), "Library/Application Support/com.vercel.cli/auth.json"),
    resolve(homedir(), ".local/share/com.vercel.cli/auth.json"),
    resolve(homedir(), ".vercel/auth.json"),
  ]) {
    if (!existsSync(path)) continue;
    try {
      return JSON.parse(readFileSync(path, "utf8")).token ?? "";
    } catch {
      return "";
    }
  }
  return "";
}

async function enableVercelProductionFlag(env) {
  const projectPath = resolve(root, ".vercel", "project.json");
  const token = readVercelAuthToken(env);
  if (!token || !existsSync(projectPath)) {
    throw new Error(
      "Vercel is not linked/authenticated; run `vercel link` and authenticate, then rerun with --vercel",
    );
  }

  const { orgId, projectId } = JSON.parse(readFileSync(projectPath, "utf8"));
  if (!orgId || !projectId) {
    throw new Error("Vercel project metadata is incomplete");
  }
  const response = await fetch(
    `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/env?teamId=${encodeURIComponent(orgId)}&upsert=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "NEXT_PUBLIC_GOOGLE_AUTH_ENABLED",
        value: "true",
        type: "plain",
        target: ["production"],
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Vercel API returned ${response.status} ${response.statusText}`,
    );
  }
  console.log(
    "Vercel production flag enabled. Redeploy production for it to take effect.",
  );
}

async function verifyProviderRedirect() {
  const authorizeUrl = new URL(
    `https://${projectRef}.supabase.co/auth/v1/authorize`,
  );
  authorizeUrl.searchParams.set("provider", "google");
  authorizeUrl.searchParams.set(
    "redirect_to",
    `${productionOrigin}/auth/callback`,
  );
  const response = await fetch(authorizeUrl, { redirect: "manual" });
  const location = response.headers.get("location");
  if (!location) {
    throw new Error(`Supabase OAuth start returned ${response.status}`);
  }
  const target = new URL(location);
  const callback = target.searchParams.get("redirect_uri");
  if (
    target.hostname !== "accounts.google.com" ||
    callback !== supabaseCallback
  ) {
    throw new Error("Supabase did not produce the expected Google redirect");
  }
  console.log(
    `OAuth start verified: accounts.google.com uses ${supabaseCallback}`,
  );
}

async function main() {
  const localEnv = readLocalEnv();
  const env = { ...localEnv, ...process.env };
  const token = readSupabaseToken(env);
  if (!token) {
    throw new Error(
      "Missing Supabase CLI access token in the environment, token file, or macOS Keychain",
    );
  }

  const current = await managementRequest(token, "GET");
  if (process.argv.includes("--status")) {
    console.log(JSON.stringify(providerSummary(current), null, 2));
    return;
  }

  const clientId = env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID?.trim();
  const secret = env.SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET?.trim();
  if (!clientId?.endsWith(".apps.googleusercontent.com") || !secret) {
    throw new Error(
      `Missing valid Google Web client credentials. Create the client with authorized redirect URI ${supabaseCallback}, then set SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID and SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET in .env.local.`,
    );
  }

  await managementRequest(token, "PATCH", {
    site_url: productionOrigin,
    uri_allow_list: callbackAllowList.join(","),
    external_google_enabled: true,
    external_google_client_id: clientId,
    external_google_secret: secret,
  });
  const updated = await managementRequest(token, "GET");
  const summary = providerSummary(updated);
  if (
    !summary.callback_allow_list_correct ||
    !summary.google_enabled ||
    !summary.google_client_id_present ||
    !summary.google_secret_present
  ) {
    throw new Error(
      "Supabase did not retain the complete Google configuration",
    );
  }

  writeLocalEnableFlag();
  console.log(JSON.stringify(summary, null, 2));
  console.log("Local Google sign-in enabled in .env.local.");
  await verifyProviderRedirect();

  if (process.argv.includes("--vercel")) {
    await enableVercelProductionFlag(env);
  } else {
    console.log(
      "Vercel unchanged. Rerun with --vercel after linking/authenticating Vercel.",
    );
  }
}

const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
