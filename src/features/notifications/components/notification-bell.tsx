"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/notifications/actions";
import type { InAppNotification } from "@/features/notifications/queries";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/validation/notifications";

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function NotificationBell({
  userId,
  initialNotifications,
  initialUnreadCount,
}: {
  userId: string;
  initialNotifications: InAppNotification[];
  initialUnreadCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // Narrow Realtime subscription: this user's notification rows only.
    // Do not attach broad table listeners from arbitrary dashboard widgets.
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            notification_type: string;
            title: string;
            body: string;
            action_url: string | null;
            club_id: string | null;
            school_id: string | null;
            entity_type: string | null;
            entity_id: string | null;
            read_at: string | null;
            created_at: string;
            payload: Record<string, unknown> | null;
          };
          const next: InAppNotification = {
            id: row.id,
            type: row.notification_type,
            title: row.title,
            body: row.body,
            actionUrl: row.action_url,
            clubId: row.club_id,
            schoolId: row.school_id,
            entityType: row.entity_type,
            entityId: row.entity_id,
            readAt: row.read_at,
            createdAt: row.created_at,
            payload: row.payload ?? {},
          };
          setItems((current) => {
            if (current.some((item) => item.id === next.id)) return current;
            return [next, ...current].slice(0, 40);
          });
          if (!next.readAt) {
            setUnreadCount((count) => count + 1);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as { id: string; read_at: string | null };
          setItems((current) => {
            const previous = current.find((item) => item.id === row.id);
            if (previous && !previous.readAt && row.read_at) {
              setUnreadCount((count) => Math.max(0, count - 1));
            }
            return current.map((item) =>
              item.id === row.id ? { ...item, readAt: row.read_at } : item,
            );
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  function markOne(notification: InAppNotification) {
    if (notification.readAt) return;
    startTransition(async () => {
      setItems((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      await markNotificationReadAction({ notificationId: notification.id });
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell aria-hidden className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0 sm:w-[26rem]">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <p className="font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Persistent inbox · live updates for new items
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending || unreadCount === 0}
            onClick={() => {
              startTransition(async () => {
                setUnreadCount(0);
                setItems((current) =>
                  current.map((item) => ({
                    ...item,
                    readAt: item.readAt ?? new Date().toISOString(),
                  })),
                );
                await markAllNotificationsReadAction();
                router.refresh();
              });
            }}
          >
            Mark all read
          </Button>
        </div>
        <ul className="max-h-[24rem] overflow-y-auto">
          {items.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </li>
          ) : (
            items.map((item) => {
              const deepLink = item.actionUrl;
              const content = (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground">{item.title}</p>
                    {!item.readAt ? (
                      <span
                        aria-label="Unread"
                        className="mt-1 size-2 shrink-0 rounded-full bg-primary"
                      />
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type} ·{" "}
                    {formatWhen(item.createdAt)}
                  </p>
                </>
              );
              return (
                <li key={item.id} className="border-b border-border last:border-b-0">
                  {deepLink ? (
                    <Link
                      href={deepLink}
                      className={cn(
                        "block px-4 py-3 transition-colors hover:bg-surface-muted/60",
                        !item.readAt && "bg-surface-muted/30",
                      )}
                      onClick={() => {
                        markOne(item);
                        setOpen(false);
                      }}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={cn(
                        "block w-full px-4 py-3 text-left transition-colors hover:bg-surface-muted/60",
                        !item.readAt && "bg-surface-muted/30",
                      )}
                      onClick={() => markOne(item)}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>
        <div className="border-t border-border px-4 py-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/dashboard/notifications" onClick={() => setOpen(false)}>
              Open notification center
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
