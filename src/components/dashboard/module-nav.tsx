import Link from "next/link";

import type { ResolvedDashboardModule } from "@/components/dashboard/types";
import {
  groupModulesBySection,
  isModuleActive,
  isUsableAppPath,
} from "@/components/dashboard/nav-modules";
import { DashboardModuleIcon } from "@/features/dashboard-config/icons";
import { cn } from "@/lib/utils";

export function ModuleNavList({
  modules,
  pathname,
  onNavigate,
  className,
  collapsed = false,
}: {
  modules: readonly ResolvedDashboardModule[];
  pathname: string;
  onNavigate?: () => void;
  className?: string;
  collapsed?: boolean;
}) {
  const groups = groupModulesBySection(modules);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {groups.map((group) => (
        <div key={group.section}>
          {collapsed ? (
            <p className="sr-only">{group.section}</p>
          ) : (
            <div className="flex items-center gap-2 px-3">
              <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {group.section}
              </p>
              <span
                aria-hidden
                className="h-px min-w-0 flex-1 bg-[var(--sidebar-border)]"
              />
            </div>
          )}
          <ul className={cn("mt-2", collapsed ? "space-y-2" : "space-y-1.5")}>
            {group.modules.map((module) => {
              const href = module.href ?? module.route;
              const usable = isUsableAppPath(href);
              const active = usable && isModuleActive(href, pathname);
              return (
                <li key={module.id}>
                  {usable ? (
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? module.label : undefined}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-full px-3 py-2.5 text-sm font-medium",
                        "text-[var(--sidebar-nav-fg)]",
                        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                        "motion-reduce:transition-none",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active
                          ? "bg-[var(--catalog-nav-selected-bg)] text-[var(--catalog-nav-selected-fg)]"
                          : "hover:bg-[var(--sidebar-search-bg)]",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <DashboardModuleIcon
                        name={module.icon}
                        className="size-[1.125rem] shrink-0"
                      />
                      <span className={cn("truncate", collapsed && "sr-only")}>
                        {module.label}
                      </span>
                    </Link>
                  ) : (
                    <span
                      title="This module has no destination yet"
                      className={cn(
                        "flex items-center gap-2.5 rounded-full px-3 py-2.5 text-sm font-medium text-muted-foreground",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <DashboardModuleIcon
                        name={module.icon}
                        className="size-[1.125rem] shrink-0"
                      />
                      <span className={cn("truncate", collapsed && "sr-only")}>
                        {module.label}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
