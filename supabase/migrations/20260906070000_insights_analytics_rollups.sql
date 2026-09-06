-- Insights: expand daily rollups, incremental refresh RPC, and supporting indexes.
-- Metrics are operational usage only — never student academic performance.

alter table public.analytics_daily_club
  add column if not exists resource_subscriptions integer not null default 0
    check (resource_subscriptions >= 0),
  add column if not exists renewals_due integer not null default 0
    check (renewals_due >= 0),
  add column if not exists renewals_completed integer not null default 0
    check (renewals_completed >= 0),
  add column if not exists meetings integer not null default 0
    check (meetings >= 0);

alter table public.analytics_daily_school
  add column if not exists new_clubs integer not null default 0
    check (new_clubs >= 0),
  add column if not exists new_members integer not null default 0
    check (new_members >= 0),
  add column if not exists attendance_present integer not null default 0
    check (attendance_present >= 0),
  add column if not exists attendance_sessions integer not null default 0
    check (attendance_sessions >= 0),
  add column if not exists resource_subscriptions integer not null default 0
    check (resource_subscriptions >= 0),
  add column if not exists renewals_due integer not null default 0
    check (renewals_due >= 0),
  add column if not exists renewals_completed integer not null default 0
    check (renewals_completed >= 0);

alter table public.analytics_daily_platform
  add column if not exists new_clubs integer not null default 0
    check (new_clubs >= 0),
  add column if not exists new_members integer not null default 0
    check (new_members >= 0),
  add column if not exists attendance_present integer not null default 0
    check (attendance_present >= 0),
  add column if not exists attendance_sessions integer not null default 0
    check (attendance_sessions >= 0),
  add column if not exists resource_subscriptions integer not null default 0
    check (resource_subscriptions >= 0),
  add column if not exists renewals_due integer not null default 0
    check (renewals_due >= 0),
  add column if not exists renewals_completed integer not null default 0
    check (renewals_completed >= 0);

create index if not exists analytics_daily_platform_date_idx
  on public.analytics_daily_platform (metric_date desc);

create index if not exists clubs_category_status_idx
  on public.clubs (category, status)
  where status = 'active';

create index if not exists clubs_school_status_created_idx
  on public.clubs (school_id, status, created_at desc);

create index if not exists club_memberships_joined_at_idx
  on public.club_memberships (joined_at desc)
  where status = 'active' and joined_at is not null;

-- Idempotent daily refresh for one calendar day (America/Los_Angeles).
create or replace function public.refresh_analytics_for_date(target_date date default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  day date := coalesce(
    target_date,
    (timezone('America/Los_Angeles', now()))::date - 1
  );
  club_rows integer := 0;
  school_rows integer := 0;
  platform_rows integer := 0;
begin
  -- Club daily facts
  with club_base as (
    select club.id as club_id, club.school_id
    from public.clubs club
    where club.status in ('active', 'inactive', 'archived')
  ),
  members as (
    select
      membership.club_id,
      count(*) filter (
        where membership.status = 'active'
      )::integer as active_members,
      count(*) filter (
        where membership.status = 'active'
          and membership.joined_at is not null
          and (membership.joined_at at time zone 'America/Los_Angeles')::date = day
      )::integer as new_members
    from public.club_memberships membership
    group by membership.club_id
  ),
  attendance as (
    select
      session.club_id,
      count(distinct session.id)::integer as attendance_sessions,
      count(record.id)::integer as attendance_recorded,
      count(record.id) filter (
        where record.status in ('present', 'late')
      )::integer as attendance_present
    from public.attendance_sessions session
    left join public.attendance_records record on record.session_id = session.id
    where (session.starts_at at time zone 'America/Los_Angeles')::date = day
    group by session.club_id
  ),
  event_day as (
    select event.id, event.club_id, event.event_type
    from public.events event
    where event.club_id is not null
      and event.status in ('published', 'completed', 'cancelled')
      and (event.starts_at at time zone 'America/Los_Angeles')::date = day
  ),
  event_stats as (
    select
      event_day.club_id,
      count(*)::integer as events,
      count(*) filter (
        where event_day.event_type = 'club_meeting'
      )::integer as meetings,
      count(rsvp.id) filter (
        where rsvp.status in ('going', 'waitlisted')
      )::integer as rsvps
    from event_day
    left join public.event_rsvps rsvp on rsvp.event_id = event_day.id
    group by event_day.club_id
  ),
  activity_stats as (
    select
      activity.club_id,
      count(*)::integer as activities
    from public.club_activities activity
    where activity.activity_date = day
    group by activity.club_id
  ),
  subscription_stats as (
    select
      membership.club_id,
      count(distinct subscription.id)::integer as resource_subscriptions
    from public.course_subscriptions subscription
    join public.club_memberships membership
      on membership.user_id = subscription.user_id
     and membership.status = 'active'
    where (subscription.subscribed_at at time zone 'America/Los_Angeles')::date = day
    group by membership.club_id
  ),
  renewal_stats as (
    select
      renewal.club_id,
      count(*) filter (
        where renewal.status in ('draft', 'submitted', 'under_review', 'changes_requested')
      )::integer as renewals_due,
      count(*) filter (
        where renewal.status = 'approved'
          and renewal.updated_at is not null
          and (renewal.updated_at at time zone 'America/Los_Angeles')::date = day
      )::integer as renewals_completed
    from public.club_renewals renewal
    group by renewal.club_id
  ),
  club_upsert as (
    insert into public.analytics_daily_club as rollup (
      club_id,
      metric_date,
      active_members,
      new_members,
      attendance_sessions,
      attendance_recorded,
      attendance_present,
      events,
      meetings,
      rsvps,
      activities,
      resource_subscriptions,
      renewals_due,
      renewals_completed,
      calculated_at
    )
    select
      base.club_id,
      day,
      coalesce(members.active_members, 0),
      coalesce(members.new_members, 0),
      coalesce(attendance.attendance_sessions, 0),
      coalesce(attendance.attendance_recorded, 0),
      coalesce(attendance.attendance_present, 0),
      coalesce(event_stats.events, 0),
      coalesce(event_stats.meetings, 0),
      coalesce(event_stats.rsvps, 0),
      coalesce(activity_stats.activities, 0),
      coalesce(subscription_stats.resource_subscriptions, 0),
      coalesce(renewal_stats.renewals_due, 0),
      coalesce(renewal_stats.renewals_completed, 0),
      statement_timestamp()
    from club_base base
    left join members on members.club_id = base.club_id
    left join attendance on attendance.club_id = base.club_id
    left join event_stats on event_stats.club_id = base.club_id
    left join activity_stats on activity_stats.club_id = base.club_id
    left join subscription_stats on subscription_stats.club_id = base.club_id
    left join renewal_stats on renewal_stats.club_id = base.club_id
    on conflict (club_id, metric_date) do update set
      active_members = excluded.active_members,
      new_members = excluded.new_members,
      attendance_sessions = excluded.attendance_sessions,
      attendance_recorded = excluded.attendance_recorded,
      attendance_present = excluded.attendance_present,
      events = excluded.events,
      meetings = excluded.meetings,
      rsvps = excluded.rsvps,
      activities = excluded.activities,
      resource_subscriptions = excluded.resource_subscriptions,
      renewals_due = excluded.renewals_due,
      renewals_completed = excluded.renewals_completed,
      calculated_at = excluded.calculated_at
    returning 1
  )
  select count(*)::integer into club_rows from club_upsert;

  -- School daily facts from club rollups + idea flow
  with school_from_clubs as (
    select
      club.school_id,
      count(*) filter (where club.status = 'active')::integer as active_clubs,
      count(*) filter (
        where club.status = 'active'
          and (club.created_at at time zone 'America/Los_Angeles')::date = day
      )::integer as new_clubs,
      coalesce(sum(rollup.active_members), 0)::integer as active_members,
      coalesce(sum(rollup.new_members), 0)::integer as new_members,
      coalesce(sum(rollup.events), 0)::integer as events,
      coalesce(sum(rollup.attendance_recorded), 0)::integer as attendance_recorded,
      coalesce(sum(rollup.attendance_present), 0)::integer as attendance_present,
      coalesce(sum(rollup.attendance_sessions), 0)::integer as attendance_sessions,
      coalesce(sum(rollup.resource_subscriptions), 0)::integer as resource_subscriptions,
      coalesce(sum(rollup.renewals_due), 0)::integer as renewals_due,
      coalesce(sum(rollup.renewals_completed), 0)::integer as renewals_completed
    from public.clubs club
    left join public.analytics_daily_club rollup
      on rollup.club_id = club.id
     and rollup.metric_date = day
    group by club.school_id
  ),
  idea_stats as (
    select
      idea.school_id,
      count(*) filter (
        where idea.submitted_at is not null
          and (idea.submitted_at at time zone 'America/Los_Angeles')::date = day
      )::integer as ideas_submitted,
      count(*) filter (
        where idea.status = 'approved'
          and idea.updated_at is not null
          and (idea.updated_at at time zone 'America/Los_Angeles')::date = day
      )::integer as ideas_approved
    from public.club_ideas idea
    group by idea.school_id
  ),
  school_upsert as (
    insert into public.analytics_daily_school as rollup (
      school_id,
      metric_date,
      active_clubs,
      active_members,
      new_clubs,
      new_members,
      ideas_submitted,
      ideas_approved,
      events,
      attendance_recorded,
      attendance_present,
      attendance_sessions,
      resource_subscriptions,
      renewals_due,
      renewals_completed,
      calculated_at
    )
    select
      school.id,
      day,
      coalesce(school_from_clubs.active_clubs, 0),
      coalesce(school_from_clubs.active_members, 0),
      coalesce(school_from_clubs.new_clubs, 0),
      coalesce(school_from_clubs.new_members, 0),
      coalesce(idea_stats.ideas_submitted, 0),
      coalesce(idea_stats.ideas_approved, 0),
      coalesce(school_from_clubs.events, 0),
      coalesce(school_from_clubs.attendance_recorded, 0),
      coalesce(school_from_clubs.attendance_present, 0),
      coalesce(school_from_clubs.attendance_sessions, 0),
      coalesce(school_from_clubs.resource_subscriptions, 0),
      coalesce(school_from_clubs.renewals_due, 0),
      coalesce(school_from_clubs.renewals_completed, 0),
      statement_timestamp()
    from public.schools school
    left join school_from_clubs on school_from_clubs.school_id = school.id
    left join idea_stats on idea_stats.school_id = school.id
    on conflict (school_id, metric_date) do update set
      active_clubs = excluded.active_clubs,
      active_members = excluded.active_members,
      new_clubs = excluded.new_clubs,
      new_members = excluded.new_members,
      ideas_submitted = excluded.ideas_submitted,
      ideas_approved = excluded.ideas_approved,
      events = excluded.events,
      attendance_recorded = excluded.attendance_recorded,
      attendance_present = excluded.attendance_present,
      attendance_sessions = excluded.attendance_sessions,
      resource_subscriptions = excluded.resource_subscriptions,
      renewals_due = excluded.renewals_due,
      renewals_completed = excluded.renewals_completed,
      calculated_at = excluded.calculated_at
    returning 1
  )
  select count(*)::integer into school_rows from school_upsert;

  insert into public.analytics_daily_platform as rollup (
    metric_date,
    active_schools,
    active_clubs,
    active_members,
    new_clubs,
    new_members,
    ideas_submitted,
    ideas_approved,
    events,
    attendance_recorded,
    attendance_present,
    attendance_sessions,
    resource_subscriptions,
    renewals_due,
    renewals_completed,
    calculated_at
  )
  select
    day,
    count(distinct school.school_id) filter (where school.active_clubs > 0)::integer,
    coalesce(sum(school.active_clubs), 0)::integer,
    coalesce(sum(school.active_members), 0)::integer,
    coalesce(sum(school.new_clubs), 0)::integer,
    coalesce(sum(school.new_members), 0)::integer,
    coalesce(sum(school.ideas_submitted), 0)::integer,
    coalesce(sum(school.ideas_approved), 0)::integer,
    coalesce(sum(school.events), 0)::integer,
    coalesce(sum(school.attendance_recorded), 0)::integer,
    coalesce(sum(school.attendance_present), 0)::integer,
    coalesce(sum(school.attendance_sessions), 0)::integer,
    coalesce(sum(school.resource_subscriptions), 0)::integer,
    coalesce(sum(school.renewals_due), 0)::integer,
    coalesce(sum(school.renewals_completed), 0)::integer,
    statement_timestamp()
  from public.analytics_daily_school school
  where school.metric_date = day
  on conflict (metric_date) do update set
    active_schools = excluded.active_schools,
    active_clubs = excluded.active_clubs,
    active_members = excluded.active_members,
    new_clubs = excluded.new_clubs,
    new_members = excluded.new_members,
    ideas_submitted = excluded.ideas_submitted,
    ideas_approved = excluded.ideas_approved,
    events = excluded.events,
    attendance_recorded = excluded.attendance_recorded,
    attendance_present = excluded.attendance_present,
    attendance_sessions = excluded.attendance_sessions,
    resource_subscriptions = excluded.resource_subscriptions,
    renewals_due = excluded.renewals_due,
    renewals_completed = excluded.renewals_completed,
    calculated_at = excluded.calculated_at;

  get diagnostics platform_rows = row_count;

  return jsonb_build_object(
    'metric_date', day,
    'club_rows', club_rows,
    'school_rows', school_rows,
    'platform_rows', platform_rows
  );
end;
$$;

revoke all on function public.refresh_analytics_for_date(date) from public;
grant execute on function public.refresh_analytics_for_date(date) to service_role;

-- Backfill last 30 local days for existing environments (idempotent).
do $$
declare
  cursor_day date;
  start_day date := (timezone('America/Los_Angeles', now()))::date - 30;
  end_day date := (timezone('America/Los_Angeles', now()))::date;
begin
  cursor_day := start_day;
  while cursor_day <= end_day loop
    perform public.refresh_analytics_for_date(cursor_day);
    cursor_day := cursor_day + 1;
  end loop;
end;
$$;
