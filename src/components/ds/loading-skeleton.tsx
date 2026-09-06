import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  variant?: "metric" | "card" | "table" | "list";
  className?: string;
};

export function LoadingSkeleton({
  variant = "card",
  className,
}: LoadingSkeletonProps) {
  if (variant === "metric") {
    return (
      <div
        data-slot="loading-skeleton"
        aria-busy="true"
        aria-label="Loading"
        className={cn("space-y-3 rounded-lg border border-border p-5", className)}
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        data-slot="loading-skeleton"
        aria-busy="true"
        aria-label="Loading table"
        className={cn("space-y-2", className)}
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div
        data-slot="loading-skeleton"
        aria-busy="true"
        aria-label="Loading list"
        className={cn("space-y-3", className)}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="loading-skeleton"
      aria-busy="true"
      aria-label="Loading"
      className={cn("space-y-3 rounded-lg border border-border p-5", className)}
    >
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
