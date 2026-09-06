import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { processCommunicationJobs } from "@/features/communications/processor";
import { logger } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Durable communications outbox processor.
 * Protect with CRON_SECRET. Idempotent job + recipient claims.
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
