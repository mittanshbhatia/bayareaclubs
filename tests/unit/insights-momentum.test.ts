import { describe, expect, it } from "vitest";

import { computeClubMomentum, percentPointDelta } from "@/features/insights/momentum";

describe("club momentum", () => {
  it("publishes component scores and avoids opaque AI scoring", () => {
    const momentum = computeClubMomentum({
      activitiesLast30: 2,
      meetingsLast30: 2,
      daysSinceLastMeeting: 7,
      attendanceRateLast30: 80,
      activeMembers: 4,
      newMembersLast30: 1,
      eventsLast30: 1,
      hasOfficer: true,
      hasAdvisor: true,
      charterApproved: true,
      daysToCharterExpiry: 120,
      renewalOpen: false,
      renewalApprovedThisYear: true,
    });

    expect(momentum.combinedScore).toBeGreaterThanOrEqual(70);
    expect(momentum.status).toBe("healthy");
    expect(momentum.formulaSummary).toContain("weighted average");
    expect(momentum.components).toHaveLength(7);
  });

  it("flags renewal risk with an explainable reason", () => {
    const momentum = computeClubMomentum({
      activitiesLast30: 0,
      meetingsLast30: 0,
      daysSinceLastMeeting: 42,
      attendanceRateLast30: null,
      activeMembers: 3,
      newMembersLast30: 0,
      eventsLast30: 0,
      hasOfficer: false,
      hasAdvisor: false,
      charterApproved: true,
      daysToCharterExpiry: 18,
      renewalOpen: false,
      renewalApprovedThisYear: false,
    });

    expect(momentum.status).toBe("renewal_risk");
    expect(momentum.reasons.some((reason) => reason.includes("expires in 18"))).toBe(
      true,
    );
    expect(
      momentum.reasons.some((reason) => reason.includes("No recorded meeting in 42")),
    ).toBe(true);
    expect(
      momentum.reasons.some((reason) => reason.includes("Officer roster is incomplete")),
    ).toBe(true);
    expect(
      momentum.components.find((item) => item.key === "attendance_participation")
        ?.score,
    ).toBe(50);
  });

  it("computes percentage-point deltas deterministically", () => {
    expect(percentPointDelta(58, 50)).toBe(8);
    expect(percentPointDelta(null, 50)).toBeNull();
  });
});
