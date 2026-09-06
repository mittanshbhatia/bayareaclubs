import { z } from "zod";

export const clubRoles = [
  "club_admin",
  "president",
  "vice_president",
  "secretary",
  "treasurer",
  "officer",
  "advisor",
  "member",
] as const;

export const officerRoles = clubRoles.filter((role) => role !== "member");

export const CLUB_SECTIONS = [
  { key: "overview", label: "Overview", href: "" },
  { key: "members", label: "Members", href: "/members" },
  { key: "attendance", label: "Attendance", href: "/attendance" },
  { key: "activities", label: "Activities", href: "/activities" },
  { key: "events", label: "Events", href: "/events" },
  { key: "charter", label: "Charter", href: "/charter" },
  { key: "media", label: "Media", href: "/media" },
  { key: "highlights", label: "Highlights", href: "/highlights" },
  { key: "communications", label: "Communications", href: "/communications" },
  { key: "newsletter", label: "Newsletter", href: "/newsletter" },
  { key: "resources", label: "Resources", href: "/resources" },
  { key: "insights", label: "Insights", href: "/insights" },
  { key: "settings", label: "Settings", href: "/settings" },
] as const;

export const inviteMemberSchema = z.object({
  clubId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(clubRoles).default("member"),
  schoolYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Use school year format YYYY-YYYY"),
});

export const updateMembershipStatusSchema = z.object({
  clubId: z.string().uuid(),
  membershipId: z.string().uuid(),
  status: z.enum(["active", "exited", "declined", "suspended"]),
});

export const changeMemberRoleSchema = z.object({
  clubId: z.string().uuid(),
  membershipId: z.string().uuid(),
  role: z.enum(clubRoles),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  startsOn: z.string().date().optional(),
});

export const appointOfficerSchema = z.object({
  clubId: z.string().uuid(),
  membershipId: z.string().uuid(),
  role: z.enum([
    "club_admin",
    "president",
    "vice_president",
    "secretary",
    "treasurer",
    "officer",
    "advisor",
  ]),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/),
  startsOn: z.string().date(),
  endsOn: z.string().date().optional().nullable(),
});

export const endOfficerTermSchema = z.object({
  clubId: z.string().uuid(),
  termId: z.string().uuid(),
  endsOn: z.string().date(),
  endedReason: z.string().trim().min(2).max(200),
  demoteToMember: z.boolean().default(false),
});

export const bulkMembershipStatusSchema = z.object({
  clubId: z.string().uuid(),
  membershipIds: z.array(z.string().uuid()).min(1).max(50),
  status: z.enum(["active", "exited"]),
});

export const createActivitySchema = z.object({
  clubId: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1),
  activityDate: z.string().date(),
  category: z.string().trim().min(1).max(80),
  outcomes: z.string().trim().max(4000).optional().default(""),
  relatedEventId: z.string().uuid().optional().nullable(),
  participantMembershipIds: z.array(z.string().uuid()).max(200).default([]),
  mediaAssetIds: z.array(z.string().uuid()).max(20).default([]),
});

export const updateClubSettingsSchema = z
  .object({
    clubId: z.string().uuid(),
    name: z.string().trim().min(2).max(160).optional(),
    description: z.string().trim().min(1).optional(),
    mission: z.string().trim().min(1).optional(),
    category: z.string().trim().min(1).max(80).optional(),
    meetingCadence: z.string().trim().max(500).optional(),
    publicSummary: z.string().trim().max(500).optional(),
    visibility: z.enum(["private", "club", "school", "public"]).optional(),
    logoAssetId: z.string().uuid().optional().nullable(),
  })
  .refine(
    (value) =>
      value.name != null ||
      value.description != null ||
      value.mission != null ||
      value.category != null ||
      value.meetingCadence != null ||
      value.publicSummary != null ||
      value.visibility != null ||
      value.logoAssetId !== undefined,
    { message: "Provide at least one settings field to update." },
  );

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateClubSettingsInput = z.infer<typeof updateClubSettingsSchema>;
