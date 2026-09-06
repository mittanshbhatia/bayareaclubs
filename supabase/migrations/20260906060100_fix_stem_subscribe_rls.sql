-- Allow members to see free published courses for subscribe checks,
-- and align published_at with transaction now() for catalog visibility.

create or replace function public.sync_stem_course_publish_flags()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' then
    new.is_published := true;
    new.published_at := coalesce(new.published_at, now());
    new.archived_at := null;
  elsif new.status = 'archived' then
    new.is_published := false;
    new.published_at := null;
    new.archived_at := coalesce(new.archived_at, now());
  else
    new.is_published := false;
    new.published_at := null;
    if new.status <> 'archived' then
      new.archived_at := null;
    end if;
  end if;
  return new;
end;
$$;

drop policy if exists courses_published_select on public.stem_courses;
create policy courses_published_select on public.stem_courses
  for select to authenticated using (
    is_free
    and status = 'published'
    and is_published
    and archived_at is null
    and published_at is not null
    and published_at <= now()
  );

drop policy if exists modules_published_select on public.stem_course_modules;
create policy modules_published_select on public.stem_course_modules
  for select to authenticated using (
    is_published
    and exists (
      select 1 from public.stem_courses course
      where course.id = course_id
        and course.is_free
        and course.status = 'published'
        and course.is_published
        and course.archived_at is null
    )
  );

drop policy if exists resources_published_select on public.stem_resources;
create policy resources_published_select on public.stem_resources
  for select to authenticated using (
    is_published
    and exists (
      select 1
      from public.stem_course_modules module
      join public.stem_courses course on course.id = module.course_id
      where module.id = module_id
        and module.is_published
        and course.is_free
        and course.status = 'published'
        and course.is_published
        and course.archived_at is null
    )
  );
