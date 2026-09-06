"use server";

import { revalidatePath } from "next/cache";

import {
  AuthorizationError,
  requireClubManager,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  appointOfficerSchema,
  bulkMembershipStatusSchema,
  changeMemberRoleSchema,
  createActivitySchema,
  endOfficerTermSchema,
  inviteMemberSchema,
  updateClubSettingsSchema,
  updateMembershipStatusSchema,
  type CreateActivityInput,
  type InviteMemberInput,
  type UpdateClubSettingsInput,
} from "@/lib/validation/clubs";
import type { ActionResult } from "@/types/action-result";
import { currentSchoolYear } from "@/features/clubs/school-year";

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

async function revalidateClub(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();
  if (data?.slug) {
    revalidatePath(`/clubs/${data.slug}`);
    revalidatePath(`/clubs/${data.slug}`, "layout");
  }
  revalidatePath("/dashboard");
}

export async function inviteMemberAction(
  input: InviteMemberInput,
): Promise<ActionResult<{ membershipId: string }>> {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("club_memberships")
      .insert({
        club_id: parsed.data.clubId,
        user_id: parsed.data.userId,
        role: parsed.data.role,
        status: "invited",
        school_year: parsed.data.schoolYear,
        invited_by: actor.id,
        invited_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error || !data) {
      logger.error("club.invite.failed", { message: error?.message });
      return failure("INVITE_FAILED", error?.message ?? "Could not invite member.");
    }
    await revalidateClub(parsed.data.clubId);
    return { ok: true, data: { membershipId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function updateMembershipStatusAction(input: unknown) {
  const parsed = updateMembershipStatusSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const patch: {
      status: typeof parsed.data.status;
      updated_at: string;
      joined_at?: string | null;
      exited_at?: string | null;
    } = {
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    };
    if (parsed.data.status === "active") {
      patch.joined_at = new Date().toISOString();
      patch.exited_at = null;
    }
    if (parsed.data.status === "exited") {
      patch.exited_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("club_memberships")
      .update(patch)
      .eq("id", parsed.data.membershipId)
      .eq("club_id", parsed.data.clubId);
    if (error) return failure("UPDATE_FAILED", error.message);
    await revalidateClub(parsed.data.clubId);
    return { ok: true as const, data: { status: parsed.data.status } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function bulkUpdateMembershipStatusAction(input: unknown) {
  const parsed = bulkMembershipStatusSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const patch: {
      status: typeof parsed.data.status;
      updated_at: string;
      joined_at?: string | null;
      exited_at?: string | null;
    } = {
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    };
    if (parsed.data.status === "active") {
      patch.joined_at = new Date().toISOString();
      patch.exited_at = null;
    }
    if (parsed.data.status === "exited") {
      patch.exited_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("club_memberships")
      .update(patch)
      .eq("club_id", parsed.data.clubId)
      .in("id", parsed.data.membershipIds)
      .in(
        "status",
        parsed.data.status === "active" ? ["invited"] : ["active", "invited"],
      );
    if (error) return failure("BULK_UPDATE_FAILED", error.message);
    await revalidateClub(parsed.data.clubId);
    return { ok: true as const, data: { updated: parsed.data.membershipIds.length } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function changeMemberRoleAction(input: unknown) {
  const parsed = changeMemberRoleSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: membership, error: membershipError } = await supabase
      .from("club_memberships")
      .select("id, role, status")
      .eq("id", parsed.data.membershipId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (membershipError || !membership) {
      return failure("NOT_FOUND", "Membership not found.");
    }
    if (membership.status !== "active") {
      return failure("INVALID_STATE", "Only active members can change roles.");
    }

    const { error } = await supabase
      .from("club_memberships")
      .update({
        role: parsed.data.role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", membership.id);
    if (error) return failure("ROLE_UPDATE_FAILED", error.message);

    if (parsed.data.role !== "member" && membership.role === "member") {
      await supabase.from("club_officer_terms").insert({
        club_id: parsed.data.clubId,
        membership_id: membership.id,
        role: parsed.data.role,
        school_year: parsed.data.schoolYear,
        starts_on: parsed.data.startsOn ?? new Date().toISOString().slice(0, 10),
        appointed_by: actor.id,
      });
    }

    if (parsed.data.role === "member" && membership.role !== "member") {
      await supabase
        .from("club_officer_terms")
        .update({
          ends_on: new Date().toISOString().slice(0, 10),
          ended_reason: "Role changed to member",
        })
        .eq("membership_id", membership.id)
        .eq("club_id", parsed.data.clubId)
        .is("ends_on", null);
    }

    await revalidateClub(parsed.data.clubId);
    return { ok: true as const, data: { role: parsed.data.role } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function appointOfficerAction(input: unknown) {
  const parsed = appointOfficerSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();

    const { data: membership, error: membershipError } = await supabase
      .from("club_memberships")
      .select("id, status")
      .eq("id", parsed.data.membershipId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (membershipError || !membership || membership.status !== "active") {
      return failure("NOT_FOUND", "Active membership required for appointment.");
    }

    await supabase
      .from("club_officer_terms")
      .update({
        ends_on: parsed.data.startsOn,
        ended_reason: "Superseded by new appointment",
      })
      .eq("membership_id", membership.id)
      .eq("club_id", parsed.data.clubId)
      .is("ends_on", null);

    const { data: term, error } = await supabase
      .from("club_officer_terms")
      .insert({
        club_id: parsed.data.clubId,
        membership_id: membership.id,
        role: parsed.data.role,
        school_year: parsed.data.schoolYear,
        starts_on: parsed.data.startsOn,
        ends_on: parsed.data.endsOn ?? null,
        appointed_by: actor.id,
      })
      .select("id")
      .single();
    if (error || !term) return failure("APPOINT_FAILED", error?.message ?? "Appointment failed.");

    await supabase
      .from("club_memberships")
      .update({ role: parsed.data.role, updated_at: new Date().toISOString() })
      .eq("id", membership.id);

    await revalidateClub(parsed.data.clubId);
    return { ok: true as const, data: { termId: term.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function endOfficerTermAction(input: unknown) {
  const parsed = endOfficerTermSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: term, error: termError } = await supabase
      .from("club_officer_terms")
      .select("id, membership_id")
      .eq("id", parsed.data.termId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (termError || !term) return failure("NOT_FOUND", "Officer term not found.");

    const { error } = await supabase
      .from("club_officer_terms")
      .update({
        ends_on: parsed.data.endsOn,
        ended_reason: parsed.data.endedReason,
      })
      .eq("id", term.id)
      .is("ends_on", null);
    if (error) return failure("END_TERM_FAILED", error.message);

    if (parsed.data.demoteToMember) {
      await supabase
        .from("club_memberships")
        .update({ role: "member", updated_at: new Date().toISOString() })
        .eq("id", term.membership_id)
        .eq("club_id", parsed.data.clubId);
    }

    await revalidateClub(parsed.data.clubId);
    return { ok: true as const, data: { ended: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function createActivityAction(
  input: CreateActivityInput,
): Promise<ActionResult<{ activityId: string }>> {
  const parsed = createActivitySchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: activity, error } = await supabase
      .from("club_activities")
      .insert({
        club_id: parsed.data.clubId,
        title: parsed.data.title,
        description: parsed.data.description,
        activity_date: parsed.data.activityDate,
        category: parsed.data.category,
        outcomes: parsed.data.outcomes ?? "",
        related_event_id: parsed.data.relatedEventId ?? null,
        created_by: actor.id,
      })
      .select("id")
      .single();
    if (error || !activity) {
      return failure("ACTIVITY_CREATE_FAILED", error?.message ?? "Could not create activity.");
    }

    if (parsed.data.participantMembershipIds.length) {
      await supabase.from("club_activity_participants").insert(
        parsed.data.participantMembershipIds.map((membershipId) => ({
          activity_id: activity.id,
          membership_id: membershipId,
        })),
      );
    }
    if (parsed.data.mediaAssetIds.length) {
      await supabase.from("club_activity_media").insert(
        parsed.data.mediaAssetIds.map((mediaAssetId) => ({
          activity_id: activity.id,
          media_asset_id: mediaAssetId,
        })),
      );
    }

    await revalidateClub(parsed.data.clubId);
    return { ok: true, data: { activityId: activity.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function updateClubSettingsAction(
  input: UpdateClubSettingsInput,
): Promise<ActionResult<{ clubId: string }>> {
  const parsed = updateClubSettingsSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("id, school_id, visibility")
      .eq("id", parsed.data.clubId)
      .single();
    if (!club) return failure("NOT_FOUND", "Club not found.");

    if (parsed.data.visibility === "public") {
      const { data: canManageSchool } = await supabase.rpc("can_manage_school", {
        target_school_id: club.school_id,
      });
      if (!canManageSchool) {
        return failure(
          "APPROVAL_REQUIRED",
          "Setting discoverability to public requires school administrator approval.",
        );
      }
    }

    const patch: {
      updated_at: string;
      name?: string;
      description?: string;
      mission?: string;
      category?: string;
      meeting_cadence?: string;
      public_summary?: string;
      visibility?: typeof parsed.data.visibility;
      logo_asset_id?: string | null;
    } = {
      updated_at: new Date().toISOString(),
    };
    if (parsed.data.name != null) patch.name = parsed.data.name;
    if (parsed.data.description != null) patch.description = parsed.data.description;
    if (parsed.data.mission != null) patch.mission = parsed.data.mission;
    if (parsed.data.category != null) patch.category = parsed.data.category;
    if (parsed.data.meetingCadence != null) {
      patch.meeting_cadence = parsed.data.meetingCadence;
    }
    if (parsed.data.publicSummary != null) {
      patch.public_summary = parsed.data.publicSummary;
    }
    if (parsed.data.visibility != null) patch.visibility = parsed.data.visibility;
    if (parsed.data.logoAssetId !== undefined) {
      patch.logo_asset_id = parsed.data.logoAssetId;
    }

    const { error } = await supabase
      .from("clubs")
      .update(patch)
      .eq("id", parsed.data.clubId);
    if (error) return failure("SETTINGS_UPDATE_FAILED", error.message);

    await revalidateClub(parsed.data.clubId);
    return { ok: true, data: { clubId: parsed.data.clubId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function getDefaultSchoolYearAction() {
  return currentSchoolYear();
}
