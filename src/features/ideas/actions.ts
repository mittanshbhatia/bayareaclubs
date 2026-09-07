"use server";

import { revalidatePath } from "next/cache";

import {
  AuthorizationError,
  requireActiveUser,
  requireCommitteeReviewer,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  assignReviewerSchema,
  convertIdeaSchema,
  decideIdeaSchema,
  ideaDraftSchema,
  ideaSubmitSchema,
  startReviewSchema,
  type ConvertIdeaInput,
  type DecideIdeaInput,
  type IdeaDraftInput,
} from "@/lib/validation/ideas";
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

async function replaceOfficersAndLinks(
  ideaId: string,
  officers: IdeaDraftInput["officers"],
  links: IdeaDraftInput["links"],
) {
  const supabase = await createClient();
  await supabase
    .from("club_idea_proposed_officers")
    .delete()
    .eq("idea_id", ideaId);
  await supabase.from("club_idea_links").delete().eq("idea_id", ideaId);

  if (officers.length) {
    const { error } = await supabase.from("club_idea_proposed_officers").insert(
      officers.map((officer) => ({
        idea_id: ideaId,
        proposed_name: officer.proposedName,
        proposed_role: officer.proposedRole,
        proposed_user_id: officer.proposedUserId ?? null,
      })),
    );
    if (error) throw error;
  }

  if (links.length) {
    const { error } = await supabase.from("club_idea_links").insert(
      links.map((link) => ({
        idea_id: ideaId,
        title: link.title,
        url: link.url,
      })),
    );
    if (error) throw error;
  }
}

export async function saveIdeaDraftAction(
  input: IdeaDraftInput,
): Promise<ActionResult<{ ideaId: string }>> {
  const parsed = ideaDraftSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  try {
    const user = await requireActiveUser();
    const supabase = await createClient();
    const payload = parsed.data;

    if (!payload.schoolId) {
      return failure("SCHOOL_REQUIRED", "Select a school before saving.");
    }

    const { error: claimError } = await supabase.rpc(
      "claim_student_school_membership",
      { target_school_id: payload.schoolId },
    );
    if (claimError) {
      logger.error("idea.draft.school_claim_failed", {
        message: claimError.message,
      });
      return failure(
        "SCHOOL_JOIN_FAILED",
        "Could not attach your student membership at that school.",
      );
    }

    const values = {
      application_kind: payload.applicationKind,
      school_id: payload.schoolId,
      title: payload.title,
      category: payload.category,
      description: payload.description,
      mission: payload.mission,
      problem_opportunity: payload.problemOpportunity,
      expected_activities: payload.expectedActivities,
      expected_membership: payload.expectedMembership ?? null,
      proposed_meeting_cadence: payload.proposedMeetingCadence,
      proposed_advisor_id: payload.proposedAdvisorId ?? null,
      grade_min: payload.gradeMin ?? null,
      grade_max: payload.gradeMax ?? null,
      draft_step: payload.draftStep,
      updated_at: new Date().toISOString(),
    };

    let ideaId = payload.ideaId;
    if (ideaId) {
      const { data: existing, error: existingError } = await supabase
        .from("club_ideas")
        .select("id, submitter_id, status")
        .eq("id", ideaId)
        .maybeSingle();
      if (existingError || !existing) {
        return failure("NOT_FOUND", "Draft not found.");
      }
      if (existing.submitter_id !== user.id) {
        return failure("FORBIDDEN", "You cannot edit this idea.");
      }
      if (!["draft", "changes_requested"].includes(existing.status)) {
        return failure("LOCKED", "This application is locked.");
      }
      const { error } = await supabase
        .from("club_ideas")
        .update(values)
        .eq("id", ideaId);
      if (error) {
        logger.error("idea.draft.update_failed", { message: error.message });
        return failure("SAVE_FAILED", error.message);
      }
    } else {
      const { data: createdId, error: createError } = await supabase.rpc(
        "create_club_idea_draft",
        {
          target_school_id: payload.schoolId,
          target_application_kind: payload.applicationKind,
        },
      );
      if (createError || !createdId) {
        logger.error("idea.draft.create_failed", {
          message: createError?.message,
        });
        return failure(
          "SAVE_FAILED",
          createError?.message ?? "Could not create draft.",
        );
      }
      ideaId = createdId;
      const { error } = await supabase
        .from("club_ideas")
        .update(values)
        .eq("id", ideaId);
      if (error) {
        logger.error("idea.draft.update_failed", { message: error.message });
        return failure("SAVE_FAILED", error.message);
      }
    }

    await replaceOfficersAndLinks(ideaId, payload.officers, payload.links);
    revalidatePath("/start-a-club");
    revalidatePath(`/start-a-club/${ideaId}`);
    revalidatePath("/dashboard");
    return { ok: true, data: { ideaId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    throw error;
  }
}

export async function submitIdeaAction(
  input: IdeaDraftInput,
): Promise<ActionResult<{ ideaId: string }>> {
  const parsed = ideaSubmitSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  try {
    const user = await requireActiveUser();
    const save = await saveIdeaDraftAction({
      ...parsed.data,
      draftStep: 10,
    });
    if (!save.ok) return save;

    const supabase = await createClient();
    const { data: idea, error: ideaError } = await supabase
      .from("club_ideas")
      .select("id, status, submitter_id")
      .eq("id", save.data.ideaId)
      .single();
    if (ideaError || !idea || idea.submitter_id !== user.id) {
      return failure("NOT_FOUND", "Idea not found.");
    }

    const nextStatus =
      idea.status === "changes_requested" ? "resubmitted" : "submitted";
    if (!["draft", "changes_requested"].includes(idea.status)) {
      return failure(
        "INVALID_TRANSITION",
        "This idea cannot be submitted now.",
      );
    }

    const { error } = await supabase
      .from("club_ideas")
      .update({ status: nextStatus })
      .eq("id", idea.id);
    if (error) {
      return failure("SUBMIT_FAILED", error.message);
    }

    revalidatePath("/admin/ideas");
    revalidatePath(`/start-a-club/${idea.id}`);
    revalidatePath("/dashboard");
    return { ok: true, data: { ideaId: idea.id } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    throw error;
  }
}

export async function assignReviewerAction(input: unknown) {
  const parsed = assignReviewerSchema.safeParse(input);
  if (!parsed.success)
    return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const actor = await requireCommitteeReviewer();
    const supabase = await createClient();
    const { error } = await supabase.from("club_idea_reviews").insert({
      idea_id: parsed.data.ideaId,
      reviewer_id: parsed.data.reviewerId,
      assigned_by: actor.id,
    });
    if (error) return failure("ASSIGN_FAILED", error.message);
    revalidatePath("/admin/ideas");
    revalidatePath(`/admin/ideas/${parsed.data.ideaId}`);
    return { ok: true as const, data: { assigned: true } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    throw error;
  }
}

export async function startReviewAction(input: unknown) {
  const parsed = startReviewSchema.safeParse(input);
  if (!parsed.success)
    return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireCommitteeReviewer();
    const supabase = await createClient();
    const { data: idea, error: ideaError } = await supabase
      .from("club_ideas")
      .select("id, status")
      .eq("id", parsed.data.ideaId)
      .single();
    if (ideaError || !idea) return failure("NOT_FOUND", "Idea not found.");
    if (!["submitted", "resubmitted"].includes(idea.status)) {
      return failure(
        "INVALID_TRANSITION",
        "Only submitted or resubmitted ideas can enter review.",
      );
    }
    const { error } = await supabase
      .from("club_ideas")
      .update({ status: "under_review" })
      .eq("id", idea.id)
      .in("status", ["submitted", "resubmitted"]);
    if (error) return failure("START_FAILED", error.message);
    revalidatePath(`/admin/ideas/${idea.id}`);
    revalidatePath("/admin/ideas");
    return { ok: true as const, data: { status: "under_review" as const } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    throw error;
  }
}

export async function decideIdeaAction(
  input: DecideIdeaInput,
): Promise<ActionResult<{ status: string }>> {
  const parsed = decideIdeaSchema.safeParse(input);
  if (!parsed.success)
    return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const user = await requireCommitteeReviewer();
    const supabase = await createClient();
    const { data: review, error: reviewError } = await supabase
      .from("club_idea_reviews")
      .select("id, reviewer_id, reviewed_at, idea_id")
      .eq("id", parsed.data.reviewId)
      .eq("idea_id", parsed.data.ideaId)
      .maybeSingle();
    if (reviewError || !review)
      return failure("NOT_FOUND", "Review assignment not found.");
    if (review.reviewer_id !== user.id) {
      return failure("FORBIDDEN", "Only the assigned reviewer can decide.");
    }
    if (review.reviewed_at) {
      return failure("ALREADY_DECIDED", "This review was already decided.");
    }

    const { error } = await supabase
      .from("club_idea_reviews")
      .update({
        decision: parsed.data.decision,
        applicant_feedback: parsed.data.applicantFeedback,
        internal_notes: parsed.data.internalNotes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", review.id)
      .is("reviewed_at", null);
    if (error) return failure("DECIDE_FAILED", error.message);

    revalidatePath(`/admin/ideas/${parsed.data.ideaId}`);
    revalidatePath("/admin/ideas");
    revalidatePath(`/start-a-club/${parsed.data.ideaId}`);
    return { ok: true, data: { status: parsed.data.decision } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    throw error;
  }
}

export async function convertIdeaToClubAction(
  input: ConvertIdeaInput,
): Promise<ActionResult<{ clubId: string }>> {
  const parsed = convertIdeaSchema.safeParse(input);
  if (!parsed.success)
    return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data: clubId, error } = await supabase.rpc(
      "convert_approved_idea_to_club",
      {
        target_idea_id: parsed.data.ideaId,
        confirm_name: parsed.data.confirmName,
        confirm_slug: parsed.data.slug,
      },
    );

    if (error || !clubId) {
      logger.error("idea.convert.failed", { message: error?.message });
      return failure("CONVERT_FAILED", error?.message ?? "Conversion failed.");
    }

    revalidatePath(`/dashboard/clubs/${clubId}`);
    revalidatePath(`/dashboard/clubs/${clubId}/onboarding`);
    revalidatePath(`/start-a-club/${parsed.data.ideaId}`);
    revalidatePath("/admin/ideas");
    return { ok: true, data: { clubId } };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    throw error;
  }
}
