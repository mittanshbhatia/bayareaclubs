"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.generated";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase public configuration is missing.");
  }

  return createBrowserClient<Database>(url, publishableKey);
}
