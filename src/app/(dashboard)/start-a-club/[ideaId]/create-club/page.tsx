import Link from "next/link";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/ds/page-container";
import { CreateClubConfirmForm } from "@/features/ideas/components/create-club-confirm-form";
import { getIdeaDetail } from "@/features/ideas/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CreateClubFromIdeaPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/start-a-club/${ideaId}/create-club`);
  }

  const idea = await getIdeaDetail(ideaId);
  if (!idea) {
    redirect("/start-a-club");
  }

  const supabase = await createClient();
  const { data: canReview } = await supabase.rpc("can_review_school", {
    target_school_id: idea.school_id,
  });
  const canConvert = idea.submitter_id === user!.id || Boolean(canReview);
  if (!canConvert) {
    redirect("/unauthorized");
  }

  if (idea.status === "converted_to_club") {
    const { data: club } = await supabase
      .from("clubs")
      .select("id")
      .eq("originating_idea_id", idea.id)
      .maybeSingle();
    if (club) redirect(`/dashboard/clubs/${club.id}/onboarding`);
  }

  if (idea.status !== "approved") {
    redirect(`/start-a-club/${idea.id}`);
  }

  const slug =
    idea.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "club";

  return (
    <PageContainer className="py-8">
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
        Approved idea
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Create club
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Confirm the pre-populated details from your approved proposal. The
        originating idea stays linked and immutable.
      </p>
      <p className="mt-2 text-sm">
        <Link
          href={`/start-a-club/${idea.id}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Back to application
        </Link>
      </p>
      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-xs sm:p-6">
        <CreateClubConfirmForm
          ideaId={idea.id}
          defaultName={idea.title}
          defaultSlug={slug}
          schoolName={idea.schools?.name ?? "School"}
          description={idea.description}
          mission={idea.mission}
          category={idea.category}
          gradeMin={idea.grade_min}
          gradeMax={idea.grade_max}
          officers={(idea.club_idea_proposed_officers ?? []).map(
            (officer) =>
              `${officer.proposed_name ?? "Officer"} (${officer.proposed_role.replaceAll("_", " ")})`,
          )}
          advisorLabel={
            idea.proposed_advisor_id ? idea.proposed_advisor_id : "Invite later"
          }
        />
      </div>
    </PageContainer>
  );
}
