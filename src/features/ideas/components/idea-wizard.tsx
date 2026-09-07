"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react";

import { PageContainer } from "@/components/ds/page-container";
import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveIdeaDraftAction,
  submitIdeaAction,
} from "@/features/ideas/actions";
import {
  IDEA_STEPS,
  ideaCategories,
  type IdeaDraftInput,
} from "@/lib/validation/ideas";
import { cn } from "@/lib/utils";

type SchoolOption = { id: string; name: string };

type WizardProps = {
  initial: IdeaDraftInput;
  schools: SchoolOption[];
  status: string;
  feedback?: Array<{
    applicant_feedback: string | null;
    decision: string | null;
  }>;
  readOnly?: boolean;
};

const emptyOfficer = {
  proposedName: "",
  proposedRole: "officer" as const,
  proposedUserId: null,
};

export function IdeaWizard({
  initial,
  schools,
  status,
  feedback = [],
  readOnly = false,
}: WizardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<IdeaDraftInput>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editable = !readOnly && ["draft", "changes_requested"].includes(status);
  const isExistingClub = form.applicationKind === "existing_club";

  const completion = useMemo(() => {
    const checks = [
      form.title.trim().length > 1,
      form.category.trim().length > 0,
      form.description.trim().length >= 20,
      Boolean(form.schoolId),
      form.mission.trim().length >= 20,
      form.problemOpportunity.trim().length >= 20,
      form.expectedActivities.length > 0,
      form.expectedMembership != null,
      form.gradeMin != null && form.gradeMax != null,
      form.officers.length > 0,
      form.proposedMeetingCadence.trim().length >= 3,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  useEffect(() => {
    if (!editable || !form.schoolId) return;
    const handle = window.setTimeout(() => {
      startTransition(async () => {
        const result = await saveIdeaDraftAction(form);
        if (result.ok) {
          setMessage("Draft saved");
          if (!form.ideaId) {
            setForm((prev) => ({ ...prev, ideaId: result.data.ideaId }));
            router.replace(`/start-a-club/${result.data.ideaId}`);
          }
        }
      });
    }, 900);
    return () => window.clearTimeout(handle);
  }, [form, editable, router]);

  function update<K extends keyof IdeaDraftInput>(
    key: K,
    value: IdeaDraftInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
    setError(null);
  }

  function go(step: number) {
    update("draftStep", step);
  }

  function onSubmit() {
    startTransition(async () => {
      const result = await submitIdeaAction(form);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setMessage("Application submitted");
      router.push(`/start-a-club/${result.data.ideaId}`);
      router.refresh();
    });
  }

  const step = form.draftStep;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <PageContainer className="py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/start-a-club"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-800"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to club launchpad
            </Link>
            <p className="text-xs font-semibold tracking-[0.14em] text-sky-800 uppercase">
              {isExistingClub ? "Existing club setup" : "New club application"}
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {form.title.trim() ||
                (isExistingClub ? "Bring your club" : "Start a club")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {isExistingClub
                ? "Tell us how your club currently operates. Your answers create a clear handoff for school review and workspace activation."
                : "Build your proposal one focused step at a time. Your private draft saves automatically as you work."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge
                status={
                  status === "draft"
                    ? "draft"
                    : status === "approved"
                      ? "approved"
                      : status === "rejected"
                        ? "rejected"
                        : status === "changes_requested"
                          ? "pending"
                          : "active"
                }
              />
              <span className="text-muted-foreground text-sm">
                {completion}% complete
              </span>
              {message ? (
                <span className="text-success text-sm">{message}</span>
              ) : null}
            </div>
          </div>
          {status === "approved" ? (
            <Button asChild>
              <Link href={`/start-a-club/${form.ideaId}/create-club`}>
                Create Club
              </Link>
            </Button>
          ) : null}
        </div>

        {feedback.length > 0 ? (
          <div className="border-warning/30 bg-warning-muted/40 mb-6 rounded-lg border p-4">
            <p className="text-foreground font-semibold">Reviewer feedback</p>
            <ul className="text-foreground/90 mt-2 space-y-2 text-sm">
              {feedback.map((item, index) => (
                <li key={`${item.decision}-${index}`}>
                  {item.applicant_feedback}
                </li>
              ))}
            </ul>
            {status === "changes_requested" ? (
              <p className="text-muted-foreground mt-3 text-sm">
                Editable sections are unlocked. Previous submitted versions
                remain preserved.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-600 transition-[width]"
            style={{ width: `${completion}%` }}
          />
        </div>

        <ol className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
          {IDEA_STEPS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={!editable && item.id !== step}
                onClick={() => go(item.id)}
                className={cn(
                  "flex min-h-12 w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-center text-xs font-semibold transition",
                  step === item.id
                    ? "border-sky-700 bg-sky-700 text-white shadow-sm"
                    : item.id < step
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-800",
                )}
              >
                {item.id < step ? (
                  <Check aria-hidden="true" className="size-3.5 shrink-0" />
                ) : (
                  <span>{item.id}.</span>
                )}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.key}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgb(15_23_42/0.07)] sm:p-8">
          {step === 1 ? (
            <div className="space-y-4">
              <Field
                label={isExistingClub ? "Current club name" : "Club idea title"}
              >
                <Input
                  value={form.title}
                  disabled={!editable}
                  onChange={(e) => update("title", e.target.value)}
                />
              </Field>
              <Field label="Category">
                <select
                  className="border-border bg-surface min-h-11 w-full rounded-md border px-3"
                  value={form.category}
                  disabled={!editable}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  {ideaCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={
                  isExistingClub
                    ? "Tell us about your existing club"
                    : "Short description"
                }
              >
                <Textarea
                  value={form.description}
                  disabled={!editable}
                  onChange={(e) => update("description", e.target.value)}
                  rows={5}
                />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <Field label="School">
              <select
                className="border-border bg-surface min-h-11 w-full rounded-md border px-3"
                value={form.schoolId ?? ""}
                disabled={!editable}
                onChange={(e) => update("schoolId", e.target.value)}
              >
                <option value="">Select your school</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <Field label={isExistingClub ? "Current mission" : "Mission"}>
                <Textarea
                  value={form.mission}
                  disabled={!editable}
                  onChange={(e) => update("mission", e.target.value)}
                  rows={4}
                />
              </Field>
              <Field
                label={
                  isExistingClub
                    ? "What support does your club need?"
                    : "Problem or opportunity"
                }
              >
                <Textarea
                  value={form.problemOpportunity}
                  disabled={!editable}
                  onChange={(e) => update("problemOpportunity", e.target.value)}
                  rows={4}
                />
              </Field>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-3">
              <Field
                label={
                  isExistingClub
                    ? "Current and planned activities (one per line)"
                    : "Planned activities (one per line)"
                }
              >
                <Textarea
                  value={form.expectedActivities.join("\n")}
                  disabled={!editable}
                  onChange={(e) =>
                    update(
                      "expectedActivities",
                      e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    )
                  }
                  rows={6}
                />
              </Field>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label={
                  isExistingClub
                    ? "Current or expected membership"
                    : "Expected membership"
                }
              >
                <Input
                  type="number"
                  min={1}
                  value={form.expectedMembership ?? ""}
                  disabled={!editable}
                  onChange={(e) =>
                    update(
                      "expectedMembership",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </Field>
              <Field label="Grade min">
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={form.gradeMin ?? ""}
                  disabled={!editable}
                  onChange={(e) =>
                    update(
                      "gradeMin",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </Field>
              <Field label="Grade max">
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={form.gradeMax ?? ""}
                  disabled={!editable}
                  onChange={(e) =>
                    update(
                      "gradeMax",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </Field>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="space-y-4">
              {form.officers.map((officer, index) => (
                <div
                  key={`officer-${index}`}
                  className="border-border grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_10rem_auto]"
                >
                  <Input
                    placeholder="Officer name"
                    value={officer.proposedName}
                    disabled={!editable}
                    onChange={(e) => {
                      const next = [...form.officers];
                      next[index] = {
                        ...officer,
                        proposedName: e.target.value,
                      };
                      update("officers", next);
                    }}
                  />
                  <select
                    className="border-border bg-surface min-h-11 rounded-md border px-3"
                    value={officer.proposedRole}
                    disabled={!editable}
                    onChange={(e) => {
                      const next = [...form.officers];
                      next[index] = {
                        ...officer,
                        proposedRole: e.target
                          .value as typeof officer.proposedRole,
                      };
                      update("officers", next);
                    }}
                  >
                    {[
                      "president",
                      "vice_president",
                      "secretary",
                      "treasurer",
                      "officer",
                      "club_admin",
                    ].map((role) => (
                      <option key={role} value={role}>
                        {role.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                  {editable ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        update(
                          "officers",
                          form.officers.filter((_, i) => i !== index),
                        )
                      }
                      aria-label="Remove officer"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              {editable ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    update("officers", [...form.officers, emptyOfficer])
                  }
                >
                  <Plus className="size-4" />
                  Add officer
                </Button>
              ) : null}
            </div>
          ) : null}

          {step === 7 ? (
            <Field label="Proposed advisor user ID (optional UUID)">
              <Input
                value={form.proposedAdvisorId ?? ""}
                disabled={!editable}
                onChange={(e) =>
                  update("proposedAdvisorId", e.target.value || null)
                }
                placeholder="Leave blank if advisor will be invited later"
              />
            </Field>
          ) : null}

          {step === 8 ? (
            <Field
              label={
                isExistingClub
                  ? "Current meeting schedule"
                  : "Meeting plan / cadence"
              }
            >
              <Textarea
                value={form.proposedMeetingCadence}
                disabled={!editable}
                onChange={(e) =>
                  update("proposedMeetingCadence", e.target.value)
                }
                rows={4}
                placeholder="e.g. Wednesdays 3:30–4:30 PM in Room 214"
              />
            </Field>
          ) : null}

          {step === 9 ? (
            <div className="space-y-4">
              {form.links.map((link, index) => (
                <div
                  key={`link-${index}`}
                  className="border-border grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1.4fr_auto]"
                >
                  <Input
                    placeholder="Title"
                    value={link.title}
                    disabled={!editable}
                    onChange={(e) => {
                      const next = [...form.links];
                      next[index] = { ...link, title: e.target.value };
                      update("links", next);
                    }}
                  />
                  <Input
                    placeholder="https://..."
                    value={link.url}
                    disabled={!editable}
                    onChange={(e) => {
                      const next = [...form.links];
                      next[index] = { ...link, url: e.target.value };
                      update("links", next);
                    }}
                  />
                  {editable ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        update(
                          "links",
                          form.links.filter((_, i) => i !== index),
                        )
                      }
                      aria-label="Remove link"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              {editable ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    update("links", [
                      ...form.links,
                      { title: "", url: "https://" },
                    ])
                  }
                >
                  <Plus className="size-4" />
                  Add supporting link
                </Button>
              ) : null}
            </div>
          ) : null}

          {step === 10 ? (
            <div className="space-y-4 text-sm">
              <p>
                <strong>Title:</strong> {form.title || "—"}
              </p>
              <p>
                <strong>School:</strong>{" "}
                {schools.find((school) => school.id === form.schoolId)?.name ||
                  "—"}
              </p>
              <p>
                <strong>Category:</strong> {form.category || "—"}
              </p>
              <p>
                <strong>Mission:</strong> {form.mission || "—"}
              </p>
              <p>
                <strong>Activities:</strong>{" "}
                {form.expectedActivities.join(", ") || "—"}
              </p>
              <p>
                <strong>Officers:</strong>{" "}
                {form.officers.map((o) => o.proposedName).join(", ") || "—"}
              </p>
              {editable ? (
                <Button
                  type="button"
                  disabled={pending}
                  onClick={onSubmit}
                  className="bg-sky-700 text-white hover:bg-sky-800"
                >
                  {status === "changes_requested"
                    ? "Resubmit application"
                    : isExistingClub
                      ? "Submit existing club"
                      : "Submit new club idea"}
                </Button>
              ) : (
                <p className="text-muted-foreground">
                  This application is {status.replaceAll("_", " ")}.
                </p>
              )}
            </div>
          ) : null}

          {error ? (
            <p className="text-danger mt-4 text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={step <= 1}
              onClick={() => go(step - 1)}
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </Button>
            <Button
              type="button"
              disabled={step >= 10}
              onClick={() => go(step + 1)}
              className="bg-sky-700 text-white hover:bg-sky-800"
            >
              Continue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
