import { NextResponse } from "next/server";

import { emailConfigurationStatus } from "@/lib/email/config";
import { isSupabaseConfigured } from "@/lib/env";
import { readStorageS3Config } from "@/lib/media/s3-server";

export const dynamic = "force-dynamic";

export function GET() {
  const supabaseOk = isSupabaseConfigured();
  const cronSecretOk = Boolean(process.env.CRON_SECRET?.trim());
  const serviceRoleOk = Boolean(process.env.SUPABASE_SECRET_KEY?.trim());
  const emailStatus = emailConfigurationStatus();
  const storageS3Status = readStorageS3Config() ? "ok" : "optional_missing";

  // App can serve traffic without email/S3; those are capability checks.
  const ready = supabaseOk && cronSecretOk && serviceRoleOk;

  return NextResponse.json(
    {
      status: ready ? "ready" : "not_ready",
      checks: {
        supabaseConfiguration: supabaseOk ? "ok" : "missing",
        cronSecret: cronSecretOk ? "ok" : "missing",
        supabaseSecretKey: serviceRoleOk ? "ok" : "missing",
        email: emailStatus,
        storageS3: storageS3Status,
      },
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
