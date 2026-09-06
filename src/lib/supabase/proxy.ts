import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database.generated";

function nextWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export async function refreshAuthSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return nextWithPathname(request);
  }

  let response = nextWithPathname(request);
  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = nextWithPathname(request);
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // This verifies and refreshes the token when needed. Authorization remains in
  // Server Components, actions, route handlers, and RLS.
  await supabase.auth.getClaims();
  return response;
}
