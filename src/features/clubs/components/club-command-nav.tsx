"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CLUB_SECTIONS } from "@/lib/validation/clubs";
import { cn } from "@/lib/utils";

export function ClubCommandNav({
  clubSlug,
  clubName,
}: {
  clubSlug: string;
  clubName: string;
}) {
  const pathname = usePathname();
  const base = `/clubs/${clubSlug}`;

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          Club workspace
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {clubName}
        </h1>
        <div className="relative mt-5">
          <nav
            aria-label="Club sections"
            className="scrollbar-none -mb-px flex gap-1 overflow-x-auto pb-0"
          >
            {CLUB_SECTIONS.map((section) => {
              const href = `${base}${section.href}`;
              const active =
                section.href === ""
                  ? pathname === base
                  : pathname.startsWith(href);
              return (
                <Link
                  key={section.key}
                  href={href}
                  className={cn(
                    "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {section.label}
                </Link>
              );
            })}
          </nav>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent sm:hidden"
          />
        </div>
      </div>
    </div>
  );
}
