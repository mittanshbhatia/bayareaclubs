import { cn } from "@/lib/utils";

export function Eyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.14em] text-accent",
        className,
      )}
      {...props}
    />
  );
}

type DisplayHeadingProps = React.ComponentProps<"h1"> & {
  as?: "h1" | "h2" | "h3";
};

export function DisplayHeading({
  as = "h1",
  className,
  ...props
}: DisplayHeadingProps) {
  const Comp = as;
  return (
    <Comp
      data-slot="display-heading"
      className={cn(
        "font-display text-4xl font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-display)] text-foreground sm:text-5xl",
        className,
      )}
      {...props}
    />
  );
}
