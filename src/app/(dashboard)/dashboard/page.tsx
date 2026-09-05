import { Building2, Shield, UsersRound } from "lucide-react";

import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

function formatRole(role: string) {
  return role.replaceAll("_", " ");
}

export default async function DashboardPage() {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const [profileResult, platformResult, schoolResult, clubResult] =
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
        .select("role, clubs(name)")
        .eq("user_id", user.id)
        .eq("status", "active"),
    ]);

  return (
    <>
      <p className="text-primary text-sm font-medium">Dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Welcome, {profileResult.data?.display_name ?? "member"}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
        Access is derived from active platform, school, and club assignments.
      </p>

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
              {clubResult.data.map((membership) => (
                <li key={`${membership.clubs?.name}-${membership.role}`}>
                  <span className="block font-medium">
                    {membership.clubs?.name}
                  </span>
                  <span className="text-muted-foreground capitalize">
                    {formatRole(membership.role)}
                  </span>
                </li>
              ))}
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
