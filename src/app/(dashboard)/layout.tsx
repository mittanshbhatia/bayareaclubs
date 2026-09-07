import { headers } from "next/headers";

import { DashboardShell } from "@/components/dashboard/shell";
import { loadDashboardShellData } from "@/components/dashboard/load-shell-data";
import { listMyNotifications } from "@/features/notifications/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { withAuthorization } from "@/lib/auth/route-guard";
import { safeNextPath } from "@/lib/auth/safe-next-path";

export const dynamic = "force-dynamic";

export default async function AppShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerStore = await headers();
  const pathname = safeNextPath(headerStore.get("x-pathname"), "/dashboard");

  const user = await withAuthorization(pathname, () => requireActiveUser());

  const [data, inbox] = await Promise.all([
    loadDashboardShellData({ pathname }),
    listMyNotifications(20).catch(() => ({
      notifications: [],
      unreadCount: 0,
    })),
  ]);

  return (
    <DashboardShell
      data={data}
      pathname={pathname}
      userId={user.id}
      notifications={inbox.notifications}
      unreadCount={inbox.unreadCount}
    >
      {children}
    </DashboardShell>
  );
}
