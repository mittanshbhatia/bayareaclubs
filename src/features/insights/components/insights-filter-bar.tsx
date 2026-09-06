"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { FilterBar } from "@/components/ds/filter-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InsightsFilterBar({
  schools,
  categories,
  exportHref,
  defaultStart,
  defaultEnd,
}: {
  schools: { id: string; name: string }[];
  categories: string[];
  exportHref?: string;
  defaultStart: string;
  defaultEnd: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="sticky top-0 z-20 -mx-1 border-b border-border bg-surface/95 px-1 py-3 backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const next = new URLSearchParams();
        for (const key of ["start", "end", "schoolId", "gradeBand", "category"]) {
          const value = String(form.get(key) ?? "").trim();
          if (value && value !== "all") next.set(key, value);
        }
        startTransition(() => {
          router.push(`?${next.toString()}`);
        });
      }}
    >
      <FilterBar
        leading={
          <>
            <Input
              type="date"
              name="start"
              aria-label="Start date"
              defaultValue={params.get("start") ?? defaultStart}
              required
            />
            <Input
              type="date"
              name="end"
              aria-label="End date"
              defaultValue={params.get("end") ?? defaultEnd}
              required
            />
          </>
        }
        trailing={
          <>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating…" : "Apply"}
            </Button>
            {exportHref ? (
              <Button asChild variant="outline">
                <a href={exportHref}>Export CSV</a>
              </Button>
            ) : null}
          </>
        }
      >
        <select
          name="schoolId"
          aria-label="School"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          defaultValue={params.get("schoolId") ?? ""}
        >
          <option value="">All schools</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
        <select
          name="gradeBand"
          aria-label="Grade band"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          defaultValue={params.get("gradeBand") ?? "all"}
        >
          <option value="all">All grade bands</option>
          <option value="under_13">Elementary / middle</option>
          <option value="age_13_17">High school</option>
          <option value="adult">College / adult</option>
        </select>
        <select
          name="category"
          aria-label="Club category"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          defaultValue={params.get("category") ?? ""}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </FilterBar>
    </form>
  );
}
