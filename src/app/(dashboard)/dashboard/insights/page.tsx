import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { MetricCard } from "@/components/ds/metric-card";
import { Button } from "@/components/ui/button";
import { getMemberInsights } from "@/features/insights/queries";
import { LearnProgressBar } from "@/features/learn/components/learn-progress";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function MemberInsightsPage() {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/insights");
    return null;
  }

  const data = await getMemberInsights(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">My Insights</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Personal overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Only your clubs, upcoming events, attendance marks, and course progress.
          BayAreaClubs does not rank students by participation.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Clubs joined" value={data.clubs.length} />
        <MetricCard
          label="Upcoming events"
          value={data.upcomingEvents.length}
        />
        <MetricCard
          label="Present / late"
          value={data.attendanceSummary.present + data.attendanceSummary.late}
        />
        <MetricCard label="Courses" value={data.courses.length} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Clubs joined</h2>
        {data.clubs.length === 0 ? (
          <EmptyState
            title="No clubs yet"
            description="When you join a club, it appears here."
          />
        ) : (
          <ul className="space-y-2">
            {data.clubs.map((club) => (
              <li
                key={club.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{club.name}</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {club.role?.replaceAll("_", " ")}
                  </p>
                </div>
                {club.slug ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/clubs/${club.slug}`}>Open</Link>
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Upcoming events</h2>
        {data.upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        ) : (
          <ul className="space-y-2">
            {data.upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="rounded-lg border border-border px-4 py-3 text-sm"
              >
                <p className="font-medium">{event.title}</p>
                <p className="text-muted-foreground">
                  {event.clubs?.name ? `${event.clubs.name} · ` : ""}
                  {new Date(event.starts_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Attendance summary</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <MetricCard label="Present" value={data.attendanceSummary.present} />
          <MetricCard label="Late" value={data.attendanceSummary.late} />
          <MetricCard label="Excused" value={data.attendanceSummary.excused} />
          <MetricCard label="Absent" value={data.attendanceSummary.absent} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Course progress</h2>
          <Button asChild size="sm" variant="outline">
            <Link href="/courses">AP catalog</Link>
          </Button>
        </div>
        {data.courses.length === 0 ? (
          <EmptyState
            title="No AP progress yet"
            description="Open the AP catalog to start original practice, or add a STEM resource from the public catalog."
          />
        ) : (
          <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18.75rem,1fr))]">
            {data.courses.map((course) => (
              <li
                key={course.id}
                className="flex flex-col justify-between gap-3 rounded-md border border-(--course-border) bg-learning-surface p-4"
              >
                <div>
                  <p className="font-display text-base font-extrabold tracking-tight">
                    {course.title}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {course.completedLessons} lesson
                    {course.completedLessons === 1 ? "" : "s"} complete ·{" "}
                    {course.status}
                  </p>
                  <LearnProgressBar
                    className="mt-3"
                    value={course.completedLessons}
                    max={Math.max(course.completedLessons, 1)}
                  />
                </div>
                {course.slug ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/resources/${course.slug}`}>Open</Link>
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
