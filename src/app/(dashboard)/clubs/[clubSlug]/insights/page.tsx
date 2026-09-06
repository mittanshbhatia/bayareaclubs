import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { MetricCard } from "@/components/ds/metric-card";
import {
  listClubInsights,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubInsightsPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}/insights`);
    }
    throw error;
  }
  if (!context) notFound();

  const rows = await listClubInsights(context.club.id);
  const latest = rows[0];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Insights use persisted analytics rollups and live operational counts—not
        generated advice.
      </p>
      {latest ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Active members" value={latest.active_members} />
          <MetricCard label="Attendance present" value={latest.attendance_present} />
          <MetricCard label="Events" value={latest.events} />
          <MetricCard label="RSVPs" value={latest.rsvps} />
        </div>
      ) : (
        <EmptyState
          title="No analytics rollups yet"
          description="Daily club analytics appear after operational activity is recorded and rolled up."
        />
      )}

      {rows.length > 0 ? (
        <ul className="space-y-2">
          {rows.slice(0, 14).map((row) => (
            <li
              key={`${row.club_id}-${row.metric_date}`}
              className="flex flex-wrap justify-between gap-2 rounded-lg border border-border px-4 py-3 text-sm"
            >
              <span>{row.metric_date}</span>
              <span className="text-muted-foreground">
                {row.active_members} members · {row.attendance_present} present ·{" "}
                {row.events} events
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
