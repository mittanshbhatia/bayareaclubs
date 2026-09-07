import { z } from "zod";

import {
  announcementPayloadSchema,
  DASHBOARD_CONFIG_SCOPES,
  DASHBOARD_HOME_MODULE_TYPES,
  dashboardHomePayloadSchema,
  deadlinePayloadSchema,
  featuredCoursesPayloadSchema,
  featuredEventsPayloadSchema,
  featuredResourcesPayloadSchema,
  sanitizeDashboardPlainText,
  schoolMessagePayloadSchema,
} from "@/lib/validation/dashboard";
import { containsUnsafeContent } from "@/lib/validation/communications";

export {
  announcementPayloadSchema,
  DASHBOARD_HOME_MODULE_TYPES,
  dashboardHomePayloadSchema,
  deadlinePayloadSchema,
  featuredCoursesPayloadSchema,
  featuredEventsPayloadSchema,
  featuredResourcesPayloadSchema,
  schoolMessagePayloadSchema,
};

export type DashboardHomeModuleType =
  (typeof DASHBOARD_HOME_MODULE_TYPES)[number];

export const DASHBOARD_HOME_SCOPES = ["global", "school", "club"] as const;

export type DashboardHomeScope = (typeof DASHBOARD_HOME_SCOPES)[number];

const HTML_TAG = /<[^>]+>/;

export function containsHtmlOrScript(value: string) {
  return containsUnsafeContent(value) || HTML_TAG.test(value);
}

export const dashboardHomePayloadByType = {
  announcement: announcementPayloadSchema,
  featured_courses: featuredCoursesPayloadSchema,
  featured_resources: featuredResourcesPayloadSchema,
  featured_events: featuredEventsPayloadSchema,
  deadline: deadlinePayloadSchema,
  school_message: schoolMessagePayloadSchema,
} as const;

export function parseDashboardHomePayload(
  moduleType: DashboardHomeModuleType,
  payload: unknown,
) {
  const parsed = dashboardHomePayloadByType[moduleType].safeParse(payload);
  if (!parsed.success) return parsed;
  if ("title" in parsed.data) {
    parsed.data.title = sanitizeDashboardPlainText(parsed.data.title);
  }
  if ("body" in parsed.data) {
    parsed.data.body = sanitizeDashboardPlainText(parsed.data.body);
  }
  return parsed;
}

export const upsertDashboardHomeContentSchema = z
  .object({
    id: z.string().uuid().optional(),
    moduleType: z.enum(DASHBOARD_HOME_MODULE_TYPES),
    scopeType: z.enum(DASHBOARD_HOME_SCOPES),
    schoolId: z.string().uuid().optional().nullable(),
    clubId: z.string().uuid().optional().nullable(),
    displayOrder: z.number().int().min(0).max(10_000).default(0),
    enabled: z.boolean().default(true),
    payload: z.unknown(),
  })
  .superRefine((value, ctx) => {
    if (value.moduleType === "school_message" && value.scopeType !== "school") {
      ctx.addIssue({
        code: "custom",
        path: ["scopeType"],
        message: "School messages can only be scoped to a school.",
      });
    }
    if (value.scopeType === "school" && !value.schoolId) {
      ctx.addIssue({
        code: "custom",
        path: ["schoolId"],
        message: "Choose a school for this school-scoped module.",
      });
    }
    if (value.scopeType === "club" && !value.clubId) {
      ctx.addIssue({
        code: "custom",
        path: ["clubId"],
        message: "Choose a club for this club-scoped module.",
      });
    }
    const parsed = parseDashboardHomePayload(value.moduleType, value.payload);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({
          code: "custom",
          path: ["payload", ...issue.path],
          message: issue.message,
        });
      }
    }
  });

export type UpsertDashboardHomeContentInput = z.infer<
  typeof upsertDashboardHomeContentSchema
>;

export const deleteDashboardHomeContentSchema = z.object({
  id: z.string().uuid(),
});

export function extractHomeContentBody(
  moduleType: DashboardHomeModuleType,
  payload: unknown,
) {
  const parsed = parseDashboardHomePayload(moduleType, payload);
  if (!parsed.success) return "";
  const data = parsed.data;
  if ("body" in data) return sanitizeDashboardPlainText(data.body);
  if ("title" in data) return sanitizeDashboardPlainText(data.title);
  return "";
}

export function assertNeverUserScope(
  scopeType: (typeof DASHBOARD_CONFIG_SCOPES)[number],
) {
  return scopeType !== "user";
}
