"use server";

import { revalidatePath } from "next/cache";

import {
  AuthorizationError,
  requireActiveUser,
  requireClubManager,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  correctAttendanceRecordSchema,
  createAttendanceSessionSchema,
  issueCheckInTokenSchema,
  redeemCheckInSchema,
  saveAttendanceRecordsSchema,
  type CreateAttendanceSessionInput,
  type SaveAttendanceRecordsInput,
} from "@/lib/validation/attendance";
import type { ActionResult } from "@/types/action-result";

function validationFailure(
  fieldErrors: Record<string, string[] | undefined>,
): ActionResult<never> {
  return {
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Check the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    },
  };
}

function failure(code: string, message: string): ActionResult<never> {
  return { ok: false, error: { code, message } };
}

async function revalidateAttendance(clubId: string, sessionId?: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();
  if (data?.slug) {
    revalidatePath(`/clubs/${data.slug}/attendance`);
    if (sessionId) {
      revalidatePath(`/clubs/${data.slug}/attendance/${sessionId}`);
    }
    revalidatePath(`/clubs/${data.slug}`);
    revalidatePath(`/dashboard/clubs/${clubId}/attendance`);
  }
}

function toIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid datetime");
  }
  return date.toISOString();
}

export async function createAttendanceSessionAction(
  input: CreateAttendanceSessionInput,
): Promise<ActionResult<{ sessionId: string }>> {
  const parsed = createAttendanceSessionSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  let startsAt: string;
  let endsAt: string | null = null;
  try {
    startsAt = toIso(
      parsed.data.startsAt.includes("T")
        ? parsed.data.startsAt
        : `${parsed.data.startsAt}:00`,
    );
    endsAt = parsed.data.endsAt
      ? toIso(
          parsed.data.endsAt.includes("T")
            ? parsed.data.endsAt
            : `${parsed.data.endsAt}:00`,
        )
      : null;
  } catch {
    return failure("VALIDATION_ERROR", "Provide a valid start time.");
  }

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data: members, error: membersError } = await supabase
      .from("club_memberships")
      .select("id")
      .eq("club_id", parsed.data.clubId)
      .eq("status", "active")
      .in("id", parsed.data.membershipIds);
    if (membersError) return failure("MEMBERS_FAILED", membersError.message);
    if ((members ?? []).length !== parsed.data.membershipIds.length) {
      return failure(
        "INVALID_MEMBERS",
        "Only active members of this club can be included.",
      );
    }

    const { data: session, error } = await supabase
      .from("attendance_sessions")
      .insert({
        club_id: parsed.data.clubId,
        title: parsed.data.title,
        starts_at: startsAt,
        ends_at: endsAt,
        location_name: parsed.data.locationName ?? null,
        event_id: parsed.data.eventId ?? null,
        check_in_enabled: parsed.data.checkInEnabled,
        created_by: actor.id,
      })
      .select("id")
      .single();
    if (error || !session) {
      logger.error("attendance.session.create_failed", { message: error?.message });
      return failure("CREATE_FAILED", error?.message ?? "Could not create session.");
    }

    const { error: recordsError } = await supabase.from("attendance_records").insert(
      parsed.data.membershipIds.map((membershipId) => ({
        session_id: session.id,
        membership_id: membershipId,
        status: parsed.data.defaultStatus,
        recorded_by: actor.id,
      })),
    );
    if (recordsError) {
      await supabase.from("attendance_sessions").delete().eq("id", session.id);
      return failure("RECORDS_FAILED", recordsError.message);
    }

    await revalidateAttendance(parsed.data.clubId);
    return { ok: true, data: { sessionId: session.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function saveAttendanceRecordsAction(
  input: SaveAttendanceRecordsInput,
): Promise<ActionResult<{ saved: number }>> {
  const parsed = saveAttendanceRecordsSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data: session } = await supabase
      .from("attendance_sessions")
      .select("id, club_id")
      .eq("id", parsed.data.sessionId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!session) return failure("NOT_FOUND", "Attendance session not found.");

    const rows = parsed.data.records.map((record) => ({
      session_id: parsed.data.sessionId,
      membership_id: record.membershipId,
      status: record.status,
      note: record.note ?? null,
      recorded_by: actor.id,
      recorded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("attendance_records").upsert(rows, {
      onConflict: "session_id,membership_id",
    });
    if (error) {
      logger.error("attendance.records.save_failed", { message: error.message });
      return failure("SAVE_FAILED", error.message);
    }

    await revalidateAttendance(parsed.data.clubId, parsed.data.sessionId);
    return { ok: true, data: { saved: rows.length } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function correctAttendanceRecordAction(input: unknown) {
  const parsed = correctAttendanceRecordSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: record } = await supabase
      .from("attendance_records")
      .select("id, session_id, attendance_sessions!inner(club_id)")
      .eq("id", parsed.data.recordId)
      .maybeSingle();
    const session = record?.attendance_sessions as { club_id: string } | null;
    if (!record || session?.club_id !== parsed.data.clubId) {
      return failure("NOT_FOUND", "Attendance record not found.");
    }

    const { error } = await supabase
      .from("attendance_records")
      .update({
        status: parsed.data.status,
        correction_note: parsed.data.correctionNote,
      })
      .eq("id", parsed.data.recordId);
    if (error) return failure("CORRECT_FAILED", error.message);

    await revalidateAttendance(parsed.data.clubId);
    return { ok: true as const, data: { corrected: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function issueCheckInTokenAction(input: unknown) {
  const parsed = issueCheckInTokenSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: session } = await supabase
      .from("attendance_sessions")
      .select("id, club_id, check_in_enabled")
      .eq("id", parsed.data.sessionId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!session) return failure("NOT_FOUND", "Session not found.");
    if (!session.check_in_enabled) {
      return failure("DISABLED", "Enable check-in on the session first.");
    }

    const { data: token, error } = await supabase.rpc(
      "issue_attendance_check_in_token",
      {
        target_session_id: parsed.data.sessionId,
        ttl_seconds: parsed.data.ttlSeconds,
      },
    );
    if (error || !token) {
      return failure("TOKEN_FAILED", error?.message ?? "Could not issue token.");
    }
    return {
      ok: true as const,
      data: {
        token,
        expiresInSeconds: parsed.data.ttlSeconds,
      },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function redeemCheckInAction(input: unknown) {
  const parsed = redeemCheckInSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data: recordId, error } = await supabase.rpc(
      "redeem_attendance_check_in",
      { raw_token: parsed.data.token },
    );
    if (error || !recordId) {
      return failure("REDEEM_FAILED", error?.message ?? "Check-in failed.");
    }
    return { ok: true as const, data: { recordId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}
