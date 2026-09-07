import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { ModuleNavList } from "@/components/dashboard/module-nav";
import { modulesForSurface } from "@/components/dashboard/nav-modules";
import type { ResolvedDashboardModule } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";

export function DashboardSidebar({
  modules,
  pathname,
  search,
  actorName,
}: {
  modules: readonly ResolvedDashboardModule[];
  pathname: string;
  search?: ReactNode;
  actorName?: string | null;
}) {
  const visible = modulesForSurface(modules, "desktop");

  return (
    <aside
      data-slot="dashboard-sidebar"
      className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface md:flex"
      aria-label="Dashboard"
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2 font-display font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
        >
          <ShieldCheck aria-hidden className="size-5 shrink-0 text-primary" />
          <span className="truncate">BayAreaClubs</span>
        </Link>
      </div>
      {search ? <div className="px-3 pb-3">{search}</div> : null}
      <nav
        aria-label="Dashboard modules"
        className="flex-1 overflow-y-auto px-3 py-2"
      >
        <ModuleNavList modules={visible} pathname={pathname} />
      </nav>
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/dashboard/profile"
          className="block truncate px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {actorName?.trim() || "Profile"}
        </Link>
        <form action={signOutAction} className="mt-1">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
