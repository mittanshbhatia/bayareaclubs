import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { processCommunicationJobs } from "@/features/communications/processor";
import { isEmailConfigured } from "@/lib/email/config";
import { logger } from "@/lib/logging/logger";
import { requireCronBearer } from "@/lib/security/cron-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Durable communications outbox processor.
 * Protect with CRON_SECRET via Authorization: Bearer.
 */
export async function GET(request: Request) {
  const denied = requireCronBearer(request);
  if (denied) return denied;

  if (!isEmailConfigured()) {
    logger.warn("communications.cron_skipped_email_unconfigured");
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "email_unconfigured",
      processed: 0,
      at: new Date().toISOString(),
    });
  }

  try {
    const workerId = `cron:${randomUUID()}`;
    const results = await processCommunicationJobs(workerId, 15);
    return NextResponse.json({
      ok: true,
      workerId,
      processed: results.length,
      results,
      at: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("communications.cron_failed", { message });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
