"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Library,
  Mail,
  RefreshCw,
  ScrollText,
  Search,
  Shield,
  Sparkles,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchCommandPaletteAction } from "@/features/command-palette/actions";
import type { CommandPaletteResult } from "@/lib/validation/command-palette";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  calendar: Calendar,
  clipboard: ClipboardList,
  "user-plus": UserPlus,
  sparkles: Sparkles,
  "file-text": FileText,
  mail: Mail,
  "graduation-cap": GraduationCap,
  shield: Shield,
  user: User,
  "book-open": BookOpen,
  "layout-dashboard": LayoutDashboard,
  inbox: Inbox,
  "refresh-cw": RefreshCw,
  "building-2": Building2,
  users: Users,
  "scroll-text": ScrollText,
  library: Library,
};

function ResultIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? Search;
  return <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />;
}

function useIsMobileSheet() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return isMobile;
}

export function GlobalCommandPalette({
  className,
  enableHotkey = true,
}: {
  className?: string;
  enableHotkey?: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileSheet();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<CommandPaletteResult[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback((nextQuery: string) => {
    startTransition(async () => {
      const response = await searchCommandPaletteAction({
        query: nextQuery,
        limit: 24,
      });
      if (!response.ok) {
        setError(response.error.message);
        setResults([]);
        return;
      }
      setError(null);
      setResults(response.data.results);
    });
  }, []);

  useEffect(() => {
    if (!enableHotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableHotkey]);

  useEffect(() => {
    if (!open) return;
    runSearch(deferredQuery);
  }, [open, deferredQuery, runSearch]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandPaletteResult[]>();
    for (const result of results) {
      const list = map.get(result.group) ?? [];
      list.push(result);
      map.set(result.group, list);
    }
    return [...map.entries()];
  }, [results]);

  function closeAndNavigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-9 gap-2 border-border bg-surface text-muted-foreground shadow-xs",
          "w-9 justify-center px-0 sm:w-auto sm:min-w-[14rem] sm:justify-start sm:px-3",
          className,
        )}
        onClick={() => setOpen(true)}
        aria-label="Open command search"
      >
        <Search aria-hidden className="size-4" />
        <span className="hidden flex-1 text-left text-sm sm:inline">
          Search commands…
        </span>
        <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <DialogContent
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "gap-0 overflow-hidden p-0",
            isMobile
              ? "inset-0 left-0 top-0 flex h-[100dvh] max-h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0"
              : "top-[12%] max-w-xl translate-y-0 sm:rounded-xl",
          )}
        >
          <DialogTitle id={titleId} className="sr-only">
            Command search
          </DialogTitle>
          <DialogDescription id={descriptionId} className="sr-only">
            Search clubs, members, events, resources, admin pages, and actions
            you are authorized to open. Use arrow keys to navigate and Enter to
            select.
          </DialogDescription>

          <Command
            shouldFilter={false}
            className={cn(
              "rounded-none bg-surface",
              isMobile ? "h-full" : "max-h-[min(32rem,70vh)]",
            )}
          >
            <div className="border-b border-border px-1">
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Search clubs, people, events, actions…"
                className="h-12"
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-muted/40 px-4 py-2 text-xs text-muted-foreground">
              <span>
                {pending ? "Searching…" : `${results.length} authorized results`}
              </span>
              <span className="hidden sm:inline">
                ↑↓ navigate · ↵ open · esc close
              </span>
            </div>
            <CommandList
              className={cn(
                isMobile ? "max-h-none flex-1 overflow-y-auto" : "max-h-[24rem]",
              )}
            >
              <CommandEmpty>
                {error
                  ? error
                  : pending
                    ? "Searching authorized results…"
                    : "No authorized matches."}
              </CommandEmpty>
              {groups.map(([group, items], index) => (
                <div key={group}>
                  {index > 0 ? <CommandSeparator /> : null}
                  <CommandGroup heading={group}>
                    {items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.group} ${item.label} ${item.description}`}
                        onSelect={() => closeAndNavigate(item.href)}
                        className="aria-selected:bg-accent/15 cursor-pointer gap-3 py-3"
                      >
                        <ResultIcon name={item.icon} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-foreground">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                        <Link
                          href={item.href}
                          className="sr-only"
                          tabIndex={-1}
                          aria-hidden
                        >
                          {item.label}
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
