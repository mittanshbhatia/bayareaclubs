-- Club Command Center: settings fields + richer activity records

alter table public.clubs
  add column if not exists meeting_cadence text not null default '',
  add column if not exists public_summary text not null default '';

alter table public.club_activities
  add column if not exists related_event_id uuid references public.events(id) on delete set null,
  add column if not exists outcomes text not null default '';

create table if not exists public.club_activity_participants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.club_activities(id) on delete cascade,
  membership_id uuid not null references public.club_memberships(id) on delete cascade,
  created_at timestamptz not null default statement_timestamp(),
  unique (activity_id, membership_id)
);

create table if not exists public.club_activity_media (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.club_activities(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  created_at timestamptz not null default statement_timestamp(),
  unique (activity_id, media_asset_id)
);

create index if not exists club_activity_participants_activity_idx
  on public.club_activity_participants (activity_id);
create index if not exists club_activity_media_activity_idx
  on public.club_activity_media (activity_id);
create index if not exists club_activities_related_event_idx
  on public.club_activities (related_event_id)
  where related_event_id is not null;

alter table public.club_activity_participants enable row level security;
alter table public.club_activity_media enable row level security;

drop policy if exists activity_participants_member_select on public.club_activity_participants;
drop policy if exists activity_participants_manager_insert on public.club_activity_participants;
drop policy if exists activity_participants_manager_delete on public.club_activity_participants;
drop policy if exists activity_media_member_select on public.club_activity_media;
drop policy if exists activity_media_manager_insert on public.club_activity_media;
drop policy if exists activity_media_manager_delete on public.club_activity_media;

create policy activity_participants_member_select on public.club_activity_participants
  for select to authenticated using (
    exists (
      select 1 from public.club_activities activity
      where activity.id = activity_id
        and public.is_club_member(activity.club_id)
    )
  );
create policy activity_participants_manager_insert on public.club_activity_participants
  for insert to authenticated with check (
    exists (
      select 1 from public.club_activities activity
      where activity.id = activity_id
        and public.can_manage_club(activity.club_id)
    )
  );
create policy activity_participants_manager_delete on public.club_activity_participants
  for delete to authenticated using (
    exists (
      select 1 from public.club_activities activity
      where activity.id = activity_id
        and public.can_manage_club(activity.club_id)
    )
  );

create policy activity_media_member_select on public.club_activity_media
  for select to authenticated using (
    exists (
      select 1 from public.club_activities activity
      where activity.id = activity_id
        and public.is_club_member(activity.club_id)
    )
  );
create policy activity_media_manager_insert on public.club_activity_media
  for insert to authenticated with check (
    exists (
      select 1 from public.club_activities activity
      where activity.id = activity_id
        and public.can_manage_club(activity.club_id)
    )
  );
create policy activity_media_manager_delete on public.club_activity_media
  for delete to authenticated using (
    exists (
      select 1 from public.club_activities activity
      where activity.id = activity_id
        and public.can_manage_club(activity.club_id)
    )
  );

-- Invite candidates: display names only for school peers of a managed club
create or replace function public.list_club_invite_candidates(target_club_id uuid)
returns table (
  user_id uuid,
  display_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    profile.id,
    profile.display_name
  from public.clubs club
  join public.user_school_memberships school_membership
    on school_membership.school_id = club.school_id
   and school_membership.status = 'active'
  join public.profiles profile
    on profile.id = school_membership.user_id
  where club.id = target_club_id
    and public.can_manage_club(target_club_id)
    and not exists (
      select 1
      from public.club_memberships membership
      where membership.club_id = target_club_id
        and membership.user_id = profile.id
        and membership.status in ('invited', 'active')
    )
  order by profile.display_name;
$$;

revoke all on function public.list_club_invite_candidates(uuid) from public;
grant execute on function public.list_club_invite_candidates(uuid) to authenticated;
