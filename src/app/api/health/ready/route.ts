import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  const configured = isSupabaseConfigured();

  return NextResponse.json(
    {
      status: configured ? "ready" : "not_ready",
      checks: {
        supabaseConfiguration: configured ? "ok" : "missing",
      },
    },
    {
      status: configured ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
