"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertIdeaToClubAction } from "@/features/ideas/actions";

type Props = {
  ideaId: string;
  defaultName: string;
  defaultSlug: string;
  schoolName: string;
  description: string;
  mission: string;
  category: string;
  gradeMin: number | null;
  gradeMax: number | null;
  officers: string[];
  advisorLabel: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function CreateClubConfirmForm({
  ideaId,
  defaultName,
  defaultSlug,
  schoolName,
  description,
  mission,
  category,
  gradeMin,
  gradeMax,
  officers,
  advisorLabel,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(defaultSlug || slugify(defaultName));
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function onConvert() {
    if (!confirmed) {
      setError("Confirm the club details before creating.");
      return;
    }
    startTransition(async () => {
      const result = await convertIdeaToClubAction({
        ideaId,
        confirmName: name,
        slug,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.push(`/dashboard/clubs/${result.data.clubId}/onboarding`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">School</dt>
          <dd className="font-medium">{schoolName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="font-medium">{category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Grade scope</dt>
          <dd className="font-medium">
            {gradeMin ?? "—"}–{gradeMax ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Advisor</dt>
          <dd className="font-medium">{advisorLabel}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Description</dt>
          <dd className="mt-1">{description}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Mission</dt>
          <dd className="mt-1">{mission}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Initial officers</dt>
          <dd className="mt-1">{officers.join(", ") || "None listed"}</dd>
        </div>
      </dl>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <Label htmlFor="club-name">Club name</Label>
          <Input
            id="club-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(slugify(e.target.value));
            }}
          />
        </label>
        <label className="space-y-2">
          <Label htmlFor="club-slug">URL slug</Label>
          <Input
            id="club-slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <span>
          I confirm these details are correct. Creating the club cannot create a
          second club from the same approved idea.
        </span>
      </label>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="button" disabled={pending} onClick={onConvert}>
        Create club and continue onboarding
      </Button>
    </div>
  );
}
