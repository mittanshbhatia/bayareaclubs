import { cn } from "@/lib/utils";

type DataCardProps = React.ComponentProps<"div"> & {
  title: string;
  description?: string;
  footer?: React.ReactNode;
};

export function DataCard({
  title,
  description,
  footer,
  className,
  children,
  ...props
}: DataCardProps) {
  return (
    <div
      data-slot="data-card"
      className={cn(
        "flex flex-col rounded-lg border border-border bg-surface shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex-1 p-5">{children}</div>
      {footer ? (
        <div className="border-t border-border px-5 py-3">{footer}</div>
      ) : null}
    </div>
  );
}
