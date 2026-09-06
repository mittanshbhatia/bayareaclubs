export type AttendanceStatus = "present" | "late" | "excused" | "absent";

export type AttendanceMetrics = {
  meetingsHeld: number;
  attendanceRate: number | null;
  uniqueParticipants: number;
  trend: Array<{
    sessionId: string;
    label: string;
    presentRate: number | null;
    recorded: number;
    presentLike: number;
  }>;
  participation: Array<{
    membershipId: string;
    displayName: string;
    sessionsAttended: number;
    sessionsRecorded: number;
    rate: number | null;
  }>;
};

const PRESENT_LIKE: AttendanceStatus[] = ["present", "late"];

export function computeAttendanceMetrics(input: {
  sessions: Array<{
    id: string;
    title: string;
    startsAt: string;
    records: Array<{
      membershipId: string;
      status: AttendanceStatus;
      displayName: string;
    }>;
  }>;
}): AttendanceMetrics {
  const meetingsHeld = input.sessions.length;
  let recorded = 0;
  let presentLike = 0;
  const unique = new Set<string>();
  const byMember = new Map<
    string,
    { displayName: string; attended: number; recorded: number }
  >();

  const trend = input.sessions
    .slice()
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )
    .map((session) => {
      const sessionRecorded = session.records.length;
      const sessionPresent = session.records.filter((record) =>
        PRESENT_LIKE.includes(record.status),
      ).length;
      recorded += sessionRecorded;
      presentLike += sessionPresent;
      for (const record of session.records) {
        if (PRESENT_LIKE.includes(record.status)) {
          unique.add(record.membershipId);
        }
        const current = byMember.get(record.membershipId) ?? {
          displayName: record.displayName,
          attended: 0,
          recorded: 0,
        };
        current.recorded += 1;
        if (PRESENT_LIKE.includes(record.status)) current.attended += 1;
        byMember.set(record.membershipId, current);
      }
      return {
        sessionId: session.id,
        label: session.title || new Date(session.startsAt).toLocaleDateString(),
        presentRate:
          sessionRecorded === 0
            ? null
            : Math.round((sessionPresent / sessionRecorded) * 100),
        recorded: sessionRecorded,
        presentLike: sessionPresent,
      };
    });

  const participation = [...byMember.entries()]
    .map(([membershipId, value]) => ({
      membershipId,
      displayName: value.displayName,
      sessionsAttended: value.attended,
      sessionsRecorded: value.recorded,
      rate:
        value.recorded === 0
          ? null
          : Math.round((value.attended / value.recorded) * 100),
    }))
    .sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1));

  return {
    meetingsHeld,
    attendanceRate:
      recorded === 0 ? null : Math.round((presentLike / recorded) * 100),
    uniqueParticipants: unique.size,
    trend,
    participation,
  };
}
