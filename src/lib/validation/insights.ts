import { z } from "zod";

export const insightsRangeSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  schoolId: z.string().uuid().optional().nullable(),
  gradeBand: z.enum(["under_13", "age_13_17", "adult", "all"]).default("all"),
  category: z.string().trim().max(80).optional().nullable(),
});

export type InsightsFilters = z.infer<typeof insightsRangeSchema>;

export function defaultInsightsRange(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export function gradeBandToClubGrades(band: InsightsFilters["gradeBand"]) {
  if (band === "under_13") return { min: 0, max: 8 };
  if (band === "age_13_17") return { min: 9, max: 12 };
  if (band === "adult") return { min: 13, max: 16 };
  return null;
}
