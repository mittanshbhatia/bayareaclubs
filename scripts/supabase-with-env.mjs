#!/usr/bin/env node
/**
 * Non-interactive Supabase CLI wrapper for bayareaclubs.
 * Loads SUPABASE_ACCESS_TOKEN from .env.local or ~/.supabase/access-token,
 * then runs `pnpm exec supabase` with --yes semantics for agent/automation use.
 */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
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

const localEnv = parseEnvFile(resolve(root, ".env.local"));
const tokenPath = resolve(homedir(), ".supabase", "access-token");
const tokenFromFile = existsSync(tokenPath)
  ? readFileSync(tokenPath, "utf8").trim()
  : "";

const token =
  process.env.SUPABASE_ACCESS_TOKEN ||
  localEnv.SUPABASE_ACCESS_TOKEN ||
  tokenFromFile;

if (!token) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN. Expected in .env.local or ~/.supabase/access-token.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/supabase-with-env.mjs <supabase-args...>");
  process.exit(1);
}

const env = {
  ...process.env,
  ...localEnv,
  SUPABASE_ACCESS_TOKEN: token,
};

const child = spawn("pnpm", ["exec", "supabase", ...args], {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
