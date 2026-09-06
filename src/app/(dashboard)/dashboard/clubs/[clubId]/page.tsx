import { redirect } from "next/navigation";

import { requireClubMember } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";

export default async function ClubWorkspaceRedirect({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  try {
    await requireClubMember(clubId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/clubs/${clubId}`);
  }

  const supabase = await createClient();
  const { data: club } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .maybeSingle();

  if (club?.slug) redirect(`/clubs/${club.slug}`);
  redirect("/dashboard");
}
