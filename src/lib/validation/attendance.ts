import { z } from "zod";

export const attendanceStatuses = [
  "present",
  "late",
  "excused",
  "absent",
] as const;

export type AttendanceStatus = (typeof attendanceStatuses)[number];

export const createAttendanceSessionSchema = z.object({
  clubId: z.string().uuid(),
  title: z.string().trim().min(1).max(160).default("Meeting"),
  startsAt: z.string().trim().min(1),
  endsAt: z.string().trim().min(1).optional().nullable(),
  locationName: z.string().trim().max(200).optional().nullable(),
  eventId: z.string().uuid().optional().nullable(),
  membershipIds: z.array(z.string().uuid()).min(1).max(500),
  defaultStatus: z.enum(attendanceStatuses).default("absent"),
  checkInEnabled: z.boolean().default(false),
});

export const saveAttendanceRecordsSchema = z.object({
  clubId: z.string().uuid(),
  sessionId: z.string().uuid(),
  records: z
    .array(
      z.object({
        membershipId: z.string().uuid(),
        status: z.enum(attendanceStatuses),
        note: z.string().trim().max(500).optional().nullable(),
      }),
    )
    .min(1)
    .max(500),
});

export const correctAttendanceRecordSchema = z.object({
  clubId: z.string().uuid(),
  recordId: z.string().uuid(),
  status: z.enum(attendanceStatuses),
  correctionNote: z.string().trim().min(3).max(500),
});

export const issueCheckInTokenSchema = z.object({
  clubId: z.string().uuid(),
  sessionId: z.string().uuid(),
  ttlSeconds: z.number().int().min(30).max(600).default(120),
});

export const redeemCheckInSchema = z.object({
  token: z.string().trim().min(32).max(200),
});

export type CreateAttendanceSessionInput = z.infer<
  typeof createAttendanceSessionSchema
>;
export type SaveAttendanceRecordsInput = z.infer<
  typeof saveAttendanceRecordsSchema
>;
