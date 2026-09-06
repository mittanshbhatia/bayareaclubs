"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertSchoolAction } from "@/features/admin/actions";
import { slugFromName } from "@/lib/validation/admin";

type SchoolFormValues = {
  id?: string;
  name: string;
  slug: string;
  level: "elementary" | "middle" | "high" | "college" | "other";
  city: string;
  stateCode: string;
  timezone: string;
  websiteUrl: string;
  emailDomain: string;
  isActive: boolean;
};

const emptyValues: SchoolFormValues = {
  name: "",
  slug: "",
  level: "high",
  city: "",
  stateCode: "CA",
  timezone: "America/Los_Angeles",
  websiteUrl: "",
  emailDomain: "",
  isActive: true,
};

export function SchoolFormDialog({
  initial,
  triggerLabel = "Add school",
}: {
  initial?: SchoolFormValues;
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<SchoolFormValues>(
    initial ?? emptyValues,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof SchoolFormValues>(
    key: K,
    value: SchoolFormValues[K],
  ) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !initial?.slug) {
        next.slug = slugFromName(String(value));
      }
      return next;
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(null);
        if (next) setValues(initial ?? emptyValues);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant={initial ? "outline" : "default"} size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit school" : "Add school"}</DialogTitle>
          <DialogDescription>
            Store institutional details only. Do not collect or store student
            home locations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2 sm:grid-cols-2">
          <Field label="Name" htmlFor="school-name" className="sm:col-span-2">
            <Input
              id="school-name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </Field>
          <Field label="Slug" htmlFor="school-slug">
            <Input
              id="school-slug"
              value={values.slug}
              onChange={(event) => update("slug", event.target.value)}
            />
          </Field>
          <Field label="Type" htmlFor="school-level">
            <Select
              value={values.level}
              onValueChange={(value) =>
                update("level", value as SchoolFormValues["level"])
              }
            >
              <SelectTrigger id="school-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">Elementary</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="City" htmlFor="school-city">
            <Input
              id="school-city"
              value={values.city}
              onChange={(event) => update("city", event.target.value)}
            />
          </Field>
          <Field label="State" htmlFor="school-state">
            <Input
              id="school-state"
              value={values.stateCode}
              maxLength={2}
              onChange={(event) =>
                update("stateCode", event.target.value.toUpperCase())
              }
            />
          </Field>
          <Field label="Timezone" htmlFor="school-tz" className="sm:col-span-2">
            <Input
              id="school-tz"
              value={values.timezone}
              onChange={(event) => update("timezone", event.target.value)}
            />
          </Field>
          <Field
            label="Email domain (optional)"
            htmlFor="school-domain"
            className="sm:col-span-2"
          >
            <Input
              id="school-domain"
              value={values.emailDomain}
              placeholder="school.edu"
              onChange={(event) => update("emailDomain", event.target.value)}
            />
          </Field>
          <Field
            label="Website (optional)"
            htmlFor="school-web"
            className="sm:col-span-2"
          >
            <Input
              id="school-web"
              value={values.websiteUrl}
              placeholder="https://"
              onChange={(event) => update("websiteUrl", event.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => update("isActive", event.target.checked)}
            />
            School is active
          </label>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await upsertSchoolAction({
                  id: values.id,
                  name: values.name,
                  slug: values.slug,
                  level: values.level,
                  city: values.city,
                  stateCode: values.stateCode,
                  timezone: values.timezone,
                  websiteUrl: values.websiteUrl || null,
                  emailDomain: values.emailDomain || null,
                  isActive: values.isActive,
                });
                if (!result.ok) {
                  setError(result.error.message);
                  return;
                }
                setOpen(false);
                router.refresh();
              });
            }}
          >
            {pending ? "Saving…" : "Save school"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
