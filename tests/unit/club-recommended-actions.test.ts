import { describe, expect, it } from "vitest";

import { buildRecommendedActions } from "@/features/clubs/recommended-actions";
import { currentSchoolYear } from "@/features/clubs/school-year";

describe("club recommended actions", () => {
  it("emits deterministic charter and advisor actions from real inputs", () => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 21);
    const actions = buildRecommendedActions({
      slug: "robotics",
      charterExpiresAt: expires.toISOString(),
      charterStatus: "approved",
      renewalStatus: null,
      hasAdvisor: false,
      membersWithoutAttendance: 3,
      nextEventTitle: "Build Night",
      nextEventRsvps: 17,
      activeMemberCount: 12,
      recentActivityCount: 2,
    });

    expect(actions.map((action) => action.id)).toEqual(
      expect.arrayContaining([
        "charter-renewal-window",
        "add-advisor",
        "new-members-no-attendance",
        "next-event-rsvps",
      ]),
    );
    expect(
      actions.find((action) => action.id === "charter-renewal-window")?.title,
    ).toMatch(/due in 21 days/);
    expect(
      actions.find((action) => action.id === "new-members-no-attendance")?.title,
    ).toBe("3 members have not attended a meeting yet.");
    expect(
      actions.find((action) => action.id === "next-event-rsvps")?.title,
    ).toBe("Your next event has 17 RSVPs.");
  });

  it("does not invent advice when data is healthy", () => {
    const actions = buildRecommendedActions({
      slug: "robotics",
      charterExpiresAt: null,
      charterStatus: "approved",
      renewalStatus: "approved",
      hasAdvisor: true,
      membersWithoutAttendance: 0,
      nextEventTitle: null,
      nextEventRsvps: null,
      activeMemberCount: 10,
      recentActivityCount: 4,
    });
    expect(actions).toEqual([]);
  });
});

describe("currentSchoolYear", () => {
  it("returns YYYY-YYYY spanning July boundary", () => {
    expect(currentSchoolYear(new Date("2026-09-05T12:00:00Z"))).toBe(
      "2026-2027",
    );
    expect(currentSchoolYear(new Date("2026-01-15T12:00:00Z"))).toBe(
      "2025-2026",
    );
  });
});
