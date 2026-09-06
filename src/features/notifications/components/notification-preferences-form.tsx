"use client";

import { useState, useTransition } from "react";

import { updateNotificationPreferenceAction } from "@/features/notifications/actions";
import {
  NOTIFICATION_CATEGORY_LABELS,
  OPTIONAL_NOTIFICATION_CATEGORIES,
} from "@/lib/validation/notifications";

export function NotificationPreferencesForm({
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
        <h2 className="font-display text-lg font-semibold">
          In-app notification preferences
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Club ideas, membership, and charter/renewal notices stay on. You can
          mute optional event, newsletter, and STEM recommendation alerts.
        </p>
      </div>
      <ul className="space-y-3">
        {OPTIONAL_NOTIFICATION_CATEGORIES.map((category) => (
          <li
            key={category}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span>{NOTIFICATION_CATEGORY_LABELS[category]}</span>
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {prefs[category] !== false ? "On" : "Off"}
              </span>
              <input
                type="checkbox"
                checked={prefs[category] !== false}
                disabled={pending}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setPrefs((current) => ({ ...current, [category]: enabled }));
                  startTransition(async () => {
                    const result = await updateNotificationPreferenceAction({
                      category,
                      inAppEnabled: enabled,
                    });
                    if (!result.ok) {
                      setPrefs((current) => ({
                        ...current,
                        [category]: !enabled,
                      }));
                      setMessage(result.error.message);
                      return;
                    }
                    setMessage("Preferences saved.");
                  });
                }}
              />
            </label>
          </li>
        ))}
      </ul>
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
