import Link from "next/link";

import { PageContainer } from "@/components/ds/page-container";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listMyIdeas } from "@/features/ideas/queries";
import { ideaStatusToBadge } from "@/features/ideas/status";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function StartAClubIndexPage() {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/start-a-club");
  }

  const ideas = await listMyIdeas(user!.id);
  const draft = ideas.find((idea) => idea.status === "draft");

  return (
    <PageContainer className="py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Your club ideas
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Draft, submit, and track approvals. Leave anytime—drafts autosave.
          </p>
        </div>
        <Button asChild>
          <Link href={draft ? `/start-a-club/${draft.id}` : "/start-a-club/new"}>
            {draft ? "Resume draft" : "New application"}
          </Link>
        </Button>
      </div>

      <ul className="space-y-3">
        {ideas.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            No applications yet.{" "}
            <Link className="text-primary underline-offset-4 hover:underline" href="/start-a-club/new">
              Start your first club idea
            </Link>
            .
          </li>
        ) : (
          ideas.map((idea) => (
            <li key={idea.id}>
              <Link
                href={
                  idea.status === "approved"
                    ? `/start-a-club/${idea.id}/create-club`
                    : `/start-a-club/${idea.id}`
                }
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs hover:bg-surface-muted"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {idea.title || "Untitled draft"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {idea.schools?.name ?? "School pending"} ·{" "}
                    {idea.category || "Uncategorized"} ·{" "}
                    {idea.status.replaceAll("_", " ")}
                  </p>
                </div>
                <StatusBadge status={ideaStatusToBadge(idea.status)} />
              </Link>
            </li>
          ))
        )}
      </ul>
    </PageContainer>
  );
}
