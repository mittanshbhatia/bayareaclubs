import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { AttemptForm } from "@/features/learn/components/attempt-form";
import { getLessonBySlug, listStudentQuestions } from "@/features/learn/queries";
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

export default async function ApLessonPage({
  params,
}: {
  params: Promise<{ namespace: string; unitSlug: string; lessonSlug: string }>;
}) {
  const { namespace, unitSlug, lessonSlug } = await params;
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(
      error,
      `/dashboard/learn/ap/${namespace}/${unitSlug}/${lessonSlug}`,
    );
  }

  const bundle = await getLessonBySlug(namespace, unitSlug, lessonSlug);
  if (!bundle.course || !bundle.unit || !bundle.lesson) {
    return (
      <EmptyState
        title="Lesson not available"
        description="Only published lessons on published courses are visible."
        actionLabel="Back to unit"
        actionHref={`/dashboard/learn/ap/${namespace}/${unitSlug}`}
      />
    );
  }

  const questions = await listStudentQuestions(namespace, bundle.lesson.id);
  const courseId = bundle.course.id;

  return (
    <article className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">{bundle.unit.title}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          {bundle.lesson.title}
        </h1>
        {bundle.lesson.estimated_minutes ? (
          <p className="mt-2 text-sm text-muted-foreground">
            About {bundle.lesson.estimated_minutes} minutes
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-(--course-border) bg-learning-surface p-5">
        <p className="whitespace-pre-wrap text-sm leading-7">{bundle.lesson.body_plain}</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold">Check your understanding</h2>
        {questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Practice items for this lesson are not published yet.
          </p>
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
      </section>

      <Button asChild variant="outline">
        <Link href={`/dashboard/learn/ap/${namespace}/${unitSlug}`}>Back to unit</Link>
      </Button>
    </article>
  );
}
