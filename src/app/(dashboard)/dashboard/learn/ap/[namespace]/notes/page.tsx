import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { getCourseByNamespace } from "@/features/learn/queries";
import { listToolNotes } from "@/features/learn/tools";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApNotesPage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/notes`);
  }

  const bundle = await getCourseByNamespace(namespace);
  if (!bundle.course) {
    return (
      <EmptyState
        title="Notes not available"
        description="Original lesson notes open after this course is published."
        actionLabel="Back to course"
        actionHref={`/dashboard/learn/ap/${namespace}`}
      />
    );
  }

  const notes = await listToolNotes(namespace);
  const unitById = new Map(bundle.units.map((unit) => [unit.id, unit]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">{notes.title}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Original BayAreaClubs lesson text. This is not College Board material.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/learn/ap/${namespace}`}>Back to course</Link>
        </Button>
      </div>

      {notes.lessons.length === 0 ? (
        <EmptyState
          title="No published notes"
          description="Lesson notes appear here after units are published."
        />
      ) : (
        <ol className="space-y-4">
          {notes.lessons.map((lesson) => {
            const unit = unitById.get(lesson.module_id);
            const href =
              unit?.slug && lesson.slug
                ? `/dashboard/learn/ap/${namespace}/${unit.slug}/${lesson.slug}`
                : null;
            return (
              <li
                key={lesson.id}
                className="rounded-lg border border-(--course-border) bg-learning-surface p-4"
              >
                <p className="text-xs text-muted-foreground">{unit?.title ?? "Unit"}</p>
                <h2 className="mt-1 font-semibold">{lesson.title}</h2>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {lesson.body_plain}
                </p>
                {href ? (
                  <Button asChild size="sm" className="mt-3" variant="outline">
                    <Link href={href}>Open full lesson</Link>
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
