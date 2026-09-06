import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
  const origin = request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=verification_failed", origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL("/sign-in?error=verification_failed", origin),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(
      new URL("/sign-in?reason=session_expired", origin),
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.redirect(new URL("/complete-profile", origin));
  }

  const { data: status } = await supabase.rpc("complete_verified_onboarding");
  return NextResponse.redirect(
    new URL(status === "active" ? nextPath : "/account-pending", origin),
  );
}
