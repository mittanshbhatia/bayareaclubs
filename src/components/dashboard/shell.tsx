import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { ContextSwitcher } from "@/components/dashboard/context-switcher";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import type { DashboardShellData } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
import { GlobalCommandPalette } from "@/features/command-palette/components/global-command-palette";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import type { InAppNotification } from "@/features/notifications/queries";

export function DashboardShell({
  data,
  pathname,
  userId,
  notifications,
  unreadCount,
  children,
}: {
  data: DashboardShellData;
  pathname: string;
  userId: string;
  notifications: InAppNotification[];
  unreadCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[80] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:ring-2 focus:ring-focus"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-surface">
        <div className="flex min-h-16 items-center gap-3 px-4 sm:px-5">
          <DashboardMobileNav modules={data.modules} pathname={pathname} />
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 font-display font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
          >
            <ShieldCheck aria-hidden className="size-5 text-primary" />
            <span className="hidden sm:inline">BayAreaClubs</span>
          </Link>
          <ContextSwitcher
            contexts={data.availableContexts}
            activeContextId={data.activeContext.id}
          />
          <div className="min-w-0 flex-1">
            <GlobalCommandPalette className="max-w-md" />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {data.permissions.canAccessAdminConsole ? (
              <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                <Link href="/admin">Admin console</Link>
              </Button>
            ) : null}
            <NotificationBell
              key={`${unreadCount}-${notifications[0]?.id ?? "empty"}`}
              userId={userId}
              initialNotifications={notifications}
              initialUnreadCount={unreadCount}
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
      <div className="flex">
        <DashboardSidebar modules={data.modules} pathname={pathname} />
        <main id="dashboard-main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
