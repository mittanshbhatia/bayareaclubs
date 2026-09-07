import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { getUnitBySlug } from "@/features/learn/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApUnitPage({
  params,
}: {
  params: Promise<{ namespace: string; unitSlug: string }>;
}) {
  const { namespace, unitSlug } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/${unitSlug}`);
  }

  const bundle = await getUnitBySlug(namespace, unitSlug);
  if (!bundle.course || !bundle.unit) {
    return (
      <EmptyState
        title="Unit not available"
        description="Published units appear after the course is approved and published."
        actionLabel="Back to course"
        actionHref={`/dashboard/learn/ap/${namespace}`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">{bundle.course.title}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          {bundle.unit.title}
        </h1>
        {bundle.unit.description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {bundle.unit.description}
          </p>
        ) : null}
      </div>

      {bundle.lessons.length === 0 ? (
        <EmptyState
          title="No published lessons"
          description="Lessons in this unit are not published yet."
          actionLabel="Back to course"
          actionHref={`/dashboard/learn/ap/${namespace}`}
        />
      ) : (
        <ol className="space-y-3">
          {bundle.lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="rounded-lg border border-(--course-border) bg-learning-surface p-4"
            >
              <h2 className="font-semibold">{lesson.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {lesson.estimated_minutes
                  ? `${lesson.estimated_minutes} min`
                  : "Self-paced"}
              </p>
              <Button asChild size="sm" className="mt-3" variant="outline">
                <Link
                  href={`/dashboard/learn/ap/${namespace}/${unitSlug}/${lesson.slug}`}
                >
                  Open lesson
                </Link>
              </Button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
