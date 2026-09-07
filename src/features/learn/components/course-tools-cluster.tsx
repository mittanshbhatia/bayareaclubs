import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { CourseTool } from "@/features/learn/courses/types";
import { toolHref } from "@/features/learn/tool-href";

export function CourseToolsCluster({
  namespace,
  tools,
}: {
  namespace: string;
  tools: readonly CourseTool[];
}) {
  return (
    <aside className="rounded-md border border-(--course-border) bg-learning-surface p-5">
      <h2 className="font-semibold">Study tools</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Practice, quizzes, notes, and readiness stay beside the unit map.
      </p>
      <ul className="mt-4 space-y-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={toolHref(namespace, tool.kind)}>{tool.title}</Link>
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
