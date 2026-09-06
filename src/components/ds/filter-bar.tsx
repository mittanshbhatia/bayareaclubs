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
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {leading}
        {children}
      </div>
      {trailing ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
