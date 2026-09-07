import { AttemptForm } from "@/features/learn/components/attempt-form";
import type { StudentQuestion } from "@/features/learn/database";

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

export function QuestionSet({
  courseId,
  questions,
}: {
  courseId: string;
  questions: StudentQuestion[];
}) {
  return (
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
  );
}
