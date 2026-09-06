import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listClubNewsletters } from "@/features/publishing/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function ClubNewsletterPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, `/clubs/${clubSlug}/newsletter`);
    }
    throw error;
  }
  if (!context) notFound();

  const newsletters = await listClubNewsletters(context.club.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Newsletter Studio is database-driven with structured blocks. Pull only
          recorded club facts, preview desktop/mobile/email, then draft, test,
          schedule, send, or archive.
        </p>
        <Button asChild>
          <Link href={`/clubs/${clubSlug}/newsletter/new`}>New newsletter</Link>
        </Button>
      </div>

      {newsletters.length === 0 ? (
        <EmptyState
          title="No newsletters"
          description="Create an issue after you have activities, events, or highlights to summarize."
        />
      ) : (
        <ul className="space-y-3">
          {newsletters.map((newsletter) => (
            <li
              key={newsletter.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <div>
                <Link
                  href={`/clubs/${clubSlug}/newsletter/${newsletter.id}`}
                  className="font-medium hover:underline"
                >
                  {newsletter.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {newsletter.issue_label ? `${newsletter.issue_label} · ` : ""}
                  {newsletter.published_at
                    ? `Published ${new Date(newsletter.published_at).toLocaleDateString()}`
                    : newsletter.scheduled_for
                      ? `Scheduled ${new Date(newsletter.scheduled_for).toLocaleString()}`
                      : "Draft"}
                  {newsletter.visibility === "public" &&
                  newsletter.status === "published"
                    ? ` · Public /p/${clubSlug}/newsletters/${newsletter.id}`
                    : ""}
                </p>
              </div>
              <StatusBadge
                status={
                  newsletter.status === "published"
                    ? "approved"
                    : newsletter.status === "draft"
                      ? "draft"
                      : "pending"
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
