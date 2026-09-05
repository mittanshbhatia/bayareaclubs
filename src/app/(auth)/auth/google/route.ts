import { NextResponse, type NextRequest } from "next/server";

import { isGoogleAuthEnabled } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  if (!isGoogleAuthEnabled()) {
    return NextResponse.redirect(
      new URL("/sign-in?error=google_not_configured", origin),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      new URL("/sign-in?error=google_unavailable", origin),
    );
  }
  return NextResponse.redirect(data.url);
}
