import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logging/logger";
import { requireCronBearer } from "@/lib/security/cron-auth";

export const dynamic = "force-dynamic";

/**
 * Daily analytics rollup processor.
 * Protect with CRON_SECRET via Authorization: Bearer.
 * Defaults to yesterday Pacific; pass ?date=YYYY-MM-DD to refresh a day.
 */
export async function GET(request: Request) {
  const denied = requireCronBearer(request);
  if (denied) return denied;

  try {
    const admin = createAdminClient();
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const { data, error } = await admin.rpc(
      "refresh_analytics_for_date",
      date ? { target_date: date } : {},
    );
    if (error) {
      logger.error("insights.rollup_failed", { message: error.message });
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      result: data,
      at: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("insights.rollup_cron_failed", { message });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
