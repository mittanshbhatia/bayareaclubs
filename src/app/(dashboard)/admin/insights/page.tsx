import { Suspense } from "react";

import { ChartCard } from "@/components/ds/chart-card";
import { EmptyState } from "@/components/ds/states";
import { InsightCallout } from "@/components/ds/insight-callout";
import { LoadingSkeleton } from "@/components/ds/loading-skeleton";
import { MetricCard } from "@/components/ds/metric-card";
import { PageContainer } from "@/components/ds/page-container";
import { InsightsFilterBar } from "@/features/insights/components/insights-filter-bar";
import { getAdminInsights } from "@/features/insights/queries";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import {
  defaultInsightsRange,
  insightsRangeSchema,
} from "@/lib/validation/insights";

export const dynamic = "force-dynamic";

function formatPct(value: number | null) {
  return value == null ? "—" : `${value}%`;
}

async function AdminInsightsBody({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const defaults = defaultInsightsRange(30);
  const parsed = insightsRangeSchema.safeParse({
    start: typeof searchParams.start === "string" ? searchParams.start : defaults.start,
    end: typeof searchParams.end === "string" ? searchParams.end : defaults.end,
    schoolId:
      typeof searchParams.schoolId === "string" ? searchParams.schoolId : null,
    gradeBand:
      typeof searchParams.gradeBand === "string" ? searchParams.gradeBand : "all",
    category:
      typeof searchParams.category === "string" ? searchParams.category : null,
  });
  if (!parsed.success) {
    return (
      <EmptyState
        title="Invalid filters"
        description="Choose a valid date range and try again."
      />
    );
  }

  const data = await getAdminInsights(parsed.data);
  const exportHref = `/api/admin/insights/export?${new URLSearchParams({
    start: parsed.data.start,
    end: parsed.data.end,
    ...(parsed.data.schoolId ? { schoolId: parsed.data.schoolId } : {}),
    ...(parsed.data.category ? { category: parsed.data.category } : {}),
    gradeBand: parsed.data.gradeBand,
  }).toString()}`;

  return (
    <div className="space-y-8">
      <Suspense fallback={<LoadingSkeleton variant="card" />}>
        <InsightsFilterBar
          schools={data.schools}
          categories={data.categories}
          exportHref={exportHref}
          defaultStart={parsed.data.start}
          defaultEnd={parsed.data.end}
        />
      </Suspense>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Active Clubs" value={data.metrics.activeClubs} />
        <MetricCard label="New Clubs" value={data.metrics.newClubs} />
        <MetricCard label="Active Members" value={data.metrics.activeMembers} />
        <MetricCard
          label="Member Growth"
          value={data.metrics.memberGrowth}
          hint={
            data.metrics.memberGrowthPct == null
              ? "New memberships in range"
              : `${data.metrics.memberGrowthPct}% vs start roster`
          }
        />
        <MetricCard label="Events Held" value={data.metrics.eventsHeld} />
        <MetricCard
          label="Average Attendance"
          value={formatPct(data.metrics.averageAttendance)}
          hint="Present + late ÷ recorded marks"
        />
        <MetricCard label="Renewals Due" value={data.metrics.renewalsDue} />
        <MetricCard
          label="Renewal Completion"
          value={formatPct(data.metrics.renewalCompletion)}
        />
        <MetricCard
          label="Resource Subscriptions"
          value={data.metrics.resourceSubscriptions}
        />
      </section>

      <InsightCallout title="Metric source" tone="info">
        Figures come from daily analytics rollups (`refresh_analytics_for_date`).
        Definitions live in docs/product/analytics-metrics.md. These are
        operational insights, not student performance rankings.
      </InsightCallout>

      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Club growth over time"
          description="New clubs per day in range"
          data={data.charts.clubGrowth}
          valueLabel="New clubs"
        />
        <ChartCard
          title="Membership growth over time"
          description="New memberships and active roster by day"
          data={data.charts.membershipGrowth}
          valueLabel="New members"
          secondaryLabel="Active members"
        />
        <ChartCard
          title="Attendance trend"
          description="Daily attendance rate (%)"
          data={data.charts.attendanceTrend}
          valueLabel="Attendance %"
        />
        <ChartCard
          title="Event participation"
          description="RSVPs vs events by day"
          data={data.charts.eventParticipation}
          valueLabel="RSVPs"
          secondaryLabel="Events"
        />
        <ChartCard
          title="Clubs by category"
          variant="bar"
          data={data.charts.clubsByCategory}
        />
        <ChartCard
          title="Clubs by school"
          variant="bar"
          data={data.charts.clubsBySchool}
        />
        <ChartCard
          title="Club lifecycle funnel"
          description="Proposed → approved → launched → renewed"
          variant="bar"
          data={data.charts.lifecycleFunnel}
        />
        <ChartCard
          title="Renewal status"
          variant="bar"
          data={data.charts.renewalStatus}
        />
        <ChartCard
          title="Resource engagement"
          description="New course subscriptions attributed via club memberships"
          data={data.charts.resourceEngagement}
        />
        <ChartCard
          title="Most active clubs"
          description="Operational activity score (meetings + events + activities + sessions)"
          variant="bar"
          data={data.charts.mostActive}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Activity drilldown</h2>
        {data.tableRows.length === 0 ? (
          <EmptyState
            title="No club activity in range"
            description="Rollups will populate after the daily analytics job runs."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Club</th>
                  <th className="px-4 py-3 font-medium">Activity score</th>
                </tr>
              </thead>
              <tbody>
                {data.tableRows.map((row) => (
                  <tr key={row.club} className="border-t border-border">
                    <td className="px-4 py-3">{row.club}</td>
                    <td className="px-4 py-3 font-mono">{row.activityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default async function AdminInsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/admin/insights");
    return null;
  }

  const params = await searchParams;

  return (
    <PageContainer className="py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Insights
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Platform analytics from daily rollups—selected charts only, with
          accessible summaries and aggregate CSV export for authorized admins.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton variant="metric" />}>
        <AdminInsightsBody searchParams={params} />
      </Suspense>
    </PageContainer>
  );
}
