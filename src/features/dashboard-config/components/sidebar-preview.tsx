import { DashboardModuleIcon } from "@/features/dashboard-config/icons";
import type { HydratedModule } from "@/features/dashboard-config/resolve";

export function SidebarPreview({
  modules,
  emptyLabel,
}: {
  modules: HydratedModule[];
  emptyLabel: string;
}) {
  const visible = modules.filter((module) => module.enabled);

  return (
    <aside
      aria-label="Resolved sidebar preview"
      className="rounded-xl border border-border bg-surface p-4 shadow-xs"
    >
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
        Preview
      </p>
      <h3 className="mt-1 font-semibold">Resolved navigation</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Order after global → school → club, then the permission filter. User
        preference is not applied in this admin preview.
      </p>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="mt-4 space-y-1">
          {visible.map((module) => (
            <li
              key={module.id}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm"
            >
              <DashboardModuleIcon name={module.icon} className="size-4 shrink-0" />
              <span className="min-w-0 truncate font-medium">{module.label}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
