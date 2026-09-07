import { describe, expect, it } from "vitest";

import {
  attendanceRatePercent,
  campaignStatusBadge,
  chronologicalAttendanceTrend,
  selectRecentJoins,
} from "@/components/dashboard/club-command-extras";

describe("club command overview helpers", () => {
  it("selects recent active joins without inventing names or including exited members", () => {
    const joins = selectRecentJoins(
      [
        {
          id: "exited",
          status: "exited",
          joined_at: "2026-08-01T00:00:00.000Z",
          role: "member",
          profiles: { display_name: "Should Hide" },
        },
        {
          id: "older",
          status: "active",
          joined_at: "2026-04-01T00:00:00.000Z",
          role: "member",
          profiles: { display_name: "Older Member" },
        },
        {
          id: "newer",
          status: "active",
          joined_at: "2026-09-01T00:00:00.000Z",
          role: "officer",
          profiles: { display_name: "Newer Officer" },
        },
        {
          id: "pending",
          status: "invited",
          joined_at: null,
          role: "member",
          profiles: { display_name: "Invite Only" },
        },
        {
          id: "unnamed",
          status: "active",
          joined_at: "2026-08-15T00:00:00.000Z",
          role: "member",
          profiles: null,
        },
      ],
      3,
    );

    expect(joins.map((row) => row.id)).toEqual(["newer", "unnamed", "older"]);
    expect(joins[0]?.displayName).toBe("Newer Officer");
    expect(joins[1]?.displayName).toBe("Member");
    expect(joins.every((row) => row.joinedAt)).toBe(true);
    expect(JSON.stringify(joins)).not.toMatch(/@|email/i);
  });

  it("computes honest attendance rates and keeps newest-first order reversible", () => {
    expect(attendanceRatePercent(3, 4)).toBe(75);
    expect(attendanceRatePercent(0, 0)).toBeNull();
    expect(attendanceRatePercent(2, 0)).toBeNull();

    const chronological = chronologicalAttendanceTrend([
      { id: "latest", present: 8, total: 10 },
      { id: "prior", present: 5, total: 10 },
    ]);
    expect(chronological.map((row) => row.id)).toEqual(["prior", "latest"]);
  });

  it("maps campaign status to existing badges without inventing delivery counts", () => {
    expect(campaignStatusBadge("sent")).toBe("approved");
    expect(campaignStatusBadge("draft")).toBe("draft");
    expect(campaignStatusBadge("scheduled")).toBe("pending");
    expect(campaignStatusBadge("sending")).toBe("pending");
    expect(campaignStatusBadge("failed")).toBe("rejected");
    expect(campaignStatusBadge("cancelled")).toBe("archived");
  });
});
