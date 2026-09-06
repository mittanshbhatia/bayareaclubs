import { z } from "zod";

export const schoolLevelSchema = z.enum([
  "elementary",
  "middle",
  "high",
  "college",
  "other",
]);

export const schoolUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case."),
  level: schoolLevelSchema,
  city: z.string().trim().min(2).max(80),
  stateCode: z
    .string()
    .trim()
    .length(2)
    .regex(/^[A-Z]{2}$/, "Use a two-letter state code.")
    .default("CA"),
  timezone: z.string().trim().min(3).max(64).default("America/Los_Angeles"),
  websiteUrl: z
    .union([z.literal(""), z.string().url()])
    .optional()
    .nullable(),
  emailDomain: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .toLowerCase()
        .regex(
          /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/,
          "Use a domain like school.edu",
        ),
    ])
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
});

export type SchoolUpsertInput = z.infer<typeof schoolUpsertSchema>;

export const assignPlatformRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["platform_admin", "committee_reviewer"]),
  confirm: z.literal(true),
});

export const revokePlatformRoleSchema = z.object({
  assignmentId: z.string().uuid(),
  confirm: z.literal(true),
});

export function slugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
