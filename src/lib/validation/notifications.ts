import { z } from "zod";

export const IN_APP_NOTIFICATION_CATEGORIES = [
  "club_ideas",
  "membership",
  "events",
  "governance",
  "communications",
  "resources",
] as const;

export type InAppNotificationCategory =
  (typeof IN_APP_NOTIFICATION_CATEGORIES)[number];

/** Categories users may disable. Critical workflow categories stay on. */
export const OPTIONAL_NOTIFICATION_CATEGORIES = [
  "events",
  "communications",
  "resources",
] as const satisfies readonly InAppNotificationCategory[];

export const NOTIFICATION_CATEGORY_LABELS: Record<
  InAppNotificationCategory,
  string
> = {
  club_ideas: "Club ideas & reviews",
  membership: "Invitations & officer roles",
  events: "Events",
  governance: "Charters & renewals",
  communications: "Newsletters",
  resources: "STEM course recommendations",
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  club_idea_submitted: "Club idea submitted",
  review_started: "Review started",
  changes_requested: "Changes requested",
  idea_approved: "Idea approved",
  club_invitation: "Club invitation",
  officer_assignment: "Officer assignment",
  upcoming_event: "Upcoming event",
  event_changed: "Event changed",
  charter_feedback: "Charter feedback",
  renewal_due: "Renewal due",
  newsletter_published: "Newsletter published",
  course_recommendation: "Course recommendation",
};

export const updateNotificationPreferenceSchema = z.object({
  category: z.enum(OPTIONAL_NOTIFICATION_CATEGORIES),
  inAppEnabled: z.boolean(),
});

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid(),
});
