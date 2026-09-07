import { IdeaWizard } from "@/features/ideas/components/idea-wizard";
import { listActiveSchools } from "@/features/ideas/queries";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function NewClubIdeaPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  try {
    await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/start-a-club/new");
  }

  const schools = await listActiveSchools();
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
        schoolId: null,
        officers: [],
        links: [],
      }}
    />
  );
}
