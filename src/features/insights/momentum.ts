/**
 * Club Momentum — operational insight framework.
 * Published formula (see docs/product/analytics-metrics.md).
 * Not an AI score. Not student academic performance.
 */

export type MomentumComponent = {
  key: string;
  label: string;
  weight: number;
  score: number;
  detail: string;
};

export type MomentumStatus = "healthy" | "needs_attention" | "renewal_risk";

export type ClubMomentum = {
  combinedScore: number;
  status: MomentumStatus;
  statusLabel: string;
  components: MomentumComponent[];
  reasons: string[];
  formulaSummary: string;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function weightedAverage(components: MomentumComponent[]) {
  const weightSum = components.reduce((sum, item) => sum + item.weight, 0);
  if (weightSum <= 0) return 0;
  const total = components.reduce(
    (sum, item) => sum + item.score * item.weight,
    0,
  );
  return Math.round(total / weightSum);
}

export function computeClubMomentum(input: {
  activitiesLast30: number;
  meetingsLast30: number;
  daysSinceLastMeeting: number | null;
  attendanceRateLast30: number | null;
  activeMembers: number;
  newMembersLast30: number;
  eventsLast30: number;
  hasOfficer: boolean;
  hasAdvisor: boolean;
  charterApproved: boolean;
  daysToCharterExpiry: number | null;
  renewalOpen: boolean;
  renewalApprovedThisYear: boolean;
}): ClubMomentum {
  const members = Math.max(input.activeMembers, 1);
  const growthRate = input.newMembersLast30 / members;

  const components: MomentumComponent[] = [
    {
      key: "recent_activity",
      label: "Recent Activity",
      weight: 15,
      score: clamp((input.activitiesLast30 / 2) * 100),
      detail: `${input.activitiesLast30} logged activities in the last 30 days (target 2).`,
    },
    {
      key: "meeting_consistency",
      label: "Meeting Consistency",
      weight: 20,
      score: clamp((input.meetingsLast30 / 2) * 100),
      detail: `${input.meetingsLast30} meetings in the last 30 days (target 2).`,
    },
    {
      key: "attendance_participation",
      label: "Attendance Participation",
      weight: 20,
      score:
        input.attendanceRateLast30 == null
          ? 50
          : clamp(input.attendanceRateLast30),
      detail:
        input.attendanceRateLast30 == null
          ? "No attendance sessions in the last 30 days — scored neutral (50), not as failure."
          : `Attendance rate ${Math.round(input.attendanceRateLast30)}% (present + late ÷ recorded).`,
    },
    {
      key: "member_growth",
      label: "Member Growth",
      weight: 10,
      score: clamp(growthRate * 400),
      detail: `${input.newMembersLast30} new members vs roster of ${input.activeMembers} (rate-based so small clubs are not penalized for size).`,
    },
    {
      key: "event_activity",
      label: "Event Activity",
      weight: 10,
      score: clamp(input.eventsLast30 * 100),
      detail: `${input.eventsLast30} non-meeting events in the last 30 days (target 1).`,
    },
    {
      key: "leadership_completeness",
      label: "Leadership Completeness",
      weight: 15,
      score: clamp((Number(input.hasOfficer) + Number(input.hasAdvisor)) * 50),
      detail: `Officers ${input.hasOfficer ? "present" : "missing"}; advisor ${input.hasAdvisor ? "present" : "missing"}.`,
    },
    {
      key: "charter_renewal_readiness",
      label: "Charter/Renewal Readiness",
      weight: 10,
      score: (() => {
        if (!input.charterApproved) return 25;
        if (
          input.daysToCharterExpiry != null &&
          input.daysToCharterExpiry <= 30 &&
          !input.renewalApprovedThisYear &&
          !input.renewalOpen
        ) {
          return 20;
        }
        if (input.renewalOpen) return 70;
        if (input.renewalApprovedThisYear) return 100;
        return 80;
      })(),
      detail: input.charterApproved
        ? "Charter approved; renewal readiness based on expiry window and renewal progress."
        : "Charter is not approved yet.",
    },
  ];

  const combinedScore = weightedAverage(components);
  const reasons: string[] = [];

  if (
    input.daysToCharterExpiry != null &&
    input.daysToCharterExpiry >= 0 &&
    input.daysToCharterExpiry <= 30
  ) {
    reasons.push(
      `Charter expires in ${input.daysToCharterExpiry} day${input.daysToCharterExpiry === 1 ? "" : "s"}.`,
    );
  }
  if (input.daysSinceLastMeeting != null && input.daysSinceLastMeeting >= 21) {
    reasons.push(
      `No recorded meeting in ${input.daysSinceLastMeeting} days.`,
    );
  }
  if (!input.hasOfficer || !input.hasAdvisor) {
    reasons.push("Officer roster is incomplete.");
  }
  if (!input.charterApproved) {
    reasons.push("Annual charter is not approved.");
  }
  if (input.attendanceRateLast30 != null && input.attendanceRateLast30 < 50) {
    reasons.push(
      `Attendance participation is ${Math.round(input.attendanceRateLast30)}% over the last 30 days.`,
    );
  }

  const renewalRisk =
    (input.daysToCharterExpiry != null &&
      input.daysToCharterExpiry <= 30 &&
      !input.renewalApprovedThisYear) ||
    (!input.charterApproved && input.daysToCharterExpiry != null);

  let status: MomentumStatus = "healthy";
  if (renewalRisk) status = "renewal_risk";
  else if (combinedScore < 40) status = "needs_attention";
  else if (combinedScore < 70 || reasons.length > 0) status = "needs_attention";
  else status = "healthy";

  if (status === "healthy" && reasons.length === 0) {
    reasons.push("Operational signals look steady for the last 30 days.");
  }

  return {
    combinedScore,
    status,
    statusLabel:
      status === "healthy"
        ? "Healthy"
        : status === "renewal_risk"
          ? "Renewal Risk"
          : "Needs Attention",
    components,
    reasons,
    formulaSummary:
      "Combined score = weighted average of component scores (Recent Activity 15%, Meeting Consistency 20%, Attendance Participation 20%, Member Growth 10%, Event Activity 10%, Leadership Completeness 15%, Charter/Renewal Readiness 10%). Operational insight only — not student performance.",
  };
}

export function percentPointDelta(
  current: number | null,
  previous: number | null,
) {
  if (current == null || previous == null) return null;
  return Math.round((current - previous) * 10) / 10;
}
