import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { getCourseByNamespace, listStudentQuestions } from "@/features/learn/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ApTestsPage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/tests`);
  }

  const bundle = await getCourseByNamespace(namespace);
  if (!bundle.course) {
    return (
      <EmptyState
        title="Tests not available"
        description="Timed tests open only for published courses."
        actionLabel="Back to course"
        actionHref={`/dashboard/learn/ap/${namespace}`}
      />
    );
  }

  const questions = await listStudentQuestions(namespace);
  const ready = questions.length >= 8;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">{bundle.course.title}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Tests
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Formal tests require a published original item bank. Results stay on
            your account. There is no public leaderboard.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/learn/ap/${namespace}`}>Back to course</Link>
        </Button>
      </div>

      {ready ? (
        <div className="rounded-lg border border-(--course-border) bg-learning-surface p-5">
          <h2 className="font-semibold">Practice bank is ready</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {questions.length} published questions are available. Use Practice to
            work through them. A timed test form will unlock when the course team
            marks a test set.
          </p>
          <Button asChild className="mt-4">
            <Link href={`/dashboard/learn/ap/${namespace}/practice`}>
              Open practice instead
            </Link>
          </Button>
        </div>
      ) : (
        <EmptyState
          title="No published test set"
          description="A test set is not published for this course yet. Practice stays available when questions are published."
          actionLabel="Open practice"
          actionHref={`/dashboard/learn/ap/${namespace}/practice`}
        />
      )}
    </div>
  );
}
