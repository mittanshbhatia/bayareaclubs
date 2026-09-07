import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { ContextSwitcher } from "@/components/dashboard/context-switcher";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import {
  dashboardChromeTitle,
  presentDashboardNav,
} from "@/components/dashboard/nav-modules";
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
  const school = data.availableContexts.find((context) => context.type === "school");
  const navModules = presentDashboardNav(data.modules, school);
  const title = dashboardChromeTitle(pathname);

  return (
    <div className="flex min-h-dvh bg-learning-background">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[80] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:ring-2 focus:ring-focus"
      >
        Skip to main content
      </a>
      <DashboardSidebar
        modules={navModules}
        pathname={pathname}
        actorName={data.actor.displayName}
        search={
          <GlobalCommandPalette className="h-9 w-full min-w-0 justify-start sm:w-full sm:min-w-0" />
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-surface">
          <div className="flex min-h-14 items-center gap-3 px-4 sm:px-6">
            <DashboardMobileNav modules={navModules} pathname={pathname} />
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2 font-display font-semibold tracking-tight md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              <ShieldCheck aria-hidden className="size-5 text-primary" />
              <span className="sr-only">BayAreaClubs</span>
            </Link>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="md:hidden">
              <GlobalCommandPalette className="h-9" enableHotkey={false} />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <ContextSwitcher
                contexts={data.availableContexts}
                activeContextId={data.activeContext.id}
              />
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
              <Button asChild variant="ghost" size="sm" className="md:hidden">
                <Link href="/dashboard/profile">Profile</Link>
              </Button>
              <form action={signOutAction} className="md:hidden">
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>
        <main id="dashboard-main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
