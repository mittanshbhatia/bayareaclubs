"use server";

import { revalidatePath } from "next/cache";

import { requirePlatformAdmin } from "@/lib/auth/authorization";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  assignPlatformRoleSchema,
  revokePlatformRoleSchema,
  schoolUpsertSchema,
  type SchoolUpsertInput,
} from "@/lib/validation/admin";
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

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/schools");
  revalidatePath("/admin/users");
  revalidatePath("/admin/audit");
}

export async function upsertSchoolAction(
  input: SchoolUpsertInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = schoolUpsertSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  try {
    await requirePlatformAdmin();
    const supabase = await createClient();
    const payload = {
      name: parsed.data.name,
      slug: parsed.data.slug,
      level: parsed.data.level,
      city: parsed.data.city,
      state_code: parsed.data.stateCode,
      timezone: parsed.data.timezone,
      website_url: parsed.data.websiteUrl || null,
      email_domain: parsed.data.emailDomain || null,
      is_active: parsed.data.isActive,
    };

    if (parsed.data.id) {
      const { data, error } = await supabase
        .from("schools")
        .update(payload)
        .eq("id", parsed.data.id)
        .select("id")
        .single();
      if (error) throw error;
      revalidateAdmin();
      return { ok: true, data: { id: data.id } };
    }

    const { data, error } = await supabase
      .from("schools")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    revalidateAdmin();
    return { ok: true, data: { id: data.id } };
  } catch (error) {
    logger.error("upsertSchoolAction failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure(
      "SCHOOL_UPSERT_FAILED",
      error instanceof Error ? error.message : "Could not save school.",
    );
  }
}

export async function assignPlatformRoleAction(input: {
  userId: string;
  role: "platform_admin" | "committee_reviewer";
  confirm: boolean;
}): Promise<ActionResult<{ assignmentId: string }>> {
  const parsed = assignPlatformRoleSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  try {
    await requirePlatformAdmin();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("assign_platform_role", {
      target_user_id: parsed.data.userId,
      target_role: parsed.data.role,
    });
    if (error) throw error;
    revalidateAdmin();
    return { ok: true, data: { assignmentId: data } };
  } catch (error) {
    logger.error("assignPlatformRoleAction failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return failure(
      "ROLE_ASSIGN_FAILED",
      error instanceof Error ? error.message : "Could not assign role.",
    );
  }
}

export async function revokePlatformRoleAction(input: {
  assignmentId: string;
  confirm: boolean;
}): Promise<ActionResult<{ assignmentId: string }>> {
  const parsed = revokePlatformRoleSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  try {
    await requirePlatformAdmin();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("revoke_platform_role", {
      target_assignment_id: parsed.data.assignmentId,
    });
    if (error) throw error;
    revalidateAdmin();
    return { ok: true, data: { assignmentId: data } };
  } catch (error) {
    logger.error("revokePlatformRoleAction failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    const message =
      error instanceof Error ? error.message : "Could not revoke role.";
    if (message.toLowerCase().includes("final platform administrator")) {
      return failure(
        "LAST_ADMIN",
        "Cannot remove the final platform administrator.",
      );
    }
    return failure("ROLE_REVOKE_FAILED", message);
  }
}
