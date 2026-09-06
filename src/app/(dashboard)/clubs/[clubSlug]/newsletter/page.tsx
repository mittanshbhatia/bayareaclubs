import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/badges";
import {
  listNewsletters,
  resolveClubBySlugForOfficer,
} from "@/features/clubs/queries";
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

  const newsletters = await listNewsletters(context.club.id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Newsletters can pull from logged activities and highlights. Composer tools
        will expand here.
      </p>
      {newsletters.length === 0 ? (
        <EmptyState
          title="No newsletters"
          description="Create an issue after you have activities or highlights to summarize."
        />
      ) : (
        <ul className="space-y-3">
          {newsletters.map((newsletter) => (
            <li
              key={newsletter.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs"
            >
              <div>
                <p className="font-medium">{newsletter.title}</p>
                <p className="text-sm text-muted-foreground">
                  {newsletter.published_at
                    ? `Published ${new Date(newsletter.published_at).toLocaleDateString()}`
                    : "Not published"}
                </p>
              </div>
              <StatusBadge
                status={newsletter.status === "published" ? "approved" : "draft"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
