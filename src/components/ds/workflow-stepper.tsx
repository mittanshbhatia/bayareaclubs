import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type WorkflowStep = {
  id: string;
  label: string;
  description?: string;
};

type WorkflowStepperProps = {
  steps: WorkflowStep[];
  currentStepId: string;
  className?: string;
};

export function WorkflowStepper({
  steps,
  currentStepId,
  className,
}: WorkflowStepperProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStepId),
  );

  return (
    <ol
      data-slot="workflow-stepper"
      className={cn(
        "grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]",
        className,
      )}
      aria-label="Workflow progress"
    >
      {steps.map((step, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step.id} className="relative flex gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                complete && "border-primary bg-primary text-primary-foreground",
                current && "border-accent bg-accent-muted text-accent",
                !complete &&
                  !current &&
                  "border-border bg-surface text-muted-foreground",
              )}
              aria-current={current ? "step" : undefined}
            >
              {complete ? <Check aria-hidden className="size-4" /> : index + 1}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-semibold",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {step.description ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
