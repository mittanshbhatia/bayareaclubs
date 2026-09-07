"use client";

import Link from "next/link";
import { LogOut, PanelLeft, PanelLeftClose, Plus, ShieldCheck } from "lucide-react";
import { useCallback, useSyncExternalStore, type ReactNode } from "react";

import { ModuleNavList } from "@/components/dashboard/module-nav";
import { isUsableAppPath, modulesForSurface } from "@/components/dashboard/nav-modules";
import type { ResolvedDashboardModule } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSE_KEY = "bayareaclubs.sidebar-collapsed";
const SIDEBAR_COLLAPSE_EVENT = "bayareaclubs:sidebar-collapsed";

function readSidebarCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeSidebarCollapsed(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_COLLAPSE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(SIDEBAR_COLLAPSE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SIDEBAR_COLLAPSE_EVENT, onStoreChange);
  };
}

function writeSidebarCollapsed(next: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, next ? "1" : "0");
  } catch {
    // Ignore storage write failures.
  }
  window.dispatchEvent(new Event(SIDEBAR_COLLAPSE_EVENT));
}

function actorInitial(name: string | null | undefined) {
  const trimmed = name?.trim();
  if (!trimmed) return "P";
  return Array.from(trimmed)[0]?.toUpperCase() ?? "P";
}

export function DashboardSidebar({
  modules,
  pathname,
  search,
  actorName,
  actorSubtext,
  createHref,
}: {
  modules: readonly ResolvedDashboardModule[];
  pathname: string;
  search?: ReactNode;
  actorName?: string | null;
  actorSubtext?: string | null;
  createHref?: string | null;
}) {
  const visible = modulesForSurface(modules, "desktop");
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    readSidebarCollapsed,
    () => false,
  );
  const usableCreateHref =
    createHref && isUsableAppPath(createHref) ? createHref : null;
  const displayName = actorName?.trim() || "Profile";
  const displaySubtext = actorSubtext?.trim() || "Account";
  const toggleCollapsed = useCallback(() => {
    writeSidebarCollapsed(!readSidebarCollapsed());
  }, []);

  return (
    <aside
      data-slot="dashboard-sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "group/sidebar sticky top-0 hidden h-dvh shrink-0 flex-col bg-[var(--sidebar-bg)] md:flex",
        "border-r border-[var(--sidebar-border)]",
        collapsed ? "w-[4.75rem]" : "w-64",
      )}
      aria-label="Dashboard"
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 pt-4 pb-3",
          collapsed && "flex-col px-2",
        )}
      >
        <Link
          href="/dashboard"
          aria-label="BayAreaClubs"
          className={cn(
            "flex min-w-0 items-center gap-2.5 rounded-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
            collapsed && "justify-center",
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[0.7rem] border border-[var(--sidebar-border)] bg-surface shadow-xs">
            <ShieldCheck aria-hidden className="size-4 text-primary" />
          </span>
          {collapsed ? null : (
            <span className="min-w-0 leading-tight" aria-hidden>
              <span className="block font-display text-[0.95rem] font-semibold tracking-tight text-[var(--sidebar-nav-fg)]">
                BayArea
              </span>
              <span className="block bg-gradient-to-r from-[var(--info)] to-[var(--chart-5)] bg-clip-text text-[0.7rem] font-medium tracking-wide text-transparent">
                Clubs
              </span>
            </span>
          )}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-8 min-h-8 shrink-0 text-muted-foreground hover:text-foreground",
            collapsed ? "ml-0" : "ml-auto",
          )}
          onClick={toggleCollapsed}
          aria-pressed={collapsed}
          aria-expanded={!collapsed}
          aria-controls="dashboard-sidebar-nav"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft aria-hidden className="size-4" />
          ) : (
            <PanelLeftClose aria-hidden className="size-4" />
          )}
        </Button>
      </div>

      {search || usableCreateHref ? (
        <div
          className={cn(
            "flex items-center gap-2 px-3 pb-3",
            collapsed && "flex-col px-2",
          )}
        >
          {search ? <div className="min-w-0 flex-1">{search}</div> : null}
          {usableCreateHref ? (
            <Button
              asChild
              size="icon"
              className="size-9 min-h-9 shrink-0 rounded-full border-0 bg-transparent text-white shadow-xs hover:bg-transparent hover:opacity-90"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--sidebar-create-from), var(--sidebar-create-to))",
              }}
            >
              <Link href={usableCreateHref} aria-label="Start a club">
                <Plus aria-hidden className="size-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      <nav
        id="dashboard-sidebar-nav"
        aria-label="Dashboard modules"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-1"
      >
        <ModuleNavList
          modules={visible}
          pathname={pathname}
          collapsed={collapsed}
        />
      </nav>

      <div className={cn("px-3 pb-3", collapsed && "px-2")}>
        <div className="rounded-[0.9rem] border border-[var(--sidebar-border)] p-2">
          <Link
            href="/dashboard/profile"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-1 py-1",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              collapsed && "justify-center px-0",
            )}
          >
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              {actorInitial(actorName)}
            </span>
            {collapsed ? (
              <span className="sr-only">{displayName}</span>
            ) : (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--sidebar-nav-fg)]">
                  {displayName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {displaySubtext}
                </span>
              </span>
            )}
          </Link>
          <form action={signOutAction} className={cn("mt-1", collapsed && "flex justify-center")}>
            {collapsed ? (
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="size-8 min-h-8 text-muted-foreground"
                aria-label="Sign out"
              >
                <LogOut aria-hidden className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
              >
                Sign out
              </Button>
            )}
          </form>
        </div>
      </div>
    </aside>
  );
}
