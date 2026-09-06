import Link from "next/link";
import { headers } from "next/headers";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
import { GlobalCommandPalette } from "@/features/command-palette/components/global-command-palette";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { listMyNotifications } from "@/features/notifications/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerStore = await headers();
  const nextPath = safeNextPath(headerStore.get("x-pathname"), "/dashboard");

  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, nextPath);
  }

  const supabase = await createClient();
  const [{ data: roles }, inbox] = await Promise.all([
    supabase
      .from("platform_role_assignments")
      .select("role")
      .eq("user_id", user!.id)
      .is("revoked_at", null),
    listMyNotifications(20).catch(() => ({
      notifications: [],
      unreadCount: 0,
    })),
  ]);

  const isCommittee = (roles ?? []).some(
    (row) => row.role === "committee_reviewer" || row.role === "platform_admin",
  );

  return (
    <div className="min-h-screen">
      <header className="border-b bg-surface">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2 font-display font-semibold tracking-tight"
            >
              <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
              <span>BayAreaClubs</span>
            </Link>
            <GlobalCommandPalette className="max-w-md flex-1" />
            <nav className="hidden items-center gap-1 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/start-a-club">Club ideas</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/insights">My Insights</Link>
              </Button>
              {isCommittee ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">Admin console</Link>
                </Button>
              ) : null}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell
              key={`${inbox.unreadCount}-${inbox.notifications[0]?.id ?? "empty"}`}
              userId={user!.id}
              initialNotifications={inbox.notifications}
              initialUnreadCount={inbox.unreadCount}
            />
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/profile">Profile</Link>
            </Button>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
