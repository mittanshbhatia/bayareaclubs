import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";

/**
 * Daily analytics rollup processor.
 * Protect with CRON_SECRET (Authorization: Bearer <secret> or ?secret=).
 * Defaults to yesterday Pacific; pass ?date=YYYY-MM-DD to refresh a day.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  const token =
    auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : url.searchParams.get("secret");

  if (token !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
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
