import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";

/**
 * Scheduled renewal reminder processor.
 * Protect with CRON_SECRET (Authorization: Bearer <secret> or ?secret=).
 * Enqueues approaching deadlines, then sends due reminder notifications.
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
