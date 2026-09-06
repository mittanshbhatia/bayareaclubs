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
  completeEventSchema,
  deleteLogisticsSchema,
  deleteTaskSchema,
  eventDraftSchema,
  eventTaskSchema,
  logisticsItemSchema,
  overrideRsvpSchema,
  publishEventSchema,
  upsertRsvpSchema,
  type EventDraftInput,
} from "@/lib/validation/events";
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

function toIso(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value.includes("T") ? value : `${value}:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

async function revalidateEvents(clubId: string, eventId?: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();
  if (data?.slug) {
    revalidatePath(`/clubs/${data.slug}/events`);
    revalidatePath(`/clubs/${data.slug}`);
    revalidatePath(`/clubs/${data.slug}/insights`);
    if (eventId) {
      revalidatePath(`/clubs/${data.slug}/events/${eventId}`);
    }
  }
}

async function loadClubSchoolId(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("school_id")
    .eq("id", clubId)
    .maybeSingle();
  return data?.school_id ?? null;
}

export async function saveEventDraftAction(
  input: EventDraftInput,
): Promise<ActionResult<{ eventId: string }>> {
  const parsed = eventDraftSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const schoolId = await loadClubSchoolId(parsed.data.clubId);
    if (!schoolId) return failure("NOT_FOUND", "Club not found.");

    const startsAt =
      toIso(parsed.data.startsAt) ??
      new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const endsAt =
      toIso(parsed.data.endsAt) ??
      new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString();

    const payload = {
      school_id: schoolId,
      club_id: parsed.data.clubId,
      event_type: parsed.data.eventType,
      title: parsed.data.title || "Untitled event",
      description: parsed.data.description || "",
      starts_at: startsAt,
      ends_at: endsAt,
      timezone: parsed.data.timezone,
      format: parsed.data.format,
      location_name: parsed.data.locationName || null,
      online_url: parsed.data.onlineUrl || null,
      capacity: parsed.data.capacity ?? null,
      waitlist_enabled: parsed.data.waitlistEnabled,
      rsvp_deadline: toIso(parsed.data.rsvpDeadline),
      maybe_rsvp_enabled: parsed.data.maybeRsvpEnabled,
      audience_notes: parsed.data.audienceNotes,
      permissions_notes: parsed.data.permissionsNotes,
      visibility: parsed.data.visibility,
      approval_required: parsed.data.approvalRequired,
      builder_step: parsed.data.builderStep,
      organizer_id: actor.id,
    };

    const supabase = await createClient();

    if (parsed.data.eventId) {
      const { data: existing } = await supabase
        .from("events")
        .select("id, status")
        .eq("id", parsed.data.eventId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!existing) return failure("NOT_FOUND", "Event not found.");
      if (["cancelled"].includes(existing.status)) {
        return failure("LOCKED", "Cancelled events cannot be edited.");
      }

      const { error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", parsed.data.eventId);
      if (error) {
        logger.error("events.draft.update_failed", { message: error.message });
        return failure("SAVE_FAILED", error.message);
      }
      await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
      return { ok: true, data: { eventId: parsed.data.eventId } };
    }

    const { data, error } = await supabase
      .from("events")
      .insert({ ...payload, status: "draft" })
      .select("id")
      .single();
    if (error || !data) {
      logger.error("events.draft.create_failed", { message: error?.message });
      return failure("CREATE_FAILED", error?.message ?? "Could not create event.");
    }

    await revalidateEvents(parsed.data.clubId, data.id);
    return { ok: true, data: { eventId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function publishEventAction(
  input: unknown,
): Promise<ActionResult<{ eventId: string; status: string }>> {
  const parsed = publishEventSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", parsed.data.eventId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!event) return failure("NOT_FOUND", "Event not found.");
    if (!["draft", "pending_approval"].includes(event.status)) {
      return failure("INVALID_STATUS", "Only drafts can be published from this action.");
    }

    if (!event.title.trim() || !event.description.trim()) {
      return failure("INCOMPLETE", "Add a title and description before publishing.");
    }
    if (event.format === "in_person" && !event.location_name?.trim()) {
      return failure("INCOMPLETE", "In-person events need a location.");
    }
    if (event.format === "online" && !event.online_url?.trim()) {
      return failure("INCOMPLETE", "Online events need a URL.");
    }
    if (
      event.format === "hybrid" &&
      (!event.location_name?.trim() || !event.online_url?.trim())
    ) {
      return failure("INCOMPLETE", "Hybrid events need a location and URL.");
    }

    const nextStatus = event.approval_required ? "pending_approval" : "published";
    const { error } = await supabase
      .from("events")
      .update({
        status: nextStatus,
        approved_by: nextStatus === "published" ? actor.id : null,
        approved_at: nextStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", event.id);
    if (error) return failure("PUBLISH_FAILED", error.message);

    await revalidateEvents(parsed.data.clubId, event.id);
    return { ok: true, data: { eventId: event.id, status: nextStatus } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function approveEventAction(
  input: unknown,
): Promise<ActionResult<{ approved: true }>> {
  const parsed = publishEventSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireActiveUser();
    const supabase = await createClient();
    const { data: event } = await supabase
      .from("events")
      .select("id, club_id, school_id, status")
      .eq("id", parsed.data.eventId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!event) return failure("NOT_FOUND", "Event not found.");

    const { data: canManage } = await supabase.rpc("can_manage_club", {
      target_club_id: event.club_id,
    });
    const { data: canReview } = await supabase.rpc("can_review_school", {
      target_school_id: event.school_id,
    });
    if (!canManage && !canReview) {
      return failure("FORBIDDEN", "Not authorized to approve this event.");
    }
    if (event.status !== "pending_approval") {
      return failure("INVALID_STATUS", "Event is not awaiting approval.");
    }

    const { error } = await supabase
      .from("events")
      .update({
        status: "published",
        approved_by: actor.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", event.id);
    if (error) return failure("APPROVE_FAILED", error.message);

    await revalidateEvents(parsed.data.clubId, event.id);
    return { ok: true, data: { approved: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function completeEventAction(
  input: unknown,
): Promise<ActionResult<{ completed: true }>> {
  const parsed = completeEventSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("events")
      .update({ status: "completed" })
      .eq("id", parsed.data.eventId)
      .eq("club_id", parsed.data.clubId)
      .in("status", ["published", "pending_approval"]);
    if (error) return failure("COMPLETE_FAILED", error.message);
    await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
    return { ok: true, data: { completed: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function upsertRsvpAction(
  input: unknown,
): Promise<ActionResult<{ rsvpId: string }>> {
  const parsed = upsertRsvpSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("upsert_event_rsvp", {
      target_event_id: parsed.data.eventId,
      desired_status: parsed.data.status,
    });
    if (error || !data) {
      return failure("RSVP_FAILED", error?.message ?? "Could not save RSVP.");
    }

    const { data: event } = await supabase
      .from("events")
      .select("club_id")
      .eq("id", parsed.data.eventId)
      .maybeSingle();
    if (event) await revalidateEvents(event.club_id, parsed.data.eventId);

    return { ok: true, data: { rsvpId: data } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function overrideRsvpAction(
  input: unknown,
): Promise<ActionResult<{ rsvpId: string }>> {
  const parsed = overrideRsvpSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("admin_override_event_rsvp", {
      target_rsvp_id: parsed.data.rsvpId,
      desired_status: parsed.data.status,
      override_note: parsed.data.overrideNote,
    });
    if (error || !data) {
      return failure("OVERRIDE_FAILED", error?.message ?? "Override failed.");
    }
    await revalidateEvents(parsed.data.clubId);
    return { ok: true, data: { rsvpId: data } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function saveLogisticsItemAction(
  input: unknown,
): Promise<ActionResult<{ itemId: string }>> {
  const parsed = logisticsItemSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const dueAt = toIso(parsed.data.dueAt);

    if (parsed.data.itemId) {
      const { error } = await supabase
        .from("event_logistics")
        .update({
          logistics_type: parsed.data.logisticsType,
          title: parsed.data.title,
          notes: parsed.data.notes,
          details: parsed.data.notes || parsed.data.title,
          owner_id: parsed.data.ownerId ?? null,
          status: parsed.data.status,
          due_at: dueAt,
        })
        .eq("id", parsed.data.itemId)
        .eq("event_id", parsed.data.eventId);
      if (error) return failure("SAVE_FAILED", error.message);
      await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
      return { ok: true, data: { itemId: parsed.data.itemId } };
    }

    const { data, error } = await supabase
      .from("event_logistics")
      .insert({
        event_id: parsed.data.eventId,
        logistics_type: parsed.data.logisticsType,
        title: parsed.data.title,
        notes: parsed.data.notes,
        details: parsed.data.notes || parsed.data.title,
        owner_id: parsed.data.ownerId ?? null,
        status: parsed.data.status,
        due_at: dueAt,
        created_by: actor.id,
      })
      .select("id")
      .single();
    if (error || !data) return failure("CREATE_FAILED", error?.message ?? "Failed");
    await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
    return { ok: true, data: { itemId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function deleteLogisticsItemAction(
  input: unknown,
): Promise<ActionResult<{ deleted: true }>> {
  const parsed = deleteLogisticsSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("event_logistics")
      .delete()
      .eq("id", parsed.data.itemId)
      .eq("event_id", parsed.data.eventId);
    if (error) return failure("DELETE_FAILED", error.message);
    await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
    return { ok: true, data: { deleted: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function saveEventTaskAction(
  input: unknown,
): Promise<ActionResult<{ taskId: string }>> {
  const parsed = eventTaskSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const dueAt = toIso(parsed.data.dueAt);
    const completedAt =
      parsed.data.status === "completed" ? new Date().toISOString() : null;

    if (parsed.data.taskId) {
      const { error } = await supabase
        .from("event_tasks")
        .update({
          title: parsed.data.title,
          description: parsed.data.description ?? null,
          assigned_to: parsed.data.assignedTo ?? null,
          status: parsed.data.status,
          due_at: dueAt,
          completed_at: completedAt,
        })
        .eq("id", parsed.data.taskId)
        .eq("event_id", parsed.data.eventId);
      if (error) return failure("SAVE_FAILED", error.message);
      await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
      return { ok: true, data: { taskId: parsed.data.taskId } };
    }

    const { data, error } = await supabase
      .from("event_tasks")
      .insert({
        event_id: parsed.data.eventId,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        assigned_to: parsed.data.assignedTo ?? null,
        status: parsed.data.status,
        due_at: dueAt,
        completed_at: completedAt,
        created_by: actor.id,
      })
      .select("id")
      .single();
    if (error || !data) return failure("CREATE_FAILED", error?.message ?? "Failed");
    await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
    return { ok: true, data: { taskId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function deleteEventTaskAction(
  input: unknown,
): Promise<ActionResult<{ deleted: true }>> {
  const parsed = deleteTaskSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("event_tasks")
      .delete()
      .eq("id", parsed.data.taskId)
      .eq("event_id", parsed.data.eventId);
    if (error) return failure("DELETE_FAILED", error.message);
    await revalidateEvents(parsed.data.clubId, parsed.data.eventId);
    return { ok: true, data: { deleted: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}
