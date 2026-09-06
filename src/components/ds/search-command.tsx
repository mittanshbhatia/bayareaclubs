"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type SearchCommandItem = {
  id: string;
  label: string;
  group?: string;
  onSelect?: () => void;
};

type SearchCommandProps = {
  items: SearchCommandItem[];
  placeholder?: string;
  triggerLabel?: string;
  className?: string;
};

export function SearchCommand({
  items,
  placeholder = "Search clubs, events, people…",
  triggerLabel = "Search",
  className,
}: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const groups = React.useMemo(() => {
    const map = new Map<string, SearchCommandItem[]>();
    for (const item of items) {
      const key = item.group ?? "Results";
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-muted-foreground sm:w-64",
          className,
        )}
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <Search aria-hidden className="size-4" />
        <span className="flex-1 text-left">{triggerLabel}</span>
        <kbd className="hidden rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groups.map(([group, groupItems], index) => (
            <React.Fragment key={group}>
              {index > 0 ? <CommandSeparator /> : null}
              <CommandGroup heading={group}>
                {groupItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => {
                      item.onSelect?.();
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
