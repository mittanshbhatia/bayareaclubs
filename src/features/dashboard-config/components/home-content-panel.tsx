"use client";

import { useMemo, useState, useTransition } from "react";

import { EmptyState, ErrorState } from "@/components/ds/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteHomeContentAction,
  upsertHomeContentAction,
} from "@/features/dashboard-config/actions";
import type { FeaturedOption, HomeContentListItem } from "@/features/dashboard-config/types";
import {
  DASHBOARD_HOME_MODULE_TYPES,
  type DashboardHomeModuleType,
} from "@/lib/validation/dashboard-home-content";

const TYPE_LABELS: Record<DashboardHomeModuleType, string> = {
  announcement: "Announcement",
  featured_courses: "Featured courses",
  featured_resources: "Featured resources",
  featured_events: "Featured events",
  deadline: "Deadline",
  school_message: "School message",
};

function payloadPreview(item: HomeContentListItem) {
  const payload = item.payload;
  if (!payload || typeof payload !== "object") return item.body;
  const record = payload as Record<string, unknown>;
  if (typeof record.title === "string") return record.title;
  if (Array.isArray(record.courseIds)) {
    return `${record.courseIds.length} course${record.courseIds.length === 1 ? "" : "s"}`;
  }
  if (Array.isArray(record.eventIds)) {
    return `${record.eventIds.length} event${record.eventIds.length === 1 ? "" : "s"}`;
  }
  return item.body;
}

export function HomeContentPanel({
  scopeType,
  schoolId,
  clubId,
  persistenceAvailable,
  items,
  publishedCourses,
  publishedResources,
  publishedEvents,
}: {
  scopeType: "global" | "school" | "club";
  schoolId: string | null;
  clubId: string | null;
  persistenceAvailable: boolean;
  items: HomeContentListItem[];
  publishedCourses: FeaturedOption[];
  publishedResources: FeaturedOption[];
  publishedEvents: FeaturedOption[];
}) {
  const [moduleType, setModuleType] =
    useState<DashboardHomeModuleType>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [href, setHref] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const typeLocked =
    moduleType === "school_message" && scopeType !== "school";

  const pickerOptions = useMemo(() => {
    if (moduleType === "featured_courses") return publishedCourses;
    if (moduleType === "featured_resources") return publishedResources;
    if (moduleType === "featured_events") return publishedEvents;
    return [];
  }, [
    moduleType,
    publishedCourses,
    publishedEvents,
    publishedResources,
  ]);

  function resetForm() {
    setTitle("");
    setBody("");
    setDueAt("");
    setHref("");
    setSelectedIds([]);
  }

  function buildPayload() {
    if (moduleType === "announcement" || moduleType === "school_message") {
      return { title, body };
    }
    if (moduleType === "deadline") {
      const due = dueAt ? new Date(dueAt).toISOString() : "";
      return { title, dueAt: due, href: href || undefined };
    }
    if (moduleType === "featured_events") {
      return { eventIds: selectedIds };
    }
    return { courseIds: selectedIds };
  }

  function onSubmit() {
    setError(null);
    setSuccess(null);
    if (typeLocked) {
      setError("School messages can only be saved on a school scope.");
      return;
    }
    startTransition(async () => {
      const result = await upsertHomeContentAction({
        moduleType,
        scopeType,
        schoolId,
        clubId,
        enabled: true,
        displayOrder: items.length * 10,
        payload: buildPayload(),
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      resetForm();
      setSuccess("Home content saved. It is stored as plain text only.");
    });
  }

  function onDelete(id: string) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteHomeContentAction({ id });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setSuccess("Home content removed.");
    });
  }

  const saveDisabled =
    !persistenceAvailable || pending || typeLocked;

  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs">
      <div>
        <h3 className="font-semibold">Home content modules</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Typed modules only. Bodies are sanitized plain text and rendered as
          React text—never as HTML.
        </p>
      </div>

      {!persistenceAvailable ? (
        <p className="text-sm text-muted-foreground" role="status">
          Saving is unavailable until <code>dashboard_home_content</code> exists.
        </p>
      ) : null}

      {error ? (
        <ErrorState
          title="Could not save home content"
          description={error}
          className="py-6"
        />
      ) : null}
      {success ? (
        <p className="text-sm text-success" role="status">
          {success}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="home-module-type">Module type</Label>
          <Select
            value={moduleType}
            onValueChange={(value) => {
              setModuleType(value as DashboardHomeModuleType);
              setSelectedIds([]);
            }}
          >
            <SelectTrigger id="home-module-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DASHBOARD_HOME_MODULE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {typeLocked ? (
            <p className="text-xs text-muted-foreground">
              Switch the scope to a school before adding a school message.
            </p>
          ) : null}
        </div>

        {moduleType === "announcement" ||
        moduleType === "school_message" ||
        moduleType === "deadline" ? (
          <div className="space-y-2">
            <Label htmlFor="home-title">Title</Label>
            <Input
              id="home-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={160}
              autoComplete="off"
            />
          </div>
        ) : null}

        {moduleType === "announcement" || moduleType === "school_message" ? (
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="home-body">Body</Label>
            <Textarea
              id="home-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={4000}
              rows={5}
            />
          </div>
        ) : null}

        {moduleType === "deadline" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="home-due">Due at</Label>
              <Input
                id="home-due"
                type="datetime-local"
                value={dueAt}
                onChange={(event) => setDueAt(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="home-href">Optional link</Label>
              <Input
                id="home-href"
                value={href}
                onChange={(event) => setHref(event.target.value)}
                placeholder="/dashboard or https://"
                autoComplete="off"
              />
            </div>
          </>
        ) : null}

        {pickerOptions.length > 0 ? (
          <fieldset className="space-y-2 lg:col-span-2">
            <legend className="text-sm font-medium">Published items</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {pickerOptions.map((option) => {
                const checked = selectedIds.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex items-start gap-2 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                        setSelectedIds((current) =>
                          value === true
                            ? [...current, option.id]
                            : current.filter((id) => id !== option.id),
                        );
                      }}
                    />
                    <span>{option.title}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : moduleType.startsWith("featured_") ? (
          <p className="text-sm text-muted-foreground lg:col-span-2">
            No published items are available to feature.
          </p>
        ) : null}
      </div>

      <Button type="button" onClick={onSubmit} disabled={saveDisabled}>
        {pending ? "Saving…" : "Save home content"}
      </Button>

      {items.length === 0 ? (
        <EmptyState
          compact
          title="No home content for this scope"
          description="Add an announcement, deadline, or featured list. HTML is rejected."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border px-3 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{TYPE_LABELS[item.moduleType]}</p>
                  <Badge variant={item.enabled ? "success" : "outline"}>
                    {item.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {payloadPreview(item)}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!persistenceAvailable || pending}
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
