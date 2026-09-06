-- Club Highlights enrichment + Newsletter Studio structured blocks.

create type public.highlight_source_type as enum (
  'activity',
  'event',
  'media',
  'achievement',
  'competition',
  'community_service',
  'project',
  'other'
);

create type public.newsletter_block_type as enum (
  'hero',
  'text',
  'highlight',
  'event_recap',
  'upcoming_event',
  'image',
  'gallery',
  'stats',
  'course_recommendation',
  'cta',
  'divider'
);

alter table public.club_highlights
  add column if not exists source_type public.highlight_source_type
    not null default 'other',
  add column if not exists occurred_on date not null default (timezone('America/Los_Angeles', now()))::date,
  add column if not exists related_activity_id uuid
    references public.club_activities(id) on delete set null,
  add column if not exists related_event_id uuid
    references public.events(id) on delete set null;

create index if not exists club_highlights_club_occurred_idx
  on public.club_highlights (club_id, occurred_on desc, created_at desc);

alter table public.club_highlights
  drop constraint if exists club_highlights_source_refs;
alter table public.club_highlights
  add constraint club_highlights_source_refs check (
    (related_activity_id is null or source_type in ('activity', 'community_service', 'project', 'other'))
    and (related_event_id is null or source_type in ('event', 'competition', 'community_service', 'other'))
  );

alter table public.newsletters
  add column if not exists preview_text text
    check (preview_text is null or length(trim(preview_text)) between 1 and 240),
  add column if not exists period_start date,
  add column if not exists period_end date,
  add column if not exists selected_facts jsonb not null default '{}'::jsonb
    check (jsonb_typeof(selected_facts) = 'object'),
  add column if not exists archived_at timestamptz;

alter table public.newsletters
  drop constraint if exists newsletters_period_order;
alter table public.newsletters
  add constraint newsletters_period_order check (
    period_start is null
    or period_end is null
    or period_end >= period_start
  );

create table if not exists public.newsletter_blocks (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid not null references public.newsletters(id) on delete cascade,
  position integer not null check (position >= 0),
  block_type public.newsletter_block_type not null,
  content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content) = 'object'),
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (newsletter_id, position)
);

create index if not exists newsletter_blocks_newsletter_idx
  on public.newsletter_blocks (newsletter_id, position);

alter table public.newsletter_blocks enable row level security;

drop policy if exists newsletter_blocks_public_select on public.newsletter_blocks;
drop policy if exists newsletter_blocks_authorized_select on public.newsletter_blocks;
drop policy if exists newsletter_blocks_manager_insert on public.newsletter_blocks;
drop policy if exists newsletter_blocks_manager_update on public.newsletter_blocks;
drop policy if exists newsletter_blocks_manager_delete on public.newsletter_blocks;

-- Public web reads go through published view; direct table stays closed to anon.
create policy newsletter_blocks_public_select on public.newsletter_blocks
  for select to anon using (false);

create policy newsletter_blocks_authorized_select on public.newsletter_blocks
  for select to authenticated using (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.is_club_member(newsletter.club_id)
          )
        )
    )
  );

create policy newsletter_blocks_manager_insert on public.newsletter_blocks
  for insert to authenticated with check (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  );

create policy newsletter_blocks_manager_update on public.newsletter_blocks
  for update to authenticated using (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  ) with check (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  );

create policy newsletter_blocks_manager_delete on public.newsletter_blocks
  for delete to authenticated using (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  );

drop trigger if exists set_updated_at_newsletter_blocks on public.newsletter_blocks;
create trigger set_updated_at_newsletter_blocks
  before update on public.newsletter_blocks
  for each row execute function public.set_updated_at();

drop trigger if exists audit_newsletter_blocks on public.newsletter_blocks;
create trigger audit_newsletter_blocks
  after insert or update or delete on public.newsletter_blocks
  for each row execute function public.audit_row_change('newsletter_block');

-- Allow anon to read published public highlights/newsletters via views only.
-- Drop + recreate: CREATE OR REPLACE cannot change view column names/order.
drop view if exists public.published_newsletter_blocks;
drop view if exists public.published_newsletters;
drop view if exists public.published_club_highlights;

create view public.published_club_highlights
with (security_barrier = true, security_invoker = false)
as
select
  highlight.id,
  highlight.club_id,
  highlight.title,
  highlight.summary,
  highlight.body,
  highlight.cover_asset_id,
  highlight.source_type,
  highlight.occurred_on,
  highlight.related_activity_id,
  highlight.related_event_id,
  highlight.published_at
from public.club_highlights highlight
where highlight.status = 'published'
  and highlight.visibility = 'public'
  and highlight.published_at is not null
  and highlight.published_at <= now();

create view public.published_newsletters
with (security_barrier = true, security_invoker = false)
as
select
  newsletter.id,
  newsletter.school_id,
  newsletter.club_id,
  club.name as club_name,
  club.slug as club_slug,
  newsletter.title,
  newsletter.issue_label,
  newsletter.preview_text,
  newsletter.period_start,
  newsletter.period_end,
  newsletter.published_at
from public.newsletters newsletter
join public.clubs club on club.id = newsletter.club_id
where newsletter.status = 'published'
  and newsletter.visibility = 'public'
  and newsletter.published_at is not null
  and newsletter.published_at <= now()
  and newsletter.archived_at is null;

create view public.published_newsletter_blocks
with (security_barrier = true, security_invoker = false)
as
select
  block.id,
  block.newsletter_id,
  block.position,
  block.block_type,
  block.content
from public.newsletter_blocks block
join public.newsletters newsletter on newsletter.id = block.newsletter_id
where newsletter.status = 'published'
  and newsletter.visibility = 'public'
  and newsletter.published_at is not null
  and newsletter.published_at <= now()
  and newsletter.archived_at is null;

revoke all on public.published_club_highlights from public;
revoke all on public.published_newsletters from public;
revoke all on public.published_newsletter_blocks from public;
grant select on public.published_club_highlights to anon, authenticated;
grant select on public.published_newsletters to anon, authenticated;
grant select on public.published_newsletter_blocks to anon, authenticated;

-- Club-month facts: only real stored data, never invented.
create or replace function public.club_month_facts(
  target_club_id uuid,
  range_start date,
  range_end date
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  meetings_count integer := 0;
  events jsonb := '[]'::jsonb;
  upcoming jsonb := '[]'::jsonb;
  new_members_count integer := 0;
  attendance jsonb := '{}'::jsonb;
  highlights jsonb := '[]'::jsonb;
  present_count integer := 0;
  session_count integer := 0;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if not (
    public.can_manage_club(target_club_id, actor)
    or public.is_club_member(target_club_id, actor)
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if range_end < range_start then
    raise exception 'Invalid date range' using errcode = '23514';
  end if;

  select count(*)::integer into meetings_count
  from public.events event
  where event.club_id = target_club_id
    and event.event_type = 'club_meeting'
    and event.status in ('published', 'completed')
    and (event.starts_at at time zone 'America/Los_Angeles')::date
      between range_start and range_end;

  select coalesce(jsonb_agg(row_to_json(item)::jsonb order by item.starts_at), '[]'::jsonb)
  into events
  from (
    select event.id, event.title, event.event_type, event.starts_at, event.status
    from public.events event
    where event.club_id = target_club_id
      and event.status in ('published', 'completed')
      and (event.starts_at at time zone 'America/Los_Angeles')::date
        between range_start and range_end
    order by event.starts_at
    limit 20
  ) item;

  select coalesce(jsonb_agg(row_to_json(item)::jsonb order by item.starts_at), '[]'::jsonb)
  into upcoming
  from (
    select event.id, event.title, event.event_type, event.starts_at, event.status
    from public.events event
    where event.club_id = target_club_id
      and event.status = 'published'
      and event.starts_at >= statement_timestamp()
    order by event.starts_at
    limit 10
  ) item;

  select count(*)::integer into new_members_count
  from public.club_memberships membership
  where membership.club_id = target_club_id
    and membership.status = 'active'
    and membership.joined_at is not null
    and (membership.joined_at at time zone 'America/Los_Angeles')::date
      between range_start and range_end;

  select
    count(distinct session.id)::integer,
    count(record.id) filter (where record.status in ('present', 'late'))::integer
  into session_count, present_count
  from public.attendance_sessions session
  left join public.attendance_records record on record.session_id = session.id
  where session.club_id = target_club_id
    and (session.starts_at at time zone 'America/Los_Angeles')::date
      between range_start and range_end;

  attendance := jsonb_build_object(
    'sessions', session_count,
    'present_or_late_marks', present_count
  );

  select coalesce(jsonb_agg(row_to_json(item)::jsonb order by item.occurred_on desc), '[]'::jsonb)
  into highlights
  from (
    select highlight.id, highlight.title, highlight.summary, highlight.occurred_on, highlight.source_type
    from public.club_highlights highlight
    where highlight.club_id = target_club_id
      and highlight.status in ('published', 'scheduled', 'draft')
      and highlight.occurred_on between range_start and range_end
    order by highlight.occurred_on desc
    limit 20
  ) item;

  return jsonb_build_object(
    'period_start', range_start,
    'period_end', range_end,
    'meetings_count', meetings_count,
    'events', events,
    'upcoming_events', upcoming,
    'new_members_count', new_members_count,
    'attendance', attendance,
    'highlights', highlights
  );
end;
$$;

revoke all on function public.club_month_facts(uuid, date, date) from public;
grant execute on function public.club_month_facts(uuid, date, date) to authenticated;
