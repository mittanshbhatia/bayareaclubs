import { notFound } from "next/navigation";

import { NewsletterStudio } from "@/features/publishing/components/newsletter-studio";
import {
  getNewsletterStudio,
  listPublishedCoursesForStudio,
} from "@/features/publishing/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import type { NewsletterBlockInput } from "@/lib/validation/publishing";

export const dynamic = "force-dynamic";

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ clubSlug: string; newsletterId: string }>;
}) {
  const { clubSlug, newsletterId } = await params;
  let context;
  try {
    context = await resolveClubBySlugForOfficer(clubSlug);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(
        error,
        `/clubs/${clubSlug}/newsletter/${newsletterId}`,
      );
    }
    throw error;
  }
  if (!context) notFound();

  const [studio, courses] = await Promise.all([
    getNewsletterStudio(context.club.id, newsletterId),
    listPublishedCoursesForStudio(),
  ]);
  if (!studio) notFound();

  const blocks: NewsletterBlockInput[] = studio.blocks.map((block) => ({
    id: block.id,
    blockType: block.block_type as NewsletterBlockInput["blockType"],
    content: (block.content ?? {}) as Record<string, unknown>,
  }));

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Newsletter Studio
      </h2>
      <NewsletterStudio
        clubId={context.club.id}
        clubName={context.club.name}
        clubSlug={clubSlug}
        newsletterId={newsletterId}
        courses={courses}
        initial={{
          title: studio.newsletter.title,
          issueLabel: studio.newsletter.issue_label ?? "",
          previewText: studio.newsletter.preview_text ?? "",
          visibility: studio.newsletter.visibility,
          periodStart: studio.newsletter.period_start ?? "",
          periodEnd: studio.newsletter.period_end ?? "",
          selectedFacts:
            (studio.newsletter.selected_facts as Record<string, unknown>) ?? {},
          blocks,
          status: studio.newsletter.status,
        }}
      />
    </div>
  );
}
