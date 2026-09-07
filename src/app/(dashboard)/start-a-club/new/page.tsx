import { IdeaWizard } from "@/features/ideas/components/idea-wizard";
import { listUserSchools } from "@/features/ideas/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function NewClubIdeaPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/start-a-club/new");
  }

  const memberships = await listUserSchools(user!.id);
  const schools = memberships
    .map((m) => m.schools)
    .filter((school): school is { id: string; name: string } =>
      Boolean(school),
    );
  const { path } = await searchParams;
  const applicationKind =
    path === "existing" ? ("existing_club" as const) : ("new_idea" as const);

  return (
    <IdeaWizard
      status="draft"
      schools={schools}
      initial={{
        applicationKind,
        draftStep: 1,
        title: "",
        category: "",
        description: "",
        mission: "",
        problemOpportunity: "",
        expectedActivities: [],
        expectedMembership: null,
        proposedMeetingCadence: "",
        proposedAdvisorId: null,
        gradeMin: null,
        gradeMax: null,
        schoolId: schools[0]?.id ?? null,
        officers: [],
        links: [],
      }}
    />
  );
}
