import { z } from "zod";

export const EMAIL_CAMPAIGN_KINDS = [
  "invitation",
  "approval",
  "event_update",
  "charter_status",
  "renewal_reminder",
  "announcement",
  "newsletter",
  "event_promotion",
  "highlight_digest",
] as const;

export const CLUB_COMMUNICATION_KINDS = [
  "announcement",
  "newsletter",
  "event_promotion",
  "highlight_digest",
] as const;

export const EMAIL_AUDIENCE_TYPES = [
  "all_members",
  "officers",
  "membership_segment",
  "event_attendees",
  "event_registrants",
] as const;

export const MEMBERSHIP_SEGMENT_ROLES = [
  "club_admin",
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "officer",
  "advisor",
  "member",
] as const;

const unsafePattern = /<\s*script|javascript:|on\w+\s*=/i;

export function containsUnsafeContent(value: string) {
  return unsafePattern.test(value);
}

/** Strip tags; React Email Text still escapes — this is defense in depth. */
export function sanitizePlainText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim();
}

export const campaignComposerSchema = z
  .object({
    clubId: z.string().uuid(),
    campaignId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(160),
    subject: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine((value) => !containsUnsafeContent(value), "Subject contains unsafe content."),
    previewText: z
      .string()
      .trim()
      .max(180)
      .optional()
      .or(z.literal("")),
    messageBody: z
      .string()
      .trim()
      .min(1)
      .max(20000)
      .refine((value) => !containsUnsafeContent(value), "Message contains unsafe content."),
    campaignKind: z.enum(CLUB_COMMUNICATION_KINDS),
    audienceType: z.enum(EMAIL_AUDIENCE_TYPES),
    segmentRoles: z.array(z.enum(MEMBERSHIP_SEGMENT_ROLES)).max(8).default([]),
    eventId: z.string().uuid().optional().nullable(),
    ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
    ctaUrl: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (value) => !value || /^https:\/\//.test(value),
        "CTA URL must use https://",
      ),
    sendMode: z.enum(["draft", "send_now", "schedule"]).default("draft"),
    scheduledFor: z.string().optional().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.audienceType === "membership_segment" && value.segmentRoles.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["segmentRoles"],
        message: "Select at least one membership role.",
      });
    }
    if (
      (value.audienceType === "event_attendees" ||
        value.audienceType === "event_registrants") &&
      !value.eventId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["eventId"],
        message: "Choose an event for this audience.",
      });
    }
    const hasLabel = Boolean(value.ctaLabel?.trim());
    const hasUrl = Boolean(value.ctaUrl?.trim());
    if (hasLabel !== hasUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["ctaLabel"],
        message: "CTA label and URL must be provided together.",
      });
    }
    if (value.sendMode === "schedule") {
      if (!value.scheduledFor) {
        ctx.addIssue({
          code: "custom",
          path: ["scheduledFor"],
          message: "Choose a schedule time.",
        });
      } else {
        const when = new Date(value.scheduledFor);
        if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
          ctx.addIssue({
            code: "custom",
            path: ["scheduledFor"],
            message: "Schedule time must be in the future.",
          });
        }
      }
    }
  });

export const audienceCountSchema = z.object({
  clubId: z.string().uuid(),
  audienceType: z.enum(EMAIL_AUDIENCE_TYPES),
  campaignKind: z.enum(CLUB_COMMUNICATION_KINDS),
  segmentRoles: z.array(z.enum(MEMBERSHIP_SEGMENT_ROLES)).max(8).default([]),
  eventId: z.string().uuid().optional().nullable(),
});

export const testEmailSchema = z.object({
  clubId: z.string().uuid(),
  subject: z.string().trim().min(1).max(200),
  previewText: z.string().trim().max(180).optional().or(z.literal("")),
  messageBody: z.string().trim().min(1).max(20000),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  ctaUrl: z.string().trim().optional().or(z.literal("")),
  campaignKind: z.enum(CLUB_COMMUNICATION_KINDS).default("announcement"),
});

export const enqueueCampaignSchema = z.object({
  clubId: z.string().uuid(),
  campaignId: z.string().uuid(),
  sendImmediately: z.boolean().default(true),
});

export type CampaignComposerInput = z.infer<typeof campaignComposerSchema>;

export const AUDIENCE_LABELS: Record<(typeof EMAIL_AUDIENCE_TYPES)[number], string> = {
  all_members: "All members",
  officers: "Officers",
  membership_segment: "Specific membership segment",
  event_attendees: "Event attendees",
  event_registrants: "Event registrants",
};

export const KIND_LABELS: Record<(typeof CLUB_COMMUNICATION_KINDS)[number], string> = {
  announcement: "Announcement",
  newsletter: "Newsletter",
  event_promotion: "Event promotion",
  highlight_digest: "Highlight digest",
};
