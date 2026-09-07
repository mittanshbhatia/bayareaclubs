import { PersonalHome } from "@/components/dashboard/personal-home";
import { resolveDashboardContext } from "@/features/dashboard/context";
import { loadPersonalHome } from "@/features/dashboard/personal";
import { withAuthorization } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const model = await withAuthorization("/dashboard", async () => {
    const resolved = await resolveDashboardContext({
      hint: { type: "personal" },
    });
    return loadPersonalHome(resolved);
  });

  return <PersonalHome model={model} />;
}
