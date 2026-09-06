import { notFound, redirect } from "next/navigation";

import { IdeaWizard } from "@/features/ideas/components/idea-wizard";
import {
  getApplicantFeedback,
  getIdeaDetail,
  listUserSchools,
} from "@/features/ideas/queries";
import { ActivityTimeline } from "@/components/ds/activity-timeline";
import { PageContainer } from "@/components/ds/page-container";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function StartAClubIdeaPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, `/start-a-club/${ideaId}`);
  }

  if (ideaId === "new") {
    redirect("/start-a-club");
  }

  const [idea, memberships, feedback] = await Promise.all([
    getIdeaDetail(ideaId),
    listUserSchools(user!.id),
    getApplicantFeedback(ideaId),
  ]);

  if (!idea || idea.submitter_id !== user!.id) {
    notFound();
  }

  const schools = memberships
    .map((m) => m.schools)
    .filter((school): school is { id: string; name: string } => Boolean(school));

  const timeline = (idea.club_idea_status_history ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((event) => ({
      id: event.id,
      title: event.to_status.replaceAll("_", " "),
      description: event.from_status
        ? `From ${event.from_status.replaceAll("_", " ")}`
        : "Created",
      timestamp: new Date(event.created_at).toLocaleString(),
    }));

  return (
    <>
      <IdeaWizard
        status={idea.status}
        schools={schools}
        feedback={feedback}
        readOnly={!["draft", "changes_requested"].includes(idea.status)}
        initial={{
          ideaId: idea.id,
          draftStep: idea.draft_step,
          schoolId: idea.school_id,
          title: idea.title,
          category: idea.category,
          description: idea.description,
          mission: idea.mission,
          problemOpportunity: idea.problem_opportunity,
          expectedActivities: idea.expected_activities,
          expectedMembership: idea.expected_membership,
          proposedMeetingCadence: idea.proposed_meeting_cadence,
          proposedAdvisorId: idea.proposed_advisor_id,
          gradeMin: idea.grade_min,
          gradeMax: idea.grade_max,
          officers: (idea.club_idea_proposed_officers ?? []).map((officer) => ({
            proposedName: officer.proposed_name ?? "",
            proposedRole: officer.proposed_role,
            proposedUserId: officer.proposed_user_id,
          })),
          links: (idea.club_idea_links ?? []).map((link) => ({
            title: link.title,
            url: link.url,
          })),
        }}
      />
      <PageContainer className="pb-12">
        <h2 className="mb-4 font-semibold text-foreground">Application timeline</h2>
        <ActivityTimeline items={timeline} />
        {(idea.club_idea_versions ?? []).length > 0 ? (
          <div className="mt-8">
            <h2 className="mb-3 font-semibold">Frozen versions</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(idea.club_idea_versions ?? [])
                .slice()
                .sort((a, b) => b.version_number - a.version_number)
                .map((version) => (
                  <li key={version.id}>
                    Version {version.version_number} · {version.status_at_freeze} ·{" "}
                    {new Date(version.created_at).toLocaleString()}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </PageContainer>
    </>
  );
}
