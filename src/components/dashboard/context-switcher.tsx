"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  filterContextsByQuery,
  groupContextsByType,
} from "@/components/dashboard/nav-modules";
import type { DashboardContextOption } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function ContextSwitcher({
  contexts,
  activeContextId,
}: {
  contexts: readonly DashboardContextOption[];
  activeContextId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const labelId = useId();
  const listId = useId();

  const authorized = contexts;
  const active =
    authorized.find((context) => context.id === activeContextId) ??
    authorized[0];
  const filtered = useMemo(
    () => filterContextsByQuery(authorized, query),
    [authorized, query],
  );
  const groups = useMemo(() => groupContextsByType(filtered), [filtered]);

  if (!active) return null;

  function selectContext(context: DashboardContextOption) {
    setOpen(false);
    setQuery("");
    if (context.href !== active?.href) {
      router.push(context.href);
    }
  }

  return (
    <div className="min-w-0">
      <Label
        id={labelId}
        htmlFor="dashboard-context-switcher"
        className="mb-1 sr-only text-xs text-muted-foreground md:not-sr-only md:mb-1 md:block"
      >
        Workspace
      </Label>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="dashboard-context-switcher"
            type="button"
            variant="outline"
            size="sm"
            role="combobox"
            aria-labelledby={labelId}
            aria-expanded={open}
            aria-controls={listId}
            aria-haspopup="listbox"
            name="workspace"
            className="h-9 w-full max-w-[16rem] justify-between font-medium"
          >
            <span className="truncate">{active.label}</span>
            <ChevronsUpDown aria-hidden className="size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[min(18rem,calc(100vw-2rem))] p-0"
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Filter workspaces…"
              aria-label="Filter workspaces"
            />
            <CommandList id={listId} aria-labelledby={labelId}>
              <CommandEmpty>No matching workspace.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.type} heading={group.label}>
                  {group.contexts.map((context) => {
                    const selected = context.id === active.id;
                    return (
                      <CommandItem
                        key={context.id}
                        value={context.id}
                        onSelect={() => selectContext(context)}
                        aria-current={selected ? "true" : undefined}
                        className="cursor-pointer"
                      >
                        <Check
                          aria-hidden
                          className={cn(
                            "size-4",
                            selected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="truncate">{context.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
