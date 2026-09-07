"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useId } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DashboardModuleIcon } from "@/features/dashboard-config/icons";
import type { HydratedModule } from "@/features/dashboard-config/resolve";

export function ModuleConfigList({
  modules,
  disabled,
  disabledReason,
  pendingId,
  onToggle,
  onMove,
}: {
  modules: HydratedModule[];
  disabled: boolean;
  disabledReason: string | null;
  pendingId: string | null;
  onToggle: (moduleId: HydratedModule["id"], enabled: boolean) => void;
  onMove: (moduleId: HydratedModule["id"], direction: "up" | "down") => void;
}) {
  const headingId = useId();

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 id={headingId} className="font-semibold">
            Modules
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Use Move up/down or focus a row and press Arrow Up or Arrow Down.
            Drag and drop is not required.
          </p>
        </div>
      </div>
      {disabled && disabledReason ? (
        <p className="mb-3 text-sm text-muted-foreground" role="status">
          {disabledReason}
        </p>
      ) : null}
      {modules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No modules apply to this scope.
        </p>
      ) : (
        <ol
          aria-labelledby={headingId}
          className="divide-y divide-border rounded-xl border border-border bg-surface shadow-xs"
        >
          {modules.map((module, index) => {
            const disableBlocked = Boolean(module.disableBlockedReason);
            const enableBlocked = Boolean(module.enableBlockedReason);
            const toggleDisabled =
              disabled ||
              (module.enabled ? disableBlocked : enableBlocked) ||
              pendingId === module.id;
            const toggleTitle = module.enabled
              ? module.disableBlockedReason
              : module.enableBlockedReason;
            return (
              <li
                key={module.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
                tabIndex={disabled ? -1 : 0}
                aria-label={`${module.label}. ${module.enabled ? "Enabled" : "Disabled"}. Position ${index + 1} of ${modules.length}.`}
                onKeyDown={(event) => {
                  if (disabled) return;
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    onMove(module.id, "up");
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    onMove(module.id, "down");
                  }
                }}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <DashboardModuleIcon
                    name={module.icon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{module.label}</p>
                      {module.mandatory ? (
                        <Badge variant="warning">Mandatory</Badge>
                      ) : null}
                      {module.required_permissions.length > 0 ? (
                        <Badge variant="outline">
                          {module.required_permissions.join(", ")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Any signed-in role</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                    {toggleTitle ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {toggleTitle}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`enable-${module.id}`}
                      checked={module.enabled}
                      disabled={toggleDisabled}
                      onCheckedChange={(value) =>
                        onToggle(module.id, value === true)
                      }
                      aria-describedby={
                        toggleTitle ? `enable-hint-${module.id}` : undefined
                      }
                    />
                    <Label htmlFor={`enable-${module.id}`}>
                      {module.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                  {toggleTitle ? (
                    <span id={`enable-hint-${module.id}`} className="sr-only">
                      {toggleTitle}
                    </span>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || index === 0 || pendingId === module.id}
                    onClick={() => onMove(module.id, "up")}
                    aria-label={`Move ${module.label} up`}
                  >
                    <ChevronUp />
                    Up
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={
                      disabled ||
                      index === modules.length - 1 ||
                      pendingId === module.id
                    }
                    onClick={() => onMove(module.id, "down")}
                    aria-label={`Move ${module.label} down`}
                  >
                    <ChevronDown />
                    Down
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
