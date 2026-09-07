import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import { CourseToolsCluster } from "@/features/learn/components/course-tools-cluster";
import { getRegistryEntry } from "@/features/learn/courses/registry";
import { getCourseByNamespace } from "@/features/learn/queries";
import { listCourseTools } from "@/features/learn/tools";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApCoursePage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}`);
  }

  const bundle = await getCourseByNamespace(namespace);
  const registry = bundle.registry ?? getRegistryEntry(namespace);

  if (!bundle.course && !registry) {
    return (
      <EmptyState
        title="Course not found"
        description="That AP namespace is not in the published catalog or the planned registry."
        actionLabel="Back to AP catalog"
        actionHref="/dashboard/learn/ap"
      />
    );
  }

  const title = bundle.course?.title ?? registry?.title ?? namespace;
  const description =
    bundle.course?.description ??
    registry?.description ??
    "Course details will appear after publication.";
  const tools = await listCourseTools(namespace);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-md border border-(--course-border) bg-learning-surface">
        <div className="relative h-28 w-full overflow-hidden">
          <CourseCardArt namespace={namespace} />
        </div>
        <div className="p-5">
          <p className="text-sm font-medium text-primary">{namespace}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">

      {bundle.units.length === 0 ? (
        <EmptyState
          title={registry?.status === "planned" ? "Planned course" : "No published units yet"}
          description={
            registry?.status === "planned"
              ? "This title is on the P1 roadmap. It is not published and has no lessons."
              : "Units appear here after a platform administrator publishes approved content."
          }
          actionLabel="Back to catalog"
          actionHref="/dashboard/learn/ap"
        />
      ) : (
        <ol className="space-y-3">
          {bundle.units.map((unit) => {
            const lessonCount = bundle.lessons.filter(
              (lesson) => lesson.module_id === unit.id,
            ).length;
            const href = unit.slug
              ? `/dashboard/learn/ap/${namespace}/${unit.slug}`
              : null;
            return (
              <li
                key={unit.id}
                className="rounded-md border border-(--course-border) bg-learning-surface p-4"
              >
                <h2 className="font-semibold">{unit.title}</h2>
                {unit.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{unit.description}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {lessonCount} published lesson{lessonCount === 1 ? "" : "s"}
                </p>
                {href ? (
                  <Button asChild size="sm" className="mt-3" variant="outline">
                    <Link href={href}>Open unit</Link>
                  </Button>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    This unit is missing a slug, so it cannot be opened yet.
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
        {bundle.course ? <CourseToolsCluster namespace={namespace} tools={tools} /> : null}
      </div>
    </div>
  );
}
