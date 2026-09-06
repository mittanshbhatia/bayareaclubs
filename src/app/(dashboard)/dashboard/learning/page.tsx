import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-8">
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
        <ul className="space-y-4">
          {learning.map((item) => (
            <li
              key={item.subscription.id}
              className="rounded-lg border border-border bg-surface p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    {item.course?.title ?? "Course"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
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
              <p className="mt-3 text-sm">
                Progress: {item.completedCount} lesson
                {item.completedCount === 1 ? "" : "s"} marked complete
              </p>
              {item.nextResource ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Next: {item.nextResource.moduleTitle} — {item.nextResource.title}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
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
