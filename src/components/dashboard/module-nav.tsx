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
}: {
  modules: readonly ResolvedDashboardModule[];
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const groups = groupModulesBySection(modules);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {groups.map((group) => (
        <div key={group.section}>
          <p className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group.section}
          </p>
          <ul className="mt-2 space-y-1">
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
                      onClick={onNavigate}
                      style={
                        active
                          ? {
                              borderLeftColor:
                                module.id === "learning"
                                  ? "var(--catalog-nav-selected-fg)"
                                  : "var(--accent)",
                            }
                          : undefined
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                        "border-l-2 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                        "motion-reduce:transition-none",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active && module.id === "learning"
                          ? "border-l-[var(--catalog-nav-selected-fg)] bg-[var(--catalog-nav-selected-bg)] text-[var(--catalog-nav-selected-fg)]"
                          : active
                            ? "border-l-accent bg-accent-muted text-accent"
                            : "border-l-transparent text-foreground hover:bg-surface-muted",
                      )}
                    >
                      <DashboardModuleIcon
                        name={module.icon}
                        className="size-4 shrink-0"
                      />
                      <span className="truncate">{module.label}</span>
                    </Link>
                  ) : (
                    <span
                      title="This module has no destination yet"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
                    >
                      <DashboardModuleIcon
                        name={module.icon}
                        className="size-4 shrink-0"
                      />
                      <span className="truncate">{module.label}</span>
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
