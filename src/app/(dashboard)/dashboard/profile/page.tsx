import { ProfileSettingsForm } from "@/features/auth/components/profile-settings-form";
import { EmailPreferencesForm } from "@/features/communications/components/email-preferences-form";
import { requireActiveUser } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await requireActiveUser();
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "first_name, last_initial, display_name, display_format, grade_band, show_avatar_to_club_members, show_school_to_club_members",
    )
    .eq("id", user.id)
    .single();

  if (error || !profile?.first_name || !profile.last_initial) {
    throw new Error("Active profile data is unavailable.");
  }

  const { data: preferences } = await supabase
    .from("user_email_preferences")
    .select("category, opted_in")
    .eq("user_id", user.id);

  const preferenceMap: Record<string, boolean> = {
    announcement: true,
    newsletter: true,
    event_promotion: true,
    highlight_digest: true,
  };
  for (const row of preferences ?? []) {
    preferenceMap[row.category] = row.opted_in;
  }

  return (
    <>
      <p className="text-primary text-sm font-medium">Account</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Profile and privacy
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
        Control how your name, school, and optional avatar appear to other club
        members.
      </p>
      <ProfileSettingsForm
        initialValues={{
          firstName: profile.first_name,
          lastInitial: profile.last_initial,
          displayFormat: profile.display_format,
          customDisplayName:
            profile.display_format === "custom"
              ? profile.display_name
              : undefined,
          gradeBand: profile.grade_band ?? undefined,
          showAvatarToClubMembers: profile.show_avatar_to_club_members,
          showSchoolToClubMembers: profile.show_school_to_club_members,
        }}
      />
      <EmailPreferencesForm initial={preferenceMap} />
    </>
  );
}
