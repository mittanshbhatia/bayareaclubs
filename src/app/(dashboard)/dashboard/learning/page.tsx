import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { LearnProgressBar } from "@/features/learn/components/learn-progress";
import { listMyLearning } from "@/features/stem/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { STEM_DISCIPLINE_LABELS, formatEffortMinutes } from "@/lib/validation/stem";

export const dynamic = "force-dynamic";

export default async function MyLearningPage() {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/dashboard/learning");
    return null;
  }

  const learning = await listMyLearning(user.id);

  return (
    <div className="space-y-8" style={{ background: "var(--learning-background)" }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">My Learning</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Learning dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Subscribed free STEM courses, progress, and next lessons. Usage here
            is for learning engagement only — never academic performance.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/resources">Browse STEM Resources</Link>
        </Button>
      </div>

      {learning.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            title="No courses yet"
            description="Add a free resource from the STEM catalog to start tracking progress."
          />
          <Button asChild>
            <Link href="/resources">Explore resources</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18.75rem,1fr))]">
          {learning.map((item) => (
            <li
              key={item.subscription.id}
              className="rounded-md border border-(--course-border) bg-learning-surface p-4 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-extrabold tracking-tight">
                    {item.course?.title ?? "Course"}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {item.course?.provider_name}
                    {item.course?.discipline
                      ? ` · ${
                          STEM_DISCIPLINE_LABELS[
                            item.course.discipline as keyof typeof STEM_DISCIPLINE_LABELS
                          ] ?? item.course.discipline
                        }`
                      : ""}
                    {item.course?.estimated_minutes
                      ? ` · ${formatEffortMinutes(item.course.estimated_minutes)}`
                      : ""}
                  </p>
                </div>
                <StatusBadge
                  status={
                    item.subscription.status === "completed"
                      ? "approved"
                      : item.subscription.status === "active"
                        ? "active"
                        : "pending"
                  }
                />
              </div>
              <LearnProgressBar
                className="mt-3"
                value={item.completedCount}
                max={Math.max(item.progressCount, item.completedCount, 1)}
                label={`${item.completedCount} lesson${item.completedCount === 1 ? "" : "s"} marked complete`}
              />
              {item.nextResource ? (
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  Next: {item.nextResource.moduleTitle} — {item.nextResource.title}
                </p>
              ) : (
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  No remaining lessons in the published outline.
                </p>
              )}
              {item.course?.slug ? (
                <Button asChild size="sm" className="mt-4" variant="outline">
                  <Link href={`/resources/${item.course.slug}`}>Continue</Link>
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
