import { describe, expect, it } from "vitest";

import { computeAttendanceMetrics } from "@/features/attendance/metrics";
import {
  correctAttendanceRecordSchema,
  createAttendanceSessionSchema,
  redeemCheckInSchema,
  saveAttendanceRecordsSchema,
} from "@/lib/validation/attendance";

const clubId = "11111111-1111-4111-8111-111111111111";
const sessionId = "22222222-2222-4222-8222-222222222222";
const membershipId = "33333333-3333-4333-8333-333333333333";
const recordId = "44444444-4444-4444-8444-444444444444";

describe("attendance validation", () => {
  it("requires eligible members when creating a session", () => {
    const ok = createAttendanceSessionSchema.safeParse({
      clubId,
      title: "Weekly meeting",
      startsAt: "2026-09-05T16:00",
      membershipIds: [membershipId],
      defaultStatus: "absent",
      checkInEnabled: false,
    });
    expect(ok.success).toBe(true);

    const empty = createAttendanceSessionSchema.safeParse({
      clubId,
      title: "Weekly meeting",
      startsAt: "2026-09-05T16:00",
      membershipIds: [],
    });
    expect(empty.success).toBe(false);
  });

  it("defaults check-in to disabled", () => {
    const parsed = createAttendanceSessionSchema.parse({
      clubId,
      title: "Meeting",
      startsAt: "2026-09-05T16:00",
      membershipIds: [membershipId],
    });
    expect(parsed.checkInEnabled).toBe(false);
  });

  it("requires a correction note for officer corrections", () => {
    const ok = correctAttendanceRecordSchema.safeParse({
      clubId,
      recordId,
      status: "excused",
      correctionNote: "Doctor appointment",
    });
    expect(ok.success).toBe(true);

    const short = correctAttendanceRecordSchema.safeParse({
      clubId,
      recordId,
      status: "excused",
      correctionNote: "no",
    });
    expect(short.success).toBe(false);
  });

  it("rejects short check-in tokens", () => {
    expect(redeemCheckInSchema.safeParse({ token: "too-short" }).success).toBe(
      false,
    );
    expect(
      redeemCheckInSchema.safeParse({
        token: "a".repeat(64),
      }).success,
    ).toBe(true);
  });

  it("requires at least one record on save", () => {
    const empty = saveAttendanceRecordsSchema.safeParse({
      clubId,
      sessionId,
      records: [],
    });
    expect(empty.success).toBe(false);
  });
});

describe("attendance metrics", () => {
  it("computes rate, unique participants, trend, and distribution", () => {
    const metrics = computeAttendanceMetrics({
      sessions: [
        {
          id: "s1",
          title: "Week 1",
          startsAt: "2026-09-01T16:00:00.000Z",
          records: [
            { membershipId: "m1", status: "present", displayName: "Ada" },
            { membershipId: "m2", status: "absent", displayName: "Ben" },
          ],
        },
        {
          id: "s2",
          title: "Week 2",
          startsAt: "2026-09-08T16:00:00.000Z",
          records: [
            { membershipId: "m1", status: "late", displayName: "Ada" },
            { membershipId: "m2", status: "present", displayName: "Ben" },
            { membershipId: "m3", status: "excused", displayName: "Cara" },
          ],
        },
      ],
    });

    expect(metrics.meetingsHeld).toBe(2);
    expect(metrics.attendanceRate).toBe(60);
    expect(metrics.uniqueParticipants).toBe(2);
    expect(metrics.trend).toHaveLength(2);
    expect(metrics.trend[0]?.presentRate).toBe(50);
    expect(metrics.participation[0]?.displayName).toBe("Ada");
    expect(metrics.participation[0]?.rate).toBe(100);
  });
});
