import "server-only";

import { requireActiveUser, requireClubManager, requirePlatformAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  gradeBandToClubGrades,
  type InsightsFilters,
} from "@/lib/validation/insights";
import { computeClubMomentum, percentPointDelta } from "@/features/insights/momentum";

function rate(present: number, recorded: number) {
  if (recorded <= 0) return null;
  return Math.round((present / recorded) * 1000) / 10;
}

async function filteredClubIds(filters: InsightsFilters) {
  const supabase = await createClient();
  let query = supabase.from("clubs").select("id, school_id, category, grade_min, grade_max, name, slug, status");
  if (filters.schoolId) query = query.eq("school_id", filters.schoolId);
  if (filters.category) query = query.eq("category", filters.category);
  const grades = gradeBandToClubGrades(filters.gradeBand);
  if (grades) {
    query = query.lte("grade_min", grades.max).gte("grade_max", grades.min);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAdminInsights(filters: InsightsFilters) {
  await requirePlatformAdmin();
  const supabase = await createClient();
  const clubs = await filteredClubIds(filters);
  const clubIds = clubs.map((club) => club.id);

  const [{ data: platformRows }, { data: schoolRows }, { data: clubRows }, { data: schools }] =
    await Promise.all([
      supabase
        .from("analytics_daily_platform")
        .select("*")
        .gte("metric_date", filters.start)
        .lte("metric_date", filters.end)
        .order("metric_date", { ascending: true }),
      filters.schoolId
        ? supabase
            .from("analytics_daily_school")
            .select("*")
            .eq("school_id", filters.schoolId)
            .gte("metric_date", filters.start)
            .lte("metric_date", filters.end)
            .order("metric_date", { ascending: true })
        : supabase
            .from("analytics_daily_school")
            .select("*")
            .gte("metric_date", filters.start)
            .lte("metric_date", filters.end)
            .order("metric_date", { ascending: true }),
      clubIds.length
        ? supabase
            .from("analytics_daily_club")
            .select("*")
            .in("club_id", clubIds)
            .gte("metric_date", filters.start)
            .lte("metric_date", filters.end)
            .order("metric_date", { ascending: true })
        : Promise.resolve({ data: [] as never[] }),
      supabase.from("schools").select("id, name").order("name"),
    ]);

  const scopedClubRows = clubRows ?? [];
  const byDate = new Map<
    string,
    {
      newClubs: number;
      newMembers: number;
      activeMembers: number;
      events: number;
      present: number;
      recorded: number;
      sessions: number;
      rsvps: number;
      subscriptions: number;
      renewalsDue: number;
      renewalsCompleted: number;
    }
  >();

  for (const row of scopedClubRows) {
    const key = row.metric_date;
    const current = byDate.get(key) ?? {
      newClubs: 0,
      newMembers: 0,
      activeMembers: 0,
      events: 0,
      present: 0,
      recorded: 0,
      sessions: 0,
      rsvps: 0,
      subscriptions: 0,
      renewalsDue: 0,
      renewalsCompleted: 0,
    };
    current.newMembers += row.new_members;
    current.activeMembers += row.active_members;
    current.events += row.events;
    current.present += row.attendance_present;
    current.recorded += row.attendance_recorded;
    current.sessions += row.attendance_sessions;
    current.rsvps += row.rsvps;
    current.subscriptions += row.resource_subscriptions;
    current.renewalsDue += row.renewals_due;
    current.renewalsCompleted += row.renewals_completed;
    byDate.set(key, current);
  }

  // New clubs from club created_at within range among filtered clubs
  const { data: createdClubs } = clubIds.length
    ? await supabase
        .from("clubs")
        .select("id, created_at, category, school_id, name, slug, status")
        .in("id", clubIds)
        .gte("created_at", `${filters.start}T00:00:00`)
        .lte("created_at", `${filters.end}T23:59:59`)
    : { data: [] };

  for (const club of createdClubs ?? []) {
    const day = club.created_at.slice(0, 10);
    const current = byDate.get(day) ?? {
      newClubs: 0,
      newMembers: 0,
      activeMembers: 0,
      events: 0,
      present: 0,
      recorded: 0,
      sessions: 0,
      rsvps: 0,
      subscriptions: 0,
      renewalsDue: 0,
      renewalsCompleted: 0,
    };
    current.newClubs += 1;
    byDate.set(day, current);
  }

  const dates = [...byDate.keys()].sort();
  const latestDate = dates[dates.length - 1];
  const latest = latestDate ? byDate.get(latestDate) : null;

  const sum = dates.reduce(
    (acc, date) => {
      const row = byDate.get(date)!;
      acc.newClubs += row.newClubs;
      acc.newMembers += row.newMembers;
      acc.events += row.events;
      acc.present += row.present;
      acc.recorded += row.recorded;
      acc.subscriptions += row.subscriptions;
      acc.renewalsCompleted += row.renewalsCompleted;
      return acc;
    },
    {
      newClubs: 0,
      newMembers: 0,
      events: 0,
      present: 0,
      recorded: 0,
      subscriptions: 0,
      renewalsCompleted: 0,
    },
  );

  const activeClubs = clubs.filter((club) => club.status === "active").length;
  const renewalsDue = latest?.renewalsDue ?? 0;
  const attendanceAvg = rate(sum.present, sum.recorded);
  const renewalCompletion = (() => {
    const denom = sum.renewalsCompleted + renewalsDue;
    if (denom <= 0) return null;
    return Math.round((sum.renewalsCompleted / denom) * 1000) / 10;
  })();

  const startMembers =
    dates.length > 0 ? (byDate.get(dates[0])?.activeMembers ?? 0) : 0;
  const memberGrowthPct =
    startMembers > 0
      ? Math.round((sum.newMembers / startMembers) * 1000) / 10
      : null;

  const categoryCounts = new Map<string, number>();
  const schoolCounts = new Map<string, number>();
  const schoolName = new Map(
    (schools ?? []).map((row: { id: string; name: string }) => [row.id, row.name]),
  );
  for (const club of clubs.filter((item) => item.status === "active")) {
    categoryCounts.set(
      String(club.category),
      (categoryCounts.get(String(club.category)) ?? 0) + 1,
    );
    schoolCounts.set(
      club.school_id,
      (schoolCounts.get(club.school_id) ?? 0) + 1,
    );
  }

  const activityByClub = new Map<string, number>();
  for (const row of scopedClubRows) {
    activityByClub.set(
      row.club_id,
      (activityByClub.get(row.club_id) ?? 0) +
        row.meetings +
        row.events +
        row.activities +
        row.attendance_sessions,
    );
  }
  const clubName = new Map(clubs.map((club) => [club.id, club.name]));
  const mostActive = [...activityByClub.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, value]) => ({
      label: clubName.get(id) ?? "Club",
      value,
    }));

  const { data: ideaRows } = await supabase
    .from("club_ideas")
    .select("status, submitted_at, decided_at, school_id")
    .gte("created_at", `${filters.start}T00:00:00`)
    .lte("created_at", `${filters.end}T23:59:59`);

  const ideas = (ideaRows ?? []).filter((idea) =>
    filters.schoolId ? idea.school_id === filters.schoolId : true,
  );
  const funnel = {
    proposed: ideas.filter((idea) => idea.submitted_at).length,
    approved: ideas.filter((idea) => idea.status === "approved").length,
    launched: (createdClubs ?? []).length,
    renewed: sum.renewalsCompleted,
  };

  return {
    filters,
    schools: schools ?? [],
    categories: [...new Set(clubs.map((club) => String(club.category)))].sort(),
    metrics: {
      activeClubs,
      newClubs: sum.newClubs,
      activeMembers: latest?.activeMembers ?? 0,
      memberGrowth: sum.newMembers,
      memberGrowthPct,
      eventsHeld: sum.events,
      averageAttendance: attendanceAvg,
      renewalsDue,
      renewalCompletion,
      resourceSubscriptions: sum.subscriptions,
    },
    charts: {
      clubGrowth: dates.map((date) => ({
        label: date.slice(5),
        value: byDate.get(date)!.newClubs,
        secondary: byDate.get(date)!.activeMembers,
      })),
      membershipGrowth: dates.map((date) => ({
        label: date.slice(5),
        value: byDate.get(date)!.newMembers,
        secondary: byDate.get(date)!.activeMembers,
      })),
      attendanceTrend: dates.map((date) => {
        const row = byDate.get(date)!;
        return {
          label: date.slice(5),
          value: rate(row.present, row.recorded) ?? 0,
        };
      }),
      clubsByCategory: [...categoryCounts.entries()].map(([label, value]) => ({
        label: String(label),
        value,
      })),
      clubsBySchool: [...schoolCounts.entries()].map(([id, value]) => ({
        label: String(schoolName.get(id) ?? "School"),
        value,
      })),
      eventParticipation: dates.map((date) => ({
        label: date.slice(5),
        value: byDate.get(date)!.rsvps,
        secondary: byDate.get(date)!.events,
      })),
      lifecycleFunnel: [
        { label: "Proposed", value: funnel.proposed },
        { label: "Approved", value: funnel.approved },
        { label: "Launched", value: funnel.launched },
        { label: "Renewed", value: funnel.renewed },
      ],
      renewalStatus: [
        { label: "Completed", value: sum.renewalsCompleted },
        { label: "Open due", value: renewalsDue },
      ],
      resourceEngagement: dates.map((date) => ({
        label: date.slice(5),
        value: byDate.get(date)!.subscriptions,
      })),
      mostActive,
    },
    tableRows: mostActive.map((row) => ({
      club: row.label,
      activityScore: row.value,
    })),
    platformRows: platformRows ?? [],
    schoolRows: schoolRows ?? [],
  };
}

export async function getClubInsightsBundle(clubId: string, range: { start: string; end: string }) {
  await requireClubManager(clubId);
  const supabase = await createClient();

  const startPrev = new Date(range.start);
  const endPrev = new Date(range.end);
  const spanDays =
    Math.round((endPrev.getTime() - startPrev.getTime()) / 86400000) + 1;
  const prevEnd = new Date(startPrev);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (spanDays - 1));
  const prev = {
    start: prevStart.toISOString().slice(0, 10),
    end: prevEnd.toISOString().slice(0, 10),
  };

  const [{ data: rows }, { data: prevRows }, { data: club }, { data: memberships }, { data: officers }, { data: charter }, { data: renewal }] =
    await Promise.all([
      supabase
        .from("analytics_daily_club")
        .select("*")
        .eq("club_id", clubId)
        .gte("metric_date", range.start)
        .lte("metric_date", range.end)
        .order("metric_date", { ascending: true }),
      supabase
        .from("analytics_daily_club")
        .select("*")
        .eq("club_id", clubId)
        .gte("metric_date", prev.start)
        .lte("metric_date", prev.end)
        .order("metric_date", { ascending: true }),
      supabase
        .from("clubs")
        .select("id, name, slug, school_id")
        .eq("id", clubId)
        .maybeSingle(),
      supabase
        .from("club_memberships")
        .select("id, role, status, joined_at, user_id")
        .eq("club_id", clubId),
      supabase
        .from("club_memberships")
        .select("id, role")
        .eq("club_id", clubId)
        .eq("status", "active")
        .in("role", ["president", "vice_president", "secretary", "treasurer", "club_admin", "advisor"]),
      supabase
        .from("club_charters")
        .select("status, expires_at")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("club_renewals")
        .select("status, school_year, updated_at")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const series = rows ?? [];
  const previous = prevRows ?? [];
  const sum = (list: typeof series) =>
    list.reduce(
      (acc, row) => {
        acc.newMembers += row.new_members;
        acc.meetings += row.meetings;
        acc.events += row.events;
        acc.present += row.attendance_present;
        acc.recorded += row.attendance_recorded;
        acc.rsvps += row.rsvps;
        acc.subscriptions += row.resource_subscriptions;
        acc.activities += row.activities;
        acc.sessions += row.attendance_sessions;
        return acc;
      },
      {
        newMembers: 0,
        meetings: 0,
        events: 0,
        present: 0,
        recorded: 0,
        rsvps: 0,
        subscriptions: 0,
        activities: 0,
        sessions: 0,
      },
    );

  const currentSum = sum(series);
  const prevSum = sum(previous);
  const latest = series[series.length - 1];
  const attendance = rate(currentSum.present, currentSum.recorded);
  const prevAttendance = rate(prevSum.present, prevSum.recorded);
  const attendanceDelta = percentPointDelta(attendance, prevAttendance);

  const activeMembers = (memberships ?? []).filter((row) => row.status === "active");
  const hasAdvisor = (officers ?? []).some((row) => row.role === "advisor");
  const hasOfficer = (officers ?? []).some((row) => row.role !== "advisor");

  const lastMeetingRow = [...series].reverse().find((row) => row.meetings > 0);
  const daysSinceLastMeeting = lastMeetingRow
    ? Math.round(
        (Date.now() - new Date(lastMeetingRow.metric_date).getTime()) / 86400000,
      )
    : null;

  const daysToExpiry = charter?.expires_at
    ? Math.round(
        (new Date(charter.expires_at).getTime() - Date.now()) / 86400000,
      )
    : null;

  const momentum = computeClubMomentum({
    activitiesLast30: currentSum.activities,
    meetingsLast30: currentSum.meetings,
    daysSinceLastMeeting,
    attendanceRateLast30: attendance,
    activeMembers: latest?.active_members ?? activeMembers.length,
    newMembersLast30: currentSum.newMembers,
    eventsLast30: Math.max(0, currentSum.events - currentSum.meetings),
    hasOfficer,
    hasAdvisor,
    charterApproved: charter?.status === "approved",
    daysToCharterExpiry: daysToExpiry,
    renewalOpen: ["draft", "submitted", "under_review", "changes_requested"].includes(
      renewal?.status ?? "",
    ),
    renewalApprovedThisYear: renewal?.status === "approved",
  });

  const startActive = (memberships ?? []).filter((row) => {
    if (row.status !== "active" && row.joined_at && row.joined_at.slice(0, 10) > range.start) {
      return false;
    }
    return row.joined_at == null || row.joined_at.slice(0, 10) <= range.start;
  });
  // Retention approximation from membership list: active now who joined on/before start
  const retained = activeMembers.filter(
    (row) => !row.joined_at || row.joined_at.slice(0, 10) <= range.start,
  ).length;
  const retention =
    startActive.length > 0
      ? Math.round((retained / Math.max(startActive.length, 1)) * 1000) / 10
      : null;

  const callouts: string[] = [];
  if (attendanceDelta != null && attendanceDelta !== 0) {
    callouts.push(
      `Attendance ${attendanceDelta > 0 ? "increased" : "decreased"} ${Math.abs(attendanceDelta)} percentage points compared with the previous ${spanDays} days.`,
    );
  }
  if (currentSum.newMembers !== prevSum.newMembers) {
    const delta = currentSum.newMembers - prevSum.newMembers;
    callouts.push(
      `New members ${delta >= 0 ? "increased" : "decreased"} by ${Math.abs(delta)} versus the previous period.`,
    );
  }
  if (currentSum.events !== prevSum.events) {
    const delta = currentSum.events - prevSum.events;
    callouts.push(
      `Events ${delta >= 0 ? "rose" : "fell"} by ${Math.abs(delta)} versus the previous period.`,
    );
  }

  return {
    club,
    metrics: {
      members: latest?.active_members ?? activeMembers.length,
      newMembers: currentSum.newMembers,
      meetings: currentSum.meetings,
      attendance,
      events: currentSum.events,
      rsvpRate:
        currentSum.events > 0
          ? Math.round((currentSum.rsvps / currentSum.events) * 10) / 10
          : null,
      activeParticipants: currentSum.present,
      memberRetention: retention,
      resourceSubscriptions: currentSum.subscriptions,
    },
    charts: {
      memberGrowth: series.map((row) => ({
        label: row.metric_date.slice(5),
        value: row.new_members,
        secondary: row.active_members,
      })),
      attendanceTrend: series.map((row) => ({
        label: row.metric_date.slice(5),
        value: rate(row.attendance_present, row.attendance_recorded) ?? 0,
      })),
      participationDistribution: [
        { label: "Present/late marks", value: currentSum.present },
        {
          label: "Other recorded",
          value: Math.max(0, currentSum.recorded - currentSum.present),
        },
      ],
      eventParticipation: series.map((row) => ({
        label: row.metric_date.slice(5),
        value: row.rsvps,
        secondary: row.events,
      })),
      activityFrequency: series.map((row) => ({
        label: row.metric_date.slice(5),
        value: row.activities + row.meetings,
      })),
    },
    momentum,
    callouts,
  };
}

export async function getMemberInsights(userId: string) {
  await requireActiveUser();
  const supabase = await createClient();

  const [{ data: memberships }, { data: subscriptions }] = await Promise.all([
    supabase
      .from("club_memberships")
      .select("id, role, status, joined_at, clubs(id, name, slug)")
      .eq("user_id", userId)
      .eq("status", "active"),
    supabase
      .from("course_subscriptions")
      .select("id, status, course_id, subscribed_at")
      .eq("user_id", userId)
      .in("status", ["active", "completed", "paused"]),
  ]);

  const clubIds = (memberships ?? [])
    .map((row) => {
      const club = row.clubs as { id: string } | null | undefined;
      return club?.id;
    })
    .filter(Boolean) as string[];

  const { data: events } = clubIds.length
    ? await supabase
        .from("events")
        .select("id, title, starts_at, club_id, clubs(name, slug)")
        .in("club_id", clubIds)
        .eq("status", "published")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(8)
    : { data: [] };

  const membershipIds = (memberships ?? []).map((row) => row.id);
  const { data: attendance } = membershipIds.length
    ? await supabase
        .from("attendance_records")
        .select("status, membership_id")
        .in("membership_id", membershipIds)
    : { data: [] };

  const attendanceSummary = {
    present: (attendance ?? []).filter((row) => row.status === "present").length,
    late: (attendance ?? []).filter((row) => row.status === "late").length,
    excused: (attendance ?? []).filter((row) => row.status === "excused").length,
    absent: (attendance ?? []).filter((row) => row.status === "absent").length,
  };

  const courseIds = (subscriptions ?? []).map((row) => row.course_id);
  const { data: courses } = courseIds.length
    ? await supabase
        .from("published_stem_courses")
        .select("id, title, slug")
        .in("id", courseIds)
    : { data: [] };
  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));

  const subscriptionIds = (subscriptions ?? []).map((row) => row.id);
  const { data: progress } = subscriptionIds.length
    ? await supabase
        .from("course_progress")
        .select("subscription_id, completed")
        .in("subscription_id", subscriptionIds)
        .eq("completed", true)
    : { data: [] };

  return {
    clubs: (memberships ?? []).map((row) => {
      const club = row.clubs as
        | { id: string; name: string; slug: string }
        | null
        | undefined;
      return {
        id: club?.id,
        name: club?.name,
        slug: club?.slug,
        role: row.role,
        joinedAt: row.joined_at,
      };
    }),
    upcomingEvents: (events ?? []).map((event) => ({
      ...event,
      clubs: event.clubs as { name: string; slug: string } | null,
    })),
    attendanceSummary,
    courses: (subscriptions ?? []).map((row) => ({
      id: row.id,
      status: row.status,
      title: courseMap.get(row.course_id)?.title ?? "Course",
      slug: courseMap.get(row.course_id)?.slug,
      completedLessons: (progress ?? []).filter(
        (item) => item.subscription_id === row.id,
      ).length,
    })),
  };
}
