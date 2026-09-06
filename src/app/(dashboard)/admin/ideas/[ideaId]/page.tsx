import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityTimeline } from "@/components/ds/activity-timeline";
import { PageContainer } from "@/components/ds/page-container";
import { StatusBadge } from "@/components/ds/badges";
import { IdeaReviewActions } from "@/features/ideas/components/idea-review-actions";
import {
  getApplicantFeedback,
  getIdeaDetail,
  listCommitteeReviewers,
  reviewAgeHours,
} from "@/features/ideas/queries";
import { ideaStatusToBadge } from "@/features/ideas/status";
import { requireCommitteeReviewer } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminIdeaDetailPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;
  let user;
  try {
    user = await requireCommitteeReviewer();
  } catch (error) {
    handleAuthorizationError(error, `/admin/ideas/${ideaId}`);
  }

  const [idea, feedback, reviewers] = await Promise.all([
    getIdeaDetail(ideaId),
    getApplicantFeedback(ideaId),
    listCommitteeReviewers(),
  ]);

  if (!idea) notFound();

  const age = reviewAgeHours(idea.submitted_at);
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

  const reviewerOptions = reviewers
    .map((row) => row.profiles as { id: string; display_name: string } | null)
    .filter((profile): profile is { id: string; display_name: string } =>
      Boolean(profile),
    );

  return (
    <PageContainer className="py-8">
      <p className="text-sm">
        <Link
          href="/admin/ideas"
          className="text-primary underline-offset-4 hover:underline"
        >
          ← Review queue
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {idea.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {idea.schools?.name} · {idea.category} · Applicant{" "}
            {idea.profiles?.display_name ?? idea.submitter_id}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={ideaStatusToBadge(idea.status)} />
            <span className="text-sm text-muted-foreground">
              {age == null ? "Draft timing N/A" : `${age}h since submission`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-5 shadow-xs">
            <h2 className="font-semibold">Proposal</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Description</dt>
                <dd className="mt-1 whitespace-pre-wrap">{idea.description}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Mission</dt>
                <dd className="mt-1 whitespace-pre-wrap">{idea.mission}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Problem / opportunity</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {idea.problem_opportunity}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Planned activities</dt>
                <dd className="mt-1">
                  <ul className="list-disc pl-5">
                    {idea.expected_activities.map((activity) => (
                      <li key={activity}>{activity}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Membership & grades</dt>
                <dd className="mt-1">
                  {idea.expected_membership ?? "—"} members · grades{" "}
                  {idea.grade_min ?? "—"}–{idea.grade_max ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Meeting plan</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {idea.proposed_meeting_cadence}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Leadership</dt>
                <dd className="mt-1">
                  <ul className="list-disc pl-5">
                    {(idea.club_idea_proposed_officers ?? []).map((officer) => (
                      <li key={officer.id}>
                        {officer.proposed_name} ·{" "}
                        {officer.proposed_role.replaceAll("_", " ")}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Advisor</dt>
                <dd className="mt-1">
                  {idea.proposed_advisor_id ?? "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Supporting files / links</dt>
                <dd className="mt-1">
                  {(idea.club_idea_links ?? []).length === 0 ? (
                    <span>None</span>
                  ) : (
                    <ul className="list-disc pl-5">
                      {(idea.club_idea_links ?? []).map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            className="text-primary underline-offset-4 hover:underline"
                            rel="noreferrer"
                            target="_blank"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="mb-3 font-semibold">Workflow timeline</h2>
            <ActivityTimeline items={timeline} />
          </section>

          <section>
            <h2 className="mb-3 font-semibold">Prior versions</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(idea.club_idea_versions ?? []).length === 0 ? (
                <li>No frozen versions yet.</li>
              ) : (
                (idea.club_idea_versions ?? [])
                  .slice()
                  .sort((a, b) => b.version_number - a.version_number)
                  .map((version) => (
                    <li key={version.id} className="rounded-md border border-border p-3">
                      Version {version.version_number} · {version.status_at_freeze}{" "}
                      · {new Date(version.created_at).toLocaleString()}
                    </li>
                  ))
              )}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-semibold">Prior feedback</h2>
            <ul className="space-y-2 text-sm">
              {feedback.length === 0 ? (
                <li className="text-muted-foreground">No applicant feedback yet.</li>
              ) : (
                feedback.map((item) => (
                  <li
                    key={item.id ?? `${item.reviewed_at}-${item.decision}`}
                    className="rounded-md border border-border p-3"
                  >
                    <p className="font-medium capitalize">
                      {(item.decision ?? "pending").replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {item.applicant_feedback}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <IdeaReviewActions
          ideaId={idea.id}
          status={idea.status}
          currentUserId={user!.id}
          reviewers={reviewerOptions}
          reviews={(idea.club_idea_reviews ?? []).map((review) => ({
            id: review.id,
            reviewer_id: review.reviewer_id,
            reviewed_at: review.reviewed_at,
            decision: review.decision,
          }))}
        />
      </div>
    </PageContainer>
  );
}
