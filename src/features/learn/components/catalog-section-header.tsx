import {
  Binary,
  Brain,
  Calculator,
  FlaskConical,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

import { familyCategory, familyLabel } from "@/features/learn/catalog-model";
import type { CatalogFamily } from "@/features/learn/courses/registry";

const FAMILY_ICONS: Record<Exclude<CatalogFamily, "all">, LucideIcon> = {
  cs: Binary,
  math: Calculator,
  science: FlaskConical,
  social: Brain,
};

export function CatalogSectionHeader({
  family,
  title,
  category,
  headingId,
}: {
  family?: Exclude<CatalogFamily, "all">;
  title?: string;
  category?: string;
  headingId?: string;
}) {
  const heading = title ?? (family ? familyLabel(family) : "Courses");
  const kicker = category ?? (family ? familyCategory(family) : null);
  const Icon = family ? FAMILY_ICONS[family] : GraduationCap;

  return (
    <div className="flex items-center gap-2 border-b border-(--course-border) pb-3">
      <Icon aria-hidden className="size-5 shrink-0 text-accent" />
      <h2
        id={headingId}
        className="font-display text-xl font-semibold tracking-tight"
      >
        {heading}
        {kicker ? (
          <>
            <span className="mx-2 font-normal text-muted-foreground"> · </span>
            <span className="text-base font-normal text-muted-foreground italic">
              {kicker}
            </span>
          </>
        ) : null}
      </h2>
    </div>
  );
}
