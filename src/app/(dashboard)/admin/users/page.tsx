import { RoleBadge } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/states";
import { InsightCallout } from "@/components/ds/insight-callout";
import {
  AssignRoleDialog,
  RevokeRoleDialog,
} from "@/features/admin/components/role-dialogs";
import { listAdminUsersAndRoles } from "@/features/admin/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let payload;
  try {
    payload = await listAdminUsersAndRoles();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/admin/users");
    }
    throw error;
  }

  const { assignments, activePlatformAdmins } = payload;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Users &amp; Roles
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Platform role assignments require confirmation and are audited. The
            final platform administrator cannot be revoked.
          </p>
        </div>
        <AssignRoleDialog />
      </div>

      <InsightCallout title={`${activePlatformAdmins} active platform administrator${activePlatformAdmins === 1 ? "" : "s"}`}>
        Revoking the last platform_admin assignment is blocked at the database
        layer.
      </InsightCallout>

      {assignments.length === 0 ? (
        <EmptyState
          title="No platform roles"
          description="Assign a committee reviewer or platform administrator to begin."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Platform role assignments</caption>
            <thead className="border-b bg-surface-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Person</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignments.map((row) => {
                const isLastAdmin =
                  row.role === "platform_admin" && activePlatformAdmins <= 1;
                return (
                  <tr key={row.id} className="hover:bg-surface-muted/40">
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.displayName}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {row.userId}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge
                        role={
                          row.role as "platform_admin" | "committee_reviewer"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(new Date(row.assignedAt))}
                    </td>
                    <td className="px-4 py-3">
                      <RevokeRoleDialog
                        assignmentId={row.id}
                        displayName={row.displayName}
                        role={row.role}
                        disabled={isLastAdmin}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
