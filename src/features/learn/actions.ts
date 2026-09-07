"use server";

import { revalidatePath } from "next/cache";

import { gradeLoaderAttempt } from "@/features/learn/courses/from-loader";
import { createLearnClient } from "@/features/learn/database";
import { assertLearningTransition } from "@/features/learn/workflow";
import {
  AuthorizationError,
  requireActiveUser,
  requirePlatformAdmin,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import {
  attemptInputSchema,
  reviewTransitionSchema,
  type LearningPublicationStatus,
} from "@/lib/validation/learn";
import type { ActionResult } from "@/types/action-result";
import type { Json } from "@/types/database.generated";

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

function revalidateLearn(namespace?: string | null) {
  revalidatePath("/dashboard/learn");
  revalidatePath("/dashboard/learn/ap");
  revalidatePath("/admin/learn");
  if (namespace) {
    revalidatePath(`/dashboard/learn/ap/${namespace}`);
    revalidatePath(`/dashboard/learn/ap/${namespace}/practice`);
    revalidatePath(`/dashboard/learn/ap/${namespace}/tests`);
  }
}

async function transitionCourse(
  input: unknown,
  expectedTo: LearningPublicationStatus,
): Promise<ActionResult<{ courseId: string; status: LearningPublicationStatus }>> {
  try {
    const actor = await requirePlatformAdmin();
    const parsed = reviewTransitionSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);
    if (parsed.data.toStatus !== expectedTo) {
      return failure("INVALID_TRANSITION", `This action only sets status to ${expectedTo}.`);
    }

    const supabase = await createLearnClient();
    const { data: course, error } = await supabase
      .from("stem_courses")
      .select("id, status, course_kind, course_namespace")
      .eq("id", parsed.data.courseId)
      .maybeSingle();
    if (error || !course) return failure("NOT_FOUND", "Course not found.");
    if (course.course_kind !== "ap") {
      return failure("NOT_AP", "Learning workflow applies only to AP courses.");
    }

    const fromStatus = course.status as LearningPublicationStatus;
    const allowed = assertLearningTransition(fromStatus, expectedTo);
    if (!allowed.ok) return failure(allowed.code, allowed.message);

    const { error: updateError } = await supabase
      .from("stem_courses")
      .update({ status: expectedTo })
      .eq("id", course.id);
    if (updateError) return failure("UPDATE_FAILED", updateError.message);

    const { error: eventError } = await supabase.from("learning_review_events").insert({
      course_id: course.id,
      actor_id: actor.id,
      from_status: fromStatus,
      to_status: expectedTo,
      notes: parsed.data.notes,
    });
    if (eventError) return failure("AUDIT_FAILED", eventError.message);

    revalidateLearn(course.course_namespace);
    return { ok: true, data: { courseId: course.id, status: expectedTo } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("learn.transition_failed", {
      message: error instanceof Error ? error.message : "unknown",
      to: expectedTo,
    });
    return failure("UNEXPECTED", "Could not update the learning course.");
  }
}

export async function submitForReview(input: unknown) {
  return transitionCourse(
    typeof input === "object" && input
      ? { ...input, toStatus: "review" }
      : { toStatus: "review" },
    "review",
  );
}

export async function approveCourse(input: unknown) {
  return transitionCourse(
    typeof input === "object" && input
      ? { ...input, toStatus: "approved" }
      : { toStatus: "approved" },
    "approved",
  );
}

export async function publishCourse(input: unknown) {
  return transitionCourse(
    typeof input === "object" && input
      ? { ...input, toStatus: "published" }
      : { toStatus: "published" },
    "published",
  );
}

export async function archiveCourse(input: unknown) {
  return transitionCourse(
    typeof input === "object" && input
      ? { ...input, toStatus: "archived" }
      : { toStatus: "archived" },
    "archived",
  );
}

export async function recordAttempt(
  input: unknown,
): Promise<ActionResult<{ attemptId: string; isCorrect: boolean; explanation: string | null }>> {
  try {
    const user = await requireActiveUser();
    const parsed = attemptInputSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

    const supabase = await createLearnClient();
    const { data: published } = await supabase
      .from("published_ap_courses")
      .select("id, course_namespace")
      .eq("id", parsed.data.courseId)
      .maybeSingle();
    if (!published) {
      const loaderGrade = await gradeLoaderAttempt({
        courseId: parsed.data.courseId,
        questionId: parsed.data.questionId,
        choiceId: parsed.data.choiceId,
      });
      if (!loaderGrade) {
        return failure(
          "NOT_PUBLISHED",
          "Only published courses accept practice attempts.",
        );
      }
      return {
        ok: true,
        data: {
          attemptId: parsed.data.questionId,
          isCorrect: loaderGrade.isCorrect,
          explanation: loaderGrade.explanation
            ? `${loaderGrade.explanation} Progress will save after the learning catalog is applied to the database.`
            : "Progress will save after the learning catalog is applied to the database.",
        },
      };
    }

    const { data: question } = await supabase
      .from("learning_questions_student")
      .select("id, course_id")
      .eq("id", parsed.data.questionId)
      .eq("course_id", parsed.data.courseId)
      .maybeSingle();
    if (!question) {
      return failure("NOT_FOUND", "Published question not found.");
    }

    const response = parsed.data.choiceId
      ? { choiceId: parsed.data.choiceId }
      : { text: parsed.data.text ?? "" };

    const { data, error } = await supabase.rpc("record_learning_attempt", {
      target_question_id: parsed.data.questionId,
      response: response as Json,
    });
    if (error || !data?.[0]) {
      return failure("ATTEMPT_FAILED", error?.message ?? "Could not record attempt.");
    }

    const row = data[0];
    if (!row.attempt_id) {
      return failure("ATTEMPT_FAILED", "Attempt was not recorded.");
    }

    void user;
    revalidateLearn(published.course_namespace);
    return {
      ok: true,
      data: {
        attemptId: row.attempt_id,
        isCorrect: row.is_correct,
        explanation: row.explanation,
      },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("learn.attempt_failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not record your attempt.");
  }
}
