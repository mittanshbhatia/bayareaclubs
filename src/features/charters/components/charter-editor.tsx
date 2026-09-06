"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/ds/badges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveCharterDraftAction,
  submitCharterAction,
} from "@/features/charters/actions";
import {
  computeCharterCompletion,
  type CharterSectionDefinition,
} from "@/lib/validation/charters";
import { cn } from "@/lib/utils";

type Feedback = {
  decision: string | null;
  applicant_feedback: string | null;
  reviewed_at: string | null;
};

type Version = {
  id: string;
  version_number: number;
  status_at_freeze: string;
  created_at: string;
};

export function CharterEditor({
  clubId,
  clubSlug,
  schoolYear,
  charterId,
  status,
  draftStep,
  definitions,
  initialSections,
  feedback,
  versions,
}: {
  clubId: string;
  clubSlug: string;
  schoolYear: string;
  charterId: string | null;
  status: string;
  draftStep: number;
  definitions: CharterSectionDefinition[];
  initialSections: Record<string, string>;
  feedback: Feedback[];
  versions: Version[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [id, setId] = useState<string | null>(charterId);
  const [step, setStep] = useState(draftStep);
  const [sections, setSections] = useState(initialSections);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editable = ["draft", "changes_requested", ""].includes(status) || !id;
  const completion = useMemo(
    () => computeCharterCompletion(definitions, sections),
    [definitions, sections],
  );
  const current = definitions[Math.min(step, definitions.length) - 1] ?? definitions[0];

  useEffect(() => {
    if (!editable) return;
    const handle = window.setTimeout(() => {
      startTransition(async () => {
        const result = await saveCharterDraftAction({
          clubId,
          charterId: id ?? undefined,
          schoolYear,
          draftStep: step,
          sections,
        });
        if (result.ok) {
          setMessage("Draft saved");
          if (!id) {
            setId(result.data.charterId);
            router.refresh();
          }
        }
      });
    }, 900);
    return () => window.clearTimeout(handle);
  }, [sections, step, editable, clubId, schoolYear, id, router]);

  function updateSection(key: string, value: string) {
    setSections((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">School year {schoolYear}</p>
          <h2 className="text-xl font-semibold">Annual charter</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sections are driven by the charter section schema. Autosave is on while
            drafting.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={
              status === "approved"
                ? "approved"
                : status === "submitted"
                  ? "pending"
                  : status === "changes_requested"
                    ? "pending"
                    : "draft"
            }
          />
          <Button asChild variant="outline" size="sm">
            <Link href={`/clubs/${clubSlug}/charter/renewal`}>Annual renewal</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Completion</p>
          <p className="font-mono text-sm">
            {completion.complete}/{completion.total} · {completion.percent}%
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${completion.percent}%` }}
          />
        </div>
      </div>

      {feedback.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
          <h3 className="font-semibold">Review feedback</h3>
          {feedback.map((item, index) => (
            <div key={`${item.reviewed_at}-${index}`} className="text-sm">
              <p className="capitalize text-muted-foreground">
                {(item.decision ?? "review").replaceAll("_", " ")}
                {item.reviewed_at
                  ? ` · ${new Date(item.reviewed_at).toLocaleString()}`
                  : ""}
              </p>
              <p className="mt-1">{item.applicant_feedback || "No applicant feedback."}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {definitions.map((def, index) => {
          const value = (sections[def.key] ?? "").trim();
          const done = !def.required || value.length >= def.minLength;
          return (
            <button
              key={def.key}
              type="button"
              onClick={() => setStep(index + 1)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm",
                step === index + 1
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-surface text-muted-foreground",
              )}
            >
              {index + 1}. {def.label}
              {done ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      {current ? (
        <div className="space-y-3 rounded-xl border border-border bg-surface p-5 shadow-xs">
          <div>
            <Label htmlFor={`section-${current.key}`}>{current.label}</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {current.description}
              {current.required
                ? ` Required · min ${current.minLength} characters.`
                : " Optional if not applicable."}
            </p>
          </div>
          <Textarea
            id={`section-${current.key}`}
            value={sections[current.key] ?? ""}
            onChange={(e) => updateSection(current.key, e.target.value)}
            disabled={!editable || pending}
            rows={10}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={step <= 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={step >= definitions.length}
              onClick={() => setStep((s) => Math.min(definitions.length, s + 1))}
            >
              Next
            </Button>
            {editable ? (
              <Button
                type="button"
                disabled={pending || !id || completion.percent < 100}
                onClick={() => {
                  if (!id) return;
                  startTransition(async () => {
                    setError(null);
                    const save = await saveCharterDraftAction({
                      clubId,
                      charterId: id,
                      schoolYear,
                      draftStep: step,
                      sections,
                    });
                    if (!save.ok) {
                      setError(save.error.message);
                      return;
                    }
                    const result = await submitCharterAction({
                      clubId,
                      charterId: id,
                    });
                    if (!result.ok) {
                      setError(result.error.message);
                      return;
                    }
                    setMessage("Submitted — immutable version frozen");
                    router.refresh();
                  });
                }}
              >
                Submit charter
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className="space-y-3">
        <h3 className="font-semibold">Version history</h3>
        {versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Submitted versions appear here as immutable snapshots.
          </p>
        ) : (
          <ul className="space-y-2">
            {versions.map((version) => (
              <li
                key={version.id}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
              >
                Frozen v{version.version_number} ·{" "}
                <span className="capitalize">
                  {version.status_at_freeze.replaceAll("_", " ")}
                </span>{" "}
                · {new Date(version.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}
    </div>
  );
}
