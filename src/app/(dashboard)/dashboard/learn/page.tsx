import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { ApCourseCard } from "@/features/learn/components/ap-course-card";
import { AP_COURSE_REGISTRY } from "@/features/learn/courses/registry";
import { getMyLearnProgress, listPublishedApCatalog } from "@/features/learn/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { withAuthorization } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function LearnHubPage() {
  await withAuthorization("/dashboard/learn", () => requireActiveUser());

  const [catalog, progress] = await Promise.all([
    listPublishedApCatalog(1, 6),
    getMyLearnProgress(),
  ]);
  const shipping = AP_COURSE_REGISTRY.filter((entry) => entry.status === "shipping");

  return (
    <div
      className="space-y-8 rounded-xl p-1"
      style={{ background: "var(--learning-background)" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Learn</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Structured courses
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Original AP practice and your STEM subscriptions. Student work stays
            private — there is no public ranking.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/learning">STEM dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/learn/ap">Browse AP catalog</Link>
          </Button>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap aria-hidden className="size-4 text-primary" />
          <h2 className="font-semibold">Your AP practice</h2>
        </div>
        {progress.length === 0 ? (
          <EmptyState
            title="No AP attempts yet"
            description="Open a published course to work through lessons and practice questions."
            actionLabel="Browse AP courses"
            actionHref="/dashboard/learn/ap"
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {progress.map((item) => (
              <li
                key={item.courseId}
                className="rounded-lg border border-(--course-border) bg-learning-surface p-4"
              >
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.correctCount} of {item.attemptCount} recent checks correct
                </p>
                {item.namespace ? (
                  <Button asChild size="sm" variant="outline" className="mt-3">
                    <Link href={`/dashboard/learn/ap/${item.namespace}`}>Continue</Link>
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen aria-hidden className="size-4 text-primary" />
          <h2 className="font-semibold">Published AP courses</h2>
        </div>
        {catalog.courses.length === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {shipping.map((entry) => (
              <ApCourseCard
                key={entry.namespace}
                title={entry.title}
                description={entry.description}
                namespace={entry.namespace}
                icon={entry.icon}
                status="shipping"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {catalog.courses.map((course) => {
              const registry = AP_COURSE_REGISTRY.find(
                (entry) => entry.namespace === course.course_namespace,
              );
              return (
                <ApCourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  namespace={course.course_namespace}
                  icon={registry?.icon}
                  status="published"
                  minutes={course.estimated_minutes}
                  href={`/dashboard/learn/ap/${course.course_namespace}`}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
