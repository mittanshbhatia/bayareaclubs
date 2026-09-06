"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  buildRenewalDerivedSnapshot,
  formatActivitySummary,
  listCharterSectionDefinitions,
} from "@/features/charters/queries";
import {
  AuthorizationError,
  requireActiveUser,
  requireClubManager,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  decideCharterSchema,
  decideRenewalSchema,
  saveCharterDraftSchema,
  saveRenewalDraftSchema,
  sectionsToColumns,
  submitCharterSchema,
  submitRenewalSchema,
  type SaveCharterDraftInput,
  type SaveRenewalDraftInput,
} from "@/lib/validation/charters";
import type { ActionResult } from "@/types/action-result";
import type { Database, Json } from "@/types/database.generated";

type CharterInsert = Database["public"]["Tables"]["club_charters"]["Insert"];
type CharterUpdate = Database["public"]["Tables"]["club_charters"]["Update"];

const zRefresh = z.object({
  clubId: z.string().uuid(),
  renewalId: z.string().uuid(),
});

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

async function revalidateClubCharter(clubId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();
  if (data?.slug) {
    revalidatePath(`/clubs/${data.slug}/charter`);
    revalidatePath(`/clubs/${data.slug}/charter/renewal`);
    revalidatePath(`/clubs/${data.slug}`);
  }
  revalidatePath("/admin/charters");
  revalidatePath("/admin/renewals");
}

async function requireCanReviewClub(clubId: string) {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data: club } = await supabase
    .from("clubs")
    .select("school_id")
    .eq("id", clubId)
    .maybeSingle();
  if (!club) throw new AuthorizationError("FORBIDDEN", "Club not found.");
  const { data: canReview } = await supabase.rpc("can_review_school", {
    target_school_id: club.school_id,
  });
  if (!canReview) {
    throw new AuthorizationError(
      "FORBIDDEN",
      "School review access is required.",
    );
  }
  return user;
}

export async function saveCharterDraftAction(
  input: SaveCharterDraftInput,
): Promise<ActionResult<{ charterId: string }>> {
  const parsed = saveCharterDraftSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const definitions = await listCharterSectionDefinitions();
    const columns = sectionsToColumns(definitions, parsed.data.sections);
    const supabase = await createClient();

    if (parsed.data.charterId) {
      const { data: existing } = await supabase
        .from("club_charters")
        .select("id, status, club_id")
        .eq("id", parsed.data.charterId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!existing) return failure("NOT_FOUND", "Charter draft not found.");
      if (!["draft", "changes_requested"].includes(existing.status)) {
        return failure("LOCKED", "This charter is locked for editing.");
      }

      const update: CharterUpdate = {
        draft_step: parsed.data.draftStep,
        purpose: columns.purpose ?? "",
        mission: columns.mission ?? "",
        membership_requirements: columns.membership_requirements ?? "",
        officer_structure: columns.officer_structure ?? "",
        officer_responsibilities: columns.officer_responsibilities ?? "",
        elections: columns.elections ?? "",
        meeting_cadence: columns.meeting_cadence ?? "",
        conduct_expectations: columns.conduct_expectations ?? "",
        advisor_information: columns.advisor_information ?? "",
        planned_activities: columns.planned_activities ?? "",
        financial_policy: columns.financial_policy ?? "",
        amendment_process: columns.amendment_process ?? "",
      };

      const { error } = await supabase
        .from("club_charters")
        .update(update)
        .eq("id", parsed.data.charterId);
      if (error) {
        logger.error("charter.draft.update_failed", { message: error.message });
        return failure("SAVE_FAILED", error.message);
      }
      await revalidateClubCharter(parsed.data.clubId);
      return { ok: true, data: { charterId: parsed.data.charterId } };
    }

    const insert: CharterInsert = {
      club_id: parsed.data.clubId,
      school_year: parsed.data.schoolYear,
      created_by: actor.id,
      draft_step: parsed.data.draftStep,
      purpose: columns.purpose ?? "",
      mission: columns.mission ?? "",
      membership_requirements: columns.membership_requirements ?? "",
      officer_structure: columns.officer_structure ?? "",
      officer_responsibilities: columns.officer_responsibilities ?? "",
      elections: columns.elections ?? "",
      meeting_cadence: columns.meeting_cadence ?? "",
      conduct_expectations: columns.conduct_expectations ?? "",
      advisor_information: columns.advisor_information ?? "",
      planned_activities: columns.planned_activities ?? "",
      financial_policy: columns.financial_policy ?? "",
      amendment_process: columns.amendment_process ?? "",
    };

    const { data, error } = await supabase
      .from("club_charters")
      .insert(insert)
      .select("id")
      .single();
    if (error || !data) {
      logger.error("charter.draft.create_failed", { message: error?.message });
      return failure("CREATE_FAILED", error?.message ?? "Could not create draft.");
    }

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { charterId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function submitCharterAction(
  input: unknown,
): Promise<ActionResult<{ charterId: string }>> {
  const parsed = submitCharterSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: charter } = await supabase
      .from("club_charters")
      .select("id, status")
      .eq("id", parsed.data.charterId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!charter) return failure("NOT_FOUND", "Charter not found.");
    if (!["draft", "changes_requested"].includes(charter.status)) {
      return failure("INVALID_STATUS", "Only drafts or change requests can be submitted.");
    }

    const { error } = await supabase
      .from("club_charters")
      .update({ status: "submitted" })
      .eq("id", parsed.data.charterId);
    if (error) return failure("SUBMIT_FAILED", error.message);

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { charterId: parsed.data.charterId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function decideCharterAction(
  input: unknown,
): Promise<ActionResult<{ decided: true }>> {
  const parsed = decideCharterSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const reviewer = await requireCanReviewClub(parsed.data.clubId);
    const supabase = await createClient();
    const { data: charter } = await supabase
      .from("club_charters")
      .select("id, status")
      .eq("id", parsed.data.charterId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!charter) return failure("NOT_FOUND", "Charter not found.");
    if (charter.status !== "submitted") {
      return failure("INVALID_STATUS", "Charter must be submitted for review.");
    }

    // Charter enum has no rejected status; policy maps reject → changes_requested.
    const decision =
      parsed.data.decision === "approved" ? "approved" : "changes_requested";

    const { error } = await supabase.from("club_charter_reviews").insert({
      charter_id: parsed.data.charterId,
      reviewer_id: reviewer.id,
      decision,
      applicant_feedback: parsed.data.applicantFeedback || null,
      internal_notes: parsed.data.internalNotes || null,
    });
    if (error) return failure("REVIEW_FAILED", error.message);

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { decided: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function saveRenewalDraftAction(
  input: SaveRenewalDraftInput,
): Promise<ActionResult<{ renewalId: string }>> {
  const parsed = saveRenewalDraftSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("slug")
      .eq("id", parsed.data.clubId)
      .maybeSingle();
    if (!club?.slug) return failure("NOT_FOUND", "Club not found.");

    const derived = await buildRenewalDerivedSnapshot(
      parsed.data.clubId,
      club.slug,
      parsed.data.schoolYear,
    );
    if (!derived.charter?.id) {
      return failure(
        "CHARTER_REQUIRED",
        "Create a charter for this school year before starting renewal.",
      );
    }

    const officersSnapshot = derived.leadership.map((officer) => ({
      membership_id: officer.membershipId,
      role: officer.role,
      display_name: officer.displayName,
    }));
    const membershipSummary = {
      memberCount: derived.memberCount,
      meetingsHeld: derived.meetingsHeld,
      attendanceRate: derived.attendance.rate,
      uniqueParticipants: derived.attendance.uniqueParticipants,
      eventCount: derived.events.length,
      activityCount: derived.activities.length,
      highlightCount: derived.highlights.length,
    };
    const activitySummary = formatActivitySummary(derived);

    if (parsed.data.renewalId) {
      const { data: existing } = await supabase
        .from("club_renewals")
        .select("id, status")
        .eq("id", parsed.data.renewalId)
        .eq("club_id", parsed.data.clubId)
        .maybeSingle();
      if (!existing) return failure("NOT_FOUND", "Renewal not found.");
      if (!["draft", "changes_requested"].includes(existing.status)) {
        return failure("LOCKED", "This renewal is locked for editing.");
      }

      const { error } = await supabase
        .from("club_renewals")
        .update({
          charter_id: derived.charter.id,
          next_year_plan: parsed.data.nextYearPlan,
          highlights_summary: parsed.data.highlightsSummary,
          current_officers_snapshot: officersSnapshot as Json,
          membership_summary: membershipSummary as Json,
          activity_summary: activitySummary,
          derived_snapshot: derived as unknown as Json,
          derived_at: new Date().toISOString(),
          advisor_confirmed_by: parsed.data.advisorConfirmed ? actor.id : null,
          advisor_confirmed_at: parsed.data.advisorConfirmed
            ? new Date().toISOString()
            : null,
        })
        .eq("id", parsed.data.renewalId);
      if (error) return failure("SAVE_FAILED", error.message);

      await revalidateClubCharter(parsed.data.clubId);
      return { ok: true, data: { renewalId: parsed.data.renewalId } };
    }

    const { data, error } = await supabase
      .from("club_renewals")
      .insert({
        club_id: parsed.data.clubId,
        school_year: parsed.data.schoolYear,
        charter_id: derived.charter.id,
        submitted_by: actor.id,
        next_year_plan: parsed.data.nextYearPlan,
        highlights_summary: parsed.data.highlightsSummary,
        current_officers_snapshot: officersSnapshot as Json,
        membership_summary: membershipSummary as Json,
        activity_summary: activitySummary,
        derived_snapshot: derived as unknown as Json,
        derived_at: new Date().toISOString(),
        advisor_confirmed_by: parsed.data.advisorConfirmed ? actor.id : null,
        advisor_confirmed_at: parsed.data.advisorConfirmed
          ? new Date().toISOString()
          : null,
      })
      .select("id")
      .single();
    if (error || !data) {
      return failure("CREATE_FAILED", error?.message ?? "Could not create renewal.");
    }

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { renewalId: data.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function refreshRenewalDerivedAction(
  input: unknown,
): Promise<ActionResult<{ refreshed: true }>> {
  const parsed = zRefresh.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: club } = await supabase
      .from("clubs")
      .select("slug")
      .eq("id", parsed.data.clubId)
      .maybeSingle();
    if (!club?.slug) return failure("NOT_FOUND", "Club not found.");

    const { data: renewal } = await supabase
      .from("club_renewals")
      .select("id, status, school_year, next_year_plan, highlights_summary, advisor_confirmed_at")
      .eq("id", parsed.data.renewalId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!renewal) return failure("NOT_FOUND", "Renewal not found.");
    if (!["draft", "changes_requested"].includes(renewal.status)) {
      return failure("LOCKED", "Cannot refresh a locked renewal.");
    }

    const derived = await buildRenewalDerivedSnapshot(
      parsed.data.clubId,
      club.slug,
      renewal.school_year,
    );
    if (!derived.charter?.id) {
      return failure("CHARTER_REQUIRED", "A charter is required for renewal.");
    }

    const { error } = await supabase
      .from("club_renewals")
      .update({
        charter_id: derived.charter.id,
        current_officers_snapshot: derived.leadership.map((officer) => ({
          membership_id: officer.membershipId,
          role: officer.role,
          display_name: officer.displayName,
        })) as Json,
        membership_summary: {
          memberCount: derived.memberCount,
          meetingsHeld: derived.meetingsHeld,
          attendanceRate: derived.attendance.rate,
          uniqueParticipants: derived.attendance.uniqueParticipants,
        } as Json,
        activity_summary: formatActivitySummary(derived),
        derived_snapshot: derived as unknown as Json,
        derived_at: new Date().toISOString(),
      })
      .eq("id", renewal.id);
    if (error) return failure("REFRESH_FAILED", error.message);

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { refreshed: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function submitRenewalAction(
  input: unknown,
): Promise<ActionResult<{ renewalId: string }>> {
  const parsed = submitRenewalSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireClubManager(parsed.data.clubId);
    const supabase = await createClient();
    const { data: renewal } = await supabase
      .from("club_renewals")
      .select("id, status")
      .eq("id", parsed.data.renewalId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!renewal) return failure("NOT_FOUND", "Renewal not found.");
    if (!["draft", "changes_requested"].includes(renewal.status)) {
      return failure("INVALID_STATUS", "Only drafts or change requests can be submitted.");
    }

    const { error } = await supabase
      .from("club_renewals")
      .update({ status: "submitted" })
      .eq("id", parsed.data.renewalId);
    if (error) return failure("SUBMIT_FAILED", error.message);

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { renewalId: parsed.data.renewalId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function decideRenewalAction(
  input: unknown,
): Promise<ActionResult<{ decided: true }>> {
  const parsed = decideRenewalSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const reviewer = await requireCanReviewClub(parsed.data.clubId);
    const supabase = await createClient();
    const { data: renewal } = await supabase
      .from("club_renewals")
      .select("id, status")
      .eq("id", parsed.data.renewalId)
      .eq("club_id", parsed.data.clubId)
      .maybeSingle();
    if (!renewal) return failure("NOT_FOUND", "Renewal not found.");
    if (!["submitted", "under_review"].includes(renewal.status)) {
      return failure("INVALID_STATUS", "Renewal must be submitted for review.");
    }

    if (renewal.status === "submitted") {
      await supabase
        .from("club_renewals")
        .update({ status: "under_review" })
        .eq("id", parsed.data.renewalId);
    }

    const { error } = await supabase.from("club_renewal_reviews").insert({
      renewal_id: parsed.data.renewalId,
      reviewer_id: reviewer.id,
      decision: parsed.data.decision,
      applicant_feedback: parsed.data.applicantFeedback || null,
      internal_notes: parsed.data.internalNotes || null,
    });
    if (error) return failure("REVIEW_FAILED", error.message);

    await revalidateClubCharter(parsed.data.clubId);
    return { ok: true, data: { decided: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}

export async function enqueueRenewalRemindersAction(): Promise<
  ActionResult<{ enqueued: number }>
> {
  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("enqueue_renewal_reminders");
    if (error) return failure("ENQUEUE_FAILED", error.message);
    return { ok: true, data: { enqueued: data ?? 0 } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    throw error;
  }
}
