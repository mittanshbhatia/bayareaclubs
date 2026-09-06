"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateClubSettingsAction } from "@/features/clubs/actions";

type Settings = {
  name: string;
  description: string;
  mission: string;
  category: string;
  meetingCadence: string;
  publicSummary: string;
  visibility: "public" | "school" | "club" | "private";
};

export function ClubSettingsForm({
  clubId,
  initial,
}: {
  clubId: string;
  initial: Settings;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setError(null);
          setMessage(null);
          const result = await updateClubSettingsAction({
            clubId,
            name: form.name,
            description: form.description,
            mission: form.mission,
            category: form.category,
            meetingCadence: form.meetingCadence,
            publicSummary: form.publicSummary,
            visibility: form.visibility,
          });
          if (!result.ok) {
            setError(result.error.message);
            return;
          }
          setMessage("Settings saved");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="club-name">Name</Label>
          <Input
            id="club-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="club-category">Category</Label>
          <Input
            id="club-category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="club-visibility">Discoverability</Label>
          <select
            id="club-visibility"
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
            value={form.visibility}
            onChange={(e) =>
              update(
                "visibility",
                e.target.value as Settings["visibility"],
              )
            }
          >
            <option value="private">Private</option>
            <option value="club">Club members</option>
            <option value="school">School</option>
            <option value="public">Public (school admin approval)</option>
          </select>
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="club-description">Description</Label>
          <Textarea
            id="club-description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="club-mission">Mission</Label>
          <Textarea
            id="club-mission"
            value={form.mission}
            onChange={(e) => update("mission", e.target.value)}
            rows={3}
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="club-summary">Public summary</Label>
          <Textarea
            id="club-summary"
            value={form.publicSummary}
            onChange={(e) => update("publicSummary", e.target.value)}
            rows={2}
            maxLength={500}
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="club-cadence">Meeting cadence</Label>
          <Input
            id="club-cadence"
            value={form.meetingCadence}
            onChange={(e) => update("meetingCadence", e.target.value)}
            placeholder="e.g. Wednesdays 3:30–4:30 PM"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        Logo and branding assets are managed from Media. Advisor assignment is
        managed from Members. Public discoverability requires school administrator
        approval.
      </p>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}

      <Button type="submit" disabled={pending}>
        Save settings
      </Button>
    </form>
  );
}
