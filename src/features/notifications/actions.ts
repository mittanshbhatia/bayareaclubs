"use server";

import { revalidatePath } from "next/cache";

import {
  AuthorizationError,
  requireActiveUser,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  markNotificationReadSchema,
  updateNotificationPreferenceSchema,
} from "@/lib/validation/notifications";
import type { ActionResult } from "@/types/action-result";

function failure(code: string, message: string): ActionResult<never> {
  return { ok: false, error: { code, message } };
}

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

export async function markNotificationReadAction(
  input: unknown,
): Promise<ActionResult<{ notificationId: string }>> {
  const parsed = markNotificationReadSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const user = await requireActiveUser();
    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", parsed.data.notificationId)
      .eq("user_id", user.id)
      .is("read_at", null);
    if (error) return failure("MARK_READ_FAILED", error.message);
    revalidatePath("/dashboard/notifications");
    return { ok: true, data: { notificationId: parsed.data.notificationId } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    logger.error("notifications.mark_read_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not mark notification as read.");
  }
}

export async function markAllNotificationsReadAction(): Promise<
  ActionResult<{ updated: number }>
> {
  try {
    await requireActiveUser();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("mark_all_notifications_read");
    if (error) return failure("MARK_ALL_FAILED", error.message);
    revalidatePath("/dashboard/notifications");
    return { ok: true, data: { updated: data ?? 0 } };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not mark notifications as read.");
  }
}

export async function markAllNotificationsReadFormAction() {
  await markAllNotificationsReadAction();
}

export async function updateNotificationPreferenceAction(
  input: unknown,
): Promise<ActionResult<{ category: string; inAppEnabled: boolean }>> {
  const parsed = updateNotificationPreferenceSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error.flatten().fieldErrors);

  try {
    const user = await requireActiveUser();
    const supabase = await createClient();
    const { error } = await supabase.from("user_notification_preferences").upsert(
      {
        user_id: user.id,
        category: parsed.data.category,
        in_app_enabled: parsed.data.inAppEnabled,
      },
      { onConflict: "user_id,category" },
    );
    if (error) return failure("PREFERENCE_FAILED", error.message);
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/notifications");
    return {
      ok: true,
      data: {
        category: parsed.data.category,
        inAppEnabled: parsed.data.inAppEnabled,
      },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) return failure(error.code, error.message);
    return failure("UNEXPECTED", "Could not update notification preference.");
  }
}
