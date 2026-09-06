"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  adminSectionsForRoles,
  type PlatformRoleKey,
} from "@/features/admin/sections";
import { cn } from "@/lib/utils";

export function AdminCommandNav({ roles }: { roles: PlatformRoleKey[] }) {
  const pathname = usePathname();
  const sections = adminSectionsForRoles(roles);
  const base = "/admin";

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
          Administration console
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          BayAreaClubs Admin
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review applications, govern clubs and schools, and audit operational
          changes—without exposing student home locations or unnecessary PII.
        </p>
        <nav
          aria-label="Administration sections"
          className="mt-5 -mb-px flex gap-1 overflow-x-auto pb-0"
        >
          {sections.map((section) => {
            const href = `${base}${section.href}`;
            const active =
              section.href === ""
                ? pathname === base || pathname === `${base}/`
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
      </div>
    </div>
  );
}
