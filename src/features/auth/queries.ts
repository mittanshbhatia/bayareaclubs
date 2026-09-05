import "server-only";

import { createClient } from "@/lib/supabase/server";

import type { SchoolOption } from "./components/auth-forms";

export async function getSignupSchools(): Promise<SchoolOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("id, name, city, state_code")
    .eq("is_active", true)
    .order("name");

  if (error) {
    return [];
  }
  return data.map((school) => ({
    id: school.id,
    name: school.name,
    location: `${school.city}, ${school.state_code}`,
  }));
}
