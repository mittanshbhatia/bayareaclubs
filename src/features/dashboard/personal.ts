import "server-only";

import {
  isClubOfficerRole as isPersistedClubOfficerRole,
  isSchoolDashboardRole,
  resolveDashboardContext,
  type DashboardActor,
  type DashboardResolvedContext,
} from "@/features/dashboard/context";
import { listMyIdeas, type IdeaListItem } from "@/features/ideas/queries";
import { getMyLearnProgress, listPublishedApCatalog } from "@/features/learn/queries";
import { listMyNotifications, type InAppNotification } from "@/features/notifications/queries";
import { listMyLearning } from "@/features/stem/queries";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.generated";

type ClubRole = Database["public"]["Enums"]["club_role"];
type SchoolRole = Database["public"]["Enums"]["school_role"];
type RsvpStatus = Database["public"]["Enums"]["rsvp_status"];

export const IDEA_ACTION_STATUSES = ["draft", "changes_requested"] as const;

const RSVP_ATTENDING: readonly RsvpStatus[] = ["going", "maybe", "waitlisted"];

export type PersonalClub = {
  id: string;
  name: string;
  slug: string | null;
  role: ClubRole;
  href: string | null;
};

export type PersonalSchool = {
  id: string;
  name: string;
  role: SchoolRole;
  dashboardHref: string | null;
};

export type PersonalLearningItem = {
  subscriptionId: string;
  title: string;
  href: string;
  status: string;
  completedCount: number;
  nextLessonTitle: string | null;
  kind: "stem" | "ap";
};

export type MyDayItem = {
  id: string;
  kind: "event" | "idea" | "learning";
  title: string;
  detail: string;
  href: string | null;
};

export type QuickAction = {
  id: string;
  label: string;
  href: string;
};

export type PersonalHomeModel = {
  displayName: string;
  contextLabel: string;
  schools: PersonalSchool[];
  clubs: PersonalClub[];
  learning: PersonalLearningItem[];
  learningLinks: { href: string; label: string }[];
  myDay: MyDayItem[];
  notifications: InAppNotification[];
  unreadNotificationCount: number;
  quickActions: QuickAction[];
};

type ClubRef = { id?: string; name?: string; slug?: string } | null | undefined;

export function isClubOfficerRole(role: string): boolean {
  return isPersistedClubOfficerRole(role as ClubRole);
}

export function clubWorkspaceHref(role: string, club: ClubRef): string | null {
  if (!club?.id) return null;
  if (isClubOfficerRole(role) && club.slug) return `/clubs/${club.slug}`;
  return `/dashboard/clubs/${club.id}/attendance`;
}

export function ideaNeedsAction(status: string): boolean {
  return (IDEA_ACTION_STATUSES as readonly string[]).includes(status);
}

export function wouldPassSchoolDashboardAccess(input: {
  isPlatformAdmin: boolean;
  schoolRole: string | null;
}): boolean {
  if (input.isPlatformAdmin) return true;
  return input.schoolRole != null && isSchoolDashboardRole(input.schoolRole as SchoolRole);
}

export function learningCatalogLinks(input: { apLearnRouteExists: boolean }) {
  const links = [
    { href: "/dashboard/learning", label: "My STEM learning" },
    { href: "/resources", label: "STEM catalog" },
  ];
  if (input.apLearnRouteExists) {
    links.unshift({ href: "/dashboard/learn", label: "AP catalog" });
  }
  return links;
}

export function buildQuickActions(input: {
  isPlatformAdmin: boolean;
  isCommitteeReviewer: boolean;
  schools: Array<{ id: string; name: string; role: string }>;
}): QuickAction[] {
  const actions: QuickAction[] = [
    {
      id: "start-idea",
      label: "Start a club idea",
      href: "/start-a-club",
    },
  ];

  if (input.isCommitteeReviewer || input.isPlatformAdmin) {
    actions.push({
      id: "review-queue",
      label: "Review queue",
      href: "/admin/ideas",
    });
  }

  if (input.isPlatformAdmin) {
    actions.push({
      id: "admin",
      label: "Administration",
      href: "/admin",
    });
  }

  for (const school of input.schools) {
    if (
      !wouldPassSchoolDashboardAccess({
        isPlatformAdmin: input.isPlatformAdmin,
        schoolRole: school.role,
      })
    ) {
      continue;
    }
    actions.push({
      id: `school-${school.id}`,
      label: `School dashboard · ${school.name}`,
      href: `/dashboard/schools/${school.id}`,
    });
  }

  return actions;
}

export function selectIdeaNeedingAction(
  ideas: Array<Pick<IdeaListItem, "id" | "title" | "status">>,
): Pick<IdeaListItem, "id" | "title" | "status"> | null {
  const actionable = ideas.filter((idea) => ideaNeedsAction(idea.status));
  return (
    actionable.find((idea) => idea.status === "changes_requested") ??
    actionable[0] ??
    null
  );
}

export function selectNextLearning(
  items: Array<{
    subscription: { id: string; status: string };
    course: { title: string | null; slug: string | null } | null;
    nextResource: { title: string } | null;
    completedCount: number;
  }>,
): PersonalLearningItem | null {
  const withNext = items.find((item) => item.nextResource && item.course);
  const fallback = items.find((item) => item.course);
  const chosen = withNext ?? fallback;
  if (!chosen?.course) return null;
  return {
    subscriptionId: chosen.subscription.id,
    title: chosen.course.title ?? "Course",
    href: chosen.course.slug
      ? `/resources/${chosen.course.slug}`
      : "/dashboard/learning",
    status: chosen.subscription.status,
    completedCount: chosen.completedCount,
    nextLessonTitle: chosen.nextResource?.title ?? null,
    kind: "stem",
  };
}

export function selectNextApLearning(
  progress: Array<{
    title: string;
    namespace: string;
    attemptCount: number;
  }>,
): PersonalLearningItem | null {
  const next = progress.find((row) => row.namespace);
  if (!next) return null;
  return {
    subscriptionId: `ap-${next.namespace}`,
    title: next.title,
    href: `/dashboard/learn/ap/${next.namespace}`,
    status: "active",
    completedCount: next.attemptCount,
    nextLessonTitle: "Continue AP practice",
    kind: "ap",
  };
}

export function buildMyDayItems(input: {
  nextEvent: {
    id: string;
    title: string;
    startsAt: string;
    clubName: string | null;
    href: string | null;
    rsvpStatus: string | null;
  } | null;
  idea: Pick<IdeaListItem, "id" | "title" | "status"> | null;
  learning: PersonalLearningItem | null;
}): MyDayItem[] {
  const items: MyDayItem[] = [];

  if (input.nextEvent) {
    items.push({
      id: `event-${input.nextEvent.id}`,
      kind: "event",
      title: input.nextEvent.title,
      detail: [
        input.nextEvent.clubName,
        formatWhen(input.nextEvent.startsAt),
        input.nextEvent.rsvpStatus
          ? `RSVP ${input.nextEvent.rsvpStatus.replaceAll("_", " ")}`
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      href: input.nextEvent.href,
    });
  }

  if (input.idea) {
    items.push({
      id: `idea-${input.idea.id}`,
      kind: "idea",
      title: input.idea.title || "Untitled idea",
      detail:
        input.idea.status === "changes_requested"
          ? "Reviewer requested changes"
          : "Draft application needs your attention",
      href: `/start-a-club/${input.idea.id}`,
    });
  }

  if (input.learning) {
    items.push({
      id: `learning-${input.learning.subscriptionId}`,
      kind: "learning",
      title: input.learning.title,
      detail: input.learning.nextLessonTitle
        ? `Next: ${input.learning.nextLessonTitle}`
        : `${input.learning.completedCount} lessons complete`,
      href: input.learning.href,
    });
  }

  return items;
}

export function pickNextVisibleEvent<
  T extends {
    id: string;
    startsAt: string;
    rsvpStatus: string | null;
  },
>(events: T[]): T | null {
  const upcoming = events
    .filter((event) => Date.parse(event.startsAt) >= Date.now())
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return (
    upcoming.find(
      (event) =>
        event.rsvpStatus != null &&
        RSVP_ATTENDING.includes(event.rsvpStatus as RsvpStatus),
    ) ??
    upcoming[0] ??
    null
  );
}

export function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function clubsFromActor(actor: DashboardActor): PersonalClub[] {
  return actor.clubMemberships.map((club) => ({
    id: club.clubId,
    name: club.clubName,
    slug: club.clubSlug,
    role: club.role,
    href: clubWorkspaceHref(club.role, {
      id: club.clubId,
      name: club.clubName,
      slug: club.clubSlug,
    }),
  }));
}

function schoolsFromActor(actor: DashboardActor): PersonalSchool[] {
  return actor.schoolMemberships.map((school) => ({
    id: school.schoolId,
    name: school.schoolName,
    role: school.role,
    dashboardHref: wouldPassSchoolDashboardAccess({
      isPlatformAdmin: actor.isPlatformAdmin,
      schoolRole: school.role,
    })
      ? `/dashboard/schools/${school.schoolId}`
      : null,
  }));
}

export async function loadPersonalHome(
  resolved?: DashboardResolvedContext,
): Promise<PersonalHomeModel> {
  const context =
    resolved ?? (await resolveDashboardContext({ hint: { type: "personal" } }));
  const { actor } = context;
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const [profileResult, ideas, learning, inbox, apCatalog, apProgress] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", actor.userId)
        .maybeSingle(),
      listMyIdeas(actor.userId).catch(() => []),
      listMyLearning(actor.userId).catch(() => []),
      listMyNotifications(8).catch(() => ({
        notifications: [],
        unreadCount: 0,
      })),
      listPublishedApCatalog(1, 4).catch(() => ({
        page: 1,
        pageSize: 4,
        total: 0,
        pageCount: 1,
        courses: [],
      })),
      getMyLearnProgress().catch(() => []),
    ]);

  const clubs = clubsFromActor(actor);
  const schools = schoolsFromActor(actor);
  const clubById = new Map(clubs.map((club) => [club.id, club]));
  const clubIds = clubs.map((club) => club.id);

  const [visibleEventsResult, rsvpResult] = await Promise.all([
    clubIds.length
      ? supabase
          .from("events")
          .select("id, title, starts_at, club_id, clubs(name, slug)")
          .in("club_id", clubIds)
          .eq("status", "published")
          .gte("starts_at", nowIso)
          .order("starts_at", { ascending: true })
          .limit(8)
      : Promise.resolve({ data: [] as const, error: null }),
    supabase
      .from("event_rsvps")
      .select("status, event_id, events(id, title, starts_at, status, club_id, clubs(name, slug))")
      .eq("user_id", actor.userId)
      .in("status", [...RSVP_ATTENDING]),
  ]);

  const visibleEvents = visibleEventsResult.error
    ? []
    : (visibleEventsResult.data ?? []);
  const rsvps = rsvpResult.error ? [] : (rsvpResult.data ?? []);

  type EventCandidate = {
    id: string;
    title: string;
    startsAt: string;
    clubName: string | null;
    href: string | null;
    rsvpStatus: string | null;
  };

  const candidates = new Map<string, EventCandidate>();

  for (const event of visibleEvents) {
    const club = clubById.get(event.club_id);
    const related = unwrapRelation(event.clubs);
    candidates.set(event.id, {
      id: event.id,
      title: event.title,
      startsAt: event.starts_at,
      clubName: related?.name ?? club?.name ?? null,
      href:
        club && isClubOfficerRole(club.role) && club.slug
          ? `/clubs/${club.slug}/events/${event.id}`
          : null,
      rsvpStatus: null,
    });
  }

  for (const rsvp of rsvps) {
    const event = unwrapRelation(rsvp.events);
    if (!event?.id || event.status !== "published") continue;
    if (Date.parse(event.starts_at) < Date.now()) continue;
    const club = event.club_id ? clubById.get(event.club_id) : undefined;
    const related = unwrapRelation(event.clubs);
    const existing = candidates.get(event.id);
    candidates.set(event.id, {
      id: event.id,
      title: event.title,
      startsAt: event.starts_at,
      clubName: related?.name ?? existing?.clubName ?? club?.name ?? null,
      href:
        club && isClubOfficerRole(club.role) && club.slug
          ? `/clubs/${club.slug}/events/${event.id}`
          : (existing?.href ?? null),
      rsvpStatus: rsvp.status,
    });
  }

  const stemItems: PersonalLearningItem[] = learning.flatMap((item) => {
    if (!item.course) return [];
    return [
      {
        subscriptionId: item.subscription.id,
        title: item.course.title ?? "Course",
        href: item.course.slug
          ? `/resources/${item.course.slug}`
          : "/dashboard/learning",
        status: item.subscription.status,
        completedCount: item.completedCount,
        nextLessonTitle: item.nextResource?.title ?? null,
        kind: "stem",
      },
    ];
  });

  const apItems: PersonalLearningItem[] = apCatalog.courses.map((course) => ({
    subscriptionId: `ap-${course.id}`,
    title: course.title,
    href: `/dashboard/learn/ap/${course.course_namespace}`,
    status: "active",
    completedCount: 0,
    nextLessonTitle: course.framework_code
      ? `${course.framework_code} catalog`
      : "AP catalog",
    kind: "ap",
  }));

  const nextLearning =
    selectNextLearning(learning) ?? selectNextApLearning(apProgress);

  return {
    displayName: profileResult.data?.display_name?.trim() || "member",
    contextLabel: "Personal",
    schools,
    clubs,
    learning: [...stemItems, ...apItems],
    learningLinks: learningCatalogLinks({ apLearnRouteExists: true }),
    myDay: buildMyDayItems({
      nextEvent: pickNextVisibleEvent([...candidates.values()]),
      idea: selectIdeaNeedingAction(ideas),
      learning: nextLearning,
    }),
    notifications: inbox.notifications,
    unreadNotificationCount: inbox.unreadCount,
    quickActions: buildQuickActions({
      isPlatformAdmin: actor.isPlatformAdmin,
      isCommitteeReviewer: actor.isCommitteeReviewer,
      schools: schools.map((school) => ({
        id: school.id,
        name: school.name,
        role: school.role,
      })),
    }),
  };
}
