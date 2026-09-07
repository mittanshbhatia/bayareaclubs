import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { CourseCardArt } from "@/features/learn/components/course-card-art";
import { CourseToolsCluster } from "@/features/learn/components/course-tools-cluster";
import { LearnProgressBar } from "@/features/learn/components/learn-progress";
import { courseFamilyLabel } from "@/features/learn/catalog-model";
import type { CourseTool } from "@/features/learn/courses/types";
import type { getCourseWorkspace } from "@/features/learn/queries";

type Workspace = Awaited<ReturnType<typeof getCourseWorkspace>>;

export function CourseWorkspace({
  namespace,
  workspace,
  tools,
}: {
  namespace: string;
  workspace: Workspace;
  tools: readonly CourseTool[];
}) {
  const title = workspace.course?.title ?? workspace.registry?.title ?? namespace;
  const description =
    workspace.course?.description ??
    workspace.registry?.description ??
    "Course details will appear after publication.";
  const planned = workspace.registry?.status === "planned" && !workspace.course;

  return (
    <div className="space-y-8" style={{ background: "var(--learning-background)" }}>
      <header className="overflow-hidden rounded-md border border-(--course-border) bg-learning-surface">
        <div className="relative h-28 w-full overflow-hidden">
          <CourseCardArt namespace={namespace} />
        </div>
        <div className="p-5">
          <p className="text-sm font-medium text-primary">{courseFamilyLabel(namespace)}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          <LearnProgressBar
            className="mt-4 max-w-xl"
            value={workspace.progress.questionsCorrect}
            max={Math.max(1, workspace.progress.questionTotal)}
            label={`${workspace.progress.questionsCorrect} of ${workspace.progress.questionTotal} original items correct`}
          />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-(--course-border) bg-learning-surface p-5">
          <h2 className="font-semibold">Continue</h2>
          <p className="mt-2 text-sm text-muted-foreground">{workspace.continueTarget.detail}</p>
          <p className="mt-1 font-display text-lg font-extrabold tracking-tight">
            {workspace.continueTarget.title}
          </p>
          <Button asChild className="mt-4">
            <Link href={workspace.continueTarget.href}>Continue</Link>
          </Button>
        </div>
        <div className="rounded-md border border-(--course-border) bg-learning-surface p-5">
          <h2 className="font-semibold">Practice</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Original items stay on your account. Officers see counts, not answers.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href={`/dashboard/learn/ap/${namespace}/practice`}>Open practice</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="space-y-3">
          <h2 className="font-semibold">Unit map</h2>
          {workspace.units.length === 0 ? (
            <EmptyState
              title={planned ? "Planned course" : "No published units yet"}
              description={
                planned
                  ? "This title is on the roadmap. It is not published and has no lessons."
                  : "Units appear here after a platform administrator publishes approved content."
              }
              actionLabel="Back to catalog"
              actionHref="/dashboard/learn/ap"
            />
          ) : (
            <ol className="space-y-3">
              {workspace.units.map((unit, index) => {
                const lessonCount = workspace.lessons.filter(
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
                    <p className="text-xs font-semibold text-primary">Unit {index + 1}</p>
                    <h3 className="mt-1 font-semibold">{unit.title}</h3>
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
        </section>
        {workspace.course ? <CourseToolsCluster namespace={namespace} tools={tools} /> : null}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-(--course-border) bg-learning-surface p-5">
          <h2 className="font-semibold">Weak areas</h2>
          {workspace.weakAreas.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Weak units appear after at least two checks in a unit land below 70% correct.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {workspace.weakAreas.map((area) => (
                <li key={area.unitId}>
                  <p className="font-medium">{area.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(area.accuracy * 100)}% correct across {area.attemptCount} checks
                  </p>
                  {area.href ? (
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <Link href={area.href}>Review unit</Link>
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-md border border-(--course-border) bg-learning-surface p-5">
          <h2 className="font-semibold">Recent results</h2>
          {workspace.recentResults.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Your latest checks appear here after you submit practice.
            </p>
          ) : (
            <ol className="mt-3 space-y-2">
              {workspace.recentResults.map((result) => (
                <li key={`${result.questionId}-${result.createdAt}`} className="text-sm">
                  <span className="font-medium">
                    {result.isCorrect ? "Correct" : "Needs review"}
                  </span>
                  <p className="line-clamp-2 text-muted-foreground">{result.prompt}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
