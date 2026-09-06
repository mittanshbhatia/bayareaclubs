import Link from "next/link";

import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { markAllNotificationsReadFormAction } from "@/features/notifications/actions";
import { NotificationPreferencesForm } from "@/features/notifications/components/notification-preferences-form";
import {
  getMyNotificationPreferences,
  listMyNotifications,
} from "@/features/notifications/queries";
import { AuthorizationError } from "@/lib/auth/authorization";
import { handleAuthorizationError } from "@/lib/auth/route-guard";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/validation/notifications";

export const dynamic = "force-dynamic";

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function NotificationsPage() {
  let inbox;
  let preferences;
  try {
    [inbox, preferences] = await Promise.all([
      listMyNotifications(80),
      getMyNotificationPreferences(),
    ]);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      handleAuthorizationError(error, "/dashboard/notifications");
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            PostgreSQL is the source of truth. Live updates only surface new
            items for your account.
          </p>
        </div>
        <form action={markAllNotificationsReadFormAction}>
          <Button type="submit" variant="outline" size="sm">
            Mark all read
          </Button>
        </form>
      </div>

      {inbox.notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="Club ideas, invites, events, charters, renewals, newsletters, and course recommendations appear here."
        />
      ) : (
        <ul className="space-y-3">
          {inbox.notifications.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-border bg-surface p-4 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {item.actionUrl ? (
                      <Link href={item.actionUrl} className="hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type} ·{" "}
                    {formatWhen(item.createdAt)}
                    {item.readAt ? "" : " · Unread"}
                  </p>
                </div>
                {item.actionUrl ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={item.actionUrl}>Open</Link>
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <NotificationPreferencesForm initial={preferences} />
    </div>
  );
}
