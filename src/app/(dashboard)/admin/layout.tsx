import { AdminCommandNav } from "@/features/admin/components/admin-command-nav";
import { getAdminAccessRoles } from "@/features/admin/queries";
import { requireAdminConsoleAccess } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    await requireAdminConsoleAccess();
  } catch (error) {
    handleAuthorizationError(error, "/admin");
  }

  const roles = await getAdminAccessRoles();

  return (
    <div>
      <AdminCommandNav roles={roles} />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
