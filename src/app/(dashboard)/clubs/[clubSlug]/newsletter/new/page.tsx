import { notFound } from "next/navigation";

import { NewsletterStudio } from "@/features/publishing/components/newsletter-studio";
import {
  listPublishedCoursesForStudio,
} from "@/features/publishing/queries";
import { resolveClubBySlugForOfficer } from "@/features/clubs/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function NewNewsletterPage({
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
      handleAuthorizationError(error, `/clubs/${clubSlug}/newsletter/new`);
    }
    throw error;
  }
  if (!context) notFound();

  const courses = await listPublishedCoursesForStudio();

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Newsletter Studio
      </h2>
      <NewsletterStudio
        clubId={context.club.id}
        clubName={context.club.name}
        clubSlug={clubSlug}
        courses={courses}
      />
    </div>
  );
}
