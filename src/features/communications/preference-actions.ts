"use server";

import { z } from "zod";

import {
  AuthorizationError,
  requireActiveUser,
} from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action-result";

const preferenceSchema = z.object({
  category: z.enum([
    "announcement",
    "newsletter",
    "event_promotion",
    "highlight_digest",
  ]),
  optedIn: z.boolean(),
});

function failure(code: string, message: string): ActionResult<never> {
  return { ok: false, error: { code, message } };
}

export async function updateEmailPreference(
  input: unknown,
): Promise<ActionResult<{ category: string; optedIn: boolean }>> {
  try {
    const user = await requireActiveUser();
    const parsed = preferenceSchema.safeParse(input);
    if (!parsed.success) {
      return failure("VALIDATION_ERROR", "Invalid preference update.");
    }

    const supabase = await createClient();
    const { error } = await supabase.from("user_email_preferences").upsert(
      {
        user_id: user.id,
        category: parsed.data.category,
        opted_in: parsed.data.optedIn,
        unsubscribed_at: parsed.data.optedIn ? null : new Date().toISOString(),
      },
      { onConflict: "user_id,category" },
    );
    if (error) return failure("SAVE_FAILED", error.message);

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "email_preference.update",
      entity_type: "user_email_preferences",
      entity_id: null,
      metadata: {
        category: parsed.data.category,
        opted_in: parsed.data.optedIn,
      },
    });

    return {
      ok: true,
      data: { category: parsed.data.category, optedIn: parsed.data.optedIn },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    return failure("UNEXPECTED", "Could not update email preferences.");
  }
}
