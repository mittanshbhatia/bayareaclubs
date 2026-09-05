"use server";

import { redirect } from "next/navigation";

import { getAppUrl } from "@/lib/env";
import { logger } from "@/lib/logging/logger";
import { createClient } from "@/lib/supabase/server";
import {
  completeProfileSchema,
  forgotPasswordSchema,
  profileSettingsSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type ForgotPasswordInput,
  type ProfileSettingsInput,
  type CompleteProfileInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validation/auth";
import { requireActiveUser } from "@/lib/auth/authorization";
import type { ActionResult } from "@/types/action-result";

type AuthActionData = {
  redirectTo?: string;
};

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

export async function signInAction(
  input: SignInInput,
): Promise<ActionResult<AuthActionData>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      ok: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "The email or password is incorrect.",
      },
    };
  }

  const { data: onboardingStatus } = await supabase.rpc(
    "complete_verified_onboarding",
  );

  return {
    ok: true,
    data: {
      redirectTo:
        onboardingStatus === "active" ? "/dashboard" : "/account-pending",
    },
  };
}

export async function signUpAction(
  input: SignUpInput,
): Promise<ActionResult<AuthActionData>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }
  if (parsed.data.ageBand === "under_13") {
    return {
      ok: false,
      error: {
        code: "UNDER_13_MANAGED_REQUIRED",
        message:
          "Under-13 accounts require guardian authorization or school-managed onboarding.",
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback?next=/dashboard`,
      data: {
        age_band: parsed.data.ageBand,
        first_name: parsed.data.firstName,
        last_initial: parsed.data.lastInitial,
        school_id: parsed.data.schoolId || null,
        grade_band: parsed.data.gradeBand ?? null,
      },
    },
  });

  if (error) {
    logger.warn("Supabase signup rejected", { code: error.code });
    return {
      ok: false,
      error: {
        code: "SIGNUP_FAILED",
        message:
          "We could not create the account. Check the information and try again.",
      },
    };
  }

  return {
    ok: true,
    data: { redirectTo: "/verify-email" },
  };
}

export async function completeOAuthProfileAction(
  input: CompleteProfileInput,
): Promise<ActionResult<AuthActionData>> {
  const parsed = completeProfileSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }
  if (parsed.data.ageBand === "under_13") {
    return {
      ok: false,
      error: {
        code: "UNDER_13_MANAGED_REQUIRED",
        message:
          "Under-13 accounts require guardian authorization or school-managed onboarding.",
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: {
        code: "SESSION_EXPIRED",
        message: "Your sign-in session expired. Please sign in again.",
      },
    };
  }

  const { error } = await supabase.rpc("complete_oauth_profile", {
    first_name: parsed.data.firstName,
    last_initial: parsed.data.lastInitial,
    selected_age_band: parsed.data.ageBand,
    school_id: parsed.data.schoolId || undefined,
    selected_grade_band: parsed.data.gradeBand,
  });
  if (error) {
    logger.warn("OAuth profile completion failed", { code: error.code });
    return {
      ok: false,
      error: {
        code: "PROFILE_COMPLETION_FAILED",
        message: "Your profile could not be completed. Please try again.",
      },
    };
  }
  return { ok: true, data: { redirectTo: "/dashboard" } };
}

export async function requestPasswordResetAction(
  input: ForgotPasswordInput,
): Promise<ActionResult<AuthActionData>> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
    },
  );
  if (error) {
    logger.warn("Password reset request was not accepted", {
      code: error.code,
    });
  }

  return { ok: true, data: {} };
}

export async function updatePasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult<AuthActionData>> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: {
        code: "SESSION_EXPIRED",
        message: "This password reset session has expired. Request a new link.",
      },
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return {
      ok: false,
      error: {
        code: "PASSWORD_UPDATE_FAILED",
        message: "The password could not be updated. Request a new link.",
      },
    };
  }

  return { ok: true, data: { redirectTo: "/dashboard" } };
}

export async function updateProfileAction(
  input: ProfileSettingsInput,
): Promise<ActionResult<AuthActionData>> {
  const parsed = profileSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return validationFailure(parsed.error.flatten().fieldErrors);
  }

  const user = await requireActiveUser();
  const displayName =
    parsed.data.displayFormat === "custom"
      ? parsed.data.customDisplayName?.trim()
      : parsed.data.displayFormat === "first_name_only"
        ? parsed.data.firstName
        : `${parsed.data.firstName} ${parsed.data.lastInitial}.`;
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: parsed.data.firstName,
      last_initial: parsed.data.lastInitial,
      display_format: parsed.data.displayFormat,
      display_name: displayName,
      grade_band: parsed.data.gradeBand,
      show_avatar_to_club_members: parsed.data.showAvatarToClubMembers,
      show_school_to_club_members: parsed.data.showSchoolToClubMembers,
    })
    .eq("id", user.id);

  if (error) {
    return {
      ok: false,
      error: {
        code: "PROFILE_UPDATE_FAILED",
        message: "Your profile settings could not be saved.",
      },
    };
  }
  return { ok: true, data: {} };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
