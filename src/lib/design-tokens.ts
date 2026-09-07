/** Typed mirrors of Design System v1 CSS tokens (Peninsula). CSS remains source of truth. */

export const motionDurations = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export const motionEasings = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
};

export const containerWidths = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  page: "72rem",
} as const;

export const chartSeriesKeys = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
] as const;

export type ChartSeriesKey = (typeof chartSeriesKeys)[number];

/** CSS variable references for Recharts / inline styles. */
export const chartCssVars: Record<ChartSeriesKey, string> = {
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
  "chart-6": "var(--chart-6)",
};

export const zIndex = {
  base: 0,
  dropdown: 40,
  sticky: 50,
  overlay: 60,
  modal: 70,
  toast: 80,
} as const;

export const designSystemMeta = {
  name: "BayAreaClubs Design System",
  version: "1.0.0",
  codename: "Peninsula",
} as const;

/** Learning surface tokens — CSS remains source of truth. Derived from Peninsula. */
export const learningCssVars = {
  "learning-background": "var(--learning-background)",
  "learning-surface": "var(--learning-surface)",
  "course-accent": "var(--course-accent)",
  "progress-track": "var(--progress-track)",
  "progress-fill": "var(--progress-fill)",
  "course-border": "var(--course-border)",
  "course-muted": "var(--course-muted)",
  "course-success": "var(--course-success)",
} as const;

export const learningTokenNames = [
  "learning-background",
  "learning-surface",
  "course-accent",
  "progress-track",
  "progress-fill",
  "course-border",
  "course-muted",
  "course-success",
] as const;
