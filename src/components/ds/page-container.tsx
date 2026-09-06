import { cn } from "@/lib/utils";

type PageContainerProps = React.ComponentProps<"div"> & {
  size?: "sm" | "md" | "lg" | "xl" | "page";
};

const sizeClass = {
  sm: "max-w-[var(--container-sm)]",
  md: "max-w-[var(--container-md)]",
  lg: "max-w-[var(--container-lg)]",
  xl: "max-w-[var(--container-xl)]",
  page: "max-w-[var(--container-page)]",
} as const;

export function PageContainer({
  className,
  size = "page",
  ...props
}: PageContainerProps) {
  return (
    <div
      data-slot="page-container"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
