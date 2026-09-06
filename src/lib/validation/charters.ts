import { z } from "zod";

/** Field columns on club_charters that section definitions may target. */
export const charterFieldColumns = [
  "purpose",
  "mission",
  "membership_requirements",
  "officer_structure",
  "officer_responsibilities",
  "elections",
  "meeting_cadence",
  "conduct_expectations",
  "advisor_information",
  "planned_activities",
  "financial_policy",
  "amendment_process",
] as const;

export type CharterFieldColumn = (typeof charterFieldColumns)[number];

export type CharterSectionDefinition = {
  key: string;
  label: string;
  description: string;
  fieldColumn: CharterFieldColumn;
  sortOrder: number;
  required: boolean;
  minLength: number;
};

export const charterSectionValuesSchema = z.record(z.string(), z.string());

export const saveCharterDraftSchema = z.object({
  clubId: z.string().uuid(),
  charterId: z.string().uuid().optional(),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  draftStep: z.number().int().min(1).max(20).default(1),
  sections: charterSectionValuesSchema,
});

export const submitCharterSchema = z.object({
  clubId: z.string().uuid(),
  charterId: z.string().uuid(),
});

export const decideCharterSchema = z
  .object({
    clubId: z.string().uuid(),
    charterId: z.string().uuid(),
    decision: z.enum(["approved", "changes_requested", "rejected"]),
    applicantFeedback: z.string().trim().max(4000).default(""),
    internalNotes: z.string().trim().max(4000).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      (value.decision === "changes_requested" || value.decision === "rejected") &&
      value.applicantFeedback.trim().length < 12
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["applicantFeedback"],
        message: "Share actionable feedback (at least 12 characters).",
      });
    }
  });

export const saveRenewalDraftSchema = z.object({
  clubId: z.string().uuid(),
  renewalId: z.string().uuid().optional(),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  nextYearPlan: z.string().default(""),
  highlightsSummary: z.string().default(""),
  advisorConfirmed: z.boolean().default(false),
});

export const submitRenewalSchema = z.object({
  clubId: z.string().uuid(),
  renewalId: z.string().uuid(),
});

export const decideRenewalSchema = z
  .object({
    clubId: z.string().uuid(),
    renewalId: z.string().uuid(),
    decision: z.enum(["approved", "changes_requested", "rejected"]),
    applicantFeedback: z.string().trim().max(4000).default(""),
    internalNotes: z.string().trim().max(4000).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      (value.decision === "changes_requested" || value.decision === "rejected") &&
      value.applicantFeedback.trim().length < 12
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["applicantFeedback"],
        message: "Share actionable feedback (at least 12 characters).",
      });
    }
  });

export type SaveCharterDraftInput = z.infer<typeof saveCharterDraftSchema>;
export type SaveRenewalDraftInput = z.infer<typeof saveRenewalDraftSchema>;

export function sectionsToColumns(
  definitions: CharterSectionDefinition[],
  sections: Record<string, string>,
): Partial<Record<CharterFieldColumn, string>> {
  const out: Partial<Record<CharterFieldColumn, string>> = {};
  for (const def of definitions) {
    out[def.fieldColumn] = sections[def.key] ?? "";
  }
  return out;
}

export function columnsToSections(
  definitions: CharterSectionDefinition[],
  row: Partial<Record<CharterFieldColumn, string | null>>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const def of definitions) {
    out[def.key] = row[def.fieldColumn] ?? "";
  }
  return out;
}

export function computeCharterCompletion(
  definitions: CharterSectionDefinition[],
  sections: Record<string, string>,
): { complete: number; total: number; percent: number } {
  const required = definitions.filter((def) => def.required);
  const complete = required.filter((def) => {
    const value = (sections[def.key] ?? "").trim();
    return value.length >= def.minLength;
  }).length;
  const total = required.length || 1;
  return {
    complete,
    total,
    percent: Math.round((complete / total) * 100),
  };
}
