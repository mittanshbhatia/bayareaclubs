import { describe, expect, it } from "vitest";

import {
  columnsToSections,
  computeCharterCompletion,
  decideCharterSchema,
  saveCharterDraftSchema,
  saveRenewalDraftSchema,
  sectionsToColumns,
  type CharterSectionDefinition,
} from "@/lib/validation/charters";

const definitions: CharterSectionDefinition[] = [
  {
    key: "purpose",
    label: "Purpose",
    description: "",
    fieldColumn: "purpose",
    sortOrder: 1,
    required: true,
    minLength: 20,
  },
  {
    key: "finances",
    label: "Finances",
    description: "",
    fieldColumn: "financial_policy",
    sortOrder: 2,
    required: false,
    minLength: 0,
  },
];

describe("charter section schema helpers", () => {
  it("maps sections to columns and back without a hard-coded form", () => {
    const sections = {
      purpose: "A clear club purpose for student makers.",
      finances: "",
    };
    const columns = sectionsToColumns(definitions, sections);
    expect(columns.purpose).toContain("makers");
    expect(columns.financial_policy).toBe("");
    expect(columnsToSections(definitions, columns)).toEqual(sections);
  });

  it("computes completion from required sections only", () => {
    const incomplete = computeCharterCompletion(definitions, {
      purpose: "too short",
      finances: "",
    });
    expect(incomplete.percent).toBe(0);

    const complete = computeCharterCompletion(definitions, {
      purpose: "A clear club purpose for student makers.",
      finances: "",
    });
    expect(complete.percent).toBe(100);
  });
});

describe("charter validation", () => {
  it("accepts draft saves with partial sections", () => {
    const parsed = saveCharterDraftSchema.safeParse({
      clubId: "11111111-1111-4111-8111-111111111111",
      schoolYear: "2026-2027",
      draftStep: 1,
      sections: { purpose: "draft" },
    });
    expect(parsed.success).toBe(true);
  });

  it("requires feedback when requesting charter changes", () => {
    const bad = decideCharterSchema.safeParse({
      clubId: "11111111-1111-4111-8111-111111111111",
      charterId: "22222222-2222-4222-8222-222222222222",
      decision: "changes_requested",
      applicantFeedback: "short",
    });
    expect(bad.success).toBe(false);

    const ok = decideCharterSchema.safeParse({
      clubId: "11111111-1111-4111-8111-111111111111",
      charterId: "22222222-2222-4222-8222-222222222222",
      decision: "approved",
      applicantFeedback: "",
    });
    expect(ok.success).toBe(true);
  });

  it("accepts renewal draft payloads", () => {
    const parsed = saveRenewalDraftSchema.safeParse({
      clubId: "11111111-1111-4111-8111-111111111111",
      schoolYear: "2026-2027",
      nextYearPlan: "Grow mentorship",
      highlightsSummary: "",
      advisorConfirmed: true,
    });
    expect(parsed.success).toBe(true);
  });
});
