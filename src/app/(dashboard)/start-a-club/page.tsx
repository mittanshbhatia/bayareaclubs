import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { PageContainer } from "@/components/ds/page-container";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { listMyIdeas } from "@/features/ideas/queries";
import { ideaStatusToBadge } from "@/features/ideas/status";
import { requireActiveUser } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";

export const dynamic = "force-dynamic";

export default async function StartAClubIndexPage() {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    handleAuthorizationError(error, "/start-a-club");
  }

  const ideas = await listMyIdeas(user!.id);
  const newIdeaDraft = ideas.find(
    (idea) =>
      idea.status === "draft" && idea.application_kind !== "existing_club",
  );
  const existingClubDraft = ideas.find(
    (idea) =>
      idea.status === "draft" && idea.application_kind === "existing_club",
  );

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <PageContainer className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-sky-800 uppercase">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Club launchpad
            </div>
            <h1 className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              Bring your community to life.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Choose the path that fits. We will guide you through school
              review, setup, and launch without losing your progress.
            </p>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <LaunchPath
              href={
                newIdeaDraft
                  ? `/start-a-club/${newIdeaDraft.id}`
                  : "/start-a-club/new"
              }
              icon={<Lightbulb aria-hidden="true" className="size-6" />}
              eyebrow="Start something new"
              title="Turn an idea into a club"
              description="Shape your mission, leadership team, activities, and meeting plan before sending it for review."
              steps={[
                "Build your idea",
                "Submit for review",
                "Launch your club",
              ]}
              action={newIdeaDraft ? "Resume your idea" : "Start a new idea"}
              tone="blue"
            />
            <LaunchPath
              href={
                existingClubDraft
                  ? `/start-a-club/${existingClubDraft.id}`
                  : "/start-a-club/new?path=existing"
              }
              icon={<Building2 aria-hidden="true" className="size-6" />}
              eyebrow="Already active"
              title="Bring an existing club"
              description="Move your current club into BayAreaClubs while preserving its identity, leaders, and established plans."
              steps={[
                "Describe your club",
                "Confirm school details",
                "Activate your workspace",
              ]}
              action={
                existingClubDraft ? "Resume club setup" : "Bring your club"
              }
              tone="teal"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-200 py-5 text-sm text-slate-600">
            {["Private drafts", "Automatic saving", "Clear school review"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 text-emerald-600"
                  />
                  {item}
                </span>
              ),
            )}
          </div>

          <section className="mt-12" aria-labelledby="applications-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-sky-800 uppercase">
                  Your workspace
                </p>
                <h2
                  id="applications-title"
                  className="font-display mt-2 text-2xl font-semibold tracking-tight text-slate-950"
                >
                  Applications and drafts
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                Select any item to continue or view its status.
              </p>
            </div>

            <ul className="mt-5 grid gap-3">
              {ideas.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
                  No applications yet. Choose a path above when you are ready.
                </li>
              ) : (
                ideas.map((idea) => (
                  <li key={idea.id}>
                    <Link
                      href={
                        idea.status === "approved"
                          ? `/start-a-club/${idea.id}/create-club`
                          : `/start-a-club/${idea.id}`
                      }
                      className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/0.04)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_14px_35px_rgb(14_116_144/0.10)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-800">
                          {idea.application_kind === "existing_club" ? (
                            <Building2 aria-hidden="true" className="size-5" />
                          ) : (
                            <Lightbulb aria-hidden="true" className="size-5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">
                            {idea.title || "Untitled draft"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {idea.application_kind === "existing_club"
                              ? "Existing club"
                              : "New idea"}{" "}
                            · {idea.schools?.name ?? "School pending"} ·{" "}
                            {idea.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={ideaStatusToBadge(idea.status)} />
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-sky-700"
                        />
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}

function LaunchPath({
  href,
  icon,
  eyebrow,
  title,
  description,
  steps,
  action,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  steps: string[];
  action: string;
  tone: "blue" | "teal";
}) {
  const blue = tone === "blue";
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgb(15_23_42/0.07)] sm:p-7">
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          blue ? "bg-sky-500" : "bg-teal-500"
        }`}
      />
      <div
        className={`grid size-12 place-items-center rounded-xl ${
          blue ? "bg-sky-50 text-sky-800" : "bg-teal-50 text-teal-800"
        }`}
      >
        {icon}
      </div>
      <p
        className={`mt-6 text-xs font-semibold tracking-[0.12em] uppercase ${
          blue ? "text-sky-800" : "text-teal-800"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
        {description}
      </p>
      <ol className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 text-sm text-slate-700"
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                blue ? "bg-sky-100 text-sky-800" : "bg-teal-100 text-teal-800"
              }`}
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <Button
        asChild
        className={`mt-7 w-full border-0 text-white ${
          blue ? "bg-sky-700 hover:bg-sky-800" : "bg-teal-700 hover:bg-teal-800"
        }`}
      >
        <Link href={href}>
          {action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Button>
    </article>
  );
}
