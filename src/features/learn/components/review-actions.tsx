"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  approveCourse,
  archiveCourse,
  publishCourse,
  submitForReview,
} from "@/features/learn/actions";
import type { LearningPublicationStatus } from "@/lib/validation/learn";

type ReviewActionsProps = {
  courseId: string;
  status: LearningPublicationStatus;
};

export function ReviewActions({ courseId, status }: ReviewActionsProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function run(
    action: typeof submitForReview,
    label: string,
  ) {
    startTransition(async () => {
      setMessage(null);
      const result = await action({ courseId, toStatus: status });
      setMessage(result.ok ? `${label} succeeded.` : result.error.message);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {status === "draft" ? (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run(submitForReview, "Submit for review")}
          >
            Submit for review
          </Button>
        ) : null}
        {status === "review" ? (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run(approveCourse, "Approve")}
          >
            Approve
          </Button>
        ) : null}
        {status === "approved" ? (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run(publishCourse, "Publish")}
          >
            Publish
          </Button>
        ) : null}
        {status === "published" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(archiveCourse, "Archive")}
          >
            Archive
          </Button>
        ) : null}
        {status === "draft" || status === "review" ? (
          <p className="self-center text-xs text-muted-foreground">
            Publish stays disabled until the course is approved.
          </p>
        ) : null}
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
