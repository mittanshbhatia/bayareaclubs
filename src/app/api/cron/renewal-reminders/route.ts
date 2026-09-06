import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logging/logger";
import { requireCronBearer } from "@/lib/security/cron-auth";

export const dynamic = "force-dynamic";

/**
 * Scheduled renewal reminder processor.
 * Protect with CRON_SECRET via Authorization: Bearer.
 * Enqueues approaching deadlines, then sends due reminder notifications.
 */
export async function GET(request: Request) {
  const denied = requireCronBearer(request);
  if (denied) return denied;

  try {
    const admin = createAdminClient();
    const { data: enqueued, error: enqueueError } = await admin.rpc(
      "enqueue_renewal_reminders",
    );
    if (enqueueError) {
      logger.error("renewal.reminders.enqueue_failed", {
        message: enqueueError.message,
      });
      return NextResponse.json(
        { ok: false, error: enqueueError.message },
        { status: 500 },
      );
    }

    const { data: processed, error: processError } = await admin.rpc(
      "process_due_renewal_reminders",
    );
    if (processError) {
      logger.error("renewal.reminders.process_failed", {
        message: processError.message,
      });
      return NextResponse.json(
        { ok: false, error: processError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      enqueued: enqueued ?? 0,
      processed: processed ?? 0,
      at: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("renewal.reminders.cron_failed", { message });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
