import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { InsightCallout } from "@/components/ds/insight-callout";
import { Button } from "@/components/ui/button";
import { listAdminUsersAndRoles } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let roles;
  try {
    roles = await listAdminUsersAndRoles();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/settings");
    }
    throw error;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Settings
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Platform governance defaults for BayAreaClubs administration.
        </p>
      </div>

      <InsightCallout title="Student privacy">
        Never store student home locations. Prefer school city and institutional
        email domains only when needed for verification.
      </InsightCallout>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5 shadow-xs">
          <h3 className="font-semibold">Access control</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {roles.activePlatformAdmins} active platform administrator
            {roles.activePlatformAdmins === 1 ? "" : "s"}. Role changes require
            confirmation and write to the audit log.
          </p>
          <Button asChild className="mt-4" variant="outline" size="sm">
            <Link href="/admin/users">Manage users &amp; roles</Link>
          </Button>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5 shadow-xs">
          <h3 className="font-semibold">Schools</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure school name, type, city, optional email domain, advisors,
            and administrators from the schools directory.
          </p>
          <Button asChild className="mt-4" variant="outline" size="sm">
            <Link href="/admin/schools">Open schools</Link>
          </Button>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5 shadow-xs lg:col-span-2">
          <h3 className="font-semibold">Audit &amp; accountability</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Administrative mutations append to an immutable audit stream. The
            console filters secrets and sensitive contact fields from displayed
            metadata.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/audit">Open audit log</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/insights">Open insights</Link>
            </Button>
          </div>
        </section>
      </div>

      {roles.assignments.length === 0 ? (
        <EmptyState
          title="No platform roles configured"
          description="Assign at least one platform administrator before relying on this console in production."
        />
      ) : null}
    </div>
  );
}
