-- Production-readiness hardening: authorize sensitive RPCs, tighten media consent,
-- restrict cross-user role probes, revoke overly broad grants.

-- ---------------------------------------------------------------------------
-- P0: Email audience resolution must require club management.
-- ---------------------------------------------------------------------------
create or replace function public.resolve_email_audience_user_ids(
  target_club_id uuid,
  audience public.email_audience_type,
  filter jsonb default '{}'::jsonb
)
returns table (user_id uuid)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  event_uuid uuid := nullif(filter ->> 'event_id', '')::uuid;
  roles text[] := coalesce(
    array(select jsonb_array_elements_text(coalesce(filter -> 'roles', '[]'::jsonb))),
    array[]::text[]
  );
begin
  -- auth.uid() null = service_role / postgres workers; otherwise require club manager.
  if actor is not null and not public.can_manage_club(target_club_id, actor) then
    raise exception 'Club manager role required' using errcode = '42501';
  end if;

  if audience = 'all_members' then
    return query
      select distinct membership.user_id
      from public.club_memberships membership
      where membership.club_id = target_club_id
        and membership.status = 'active';
    return;
  end if;

  if audience = 'officers' then
    return query
      select distinct membership.user_id
      from public.club_memberships membership
      where membership.club_id = target_club_id
        and membership.status = 'active'
        and membership.role in (
          'club_admin','president','vice_president','secretary',
          'treasurer','officer','advisor'
        );
    return;
  end if;

  if audience = 'membership_segment' then
    if coalesce(array_length(roles, 1), 0) = 0 then
      raise exception 'membership_segment requires roles' using errcode = '23514';
    end if;
    return query
      select distinct membership.user_id
      from public.club_memberships membership
      where membership.club_id = target_club_id
        and membership.status = 'active'
        and membership.role::text = any (roles);
    return;
  end if;

  if audience = 'event_registrants' then
    if event_uuid is null then
      raise exception 'event_registrants requires event_id' using errcode = '23514';
    end if;
    if not exists (
      select 1 from public.events
      where id = event_uuid and club_id = target_club_id
    ) then
      raise exception 'Event does not belong to club' using errcode = '23514';
    end if;
    return query
      select distinct rsvp.user_id
      from public.event_rsvps rsvp
      where rsvp.event_id = event_uuid
        and rsvp.status in ('going', 'maybe', 'waitlisted');
    return;
  end if;

  if audience = 'event_attendees' then
    if event_uuid is null then
      raise exception 'event_attendees requires event_id' using errcode = '23514';
    end if;
    if not exists (
      select 1 from public.events
      where id = event_uuid and club_id = target_club_id
    ) then
      raise exception 'Event does not belong to club' using errcode = '23514';
    end if;
    return query
      select distinct membership.user_id
      from public.attendance_sessions session
      join public.attendance_records record on record.session_id = session.id
      join public.club_memberships membership on membership.id = record.membership_id
      where session.club_id = target_club_id
        and session.event_id = event_uuid
        and record.status in ('present', 'late')
        and membership.status = 'active';
    return;
  end if;

  raise exception 'Unsupported audience type' using errcode = '23514';
end;
$$;

create or replace function public.count_email_audience(
  target_club_id uuid,
  audience public.email_audience_type,
  filter jsonb default '{}'::jsonb,
  category public.email_preference_category default 'announcement'
)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  total integer;
begin
  if actor is not null and not public.can_manage_club(target_club_id, actor) then
    raise exception 'Club manager role required' using errcode = '42501';
  end if;

  select count(*)::integer into total
  from public.resolve_email_audience_user_ids(target_club_id, audience, filter) audience_user
  where public.user_allows_email_category(audience_user.user_id, category);

  return coalesce(total, 0);
end;
$$;

-- Preference checks: self only for authenticated callers (campaign workers use
-- service role / nested definer after audience auth).
drop function if exists public.user_allows_email_category(uuid, public.email_preference_category);

create function public.user_allows_email_category(
  target_user_id uuid,
  target_category public.email_preference_category
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is not null
     and target_user_id is distinct from actor
     and not exists (
       select 1
       from public.platform_role_assignments
       where platform_role_assignments.user_id = actor
         and role = 'platform_admin'
         and revoked_at is null
     ) then
    if not exists (
      select 1
      from public.club_memberships membership
      where membership.user_id = target_user_id
        and membership.status = 'active'
        and public.can_manage_club(membership.club_id, actor)
    ) then
      raise exception 'Not authorized to inspect email preferences'
        using errcode = '42501';
    end if;
  end if;

  return case
    when target_category = 'transactional' then true
    when not exists (
      select 1 from public.user_email_preferences pref
      where pref.user_id = target_user_id and pref.category = target_category
    ) then true
    else exists (
      select 1 from public.user_email_preferences pref
      where pref.user_id = target_user_id
        and pref.category = target_category
        and pref.opted_in
    )
  end;
end;
$$;

revoke all on function public.user_allows_email_category(uuid, public.email_preference_category) from public;
grant execute on function public.user_allows_email_category(uuid, public.email_preference_category) to authenticated;
grant execute on function public.user_allows_email_category(uuid, public.email_preference_category) to service_role;

-- ---------------------------------------------------------------------------
-- P0: Prevent cross-user role / membership probing via helper RPCs.
-- Soft-deny (return false) so nested RLS helpers keep working for auth.uid().
-- IMPORTANT: use positional args ($1/$2/$3) — named params collide with columns.
-- ---------------------------------------------------------------------------
create or replace function public.may_inspect_user(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is null
    or $1 is not distinct from auth.uid()
    or exists (
      select 1
      from public.platform_role_assignments assignment
      where assignment.user_id = auth.uid()
        and assignment.role = 'platform_admin'
        and assignment.revoked_at is null
    );
$$;

create or replace function public.is_platform_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($1)
    and exists (
      select 1
      from public.platform_role_assignments assignment
      where assignment.user_id = $1
        and assignment.role = 'platform_admin'
        and assignment.revoked_at is null
    );
$$;

create or replace function public.is_committee_reviewer(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($1)
    and exists (
      select 1
      from public.platform_role_assignments assignment
      where assignment.user_id = $1
        and assignment.role = 'committee_reviewer'
        and assignment.revoked_at is null
    );
$$;

create or replace function public.is_club_member(
  target_club_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($2)
    and exists (
      select 1
      from public.club_memberships membership
      where membership.club_id = $1
        and membership.user_id = $2
        and membership.status = 'active'
    );
$$;

create or replace function public.has_club_role(
  target_club_id uuid,
  allowed_roles public.club_role[],
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($3)
    and exists (
      select 1
      from public.club_memberships membership
      where membership.club_id = $1
        and membership.user_id = $3
        and membership.role = any ($2)
        and membership.status = 'active'
    );
$$;

create or replace function public.is_school_member(
  target_school_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($2)
    and exists (
      select 1
      from public.user_school_memberships membership
      where membership.school_id = $1
        and membership.user_id = $2
        and membership.status = 'active'
    );
$$;

create or replace function public.has_school_role(
  target_school_id uuid,
  allowed_roles public.school_role[],
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($3)
    and exists (
      select 1
      from public.user_school_memberships membership
      where membership.school_id = $1
        and membership.user_id = $3
        and membership.role = any ($2)
        and membership.status = 'active'
    );
$$;

-- ---------------------------------------------------------------------------
-- P0: Media consent required for club/school visibility; under-13 consent
-- only by guardian / school admin / platform admin.
-- ---------------------------------------------------------------------------
create or replace function public.can_view_media_asset(
  target_asset_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.media_assets asset
    where asset.id = $1
      and asset.deleted_at is null
      and (
        asset.uploader_id = $2
        or public.is_platform_admin($2)
        or public.can_manage_school(asset.school_id, $2)
        or (
          asset.visibility = 'public'
          and asset.approved_for_public_at is not null
          and (
            not asset.consent_required
            or asset.consent_state = 'granted'
          )
        )
        or (
          asset.visibility = 'private'
          and (
            asset.uploader_id = $2
            or (asset.club_id is not null and public.can_manage_club(asset.club_id, $2))
            or public.can_manage_school(asset.school_id, $2)
          )
        )
        or (
          asset.visibility = 'club'
          and asset.club_id is not null
          and public.can_view_club(asset.club_id, $2)
          and (
            not asset.consent_required
            or asset.consent_state = 'granted'
          )
        )
        or (
          asset.visibility = 'school'
          and public.is_school_member(asset.school_id, $2)
          and (
            not asset.consent_required
            or asset.consent_state = 'granted'
          )
        )
        or (
          asset.idea_id is not null
          and public.can_view_idea(asset.idea_id, $2)
          and (
            not asset.consent_required
            or asset.consent_state = 'granted'
            or asset.uploader_id = $2
          )
        )
        or (
          asset.storage_bucket = 'course-assets'
          and exists (
            select 1
            from public.stem_resources resource
            join public.stem_course_modules module on module.id = resource.module_id
            join public.stem_courses course on course.id = module.course_id
            where resource.media_asset_id = asset.id
              and resource.is_published
              and module.is_published
              and course.status = 'published'
              and course.is_published
          )
        )
      )
  );
$$;

drop policy if exists media_assets_authorized_select on public.media_assets;
create policy media_assets_authorized_select on public.media_assets
  for select to authenticated using (
    deleted_at is null
    and public.can_view_media_asset(id)
  );

drop policy if exists media_consents_authorized_insert on public.media_consents;
create policy media_consents_authorized_insert on public.media_consents
  for insert to authenticated with check (
    (
      granted_by = auth.uid()
      and (
        (
          subject_user_id = auth.uid()
          and not exists (
            select 1 from public.profiles
            where id = auth.uid() and age_band = 'under_13'
          )
        )
        or public.is_guardian_of(subject_user_id)
      )
    )
    or (
      club_id is not null
      and (
        public.is_platform_admin()
        or exists (
          select 1
          from public.clubs club
          where club.id = club_id
            and public.can_manage_school(club.school_id)
        )
        or (
          public.can_manage_club(club_id)
          and not exists (
            select 1 from public.profiles
            where id = subject_user_id and age_band = 'under_13'
          )
        )
      )
    )
  );

drop policy if exists media_consents_authorized_update on public.media_consents;
create policy media_consents_authorized_update on public.media_consents
  for update to authenticated using (
    granted_by = auth.uid()
    or public.is_guardian_of(subject_user_id)
    or public.is_platform_admin()
    or exists (
      select 1 from public.clubs club
      where club.id = club_id
        and public.can_manage_school(club.school_id)
    )
    or (
      club_id is not null
      and public.can_manage_club(club_id)
      and not exists (
        select 1 from public.profiles
        where id = subject_user_id and age_band = 'under_13'
      )
    )
  ) with check (
    granted_by = auth.uid()
    or public.is_guardian_of(subject_user_id)
    or public.is_platform_admin()
    or exists (
      select 1 from public.clubs club
      where club.id = club_id
        and public.can_manage_school(club.school_id)
    )
    or (
      club_id is not null
      and public.can_manage_club(club_id)
      and not exists (
        select 1 from public.profiles
        where id = subject_user_id and age_band = 'under_13'
      )
    )
  );

-- Disallow SVG in branding bucket (scriptable content).
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif'
]
where id = 'club-branding';

-- ---------------------------------------------------------------------------
-- P1: Renewal enqueue is cron/service only.
-- ---------------------------------------------------------------------------
revoke all on function public.enqueue_renewal_reminders(timestamptz) from public;
revoke all on function public.enqueue_renewal_reminders(timestamptz) from authenticated;
grant execute on function public.enqueue_renewal_reminders(timestamptz) to service_role;

revoke all on function public.may_inspect_user(uuid) from public;
grant execute on function public.may_inspect_user(uuid) to authenticated;
