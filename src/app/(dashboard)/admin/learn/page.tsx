import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { ReviewActions } from "@/features/learn/components/review-actions";
import { listReviewEvents, listReviewQueue } from "@/features/learn/queries";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import type { LearningPublicationStatus } from "@/lib/validation/learn";

export const dynamic = "force-dynamic";

function badgeFor(status: string) {
  if (status === "published" || status === "approved") return "approved" as const;
  if (status === "draft") return "draft" as const;
  if (status === "archived") return "archived" as const;
  return "pending" as const;
}

export default async function AdminLearnReviewPage() {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/admin/learn");
  }

  const queue = await listReviewQueue();
  const eventsByCourse = await Promise.all(
    queue.slice(0, 12).map(async (course) => ({
      courseId: course.id,
      events: await listReviewEvents(course.id),
    })),
  );
  const eventMap = new Map(eventsByCourse.map((row) => [row.courseId, row.events]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Learning review
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          AP courses move draft → review → approved → published. Only a platform
          administrator can publish after approval. AI cannot publish.
        </p>
      </div>

      {queue.length === 0 ? (
        <EmptyState
          title="No AP courses in the queue"
          description="When authors submit a course for review it will appear here."
        />
      ) : (
        <ul className="space-y-4">
          {queue.map((course) => {
            const events = eventMap.get(course.id) ?? [];
            const status = course.status as LearningPublicationStatus;
            return (
              <li
                key={course.id}
                className="rounded-lg border border-border bg-surface p-4 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {course.course_namespace} · {course.source_basis}
                    </p>
                  </div>
                  <StatusBadge status={badgeFor(course.status)} />
                </div>
                <div className="mt-4">
                  <ReviewActions courseId={course.id} status={status} />
                </div>
                {events.length ? (
                  <ol className="mt-4 space-y-1 text-xs text-muted-foreground">
                    {events.slice(0, 5).map((event) => (
                      <li key={event.id}>
                        {event.from_status} → {event.to_status}
                        {event.notes ? ` · ${event.notes}` : ""}
                      </li>
                    ))}
                  </ol>
                ) : null}
                {course.course_namespace ? (
                  <Button asChild size="sm" variant="outline" className="mt-3">
                    <Link href={`/dashboard/learn/ap/${course.course_namespace}`}>
                      Preview student route
                    </Link>
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
