"use client";

import dynamic from "next/dynamic";

import type { ChartPoint } from "./chart-card-inner";

export type { ChartPoint };
export { ChartCard as ChartCardImpl } from "./chart-card-inner";

type ChartCardProps = {
  title: string;
  description?: string;
  data: ChartPoint[];
  className?: string;
  variant?: "line" | "bar";
  valueLabel?: string;
  secondaryLabel?: string;
  summary?: string;
};

const ChartCardLazy = dynamic(
  () => import("./chart-card-inner").then((mod) => mod.ChartCard),
  {
    ssr: false,
    loading: () => (
      <div
        data-slot="chart-card"
        className="flex h-72 items-center justify-center rounded-lg border border-border bg-surface p-5 text-sm text-muted-foreground shadow-xs"
        aria-busy="true"
        aria-label="Loading chart"
      >
        Loading chart…
      </div>
    ),
  },
);

export function ChartCard(props: ChartCardProps) {
  return <ChartCardLazy {...props} />;
}
