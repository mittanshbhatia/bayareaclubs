import { z } from "zod";

import {
  containsUnsafeContent,
  sanitizePlainText,
} from "@/lib/validation/communications";

export const DASHBOARD_CONTEXT_TYPES = [
  "personal",
  "club",
  "school",
  "platform",
] as const;

export type DashboardContextType = (typeof DASHBOARD_CONTEXT_TYPES)[number];

export const DASHBOARD_CONFIG_SCOPES = [
  "global",
  "school",
  "club",
  "user",
] as const;

export const DASHBOARD_MODULE_STATUSES = ["active", "deprecated"] as const;

export const DASHBOARD_MOBILE_VISIBILITIES = [
  "always",
  "overflow",
  "hidden",
] as const;

export const DASHBOARD_HOME_MODULE_TYPES = [
  "announcement",
  "featured_courses",
  "featured_resources",
  "featured_events",
  "deadline",
  "school_message",
] as const;

export const DASHBOARD_PERMISSIONS = [
  "personal",
  "club.member",
  "club.officer",
  "club.manage",
  "school.dashboard",
  "school.admin",
  "platform.admin",
] as const;

export type DashboardPermission = (typeof DASHBOARD_PERMISSIONS)[number];

export const dashboardContextTypeSchema = z.enum(DASHBOARD_CONTEXT_TYPES);

const kebabSlugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case.");

const uuidSchema = z.string().uuid();

/** URL hint only. school_id / club_id / role are not accepted as authority. */
export const dashboardContextHintSchema = z
  .object({
    type: dashboardContextTypeSchema.optional(),
    clubSlug: kebabSlugSchema.optional(),
    schoolRef: z.string().trim().min(1).max(80).optional(),
  })
  .strict();

export type DashboardContextHint = z.infer<typeof dashboardContextHintSchema>;

export const dashboardUserPreferenceSchema = z
  .object({
    lastContextType: dashboardContextTypeSchema,
    lastClubId: uuidSchema.optional().nullable(),
    lastSchoolId: uuidSchema.optional().nullable(),
    hiddenModuleIds: z.array(kebabSlugSchema).max(64).default([]),
    moduleOrder: z.array(kebabSlugSchema).max(64).default([]),
  })
  .superRefine((value, ctx) => {
    if (value.lastContextType === "club" && !value.lastClubId) {
      ctx.addIssue({
        code: "custom",
        path: ["lastClubId"],
        message: "A club is required for the club context.",
      });
    }
    if (value.lastContextType === "school" && !value.lastSchoolId) {
      ctx.addIssue({
        code: "custom",
        path: ["lastSchoolId"],
        message: "A school is required for the school context.",
      });
    }
    if (value.lastContextType === "personal" || value.lastContextType === "platform") {
      if (value.lastClubId) {
        ctx.addIssue({
          code: "custom",
          path: ["lastClubId"],
          message: "Club is only stored for the club context.",
        });
      }
      if (value.lastSchoolId) {
        ctx.addIssue({
          code: "custom",
          path: ["lastSchoolId"],
          message: "School is only stored for the school context.",
        });
      }
    }
  });

export type DashboardUserPreferenceInput = z.infer<
  typeof dashboardUserPreferenceSchema
>;

export const dashboardModuleConfigSchema = z
  .object({
    moduleId: kebabSlugSchema,
    scopeType: z.enum(DASHBOARD_CONFIG_SCOPES),
    enabled: z.boolean(),
    displayOrder: z.number().int().min(0).max(10_000).optional().nullable(),
    schoolId: uuidSchema.optional().nullable(),
    clubId: uuidSchema.optional().nullable(),
    userId: uuidSchema.optional().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.scopeType === "global") {
      if (value.schoolId || value.clubId || value.userId) {
        ctx.addIssue({
          code: "custom",
          message: "Global config cannot include school, club, or user ids.",
        });
      }
    }
    if (value.scopeType === "school" && !value.schoolId) {
      ctx.addIssue({
        code: "custom",
        path: ["schoolId"],
        message: "School scope requires schoolId.",
      });
    }
    if (value.scopeType === "club" && !value.clubId) {
      ctx.addIssue({
        code: "custom",
        path: ["clubId"],
        message: "Club scope requires clubId.",
      });
    }
    if (value.scopeType === "user" && !value.userId) {
      ctx.addIssue({
        code: "custom",
        path: ["userId"],
        message: "User scope requires userId.",
      });
    }
  });

export type DashboardModuleConfigInput = z.infer<
  typeof dashboardModuleConfigSchema
>;

const plainText = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !containsUnsafeContent(value), "Contains unsafe content.")
    .refine((value) => !/<[^>]+>/.test(value), "HTML is not allowed.");

export const announcementPayloadSchema = z.object({
  title: plainText(160),
  body: plainText(4000),
});

export const featuredCoursesPayloadSchema = z.object({
  courseIds: z.array(uuidSchema).min(1).max(24),
});

export const featuredResourcesPayloadSchema = z.object({
  courseIds: z.array(uuidSchema).min(1).max(24),
});

export const featuredEventsPayloadSchema = z.object({
  eventIds: z.array(uuidSchema).min(1).max(24),
});

export const deadlinePayloadSchema = z.object({
  title: plainText(160),
  dueAt: z
    .string()
    .trim()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
      "Use an ISO-8601 timestamp.",
    ),
  href: z
    .string()
    .trim()
    .max(240)
    .regex(/^\/[A-Za-z0-9/_#?-]*$/, "Use an in-app path.")
    .optional(),
});

export const schoolMessagePayloadSchema = z.object({
  title: plainText(160),
  body: plainText(4000),
});

export const dashboardHomePayloadSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("announcement"), payload: announcementPayloadSchema }),
  z.object({
    type: z.literal("featured_courses"),
    payload: featuredCoursesPayloadSchema,
  }),
  z.object({
    type: z.literal("featured_resources"),
    payload: featuredResourcesPayloadSchema,
  }),
  z.object({
    type: z.literal("featured_events"),
    payload: featuredEventsPayloadSchema,
  }),
  z.object({ type: z.literal("deadline"), payload: deadlinePayloadSchema }),
  z.object({
    type: z.literal("school_message"),
    payload: schoolMessagePayloadSchema,
  }),
]);

export type DashboardHomePayload = z.infer<typeof dashboardHomePayloadSchema>;

export function sanitizeDashboardPlainText(value: string) {
  return sanitizePlainText(value);
}
