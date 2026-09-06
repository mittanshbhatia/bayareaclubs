"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { markResourceProgress } from "@/features/stem/actions";

export function MarkCompleteButton({
  courseId,
  resourceId,
  completed,
}: {
  courseId: string;
  resourceId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={completed ? "outline" : "default"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await markResourceProgress({
            courseId,
            resourceId,
            completed: !completed,
          });
          router.refresh();
        });
      }}
    >
      {pending ? "Saving…" : completed ? "Mark incomplete" : "Mark complete"}
    </Button>
  );
}
