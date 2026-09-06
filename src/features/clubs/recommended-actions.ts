import { daysUntil } from "@/features/clubs/school-year";

export type RecommendedAction = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  tone: "info" | "tip" | "warning";
};

export function buildRecommendedActions(input: {
  slug: string;
  charterExpiresAt: string | null;
  charterStatus: string | null;
  renewalStatus: string | null;
  hasAdvisor: boolean;
  membersWithoutAttendance: number;
  nextEventTitle: string | null;
  nextEventRsvps: number | null;
  activeMemberCount: number;
  recentActivityCount: number;
}): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const base = `/clubs/${input.slug}`;

  const days = daysUntil(input.charterExpiresAt);
  if (days != null && days >= 0 && days <= 45) {
    actions.push({
      id: "charter-renewal-window",
      title: `Annual charter renewal due in ${days} day${days === 1 ? "" : "s"}.`,
      detail: "Start or continue renewal before the approved charter expires.",
      href: `${base}/charter`,
      tone: days <= 21 ? "warning" : "info",
    });
  }

  if (!input.hasAdvisor) {
    actions.push({
      id: "add-advisor",
      title: "Add an advisor before submitting renewal.",
      detail: "Renewals require an advisor confirmation path.",
      href: `${base}/members`,
      tone: "warning",
    });
  }

  if (input.membersWithoutAttendance > 0) {
    actions.push({
      id: "new-members-no-attendance",
      title: `${input.membersWithoutAttendance} member${input.membersWithoutAttendance === 1 ? " has" : "s have"} not attended a meeting yet.`,
      detail: "Record attendance or schedule an orientation meeting.",
      href: `${base}/attendance`,
      tone: "tip",
    });
  }

  if (input.nextEventTitle && input.nextEventRsvps != null) {
    actions.push({
      id: "next-event-rsvps",
      title: `Your next event has ${input.nextEventRsvps} RSVP${input.nextEventRsvps === 1 ? "" : "s"}.`,
      detail: `"${input.nextEventTitle}" is upcoming—confirm logistics and capacity.`,
      href: `${base}/events`,
      tone: "info",
    });
  }

  if (!input.charterStatus || input.charterStatus === "draft") {
    actions.push({
      id: "charter-draft",
      title: "Complete and submit this year’s charter.",
      detail: "An approved charter is required for full club operations.",
      href: `${base}/charter`,
      tone: "warning",
    });
  }

  if (input.activeMemberCount < 3) {
    actions.push({
      id: "grow-membership",
      title: "Invite more members to reach a viable roster.",
      detail: `You currently have ${input.activeMemberCount} active member${input.activeMemberCount === 1 ? "" : "s"}.`,
      href: `${base}/members`,
      tone: "tip",
    });
  }

  if (input.recentActivityCount === 0) {
    actions.push({
      id: "log-activity",
      title: "Log a recent club activity.",
      detail: "Activities feed highlights, newsletters, and renewal summaries.",
      href: `${base}/activities`,
      tone: "tip",
    });
  }

  return actions;
}
