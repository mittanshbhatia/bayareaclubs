import { NextResponse } from "next/server";

import { getAdminInsights } from "@/features/insights/queries";
import { AuthorizationError, requirePlatformAdmin } from "@/lib/auth/authorization";
import {
  defaultInsightsRange,
  insightsRangeSchema,
} from "@/lib/validation/insights";

export const dynamic = "force-dynamic";

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export async function GET(request: Request) {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
    }
    throw error;
  }

  const url = new URL(request.url);
  const defaults = defaultInsightsRange(30);
  const parsed = insightsRangeSchema.safeParse({
    start: url.searchParams.get("start") ?? defaults.start,
    end: url.searchParams.get("end") ?? defaults.end,
    schoolId: url.searchParams.get("schoolId"),
    gradeBand: url.searchParams.get("gradeBand") ?? "all",
    category: url.searchParams.get("category"),
  });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid filters" }, { status: 400 });
  }

  const data = await getAdminInsights(parsed.data);
  const lines = [
    ["metric", "value"].map(csvEscape).join(","),
    ["active_clubs", data.metrics.activeClubs].map(csvEscape).join(","),
    ["new_clubs", data.metrics.newClubs].map(csvEscape).join(","),
    ["active_members", data.metrics.activeMembers].map(csvEscape).join(","),
    ["member_growth", data.metrics.memberGrowth].map(csvEscape).join(","),
    ["events_held", data.metrics.eventsHeld].map(csvEscape).join(","),
    ["average_attendance_pct", data.metrics.averageAttendance].map(csvEscape).join(","),
    ["renewals_due", data.metrics.renewalsDue].map(csvEscape).join(","),
    ["renewal_completion_pct", data.metrics.renewalCompletion].map(csvEscape).join(","),
    ["resource_subscriptions", data.metrics.resourceSubscriptions]
      .map(csvEscape)
      .join(","),
    "",
    ["club", "activity_score"].map(csvEscape).join(","),
    ...data.tableRows.map((row) =>
      [row.club, row.activityScore].map(csvEscape).join(","),
    ),
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bayareaclubs-insights-${parsed.data.start}-${parsed.data.end}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
