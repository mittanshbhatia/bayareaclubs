import { z } from "zod";

export const HIGHLIGHT_SOURCE_TYPES = [
  "activity",
  "event",
  "media",
  "achievement",
  "competition",
  "community_service",
  "project",
  "other",
] as const;

export const NEWSLETTER_BLOCK_TYPES = [
  "hero",
  "text",
  "highlight",
  "event_recap",
  "upcoming_event",
  "image",
  "gallery",
  "stats",
  "course_recommendation",
  "cta",
  "divider",
] as const;

export const HIGHLIGHT_SOURCE_LABELS: Record<
  (typeof HIGHLIGHT_SOURCE_TYPES)[number],
  string
> = {
  activity: "Activity",
  event: "Event",
  media: "Media",
  achievement: "Achievement",
  competition: "Competition",
  community_service: "Community service",
  project: "Project",
  other: "Other",
};

export const BLOCK_TYPE_LABELS: Record<(typeof NEWSLETTER_BLOCK_TYPES)[number], string> = {
  hero: "Hero",
  text: "Text",
  highlight: "Highlight",
  event_recap: "Event recap",
  upcoming_event: "Upcoming event",
  image: "Image",
  gallery: "Gallery",
  stats: "Stats",
  course_recommendation: "Course recommendation",
  cta: "CTA",
  divider: "Divider",
};

const unsafe = /<\s*script|javascript:|on\w+\s*=/i;

function safeText(max: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !unsafe.test(value), "Unsafe content is not allowed.");
}

export const highlightFormSchema = z.object({
  clubId: z.string().uuid(),
  highlightId: z.string().uuid().optional(),
  title: safeText(160),
  summary: safeText(400),
  body: z
    .string()
    .trim()
    .max(8000)
    .default("")
    .refine((value) => !unsafe.test(value), "Unsafe content is not allowed."),
  sourceType: z.enum(HIGHLIGHT_SOURCE_TYPES),
  occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  coverAssetId: z.string().uuid().optional().nullable(),
  relatedActivityId: z.string().uuid().optional().nullable(),
  relatedEventId: z.string().uuid().optional().nullable(),
  visibility: z.enum(["private", "club", "school", "public"]).default("club"),
  publish: z.boolean().default(false),
});

const blockContentSchema = z.record(z.string(), z.unknown());

export const newsletterBlockSchema = z.object({
  id: z.string().uuid().optional(),
  blockType: z.enum(NEWSLETTER_BLOCK_TYPES),
  content: blockContentSchema.default({}),
});

export const newsletterDraftSchema = z.object({
  clubId: z.string().uuid(),
  newsletterId: z.string().uuid().optional(),
  title: safeText(200),
  issueLabel: z.string().trim().max(80).optional().or(z.literal("")),
  previewText: z.string().trim().max(240).optional().or(z.literal("")),
  visibility: z.enum(["private", "club", "school", "public"]).default("club"),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  selectedFacts: z
    .object({
      includeMeetings: z.boolean().default(false),
      includeEvents: z.boolean().default(false),
      includeNewMembers: z.boolean().default(false),
      includeAttendance: z.boolean().default(false),
      includeHighlights: z.boolean().default(false),
      includeUpcoming: z.boolean().default(false),
      eventIds: z.array(z.string().uuid()).max(20).default([]),
      highlightIds: z.array(z.string().uuid()).max(20).default([]),
      upcomingEventIds: z.array(z.string().uuid()).max(10).default([]),
      courseIds: z.array(z.string().uuid()).max(5).default([]),
    })
    .default({
      includeMeetings: false,
      includeEvents: false,
      includeNewMembers: false,
      includeAttendance: false,
      includeHighlights: false,
      includeUpcoming: false,
      eventIds: [],
      highlightIds: [],
      upcomingEventIds: [],
      courseIds: [],
    }),
  blocks: z.array(newsletterBlockSchema).max(40).default([]),
});

export const newsletterActionSchema = z.object({
  clubId: z.string().uuid(),
  newsletterId: z.string().uuid(),
  scheduledFor: z.string().optional().nullable(),
  mode: z.enum(["schedule", "send"]).optional(),
});

export const monthFactsSchema = z.object({
  clubId: z.string().uuid(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type HighlightFormInput = z.infer<typeof highlightFormSchema>;
export type NewsletterDraftInput = z.infer<typeof newsletterDraftSchema>;
export type NewsletterBlockInput = z.infer<typeof newsletterBlockSchema>;
