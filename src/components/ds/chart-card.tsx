"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartCssVars } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
};

type ChartCardProps = {
  title: string;
  description?: string;
  data: ChartPoint[];
  className?: string;
};

export function ChartCard({
  title,
  description,
  data,
  className,
}: ChartCardProps) {
  return (
    <div
      data-slot="chart-card"
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-xs",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="h-56 w-full" role="img" aria-label={`${title} chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              stroke="var(--chart-axis)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--chart-axis)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                background: "var(--chart-tooltip-bg)",
                color: "var(--chart-tooltip-fg)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartCssVars["chart-1"]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{title} data</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <td>{point.label}</td>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
