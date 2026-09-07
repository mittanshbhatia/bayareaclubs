"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { recordAttempt } from "@/features/learn/actions";

type Choice = { id: string; text: string };

type AttemptFormProps = {
  courseId: string;
  questionId: string;
  questionType: "multiple_choice" | "short_response";
  choices: Choice[];
};

export function AttemptForm({
  courseId,
  questionId,
  questionType,
  choices,
}: AttemptFormProps) {
  const [pending, startTransition] = useTransition();
  const [choiceId, setChoiceId] = useState<string>("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const response = await recordAttempt({
        courseId,
        questionId,
        choiceId: questionType === "multiple_choice" ? choiceId : undefined,
        text: questionType === "short_response" ? text : undefined,
      });
      if (!response.ok) {
        setResult(response.error.message);
        return;
      }
      setResult(
        response.data.isCorrect
          ? `Correct.${response.data.explanation ? ` ${response.data.explanation}` : ""}`
          : `Not quite.${response.data.explanation ? ` ${response.data.explanation}` : ""}`,
      );
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {questionType === "multiple_choice" ? (
        <fieldset className="space-y-2">
          <legend className="sr-only">Answer choices</legend>
          {choices.map((choice) => (
            <label
              key={choice.id}
              className="flex items-start gap-2 rounded-md border border-(--course-border) bg-learning-surface px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name={`choice-${questionId}`}
                value={choice.id}
                checked={choiceId === choice.id}
                onChange={() => setChoiceId(choice.id)}
                className="mt-1"
                required
              />
              <span>{choice.text}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Your response</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            required
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Checking…" : "Check answer"}
      </Button>
      {result ? (
        <p className="text-sm" style={{ color: "var(--course-muted)" }} role="status">
          {result}
        </p>
      ) : null}
    </form>
  );
}
