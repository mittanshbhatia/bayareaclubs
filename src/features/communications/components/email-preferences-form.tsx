"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateEmailPreference } from "@/features/communications/preference-actions";

const CATEGORIES = [
  { key: "announcement", label: "Club announcements" },
  { key: "newsletter", label: "Newsletters" },
  { key: "event_promotion", label: "Event promotions" },
  { key: "highlight_digest", label: "Highlight digests" },
] as const;

export function EmailPreferencesForm({
  initial,
}: {
  initial: Record<string, boolean>;
}) {
  const [prefs, setPrefs] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-10 max-w-xl space-y-4 rounded-lg border border-border bg-surface p-4 shadow-xs">
      <div>
        <h2 className="font-display text-lg font-semibold">Email preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Transactional messages (invites, approvals, charter/renewal status)
          are always delivered. Club marketing categories can be opted out.
        </p>
      </div>
      <ul className="space-y-3">
        {CATEGORIES.map((category) => (
          <li
            key={category.key}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span>{category.label}</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={prefs[category.key] ?? true}
                disabled={pending}
                onChange={(e) => {
                  const optedIn = e.target.checked;
                  setPrefs((current) => ({ ...current, [category.key]: optedIn }));
                  startTransition(async () => {
                    const result = await updateEmailPreference({
                      category: category.key,
                      optedIn,
                    });
                    setMessage(
                      result.ok
                        ? "Preferences saved."
                        : result.error.message,
                    );
                  });
                }}
              />
              Opted in
            </label>
          </li>
        ))}
      </ul>
      {message ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      ) : null}
      <Button type="button" variant="outline" disabled>
        Transactional email (required)
      </Button>
    </div>
  );
}
