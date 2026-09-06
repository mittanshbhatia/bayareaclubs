import Link from "next/link";
import { Building2, GraduationCap, Lightbulb, Shield, UsersRound } from "lucide-react";

import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listMyIdeas } from "@/features/ideas/queries";
import { ideaStatusToBadge } from "@/features/ideas/status";
import { listMyLearning } from "@/features/stem/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

function formatRole(role: string) {
  return role.replaceAll("_", " ");
}

export default async function DashboardPage() {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const [profileResult, platformResult, schoolResult, clubResult, ideas, learning] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, age_band")
        .eq("id", user.id)
        .single(),
      supabase
        .from("platform_role_assignments")
        .select("role")
        .eq("user_id", user.id)
        .is("revoked_at", null),
      supabase
        .from("user_school_memberships")
        .select("role, schools(name)")
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("club_memberships")
        .select("role, clubs(id, name, slug)")
        .eq("user_id", user.id)
        .eq("status", "active"),
      listMyIdeas(user.id),
      listMyLearning(user.id),
    ]);

  const trackedIdeas = ideas.filter((idea) => idea.status !== "draft");
  const isPlatformAdmin = (platformResult.data ?? []).some(
    (assignment) => assignment.role === "platform_admin",
  );

  return (
    <>
      <p className="text-sm font-medium text-primary">Dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Welcome, {profileResult.data?.display_name ?? "member"}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        Access is derived from active platform, school, and club assignments.
      </p>

      <section className="mt-10 border-t pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap aria-hidden="true" className="size-4 text-primary" />
            <h2 className="font-semibold">My Learning</h2>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/learning">Open learning</Link>
          </Button>
        </div>
        {learning.length ? (
          <ul className="mt-4 space-y-3">
            {learning.slice(0, 3).map((item) => (
              <li key={item.subscription.id}>
                <Link
                  href={
                    item.course?.slug
                      ? `/resources/${item.course.slug}`
                      : "/dashboard/learning"
                  }
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-surface-muted"
                >
                  <div>
                    <p className="font-medium">{item.course?.title ?? "Course"}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.nextResource
                        ? `Next: ${item.nextResource.title}`
                        : `${item.completedCount} lessons complete`}
                    </p>
                  </div>
                  <StatusBadge
                    status={
                      item.subscription.status === "completed"
                        ? "approved"
                        : "active"
                    }
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No subscribed courses yet.{" "}
            <Link href="/resources" className="underline">
              Browse free STEM resources
            </Link>
            .
          </p>
        )}
      </section>

      <section className="mt-10 border-t pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb aria-hidden="true" className="size-4 text-primary" />
            <h2 className="font-semibold">Club idea applications</h2>
          </div>
          <Button asChild size="sm">
            <Link href="/start-a-club">Manage ideas</Link>
          </Button>
        </div>
        {trackedIdeas.length ? (
          <ul className="mt-4 space-y-3">
            {trackedIdeas.map((idea) => (
              <li key={idea.id}>
                <Link
                  href={`/start-a-club/${idea.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-surface-muted"
                >
                  <div>
                    <p className="font-medium">{idea.title || "Untitled"}</p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {idea.status.replaceAll("_", " ")}
                    </p>
                  </div>
                  <StatusBadge status={ideaStatusToBadge(idea.status)} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No submitted applications yet. Statuses appear here after you submit:
            Submitted, Under Review, Changes Requested, Approved, Rejected.
          </p>
        )}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="border-t pt-5">
          <div className="flex items-center gap-2">
            <Shield aria-hidden="true" className="text-primary size-4" />
            <h2 className="font-semibold">Platform assignments</h2>
          </div>
          {platformResult.data?.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {platformResult.data.map((assignment) => (
                <li key={assignment.role} className="capitalize">
                  {formatRole(assignment.role)}
                </li>
              ))}
              {isPlatformAdmin ? (
                <>
                  <li>
                    <Link href="/admin/resources" className="underline">
                      STEM Resources admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="underline">
                      Administration console
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/insights" className="underline">
                      Platform Insights
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">
              Standard user access
            </p>
          )}
        </section>

        <section className="border-t pt-5">
          <div className="flex items-center gap-2">
            <Building2 aria-hidden="true" className="text-primary size-4" />
            <h2 className="font-semibold">Schools</h2>
          </div>
          {schoolResult.data?.length ? (
            <ul className="mt-4 space-y-3 text-sm">
              {schoolResult.data.map((membership) => (
                <li key={`${membership.schools?.name}-${membership.role}`}>
                  <span className="block font-medium">
                    {membership.schools?.name}
                  </span>
                  <span className="text-muted-foreground capitalize">
                    {formatRole(membership.role)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">
              No active school membership
            </p>
          )}
        </section>

        <section className="border-t pt-5">
          <div className="flex items-center gap-2">
            <UsersRound aria-hidden="true" className="text-primary size-4" />
            <h2 className="font-semibold">Clubs</h2>
          </div>
          {clubResult.data?.length ? (
            <ul className="mt-4 space-y-3 text-sm">
              {clubResult.data.map((membership) => {
                const club = membership.clubs as
                  | { id?: string; name?: string; slug?: string }
                  | null
                  | undefined;
                const officerRoles = new Set([
                  "club_admin",
                  "president",
                  "vice_president",
                  "secretary",
                  "treasurer",
                  "officer",
                  "advisor",
                ]);
                const isOfficer = officerRoles.has(membership.role);
                const href =
                  isOfficer && club?.slug
                    ? `/clubs/${club.slug}`
                    : club?.id
                      ? `/dashboard/clubs/${club.id}/attendance`
                      : null;
                return (
                  <li key={`${club?.name}-${membership.role}`}>
                    {href ? (
                      <Link
                        href={href}
                        className="block font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {club?.name}
                      </Link>
                    ) : (
                      <span className="block font-medium">{club?.name}</span>
                    )}
                    <span className="text-muted-foreground capitalize">
                      {formatRole(membership.role)}
                      {!isOfficer && club?.id ? " · my attendance" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">
              No active club membership
            </p>
          )}
        </section>
      </div>
    </>
  );
}
