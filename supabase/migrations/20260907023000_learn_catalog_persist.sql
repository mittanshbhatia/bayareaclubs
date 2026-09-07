-- Persist original AP catalog art and allow a service-role catalog job
-- to finish draft → review → approved → published. No binaries in Postgres.

alter table public.stem_courses
  add column if not exists is_featured boolean not null default false;

create index if not exists stem_courses_featured_idx
  on public.stem_courses (is_featured, title)
  where course_kind = 'ap' and status = 'published' and is_published;

create or replace function public.enforce_ap_course_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.course_kind = 'ap' and new.status not in ('draft', 'review') then
      raise exception 'AP courses must start as draft or review';
    end if;
    return new;
  end if;

  if new.course_kind <> 'ap' and old.course_kind <> 'ap' then
    return new;
  end if;

  if new.status is not distinct from old.status then
    return new;
  end if;

  if new.status = 'published' and old.status is distinct from 'approved' then
    raise exception 'AP courses can be published only after approval';
  end if;

  if new.status = 'approved' and old.status is distinct from 'review' then
    raise exception 'AP courses can be approved only from review';
  end if;

  if new.status = 'review' and old.status not in ('draft', 'approved') then
    raise exception 'AP courses can enter review only from draft or approved';
  end if;

  if new.status = 'archived' and old.status is distinct from 'published' then
    raise exception 'AP courses can be archived only from published';
  end if;

  if new.status = 'draft' and old.status not in ('draft', 'review') then
    raise exception 'AP courses cannot return to draft from %', old.status;
  end if;

  if new.status = 'scheduled' then
    raise exception 'AP courses do not use scheduled publication';
  end if;

  if new.status = 'published'
    and not public.is_platform_admin()
    and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Only a platform administrator may publish an approved AP course';
  end if;

  return new;
end;
$$;

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
        or (
          asset.storage_bucket = 'course-assets'
          and $2 is not null
          and exists (
            select 1
            from public.stem_courses course
            where course.thumbnail_asset_id = asset.id
              and course.course_kind = 'ap'
              and course.source_basis = 'ORIGINAL'
              and course.status = 'published'
              and course.is_published
          )
        )
      )
  );
$$;

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm',
  'application/pdf',
  'application/zip',
  'text/plain'
]
where id = 'course-assets';
