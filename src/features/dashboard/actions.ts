"use server";

import { revalidatePath } from "next/cache";

import {
  AuthorizationError,
  requireActiveUser,
  requireSchoolDashboardAccess,
} from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import { dashboardUserPreferenceSchema } from "@/lib/validation/dashboard";
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

async function authorizePreferenceScope(
  userId: string,
  lastContextType: "personal" | "club" | "school" | "platform",
  lastClubId: string | null,
  lastSchoolId: string | null,
) {
  const supabase = await createClient();

  if (lastContextType === "platform") {
    const { data, error } = await supabase
      .from("platform_role_assignments")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "platform_admin")
      .is("revoked_at", null)
      .maybeSingle();
    if (error || !data) {
      throw new AuthorizationError(
        "FORBIDDEN",
        "Platform context is limited to platform administrators.",
      );
    }
  }

  if (lastContextType === "club" && lastClubId) {
    const { data, error } = await supabase
      .from("club_memberships")
      .select("id")
      .eq("user_id", userId)
      .eq("club_id", lastClubId)
      .eq("status", "active")
      .maybeSingle();
    if (error || !data) {
      throw new AuthorizationError(
        "FORBIDDEN",
        "Active membership in this club is required.",
      );
    }
  }

  if (lastContextType === "school" && lastSchoolId) {
    await requireSchoolDashboardAccess(lastSchoolId);
  }
}

export async function saveDashboardPreferenceAction(
  input: unknown,
): Promise<
  ActionResult<{
    lastContextType: "personal" | "club" | "school" | "platform";
  }>
> {
  const parsed = dashboardUserPreferenceSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  try {
    const user = await requireActiveUser();
    const lastClubId = parsed.data.lastClubId ?? null;
    const lastSchoolId = parsed.data.lastSchoolId ?? null;
    await authorizePreferenceScope(
      user.id,
      parsed.data.lastContextType,
      lastClubId,
      lastSchoolId,
    );

    const supabase = await createClient();
    const { error } = await supabase.from("dashboard_user_preferences").upsert(
      {
        user_id: user.id,
        last_context_type: parsed.data.lastContextType,
        last_club_id: lastClubId,
        last_school_id: lastSchoolId,
        hidden_module_ids: parsed.data.hiddenModuleIds,
        module_order: parsed.data.moduleOrder,
      },
      { onConflict: "user_id" },
    );
    if (error) return failure("PREFERENCE_FAILED", error.message);

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "dashboard_preference.update",
      entity_type: "dashboard_user_preferences",
      entity_id: user.id,
      school_id: lastSchoolId,
      club_id: lastClubId,
      metadata: {
        last_context_type: parsed.data.lastContextType,
        hidden_module_count: parsed.data.hiddenModuleIds.length,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard", "layout");
    return {
      ok: true,
      data: { lastContextType: parsed.data.lastContextType },
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return failure(error.code, error.message);
    }
    logger.error("dashboard.save_preference_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure("UNEXPECTED", "Could not save dashboard preference.");
  }
}
