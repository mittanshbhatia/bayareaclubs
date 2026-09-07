import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { QuestionSet } from "@/features/learn/components/question-set";
import { getCourseByNamespace } from "@/features/learn/queries";
import { listToolQuestions } from "@/features/learn/tools";
import type { CourseToolKind } from "@/features/learn/courses/types";

export async function ApToolPage({
  namespace,
  kind,
  title,
  description,
}: {
  namespace: string;
  kind: CourseToolKind;
  title: string;
  description: string;
}) {
  const bundle = await getCourseByNamespace(namespace);
  if (!bundle.course) {
    return (
      <EmptyState
        title={`${title} not available`}
        description="This tool opens after the course is published."
        actionLabel="Back to course"
        actionHref={`/dashboard/learn/ap/${namespace}`}
      />
    );
  }

  const { courseId, questions } = await listToolQuestions(namespace, kind);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">{bundle.course.title}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/learn/ap/${namespace}`}>Back to course</Link>
        </Button>
      </div>

      {questions.length === 0 || !courseId ? (
        <EmptyState
          title={`No published ${title.toLowerCase()} items`}
          description="Original questions appear here after they are approved and published."
        />
      ) : (
        <QuestionSet courseId={courseId} questions={questions} />
      )}
    </div>
  );
}
