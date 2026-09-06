"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAdminCourse, setAdminCourseStatus } from "@/features/stem/actions";
import {
  COURSE_DIFFICULTIES,
  COURSE_DIFFICULTY_LABELS,
  COURSE_FORMAT_LABELS,
  COURSE_FORMATS,
  COURSE_STATUSES,
  GRADE_BAND_LABELS,
  GRADE_BANDS,
  RESOURCE_TYPES,
  STEM_DISCIPLINE_LABELS,
  STEM_DISCIPLINES,
  type AdminCourseInput,
} from "@/lib/validation/stem";

type ModuleDraft = AdminCourseInput["modules"][number];

function emptyModule(): ModuleDraft {
  return {
    title: "Getting started",
    description: "",
    estimatedMinutes: 60,
    resources: [
      {
        title: "Open free curriculum",
        description: "External free resource. BayAreaClubs stores metadata and link only.",
        resourceType: "external_link",
        externalUrl: "https://",
        estimatedMinutes: 30,
      },
    ],
  };
}

export function AdminCourseEditor({
  initial,
  courseId,
  status,
}: {
  initial?: AdminCourseInput;
  courseId?: string;
  status?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCourseInput>(
    initial ?? {
      slug: "",
      title: "",
      description: "",
      discipline: "computer_science",
      gradeBands: ["age_13_17"],
      difficulty: "beginner",
      format: "self_paced",
      estimatedMinutes: 120,
      providerName: "",
      sourceUrl: "https://",
      licenseName: "",
      licenseUrl: "",
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
      isFree: true,
      modules: [emptyModule()],
    },
  );

  function updateModule(index: number, patch: Partial<ModuleDraft>) {
    setForm((current) => ({
      ...current,
      modules: current.modules.map((module, i) =>
        i === index ? { ...module, ...patch } : module,
      ),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Input
            id="provider"
            value={form.providerName}
            onChange={(event) =>
              setForm({ ...form, providerName: event.target.value })
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discipline">Subject</Label>
          <select
            id="discipline"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.discipline}
            onChange={(event) =>
              setForm({
                ...form,
                discipline: event.target.value as AdminCourseInput["discipline"],
              })
            }
          >
            {STEM_DISCIPLINES.filter((item) => item !== "other").map((item) => (
              <option key={item} value={item}>
                {STEM_DISCIPLINE_LABELS[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.difficulty}
            onChange={(event) =>
              setForm({
                ...form,
                difficulty: event.target
                  .value as AdminCourseInput["difficulty"],
              })
            }
          >
            {COURSE_DIFFICULTIES.map((item) => (
              <option key={item} value={item}>
                {COURSE_DIFFICULTY_LABELS[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <select
            id="format"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.format}
            onChange={(event) =>
              setForm({
                ...form,
                format: event.target.value as AdminCourseInput["format"],
              })
            }
          >
            {COURSE_FORMATS.map((item) => (
              <option key={item} value={item}>
                {COURSE_FORMAT_LABELS[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="effort">Estimated minutes</Label>
          <Input
            id="effort"
            type="number"
            min={1}
            value={form.estimatedMinutes ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                estimatedMinutes: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source URL</Label>
          <Input
            id="source"
            value={form.sourceUrl}
            onChange={(event) =>
              setForm({ ...form, sourceUrl: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="verified">Last verified</Label>
          <Input
            id="verified"
            type="date"
            value={form.lastVerifiedAt}
            onChange={(event) =>
              setForm({ ...form, lastVerifiedAt: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="license">License / terms</Label>
          <Input
            id="license"
            value={form.licenseName}
            onChange={(event) =>
              setForm({ ...form, licenseName: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="license-url">License URL</Label>
          <Input
            id="license-url"
            value={form.licenseUrl ?? ""}
            onChange={(event) =>
              setForm({ ...form, licenseUrl: event.target.value })
            }
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Grade bands</legend>
        <div className="flex flex-wrap gap-3">
          {GRADE_BANDS.map((band) => {
            const checked = form.gradeBands.includes(band);
            return (
              <label key={band} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setForm((current) => ({
                      ...current,
                      gradeBands: checked
                        ? current.gradeBands.filter((item) => item !== band)
                        : [...current.gradeBands, band],
                    }));
                  }}
                />
                {GRADE_BAND_LABELS[band]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-muted-foreground">
        Free status is required. Do not upload copyrighted third-party course
        content. External resources are metadata + https links; BayAreaClubs-owned
        files use the private course-assets bucket.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Modules & lessons</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((current) => ({
                ...current,
                modules: [...current.modules, emptyModule()],
              }))
            }
          >
            Add module
          </Button>
        </div>
        {form.modules.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className="space-y-3 rounded-lg border border-border p-4"
          >
            <Input
              value={module.title}
              onChange={(event) =>
                updateModule(moduleIndex, { title: event.target.value })
              }
              placeholder="Module title"
            />
            <Input
              value={module.description ?? ""}
              onChange={(event) =>
                updateModule(moduleIndex, { description: event.target.value })
              }
              placeholder="Module description"
            />
            {module.resources.map((resource, resourceIndex) => (
              <div
                key={resourceIndex}
                className="grid gap-2 rounded-md border border-border/70 p-3 sm:grid-cols-2"
              >
                <Input
                  value={resource.title}
                  onChange={(event) => {
                    const resources = module.resources.map((item, index) =>
                      index === resourceIndex
                        ? { ...item, title: event.target.value }
                        : item,
                    );
                    updateModule(moduleIndex, { resources });
                  }}
                  placeholder="Lesson title"
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={resource.resourceType}
                  onChange={(event) => {
                    const resources = module.resources.map((item, index) =>
                      index === resourceIndex
                        ? {
                            ...item,
                            resourceType: event.target
                              .value as ModuleDraft["resources"][number]["resourceType"],
                          }
                        : item,
                    );
                    updateModule(moduleIndex, { resources });
                  }}
                >
                  {RESOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <Input
                  className="sm:col-span-2"
                  value={resource.externalUrl ?? ""}
                  onChange={(event) => {
                    const resources = module.resources.map((item, index) =>
                      index === resourceIndex
                        ? { ...item, externalUrl: event.target.value }
                        : item,
                    );
                    updateModule(moduleIndex, { resources });
                  }}
                  placeholder="https:// external lesson URL"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveAdminCourse({
                ...form,
                courseId,
                isFree: true,
              });
              setMessage(result.ok ? "Draft saved." : result.error.message);
              if (result.ok) {
                router.push(`/dashboard/platform/stem/${result.data.courseId}`);
                router.refresh();
              }
            });
          }}
        >
          Save draft
        </Button>
        {courseId
          ? COURSE_STATUSES.map((nextStatus) => (
              <Button
                key={nextStatus}
                variant="outline"
                disabled={pending || status === nextStatus}
                onClick={() => {
                  startTransition(async () => {
                    const result = await setAdminCourseStatus({
                      courseId,
                      status: nextStatus,
                    });
                    setMessage(
                      result.ok
                        ? `Status set to ${nextStatus}.`
                        : result.error.message,
                    );
                    router.refresh();
                  });
                }}
              >
                {nextStatus}
              </Button>
            ))
          : null}
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
