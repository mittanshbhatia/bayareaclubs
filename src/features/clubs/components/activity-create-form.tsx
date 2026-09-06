"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createActivityAction } from "@/features/clubs/actions";

type MemberOption = { id: string; label: string };
type EventOption = { id: string; title: string };

export function ActivityCreateForm({
  clubId,
  members,
  events,
}: {
  clubId: string;
  members: MemberOption[];
  events: EventOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Meeting");
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [outcomes, setOutcomes] = useState("");
  const [relatedEventId, setRelatedEventId] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  function toggleParticipant(id: string) {
    setParticipants((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-xs"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setError(null);
          const result = await createActivityAction({
            clubId,
            title,
            description,
            category,
            activityDate,
            outcomes,
            relatedEventId: relatedEventId || null,
            participantMembershipIds: participants,
            mediaAssetIds: [],
          });
          if (!result.ok) {
            setError(result.error.message);
            return;
          }
          setTitle("");
          setDescription("");
          setOutcomes("");
          setParticipants([]);
          router.refresh();
        });
      }}
    >
      <h2 className="font-semibold">Log activity</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="activity-title">Title</Label>
          <Input
            id="activity-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="activity-date">Date</Label>
          <Input
            id="activity-date"
            type="date"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="activity-category">Category</Label>
          <Input
            id="activity-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="activity-description">Description</Label>
          <Textarea
            id="activity-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="activity-outcomes">Outcomes / highlights</Label>
          <Textarea
            id="activity-outcomes"
            value={outcomes}
            onChange={(e) => setOutcomes(e.target.value)}
            rows={3}
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <Label htmlFor="related-event">Related event</Label>
          <select
            id="related-event"
            className="min-h-11 w-full rounded-md border border-border bg-surface px-3"
            value={relatedEventId}
            onChange={(e) => setRelatedEventId(e.target.value)}
          >
            <option value="">None</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Participants</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {members.map((member) => (
            <label key={member.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={participants.includes(member.id)}
                onChange={() => toggleParticipant(member.id)}
              />
              {member.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-muted-foreground">
        Media attachments can be linked after upload in the Media section.
      </p>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        Save activity
      </Button>
    </form>
  );
}
