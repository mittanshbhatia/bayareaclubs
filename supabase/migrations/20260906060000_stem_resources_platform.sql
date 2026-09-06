-- STEM Resources platform: catalog metadata, workflow, club recommendations,
-- learning collections, and engagement metrics (usage only — never grades).

-- Competitive Programming category requested by product.
alter type public.stem_discipline add value if not exists 'competitive_programming';

create type public.course_format as enum (
  'self_paced',
  'video',
  'interactive',
  'reading',
  'project',
  'mixed'
);

alter table public.stem_courses
  add column if not exists status public.publication_status not null default 'draft',
  add column if not exists format public.course_format not null default 'self_paced',
  add column if not exists estimated_minutes integer
    check (estimated_minutes is null or estimated_minutes > 0),
  add column if not exists last_verified_at date,
  add column if not exists archived_at timestamptz;

-- Backfill status from legacy boolean publish flags.
update public.stem_courses
set status = case
  when is_published then 'published'::public.publication_status
  else 'draft'::public.publication_status
end
where status = 'draft' and is_published;

update public.stem_courses
set last_verified_at = coalesce(last_verified_at, (published_at at time zone 'America/Los_Angeles')::date, created_at::date)
where last_verified_at is null;

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
    -- draft, review, scheduled, unpublish path
    new.is_published := false;
    new.published_at := null;
    if new.status <> 'archived' then
      new.archived_at := null;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_stem_course_publish_flags on public.stem_courses;
create trigger sync_stem_course_publish_flags
  before insert or update of status, is_published, published_at, archived_at
  on public.stem_courses
  for each row execute function public.sync_stem_course_publish_flags();

create index if not exists stem_courses_catalog_idx
  on public.stem_courses (status, discipline, difficulty, format)
  where status = 'published' and is_free;

create index if not exists stem_courses_search_idx
  on public.stem_courses
  using gin (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(provider_name, '')
    )
  );

-- Club recommendations (optional — never auto-enrolls).
create table if not exists public.club_resource_recommendations (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  recommended_by uuid not null references public.profiles(id) on delete restrict,
  note text check (note is null or length(trim(note)) between 1 and 500),
  created_at timestamptz not null default statement_timestamp(),
  unique (club_id, course_id)
);

create index if not exists club_resource_recommendations_club_idx
  on public.club_resource_recommendations (club_id, created_at desc);

-- Officer-curated learning tracks (optional enrollment).
create table if not exists public.club_learning_collections (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  description text check (description is null or length(trim(description)) between 1 and 2000),
  created_by uuid not null references public.profiles(id) on delete restrict,
  is_archived boolean not null default false,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create index if not exists club_learning_collections_club_idx
  on public.club_learning_collections (club_id, is_archived, created_at desc);

create table if not exists public.club_learning_collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.club_learning_collections(id) on delete cascade,
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  position integer not null check (position >= 0),
  note text check (note is null or length(trim(note)) between 1 and 400),
  created_at timestamptz not null default statement_timestamp(),
  unique (collection_id, course_id),
  unique (collection_id, position)
);

create index if not exists club_learning_collection_items_collection_idx
  on public.club_learning_collection_items (collection_id, position);

-- Usage engagement only — never academic performance.
create table if not exists public.stem_course_metrics (
  course_id uuid primary key references public.stem_courses(id) on delete cascade,
  subscription_count integer not null default 0 check (subscription_count >= 0),
  start_count integer not null default 0 check (start_count >= 0),
  resource_completion_count integer not null default 0 check (resource_completion_count >= 0),
  course_completion_count integer not null default 0 check (course_completion_count >= 0),
  updated_at timestamptz not null default statement_timestamp()
);

create or replace function public.ensure_stem_course_metrics(target_course_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.stem_course_metrics (course_id)
  values (target_course_id)
  on conflict (course_id) do nothing;
end;
$$;

create or replace function public.touch_stem_course_metrics_on_subscription()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ensure_stem_course_metrics(coalesce(new.course_id, old.course_id));
  if tg_op = 'INSERT' then
    update public.stem_course_metrics
    set subscription_count = subscription_count + 1,
        course_completion_count = course_completion_count
          + case when new.status = 'completed' then 1 else 0 end,
        updated_at = statement_timestamp()
    where course_id = new.course_id;
  elsif tg_op = 'UPDATE' then
    update public.stem_course_metrics
    set course_completion_count = greatest(
          0,
          course_completion_count
            + case when new.status = 'completed' and old.status is distinct from 'completed' then 1 else 0 end
            + case when old.status = 'completed' and new.status is distinct from 'completed' then -1 else 0 end
        ),
        updated_at = statement_timestamp()
    where course_id = new.course_id;
  elsif tg_op = 'DELETE' then
    update public.stem_course_metrics
    set subscription_count = greatest(0, subscription_count - 1),
        course_completion_count = greatest(
          0,
          course_completion_count - case when old.status = 'completed' then 1 else 0 end
        ),
        updated_at = statement_timestamp()
    where course_id = old.course_id;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists stem_metrics_on_subscription on public.course_subscriptions;
create trigger stem_metrics_on_subscription
  after insert or update or delete on public.course_subscriptions
  for each row execute function public.touch_stem_course_metrics_on_subscription();

create or replace function public.touch_stem_course_metrics_on_progress()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_course uuid;
begin
  select subscription.course_id into target_course
  from public.course_subscriptions subscription
  where subscription.id = coalesce(new.subscription_id, old.subscription_id);

  if target_course is null then
    return coalesce(new, old);
  end if;

  perform public.ensure_stem_course_metrics(target_course);

  if tg_op = 'INSERT' then
    update public.stem_course_metrics
    set start_count = start_count + case when new.started_at is not null then 1 else 0 end,
        resource_completion_count = resource_completion_count
          + case when new.completed then 1 else 0 end,
        updated_at = statement_timestamp()
    where course_id = target_course;
  elsif tg_op = 'UPDATE' then
    update public.stem_course_metrics
    set start_count = start_count
          + case
              when new.started_at is not null and old.started_at is null then 1
              else 0
            end,
        resource_completion_count = greatest(
          0,
          resource_completion_count
            + case when new.completed and not old.completed then 1 else 0 end
            + case when old.completed and not new.completed then -1 else 0 end
        ),
        updated_at = statement_timestamp()
    where course_id = target_course;
  elsif tg_op = 'DELETE' then
    update public.stem_course_metrics
    set start_count = greatest(0, start_count - case when old.started_at is not null then 1 else 0 end),
        resource_completion_count = greatest(
          0,
          resource_completion_count - case when old.completed then 1 else 0 end
        ),
        updated_at = statement_timestamp()
    where course_id = target_course;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists stem_metrics_on_progress on public.course_progress;
create trigger stem_metrics_on_progress
  after insert or update or delete on public.course_progress
  for each row execute function public.touch_stem_course_metrics_on_progress();

create or replace function public.ensure_stem_course_metrics_on_course()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.ensure_stem_course_metrics(new.id);
  return new;
end;
$$;

drop trigger if exists stem_metrics_on_course on public.stem_courses;
create trigger stem_metrics_on_course
  after insert on public.stem_courses
  for each row execute function public.ensure_stem_course_metrics_on_course();

-- RLS
alter table public.club_resource_recommendations enable row level security;
alter table public.club_learning_collections enable row level security;
alter table public.club_learning_collection_items enable row level security;
alter table public.stem_course_metrics enable row level security;

drop policy if exists club_resource_recommendations_select on public.club_resource_recommendations;
drop policy if exists club_resource_recommendations_insert on public.club_resource_recommendations;
drop policy if exists club_resource_recommendations_delete on public.club_resource_recommendations;
drop policy if exists club_learning_collections_select on public.club_learning_collections;
drop policy if exists club_learning_collections_write on public.club_learning_collections;
drop policy if exists club_learning_collections_update on public.club_learning_collections;
drop policy if exists club_learning_collections_delete on public.club_learning_collections;
drop policy if exists club_learning_collection_items_select on public.club_learning_collection_items;
drop policy if exists club_learning_collection_items_write on public.club_learning_collection_items;
drop policy if exists club_learning_collection_items_update on public.club_learning_collection_items;
drop policy if exists club_learning_collection_items_delete on public.club_learning_collection_items;
drop policy if exists stem_course_metrics_admin_select on public.stem_course_metrics;

create policy club_resource_recommendations_select on public.club_resource_recommendations
  for select to authenticated using (
    public.is_club_member(club_id) or public.can_manage_club(club_id)
  );

create policy club_resource_recommendations_insert on public.club_resource_recommendations
  for insert to authenticated with check (
    recommended_by = auth.uid()
    and public.can_manage_club(club_id)
    and exists (
      select 1 from public.stem_courses course
      where course.id = course_id
        and course.is_free
        and course.status = 'published'
        and course.is_published
    )
  );

create policy club_resource_recommendations_delete on public.club_resource_recommendations
  for delete to authenticated using (public.can_manage_club(club_id));

create policy club_learning_collections_select on public.club_learning_collections
  for select to authenticated using (
    public.is_club_member(club_id) or public.can_manage_club(club_id)
  );

create policy club_learning_collections_write on public.club_learning_collections
  for insert to authenticated with check (
    created_by = auth.uid() and public.can_manage_club(club_id)
  );

create policy club_learning_collections_update on public.club_learning_collections
  for update to authenticated
  using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));

create policy club_learning_collections_delete on public.club_learning_collections
  for delete to authenticated using (public.can_manage_club(club_id));

create policy club_learning_collection_items_select on public.club_learning_collection_items
  for select to authenticated using (
    exists (
      select 1 from public.club_learning_collections collection
      where collection.id = collection_id
        and (
          public.is_club_member(collection.club_id)
          or public.can_manage_club(collection.club_id)
        )
    )
  );

create policy club_learning_collection_items_write on public.club_learning_collection_items
  for insert to authenticated with check (
    exists (
      select 1 from public.club_learning_collections collection
      where collection.id = collection_id
        and public.can_manage_club(collection.club_id)
    )
    and exists (
      select 1 from public.stem_courses course
      where course.id = course_id
        and course.is_free
        and course.status = 'published'
        and course.is_published
    )
  );

create policy club_learning_collection_items_update on public.club_learning_collection_items
  for update to authenticated
  using (
    exists (
      select 1 from public.club_learning_collections collection
      where collection.id = collection_id
        and public.can_manage_club(collection.club_id)
    )
  )
  with check (
    exists (
      select 1 from public.club_learning_collections collection
      where collection.id = collection_id
        and public.can_manage_club(collection.club_id)
    )
  );

create policy club_learning_collection_items_delete on public.club_learning_collection_items
  for delete to authenticated using (
    exists (
      select 1 from public.club_learning_collections collection
      where collection.id = collection_id
        and public.can_manage_club(collection.club_id)
    )
  );

create policy stem_course_metrics_admin_select on public.stem_course_metrics
  for select to authenticated using (public.is_platform_admin());

drop trigger if exists set_updated_at_club_learning_collections on public.club_learning_collections;
create trigger set_updated_at_club_learning_collections
  before update on public.club_learning_collections
  for each row execute function public.set_updated_at();

drop trigger if exists audit_club_resource_recommendations on public.club_resource_recommendations;
create trigger audit_club_resource_recommendations
  after insert or update or delete on public.club_resource_recommendations
  for each row execute function public.audit_row_change('club_resource_recommendation');

drop trigger if exists audit_club_learning_collections on public.club_learning_collections;
create trigger audit_club_learning_collections
  after insert or update or delete on public.club_learning_collections
  for each row execute function public.audit_row_change('club_learning_collection');

-- Refresh published catalog views with richer metadata.
drop view if exists public.published_stem_resources;
drop view if exists public.published_stem_course_modules;
drop view if exists public.published_stem_courses;

create view public.published_stem_courses
with (security_barrier = true, security_invoker = false)
as
select
  course.id,
  course.slug,
  course.title,
  course.description,
  course.discipline,
  course.grade_bands,
  course.difficulty,
  course.format,
  course.estimated_minutes,
  course.thumbnail_asset_id,
  course.provider_name,
  course.source_url,
  course.license_name,
  course.license_url,
  course.is_free,
  course.last_verified_at,
  course.published_at
from public.stem_courses course
where course.is_free
  and course.status = 'published'
  and course.is_published
  and course.published_at is not null
  and course.published_at <= now()
  and course.archived_at is null;

create view public.published_stem_course_modules
with (security_barrier = true, security_invoker = false)
as
select
  module.id,
  module.course_id,
  module.position,
  module.title,
  module.description,
  module.estimated_minutes
from public.stem_course_modules module
join public.stem_courses course on course.id = module.course_id
where module.is_published
  and course.is_free
  and course.status = 'published'
  and course.is_published
  and course.published_at is not null
  and course.published_at <= now()
  and course.archived_at is null;

create view public.published_stem_resources
with (security_barrier = true, security_invoker = false)
as
select
  resource.id,
  resource.module_id,
  resource.position,
  resource.resource_type,
  resource.title,
  resource.description,
  resource.external_url,
  resource.media_asset_id,
  resource.estimated_minutes
from public.stem_resources resource
join public.stem_course_modules module on module.id = resource.module_id
join public.stem_courses course on course.id = module.course_id
where resource.is_published
  and module.is_published
  and course.is_free
  and course.status = 'published'
  and course.is_published
  and course.published_at is not null
  and course.published_at <= now()
  and course.archived_at is null;

revoke all on public.published_stem_courses from public;
revoke all on public.published_stem_course_modules from public;
revoke all on public.published_stem_resources from public;
grant select on public.published_stem_courses to anon, authenticated;
grant select on public.published_stem_course_modules to anon, authenticated;
grant select on public.published_stem_resources to anon, authenticated;

-- Keep subscription insert policy aligned with status workflow.
drop policy if exists subscriptions_own_insert on public.course_subscriptions;
create policy subscriptions_own_insert on public.course_subscriptions
  for insert to authenticated with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.stem_courses course
      where course.id = course_id
        and course.is_free
        and course.status = 'published'
        and course.is_published
        and course.archived_at is null
    )
  );
