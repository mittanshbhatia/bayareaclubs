import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  compact?: boolean;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  compact = false,
}: EmptyStateProps) {
  const showAction = Boolean(actionLabel && (onAction || actionHref));

  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/30 text-center",
        compact ? "px-4 py-6" : "px-6 py-10",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center justify-center rounded-md bg-surface text-muted-foreground shadow-xs",
          compact ? "size-9" : "size-11",
        )}
      >
        <Inbox aria-hidden className={compact ? "size-4" : "size-5"} />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {showAction && actionHref ? (
        <Button asChild className="mt-5" size={compact ? "sm" : "default"}>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
      {showAction && !actionHref && onAction ? (
        <Button
          className="mt-5"
          type="button"
          size={compact ? "sm" : "default"}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  description?: string;
  errorId?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We could not complete that request. Try again or contact support with the error ID.",
  errorId,
  retryLabel = "Try again",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger-muted/40 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-surface text-danger shadow-xs">
        <AlertCircle aria-hidden className="size-5" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {errorId ? (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Error ID: {errorId}
        </p>
      ) : null}
      {onRetry ? (
        <Button className="mt-5" type="button" variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
