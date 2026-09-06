import { z } from "zod";

export const eventTypes = [
  "club_meeting",
  "workshop",
  "speaker",
  "competition",
  "hackathon",
  "community_service",
  "fundraiser",
  "field_trip",
  "social",
  "showcase",
  "tournament",
  "conference",
  "other",
] as const;

export const eventFormats = ["in_person", "online", "hybrid"] as const;

export const eventStatuses = [
  "draft",
  "pending_approval",
  "published",
  "cancelled",
  "completed",
] as const;

export const rsvpStatuses = [
  "going",
  "maybe",
  "not_going",
  "waitlisted",
  "cancelled",
] as const;

export const logisticsTypes = [
  "venue",
  "equipment",
  "food",
  "transportation",
  "volunteers",
  "accessibility",
  "permissions",
  "budget_notes",
  "setup",
  "cleanup",
  "other",
] as const;

export const logisticsStatuses = [
  "not_started",
  "in_progress",
  "blocked",
  "complete",
] as const;

export const taskStatuses = [
  "open",
  "in_progress",
  "blocked",
  "completed",
  "cancelled",
] as const;

export const EVENT_BUILDER_STEPS = [
  { id: 1, key: "basics", label: "Basics" },
  { id: 2, key: "schedule", label: "Schedule" },
  { id: 3, key: "location", label: "Location" },
  { id: 4, key: "capacity", label: "Capacity" },
  { id: 5, key: "audience", label: "Audience" },
  { id: 6, key: "rsvp", label: "RSVP" },
  { id: 7, key: "logistics", label: "Logistics" },
  { id: 8, key: "tasks", label: "Tasks" },
  { id: 9, key: "permissions", label: "Permissions/Approval" },
  { id: 10, key: "publish", label: "Publish" },
] as const;

export const LOGISTICS_TYPE_LABELS: Record<(typeof logisticsTypes)[number], string> =
  {
    venue: "Venue",
    equipment: "Equipment",
    food: "Food",
    transportation: "Transportation",
    volunteers: "Volunteers",
    accessibility: "Accessibility",
    permissions: "Permissions",
    budget_notes: "Budget",
    setup: "Setup",
    cleanup: "Cleanup",
    other: "Other",
  };

export const EVENT_TYPE_LABELS: Record<(typeof eventTypes)[number], string> = {
  club_meeting: "Club meeting",
  workshop: "Workshop",
  speaker: "Speaker",
  competition: "Competition",
  hackathon: "Hackathon",
  community_service: "Community service",
  fundraiser: "Fundraiser",
  field_trip: "Field trip",
  social: "Social",
  showcase: "Showcase",
  tournament: "Tournament",
  conference: "Conference",
  other: "Other",
};

export const eventDraftSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid().optional(),
  builderStep: z.number().int().min(1).max(10).default(1),
  eventType: z.enum(eventTypes).default("club_meeting"),
  title: z.string().trim().max(200).default(""),
  description: z.string().default(""),
  startsAt: z.string().trim().min(1).optional().nullable(),
  endsAt: z.string().trim().min(1).optional().nullable(),
  timezone: z.string().trim().min(1).default("America/Los_Angeles"),
  format: z.enum(eventFormats).default("in_person"),
  locationName: z.string().trim().max(200).optional().nullable(),
  onlineUrl: z.string().trim().max(500).optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  waitlistEnabled: z.boolean().default(false),
  rsvpDeadline: z.string().trim().optional().nullable(),
  maybeRsvpEnabled: z.boolean().default(true),
  audienceNotes: z.string().default(""),
  permissionsNotes: z.string().default(""),
  visibility: z.enum(["public", "school", "club", "private"]).default("club"),
  approvalRequired: z.boolean().default(false),
});

export const publishEventSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export const upsertRsvpSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(["going", "maybe", "not_going", "cancelled"]),
});

export const overrideRsvpSchema = z.object({
  clubId: z.string().uuid(),
  rsvpId: z.string().uuid(),
  status: z.enum(rsvpStatuses),
  overrideNote: z.string().trim().min(3).max(500),
});

export const logisticsItemSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid(),
  itemId: z.string().uuid().optional(),
  logisticsType: z.enum(logisticsTypes),
  title: z.string().trim().min(1).max(160),
  notes: z.string().trim().max(4000).default(""),
  ownerId: z.string().uuid().optional().nullable(),
  status: z.enum(logisticsStatuses).default("not_started"),
  dueAt: z.string().trim().optional().nullable(),
});

export const deleteLogisticsSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid(),
  itemId: z.string().uuid(),
});

export const eventTaskSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid(),
  taskId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(4000).optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  status: z.enum(taskStatuses).default("open"),
  dueAt: z.string().trim().optional().nullable(),
});

export const deleteTaskSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid(),
  taskId: z.string().uuid(),
});

export const completeEventSchema = z.object({
  clubId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export type EventDraftInput = z.infer<typeof eventDraftSchema>;
