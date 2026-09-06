import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null): string {
  if (!value) return "/dashboard";
  // Same-origin relative path only: no protocol-relative, backslash, or scheme tricks.
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("@") ||
    /[\u0000-\u001f\u007f]/.test(value) ||
    /^\/[a-z][a-z0-9+.-]*:/i.test(value)
  ) {
    return "/dashboard";
  }
  return value;
}

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
