-- Production media management: upload sessions, metadata enrichment,
-- soft deletion, event attachments, tighter storage authorization.

create type public.media_upload_status as enum (
  'pending',
  'uploaded',
  'finalized',
  'aborted',
  'expired'
);

create type public.media_consent_state as enum (
  'not_required',
  'pending',
  'granted',
  'restricted'
);

-- Enrich media metadata; soft-delete instead of silent hard deletes.
alter table public.media_assets
  add column if not exists width integer check (width is null or width > 0),
  add column if not exists height integer check (height is null or height > 0),
  add column if not exists duration_seconds numeric(12, 3)
    check (duration_seconds is null or duration_seconds > 0),
  add column if not exists consent_state public.media_consent_state
    not null default 'not_required',
  add column if not exists related_event_id uuid references public.events(id) on delete set null,
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid references public.profiles(id) on delete set null,
  add column if not exists deletion_reason text
    check (deletion_reason is null or length(trim(deletion_reason)) between 3 and 500),
  add column if not exists upload_session_id uuid;

alter table public.media_assets
  drop constraint if exists media_assets_deletion_integrity;
alter table public.media_assets
  add constraint media_assets_deletion_integrity check (
    (deleted_at is null and deleted_by is null and deletion_reason is null)
    or (deleted_at is not null and deleted_by is not null)
  );

create index if not exists media_assets_club_type_idx
  on public.media_assets (club_id, media_type, created_at desc)
  where deleted_at is null;
create index if not exists media_assets_club_uploader_idx
  on public.media_assets (club_id, uploader_id, created_at desc)
  where deleted_at is null;
create index if not exists media_assets_related_event_idx
  on public.media_assets (related_event_id)
  where related_event_id is not null and deleted_at is null;
create index if not exists media_assets_active_path_idx
  on public.media_assets (storage_bucket, storage_path)
  where deleted_at is null;

-- Upload intents: metadata row is created only after a safe finalize.
create table if not exists public.media_upload_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  club_id uuid references public.clubs(id) on delete cascade,
  idea_id uuid references public.club_ideas(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete cascade,
  storage_bucket text not null check (
    storage_bucket in ('club-branding', 'club-media', 'club-documents', 'course-assets')
  ),
  storage_path text not null check (
    storage_path <> ''
    and storage_path !~ '(^|/)\.\.?(/|$)'
  ),
  declared_mime_type text not null check (length(trim(declared_mime_type)) between 3 and 127),
  declared_size_bytes bigint not null check (declared_size_bytes > 0),
  media_type public.media_type not null,
  title text not null check (length(trim(title)) between 1 and 160),
  description text,
  visibility public.visibility_level not null default 'private'
    check (visibility <> 'public'),
  consent_required boolean not null default false,
  related_event_id uuid references public.events(id) on delete set null,
  status public.media_upload_status not null default 'pending',
  media_asset_id uuid references public.media_assets(id) on delete set null,
  detected_mime_type text,
  error_message text,
  expires_at timestamptz not null default (statement_timestamp() + interval '24 hours'),
  uploaded_at timestamptz,
  finalized_at timestamptz,
  aborted_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (storage_bucket, storage_path),
  check (club_id is not null or idea_id is not null or storage_bucket = 'course-assets')
);

create index if not exists media_upload_sessions_uploader_idx
  on public.media_upload_sessions (uploader_id, status, created_at desc);
create index if not exists media_upload_sessions_club_idx
  on public.media_upload_sessions (club_id, created_at desc)
  where club_id is not null;

alter table public.media_assets
  drop constraint if exists media_assets_upload_session_id_fkey;
alter table public.media_assets
  add constraint media_assets_upload_session_id_fkey
  foreign key (upload_session_id) references public.media_upload_sessions(id)
  on delete set null;

-- Event ↔ media attachments (activities/highlights/newsletters already link media).
create table if not exists public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  unique (event_id, media_asset_id)
);

create index if not exists event_media_event_idx on public.event_media (event_id);
create index if not exists event_media_asset_idx on public.event_media (media_asset_id);

-- Keep bucket limits/privacy aligned with product rules.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'club-branding',
    'club-branding',
    false,
    5242880,
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'
    ]::text[]
  ),
  (
    'club-media',
    'club-media',
    false,
    524288000,
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]::text[]
  ),
  (
    'club-documents',
    'club-documents',
    false,
    52428800,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg', 'image/png', 'image/webp'
    ]::text[]
  ),
  (
    'course-assets',
    'course-assets',
    false,
    524288000,
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm',
      'application/pdf',
      'application/zip',
      'text/plain'
    ]::text[]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Soft-deleted assets are not viewable.
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
        (
          asset.visibility = 'public'
          and asset.approved_for_public_at is not null
          and (
            not asset.consent_required
            or asset.consent_state = 'granted'
          )
        )
        or asset.uploader_id = $2
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
        )
        or (
          asset.visibility = 'school'
          and public.is_school_member(asset.school_id, $2)
        )
        or (
          asset.idea_id is not null
          and public.can_view_idea(asset.idea_id, $2)
        )
        or public.can_manage_school(asset.school_id, $2)
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
              and course.is_published
          )
        )
      )
  );
$$;

create or replace function public.refresh_media_consent_state(target_asset_id uuid)
returns public.media_consent_state
language plpgsql
security definer
set search_path = ''
as $$
declare
  asset_row public.media_assets%rowtype;
  next_state public.media_consent_state;
begin
  select * into asset_row from public.media_assets where id = target_asset_id;
  if not found then
    return 'not_required';
  end if;

  if not asset_row.consent_required then
    next_state := 'not_required';
  elsif exists (
    select 1 from public.media_consents
    where media_asset_id = target_asset_id
      and (
        status in ('denied', 'revoked')
        or revoked_at is not null
        or (expires_at is not null and expires_at <= statement_timestamp())
      )
  ) then
    next_state := 'restricted';
  elsif exists (
    select 1 from public.media_consents
    where media_asset_id = target_asset_id
      and status = 'granted'
      and revoked_at is null
      and (expires_at is null or expires_at > statement_timestamp())
  ) then
    next_state := 'granted';
  else
    next_state := 'pending';
  end if;

  update public.media_assets
  set consent_state = next_state, updated_at = statement_timestamp()
  where id = target_asset_id;

  return next_state;
end;
$$;

create or replace function public.media_consents_refresh_asset()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.media_asset_id is not null then
      perform public.refresh_media_consent_state(old.media_asset_id);
    end if;
    return old;
  end if;
  if new.media_asset_id is not null then
    perform public.refresh_media_consent_state(new.media_asset_id);
  end if;
  if tg_op = 'UPDATE'
    and old.media_asset_id is not null
    and old.media_asset_id is distinct from new.media_asset_id then
    perform public.refresh_media_consent_state(old.media_asset_id);
  end if;
  return new;
end;
$$;

drop trigger if exists media_consents_refresh_asset on public.media_consents;
create trigger media_consents_refresh_asset
  after insert or update or delete on public.media_consents
  for each row execute function public.media_consents_refresh_asset();

-- Soft-delete RPC with audited reason; removes storage object when safe.
create or replace function public.soft_delete_media_asset(
  target_asset_id uuid,
  reason text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  asset_row public.media_assets%rowtype;
  note text := trim(coalesce(reason, ''));
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if length(note) < 3 then
    raise exception 'Deletion reason is required' using errcode = '23514';
  end if;

  select * into asset_row
  from public.media_assets
  where id = target_asset_id
  for update;

  if not found then
    raise exception 'Media asset not found' using errcode = 'P0002';
  end if;
  if asset_row.deleted_at is not null then
    return asset_row.id;
  end if;

  if not (
    asset_row.uploader_id = actor
    or (asset_row.club_id is not null and public.can_manage_club(asset_row.club_id, actor))
    or public.can_manage_school(asset_row.school_id, actor)
  ) then
    raise exception 'Not authorized to delete media' using errcode = '42501';
  end if;

  update public.media_assets
  set
    deleted_at = statement_timestamp(),
    deleted_by = actor,
    deletion_reason = note,
    updated_at = statement_timestamp()
  where id = target_asset_id;

  insert into public.audit_logs (
    actor_id, action, entity_type, entity_id, school_id, club_id, metadata
  )
  values (
    actor,
    'media_asset.soft_delete',
    'media_assets',
    target_asset_id,
    asset_row.school_id,
    asset_row.club_id,
    jsonb_build_object(
      'storage_bucket', asset_row.storage_bucket,
      'storage_path', asset_row.storage_path,
      'reason', note,
      'visibility', asset_row.visibility::text
    )
  );

  -- Binary removal is performed by the application with a Storage API call
  -- after this RPC succeeds (avoids cross-schema RLS edge cases).

  return target_asset_id;
end;
$$;

create or replace function public.abort_media_upload_session(target_session_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  session_row public.media_upload_sessions%rowtype;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into session_row
  from public.media_upload_sessions
  where id = target_session_id
  for update;

  if not found then
    raise exception 'Upload session not found' using errcode = 'P0002';
  end if;
  if session_row.uploader_id <> actor
    and not (
      session_row.club_id is not null
      and public.can_manage_club(session_row.club_id, actor)
    )
    and not public.can_manage_school(session_row.school_id, actor)
  then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if session_row.status = 'finalized' then
    raise exception 'Finalized uploads cannot be aborted' using errcode = '23514';
  end if;

  update public.media_upload_sessions
  set
    status = 'aborted',
    aborted_at = statement_timestamp(),
    updated_at = statement_timestamp()
  where id = target_session_id;

  return target_session_id;
end;
$$;

-- RLS
alter table public.media_upload_sessions enable row level security;
alter table public.event_media enable row level security;

drop policy if exists media_assets_authorized_select on public.media_assets;
create policy media_assets_authorized_select on public.media_assets
  for select to authenticated using (
    deleted_at is null
    and (
      uploader_id = auth.uid()
      or (club_id is not null and public.can_view_club(club_id) and visibility in ('club', 'school'))
      or (club_id is not null and public.can_manage_club(club_id))
      or (visibility = 'school' and public.is_school_member(school_id))
      or (idea_id is not null and public.can_view_idea(idea_id))
      or public.can_manage_school(school_id)
      or public.can_view_media_asset(id)
    )
  );

drop policy if exists media_upload_sessions_own_select on public.media_upload_sessions;
drop policy if exists media_upload_sessions_own_insert on public.media_upload_sessions;
drop policy if exists media_upload_sessions_own_update on public.media_upload_sessions;
create policy media_upload_sessions_own_select on public.media_upload_sessions
  for select to authenticated using (
    uploader_id = auth.uid()
    or (club_id is not null and public.can_manage_club(club_id))
    or public.can_manage_school(school_id)
  );
create policy media_upload_sessions_own_insert on public.media_upload_sessions
  for insert to authenticated with check (
    uploader_id = auth.uid()
    and visibility <> 'public'
    and (
      (club_id is not null and public.is_club_member(club_id))
      or (idea_id is not null and public.can_edit_idea(idea_id))
      or (storage_bucket = 'course-assets' and public.is_platform_admin())
    )
  );
create policy media_upload_sessions_own_update on public.media_upload_sessions
  for update to authenticated using (
    uploader_id = auth.uid()
    or (club_id is not null and public.can_manage_club(club_id))
    or public.can_manage_school(school_id)
  )
  with check (
    uploader_id = auth.uid()
    or (club_id is not null and public.can_manage_club(club_id))
    or public.can_manage_school(school_id)
  );

drop policy if exists event_media_member_select on public.event_media;
drop policy if exists event_media_manager_insert on public.event_media;
drop policy if exists event_media_manager_delete on public.event_media;
create policy event_media_member_select on public.event_media
  for select to authenticated using (
    exists (
      select 1 from public.events event
      where event.id = event_id and public.can_view_event(event.id)
    )
  );
create policy event_media_manager_insert on public.event_media
  for insert to authenticated with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
    and exists (
      select 1 from public.media_assets asset
      where asset.id = media_asset_id
        and asset.deleted_at is null
        and asset.club_id = (
          select club_id from public.events where id = event_id
        )
    )
  );
create policy event_media_manager_delete on public.event_media
  for delete to authenticated using (
    exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );

-- Storage: reads still require authorized media_assets metadata (blocks path guessing).
drop policy if exists storage_authorized_read on storage.objects;
create policy storage_authorized_read on storage.objects
  for select to anon, authenticated using (
    bucket_id in ('club-branding', 'club-media', 'club-documents', 'course-assets')
    and exists (
      select 1
      from public.media_assets asset
      where asset.storage_bucket = bucket_id
        and asset.storage_path = name
        and asset.deleted_at is null
        and public.can_view_media_asset(asset.id)
    )
  );

-- Uploads may land only under the caller's uid folder, and only for a live session path.
drop policy if exists storage_user_upload on storage.objects;
create policy storage_user_upload on storage.objects
  for insert to authenticated with check (
    bucket_id in ('club-branding', 'club-media', 'club-documents', 'course-assets')
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.media_upload_sessions session
      where session.uploader_id = auth.uid()
        and session.storage_bucket = bucket_id
        and session.storage_path = name
        and session.status in ('pending', 'uploaded')
        and session.expires_at > statement_timestamp()
    )
  );

drop policy if exists storage_owner_update on storage.objects;
create policy storage_owner_update on storage.objects
  for update to authenticated using (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.media_assets asset
      where asset.storage_bucket = bucket_id
        and asset.storage_path = name
        and asset.deleted_at is null
        and (
          (asset.club_id is not null and public.can_manage_club(asset.club_id))
          or public.can_manage_school(asset.school_id)
        )
    )
  ) with check (
    bucket_id in ('club-branding', 'club-media', 'club-documents', 'course-assets')
  );

drop policy if exists storage_owner_delete on storage.objects;
create policy storage_owner_delete on storage.objects
  for delete to authenticated using (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.media_assets asset
      where asset.storage_bucket = bucket_id
        and asset.storage_path = name
        and (
          (asset.club_id is not null and public.can_manage_club(asset.club_id))
          or public.can_manage_school(asset.school_id)
        )
    )
  );

drop trigger if exists audit_media_upload_sessions on public.media_upload_sessions;
create trigger audit_media_upload_sessions
  after insert or update or delete on public.media_upload_sessions
  for each row execute function public.audit_row_change('media_upload_session');

drop trigger if exists audit_event_media on public.event_media;
create trigger audit_event_media
  after insert or update or delete on public.event_media
  for each row execute function public.audit_row_change('event_media');

drop trigger if exists set_updated_at_media_upload_sessions on public.media_upload_sessions;
create trigger set_updated_at_media_upload_sessions
  before update on public.media_upload_sessions
  for each row execute function public.set_updated_at();

revoke all on function public.soft_delete_media_asset(uuid, text) from public;
revoke all on function public.abort_media_upload_session(uuid) from public;
revoke all on function public.refresh_media_consent_state(uuid) from public;
grant execute on function public.soft_delete_media_asset(uuid, text) to authenticated;
grant execute on function public.abort_media_upload_session(uuid) to authenticated;
grant execute on function public.refresh_media_consent_state(uuid) to authenticated;
grant execute on function public.can_view_media_asset(uuid, uuid) to authenticated, anon;

-- Published view excludes soft-deleted and restricted consent.
create or replace view public.published_media_assets
with (security_barrier = true)
as
select
  asset.id,
  asset.club_id,
  asset.media_type,
  asset.mime_type,
  asset.size_bytes,
  asset.title,
  asset.description,
  asset.created_at
from public.media_assets asset
where asset.visibility = 'public'
  and asset.deleted_at is null
  and asset.approved_for_public_at is not null
  and (
    not asset.consent_required
    or asset.consent_state = 'granted'
  );

grant select on public.published_media_assets to anon, authenticated;
