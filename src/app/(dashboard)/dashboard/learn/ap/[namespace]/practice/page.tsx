import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { AttemptForm } from "@/features/learn/components/attempt-form";
import { getCourseByNamespace, listStudentQuestions } from "@/features/learn/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

function asChoices(value: unknown): Array<{ id: string; text: string }> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      "text" in item &&
      typeof item.id === "string" &&
      typeof item.text === "string"
    ) {
      return [{ id: item.id, text: item.text }];
    }
    return [];
  });
}

export default async function ApPracticePage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/learn/ap/${namespace}/practice`);
  }

  const bundle = await getCourseByNamespace(namespace);
  if (!bundle.course) {
    return (
      <EmptyState
        title="Practice not available"
        description="Practice opens after this course is published."
        actionLabel="Back to course"
        actionHref={`/dashboard/learn/ap/${namespace}`}
      />
    );
  }

  const questions = await listStudentQuestions(namespace);
  const courseId = bundle.course.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">{bundle.course.title}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Practice
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Checks are private to you. Officers and schools see counts only — never
            your answers.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/learn/ap/${namespace}`}>Back to course</Link>
        </Button>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          title="No published practice yet"
          description="Original questions appear here after they are approved and published."
        />
      ) : (
        <ol className="space-y-5">
          {questions.map((question, index) => (
            <li
              key={question.id}
              className="rounded-lg border border-(--course-border) bg-learning-surface p-4"
            >
              <p className="text-sm font-medium">
                {index + 1}. {question.prompt}
              </p>
              <div className="mt-3">
                <AttemptForm
                  courseId={courseId}
                  questionId={question.id}
                  questionType={question.question_type}
                  choices={asChoices(question.choices)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
