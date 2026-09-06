"use client";

import {
  Bar,
  BarChart,
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
  secondary?: number;
};

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

export function ChartCard({
  title,
  description,
  data,
  className,
  variant = "line",
  valueLabel = "Value",
  secondaryLabel,
  summary,
}: ChartCardProps) {
  const chartSummary =
    summary ??
    (data.length
      ? `${title}: ${data.map((point) => `${point.label} ${point.value}`).join("; ")}.`
      : `${title}: no data in range.`);

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
      {data.length === 0 ? (
        <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No data for this range yet.
        </p>
      ) : (
        <div
          className="h-56 w-full"
          role="img"
          aria-label={chartSummary}
        >
          <ResponsiveContainer width="100%" height="100%">
            {variant === "bar" ? (
              <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
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
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--chart-tooltip-bg)",
                    color: "var(--chart-tooltip-fg)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={chartCssVars["chart-1"]}
                  radius={[4, 4, 0, 0]}
                  name={valueLabel}
                />
                {secondaryLabel ? (
                  <Bar
                    dataKey="secondary"
                    fill={chartCssVars["chart-2"]}
                    radius={[4, 4, 0, 0]}
                    name={secondaryLabel}
                  />
                ) : null}
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
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
                  width={44}
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
                  name={valueLabel}
                />
                {secondaryLabel ? (
                  <Line
                    type="monotone"
                    dataKey="secondary"
                    stroke={chartCssVars["chart-2"]}
                    strokeWidth={2}
                    dot={false}
                    name={secondaryLabel}
                  />
                ) : null}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
      <p className="sr-only">{chartSummary}</p>
      <table className="sr-only">
        <caption>{title} data</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">{valueLabel}</th>
            {secondaryLabel ? <th scope="col">{secondaryLabel}</th> : null}
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <td>{point.label}</td>
              <td>{point.value}</td>
              {secondaryLabel ? <td>{point.secondary ?? 0}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
