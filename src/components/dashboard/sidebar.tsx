import { ModuleNavList } from "@/components/dashboard/module-nav";
import { modulesForSurface } from "@/components/dashboard/nav-modules";
import type { ResolvedDashboardModule } from "@/components/dashboard/types";

export function DashboardSidebar({
  modules,
  pathname,
}: {
  modules: readonly ResolvedDashboardModule[];
  pathname: string;
}) {
  const visible = modulesForSurface(modules, "desktop");

  return (
    <aside
      data-slot="dashboard-sidebar"
      className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-surface md:flex"
      aria-label="Dashboard"
    >
      <nav
        aria-label="Dashboard modules"
        className="flex-1 overflow-y-auto px-3 py-6"
      >
        <ModuleNavList modules={visible} pathname={pathname} />
      </nav>
    </aside>
  );
}
