import { cn } from "@/lib/utils";

type FilterBarProps = React.ComponentProps<"div"> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function FilterBar({
  leading,
  trailing,
  className,
  children,
  ...props
}: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {leading}
        {children}
      </div>
      {trailing ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{trailing}</div>
      ) : null}
    </div>
  );
}
