"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { subscribeToCourse } from "@/features/stem/actions";

export function SubscribeButton({
  courseId,
  subscribed,
}: {
  courseId: string;
  subscribed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (subscribed) {
    return (
      <Button asChild variant="outline">
        <a href="/dashboard/learning">Open in My Learning</a>
      </Button>
    );
  }

  return (
    <Button
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await subscribeToCourse({ courseId });
          if (result.ok) router.push("/dashboard/learning");
          else router.refresh();
        });
      }}
    >
      {pending ? "Adding…" : "Add to Dashboard"}
    </Button>
  );
}
