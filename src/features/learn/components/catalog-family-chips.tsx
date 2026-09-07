import Link from "next/link";

import { cn } from "@/lib/utils";
import type { CatalogFamily } from "@/features/learn/courses/registry";

const CHIPS: Array<{ family: CatalogFamily; label: string }> = [
  { family: "all", label: "All AP" },
  { family: "cs", label: "Computer science" },
  { family: "math", label: "Mathematics" },
  { family: "science", label: "Sciences" },
  { family: "social", label: "Social science" },
];

export function CatalogFamilyChips({
  family,
  basePath = "/dashboard/learn/ap",
}: {
  family: CatalogFamily;
  basePath?: string;
}) {
  return (
    <nav aria-label="AP subject families" className="flex flex-wrap gap-2">
      {CHIPS.map((chip) => {
        const href =
          chip.family === "all" ? basePath : `${basePath}?family=${chip.family}`;
        const selected = family === chip.family;
        return (
          <Link
            key={chip.family}
            href={href}
            className={cn(
              "inline-flex h-10 items-center rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-(--course-border) bg-learning-surface text-foreground",
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </nav>
  );
}
