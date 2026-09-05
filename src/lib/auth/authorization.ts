import "server-only";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.generated";

type ClubRole = Database["public"]["Enums"]["club_role"];
type PlatformRole = Database["public"]["Enums"]["platform_role"];

export type AuthorizationErrorCode =
  "AUTH_REQUIRED" | "ACCOUNT_PENDING" | "FORBIDDEN";

export class AuthorizationError extends Error {
  constructor(
    public readonly code: AuthorizationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthorizationError(
      "AUTH_REQUIRED",
      "A valid authenticated session is required.",
    );
  }
  return user;
}

export async function requireActiveUser(): Promise<User> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("account_onboarding")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || data?.status !== "active") {
    throw new AuthorizationError(
      "ACCOUNT_PENDING",
      "Account activation is required.",
    );
  }
  return user;
}

async function requirePlatformRole(role: PlatformRole): Promise<User> {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("platform_role_assignments")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", role)
    .is("revoked_at", null)
    .maybeSingle();

  if (error || !data) {
    throw new AuthorizationError("FORBIDDEN", `The ${role} role is required.`);
  }
  return user;
}

export function requirePlatformAdmin(): Promise<User> {
  return requirePlatformRole("platform_admin");
}

export function requireCommitteeReviewer(): Promise<User> {
  return requirePlatformRole("committee_reviewer");
}

export async function requireSchoolAccess(schoolId: string): Promise<User> {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const [{ data: platformRole }, { data: membership, error }] =
    await Promise.all([
      supabase
        .from("platform_role_assignments")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "platform_admin")
        .is("revoked_at", null)
        .maybeSingle(),
      supabase
        .from("user_school_memberships")
        .select("id")
        .eq("user_id", user.id)
        .eq("school_id", schoolId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle(),
    ]);

  if (error || (!platformRole && !membership)) {
    throw new AuthorizationError(
      "FORBIDDEN",
      "Active access to this school is required.",
    );
  }
  return user;
}

async function requireClubRole(
  clubId: string,
  roles: readonly ClubRole[],
  message: string,
): Promise<User> {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("club_memberships")
    .select("id")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", [...roles])
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new AuthorizationError("FORBIDDEN", message);
  }
  return user;
}

export function requireClubMember(clubId: string): Promise<User> {
  return requireClubRole(
    clubId,
    [
      "club_admin",
      "president",
      "vice_president",
      "secretary",
      "treasurer",
      "officer",
      "advisor",
      "member",
    ],
    "Active membership in this club is required.",
  );
}

export function requireClubOfficer(clubId: string): Promise<User> {
  return requireClubRole(
    clubId,
    [
      "club_admin",
      "president",
      "vice_president",
      "secretary",
      "treasurer",
      "officer",
      "advisor",
    ],
    "An active officer or advisor role in this club is required.",
  );
}

export function requireClubAdmin(clubId: string): Promise<User> {
  return requireClubRole(
    clubId,
    ["club_admin"],
    "The club administrator role is required.",
  );
}
