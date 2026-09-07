"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { subscribeToCourse } from "@/features/stem/actions";

export function SubscribeButton({
  courseId,
  subscribed,
  href,
}: {
  courseId: string;
  subscribed: boolean;
  href: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (subscribed) {
    return (
      <Button asChild variant="outline">
        <a href={href}>Open course</a>
      </Button>
    );
  }

  return (
    <Button
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await subscribeToCourse({ courseId });
          if (result.ok) router.push(href);
          else router.refresh();
        });
      }}
    >
      {pending ? "Adding…" : "Add to STEM catalog"}
    </Button>
  );
}
