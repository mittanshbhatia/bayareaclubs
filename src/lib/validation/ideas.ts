import { z } from "zod";

export const ideaCategories = [
  "STEM",
  "Arts",
  "Service",
  "Culture",
  "Sports",
  "Academic",
  "Other",
] as const;

export const IDEA_STEPS = [
  { id: 1, key: "idea", label: "Idea" },
  { id: 2, key: "school", label: "School" },
  { id: 3, key: "mission", label: "Mission" },
  { id: 4, key: "activities", label: "Planned Activities" },
  { id: 5, key: "membership", label: "Membership" },
  { id: 6, key: "leadership", label: "Leadership" },
  { id: 7, key: "advisor", label: "Advisor" },
  { id: 8, key: "meeting", label: "Meeting Plan" },
  { id: 9, key: "materials", label: "Supporting Materials" },
  { id: 10, key: "review", label: "Review & Submit" },
] as const;

export const proposedOfficerSchema = z.object({
  proposedName: z.string().trim().min(1).max(120),
  proposedRole: z.enum([
    "club_admin",
    "president",
    "vice_president",
    "secretary",
    "treasurer",
    "officer",
    "advisor",
    "member",
  ]),
  proposedUserId: z.string().uuid().optional().nullable(),
});

export const ideaLinkSchema = z.object({
  title: z.string().trim().min(1).max(160),
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => value.startsWith("https://"), {
      message: "Links must use https://",
    }),
});

export const ideaDraftSchema = z.object({
  ideaId: z.string().uuid().optional(),
  draftStep: z.number().int().min(1).max(10).default(1),
  schoolId: z.string().uuid().optional().nullable(),
  title: z.string().trim().max(160).default(""),
  category: z.string().trim().max(80).default(""),
  description: z.string().default(""),
  mission: z.string().default(""),
  problemOpportunity: z.string().default(""),
  expectedActivities: z.array(z.string().trim().min(1)).default([]),
  expectedMembership: z.number().int().min(1).max(100000).optional().nullable(),
  proposedMeetingCadence: z.string().default(""),
  proposedAdvisorId: z.string().uuid().optional().nullable(),
  gradeMin: z.number().int().min(0).max(20).optional().nullable(),
  gradeMax: z.number().int().min(0).max(20).optional().nullable(),
  officers: z.array(proposedOfficerSchema).default([]),
  links: z.array(ideaLinkSchema).default([]),
});

export const ideaSubmitSchema = ideaDraftSchema
  .extend({
    schoolId: z.string().uuid(),
    title: z.string().trim().min(2).max(160),
    category: z.string().trim().min(1).max(80),
    description: z.string().trim().min(20),
    mission: z.string().trim().min(20),
    problemOpportunity: z.string().trim().min(20),
    expectedActivities: z.array(z.string().trim().min(1)).min(1),
    expectedMembership: z.number().int().min(1).max(100000),
    proposedMeetingCadence: z.string().trim().min(3),
    gradeMin: z.number().int().min(0).max(20),
    gradeMax: z.number().int().min(0).max(20),
    officers: z.array(proposedOfficerSchema).min(1),
  })
  .superRefine((value, ctx) => {
    if (value.gradeMin > value.gradeMax) {
      ctx.addIssue({
        code: "custom",
        path: ["gradeMax"],
        message: "Maximum grade must be greater than or equal to minimum grade.",
      });
    }
  });

export const assignReviewerSchema = z.object({
  ideaId: z.string().uuid(),
  reviewerId: z.string().uuid(),
});

export const startReviewSchema = z.object({
  ideaId: z.string().uuid(),
});

export const decideIdeaSchema = z
  .object({
    ideaId: z.string().uuid(),
    reviewId: z.string().uuid(),
    decision: z.enum(["changes_requested", "approved", "rejected"]),
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
        message:
          value.decision === "rejected"
            ? "A decision reason is required for rejection."
            : "Meaningful feedback is required when requesting changes.",
      });
    }
  });

export const convertIdeaSchema = z.object({
  ideaId: z.string().uuid(),
  confirmName: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
});

export type IdeaDraftInput = z.infer<typeof ideaDraftSchema>;
export type IdeaSubmitInput = z.infer<typeof ideaSubmitSchema>;
export type DecideIdeaInput = z.infer<typeof decideIdeaSchema>;
export type ConvertIdeaInput = z.infer<typeof convertIdeaSchema>;
