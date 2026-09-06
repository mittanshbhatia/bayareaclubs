import { AccessScope } from "@/components/dashboard/access-scope";
import { Button } from "@/components/ui/button";
import { requireClubAdmin } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClubOnboardingPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  try {
    await requireClubAdmin(clubId);
  } catch (error) {
    handleAuthorizationError(error, `/dashboard/clubs/${clubId}/onboarding`);
  }

  const supabase = await createClient();
  const { data: club } = await supabase
    .from("clubs")
    .select("id, name, slug, school_id, originating_idea_id, schools(name)")
    .eq("id", clubId)
    .maybeSingle();

  if (!club) {
    return (
      <AccessScope
        title="Club not found"
        description="This club does not exist or you do not have access."
      />
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
        Club onboarding
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Welcome to {club.name}
      </h1>
      <p className="mt-3 text-muted-foreground">
        Your club was created from an approved idea
        {club.schools?.name ? ` at ${club.schools.name}` : ""}. Complete these
        next steps to open your workspace.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm">
        <li>Invite remaining officers and confirm your advisor.</li>
        <li>Draft your first charter for the current school year.</li>
        <li>Schedule the first meeting and open membership.</li>
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/dashboard/clubs/${club.id}`}>Open club workspace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/dashboard/clubs/${club.id}/admin`}>Admin tools</Link>
        </Button>
        {club.originating_idea_id ? (
          <Button asChild variant="ghost">
            <Link href={`/start-a-club/${club.originating_idea_id}`}>
              View originating idea
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
