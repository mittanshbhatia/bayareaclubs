import Link from "next/link";

import { PageContainer } from "@/components/ds/page-container";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  listCommitteeReviewers,
  listReviewQueue,
  reviewAgeHours,
  type ClubIdeaStatus,
} from "@/features/ideas/queries";
import { ideaStatusToBadge } from "@/features/ideas/status";
import { requireCommitteeReviewer } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ideaCategories } from "@/lib/validation/ideas";

export const dynamic = "force-dynamic";

function slaClass(hours: number | null) {
  if (hours == null) return "text-muted-foreground";
  if (hours >= 72) return "text-danger font-semibold";
  if (hours >= 48) return "text-warning font-medium";
  return "text-muted-foreground";
}

export default async function AdminIdeasQueuePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  try {
    await requireCommitteeReviewer();
  } catch (error) {
    handleAuthorizationError(error, "/admin/ideas");
  }

  const params = await searchParams;
  const schoolId = typeof params.school === "string" ? params.school : undefined;
  const status =
    typeof params.status === "string"
      ? (params.status as ClubIdeaStatus | "all")
      : "all";
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.q === "string" ? params.q : undefined;
  const reviewerId =
    typeof params.reviewer === "string" ? params.reviewer : undefined;
  const sort =
    typeof params.sort === "string" ? params.sort : "submitted_asc";

  const [rows, reviewers, schoolsResult] = await Promise.all([
    listReviewQueue({ schoolId, status, category, search, reviewerId }),
    listCommitteeReviewers(),
    (async () => {
      const supabase = await createClient();
      return supabase.from("schools").select("id, name").order("name");
    })(),
  ]);

  const schools = schoolsResult.data ?? [];

  const sorted = [...rows].sort((a, b) => {
    const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
    const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
    if (sort === "submitted_desc") return bTime - aTime;
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "age_desc") return aTime - bTime;
    return aTime - bTime;
  });

  return (
    <PageContainer className="py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Club idea review queue
        </h1>
        <p className="mt-2 text-muted-foreground">
          Filter, prioritize, and decide applications across schools.
        </p>
      </div>

      <form className="mb-6 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Search</span>
          <Input name="q" defaultValue={search ?? ""} placeholder="Title or category" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">School</span>
          <select
            name="school"
            defaultValue={schoolId ?? ""}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
          >
            <option value="">All schools</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Status</span>
          <select
            name="status"
            defaultValue={status}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
          >
            <option value="all">All</option>
            {[
              "submitted",
              "under_review",
              "changes_requested",
              "resubmitted",
              "approved",
              "rejected",
              "converted_to_club",
            ].map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Category</span>
          <select
            name="category"
            defaultValue={category ?? ""}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
          >
            <option value="">All categories</option>
            {ideaCategories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Assigned reviewer</span>
          <select
            name="reviewer"
            defaultValue={reviewerId ?? ""}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
          >
            <option value="">Anyone</option>
            {reviewers.map((row) => {
              const profile = row.profiles as
                | { id: string; display_name: string }
                | null
                | undefined;
              if (!profile) return null;
              return (
                <option key={profile.id} value={profile.id}>
                  {profile.display_name}
                </option>
              );
            })}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
          >
            <option value="submitted_asc">Oldest submission</option>
            <option value="submitted_desc">Newest submission</option>
            <option value="age_desc">SLA age</option>
            <option value="title">Title</option>
          </select>
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-3">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      <ul className="space-y-3">
        {sorted.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            No ideas match these filters.
          </li>
        ) : (
          sorted.map((idea) => {
            const age = reviewAgeHours(idea.submitted_at);
            const activeReview = (idea.club_idea_reviews ?? []).find(
              (review) => !review.reviewed_at,
            );
            return (
              <li key={idea.id}>
                <Link
                  href={`/admin/ideas/${idea.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs hover:bg-surface-muted"
                >
                  <div>
                    <p className="font-semibold">{idea.title || "Untitled"}</p>
                    <p className="text-sm text-muted-foreground">
                      {idea.schools?.name} · {idea.category} ·{" "}
                      {idea.profiles?.display_name ?? "Applicant"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("text-xs", slaClass(age))}>
                      {age == null ? "Not submitted" : `${age}h in queue`}
                    </span>
                    {activeReview ? (
                      <span className="text-xs text-muted-foreground">
                        Assigned
                      </span>
                    ) : null}
                    <StatusBadge status={ideaStatusToBadge(idea.status)} />
                  </div>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </PageContainer>
  );
}
