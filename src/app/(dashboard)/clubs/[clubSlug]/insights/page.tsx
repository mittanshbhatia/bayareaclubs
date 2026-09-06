import { ChartCard } from "@/components/ds/chart-card";
import { EmptyState } from "@/components/ds/states";
import { InsightCallout } from "@/components/ds/insight-callout";
import { MetricCard } from "@/components/ds/metric-card";
import { getClubInsightsBundle } from "@/features/insights/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { defaultInsightsRange } from "@/lib/validation/insights";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function formatPct(value: number | null) {
  return value == null ? "—" : `${value}%`;
}

export default async function ClubInsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ clubSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { clubSlug } = await params;
  const query = await searchParams;
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

  const defaults = defaultInsightsRange(30);
  const range = {
    start: typeof query.start === "string" ? query.start : defaults.start,
    end: typeof query.end === "string" ? query.end : defaults.end,
  };

  const data = await getClubInsightsBundle(context.club.id, range);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="space-y-2">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Insights
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Operational insights for {context.club.name}. Metrics use daily
            rollups and period comparisons—not AI advice, and not student
            performance rankings.
          </p>
        </div>
        <form className="flex flex-wrap items-end gap-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Start</span>
            <input
              type="date"
              name="start"
              defaultValue={range.start}
              className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">End</span>
            <input
              type="date"
              name="end"
              defaultValue={range.end}
              className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
          <button
            type="submit"
            className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Update range
          </button>
        </form>
      </header>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Club momentum
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold">
              {data.momentum.statusLabel}
            </h3>
            <p className="mt-1 font-mono text-3xl font-semibold">
              {data.momentum.combinedScore}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {data.momentum.formulaSummary}
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.momentum.components.map((component) => (
            <li
              key={component.key}
              className="rounded-md border border-border/80 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{component.label}</span>
                <span className="font-mono">{component.score}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Weight {component.weight}% · {component.detail}
              </p>
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-2">
          {data.momentum.reasons.map((reason) => (
            <li key={reason}>
              <InsightCallout
                title={reason}
                tone={
                  data.momentum.status === "renewal_risk"
                    ? "warning"
                    : data.momentum.status === "needs_attention"
                      ? "tip"
                      : "info"
                }
              >
                Deterministic threshold from charter, attendance, leadership, or
                activity signals.
              </InsightCallout>
            </li>
          ))}
        </ul>
      </section>

      {data.callouts.length > 0 ? (
        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">What changed</h2>
          {data.callouts.map((callout) => (
            <InsightCallout key={callout} title="Period comparison" tone="info">
              {callout}
            </InsightCallout>
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Members" value={data.metrics.members} />
        <MetricCard label="New Members" value={data.metrics.newMembers} />
        <MetricCard label="Meetings" value={data.metrics.meetings} />
        <MetricCard label="Attendance" value={formatPct(data.metrics.attendance)} />
        <MetricCard label="Events" value={data.metrics.events} />
        <MetricCard
          label="Event RSVP Rate"
          value={
            data.metrics.rsvpRate == null
              ? "—"
              : `${data.metrics.rsvpRate} / event`
          }
        />
        <MetricCard
          label="Active Participants"
          value={data.metrics.activeParticipants}
          hint="Present/late marks in range (volume)"
        />
        <MetricCard
          label="Member Retention"
          value={formatPct(data.metrics.memberRetention)}
        />
        <MetricCard
          label="Resource Subscriptions"
          value={data.metrics.resourceSubscriptions}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Member growth"
          data={data.charts.memberGrowth}
          valueLabel="New members"
          secondaryLabel="Active members"
        />
        <ChartCard
          title="Attendance trend"
          data={data.charts.attendanceTrend}
          valueLabel="Attendance %"
        />
        <ChartCard
          title="Participation distribution"
          variant="bar"
          data={data.charts.participationDistribution}
        />
        <ChartCard
          title="Event participation"
          data={data.charts.eventParticipation}
          valueLabel="RSVPs"
          secondaryLabel="Events"
        />
        <ChartCard
          title="Activity frequency"
          data={data.charts.activityFrequency}
          valueLabel="Activities + meetings"
        />
      </section>

      {data.charts.memberGrowth.length === 0 ? (
        <EmptyState
          title="No rollups in this range"
          description="Daily analytics appear after the rollup job runs for days with club activity."
        />
      ) : null}
    </div>
  );
}
