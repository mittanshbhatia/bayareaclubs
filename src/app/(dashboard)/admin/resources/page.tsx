import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listAdminCourses } from "@/features/stem/queries";
import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { STEM_DISCIPLINE_LABELS } from "@/lib/validation/stem";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  try {
    await requirePlatformAdmin();
  } catch (error) {
    handleAuthorizationError(error, "/admin/resources");
  }

  const courses = await listAdminCourses();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Resources
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Draft, review, publish, and archive free STEM resources. Metrics
            track subscriptions, starts, and completions — never academic
            performance.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new">New course</Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No STEM courses"
          description="Create the first free resource. External providers are linked; do not host copyrighted third-party course files."
        />
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course.id}
              className="rounded-xl border border-border bg-surface p-4 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/admin/resources/${course.id}`}
                    className="font-medium hover:underline"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {course.provider_name} ·{" "}
                    {STEM_DISCIPLINE_LABELS[
                      course.discipline as keyof typeof STEM_DISCIPLINE_LABELS
                    ] ?? course.discipline}
                    {" · "}
                    Free
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Subscriptions {course.metrics?.subscription_count ?? 0} ·
                    Starts {course.metrics?.start_count ?? 0} · Lesson
                    completions {course.metrics?.resource_completion_count ?? 0}{" "}
                    · Course completions{" "}
                    {course.metrics?.course_completion_count ?? 0}
                  </p>
                </div>
                <StatusBadge
                  status={
                    course.status === "published"
                      ? "approved"
                      : course.status === "draft"
                        ? "draft"
                        : course.status === "archived"
                          ? "rejected"
                          : "pending"
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
