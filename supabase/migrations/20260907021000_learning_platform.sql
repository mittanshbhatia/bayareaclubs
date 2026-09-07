-- Learning platform: AP course units/lessons/questions, review workflow,
-- private attempts, and school feature flags.
-- Reuses stem_courses + stem_course_modules. Does not rewrite 20260907020000_*.
-- Coordinates with Agent 02: add 'approved' and AP course columns only if missing.

-- ---------------------------------------------------------------------------
-- Enum + parent course columns (safe if Agent 02 already applied them)
-- ---------------------------------------------------------------------------

alter type public.publication_status add value if not exists 'approved';

alter table public.stem_courses
  add column if not exists course_kind text not null default 'stem',
  add column if not exists course_namespace text,
  add column if not exists source_basis text not null default 'ORIGINAL',
  add column if not exists framework_code text,
  add column if not exists framework_year integer,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references public.profiles(id) on delete restrict;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'stem_courses_course_kind_check'
      and conrelid = 'public.stem_courses'::regclass
  ) then
    alter table public.stem_courses
      add constraint stem_courses_course_kind_check
      check (course_kind in ('stem', 'ap'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stem_courses_source_basis_check'
      and conrelid = 'public.stem_courses'::regclass
  ) then
    alter table public.stem_courses
      add constraint stem_courses_source_basis_check
      check (source_basis in ('ORIGINAL', 'LICENSED_EXTERNAL'));
  end if;

end
$$;

alter table public.stem_course_modules
  add column if not exists slug text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'stem_course_modules_slug_check'
      and conrelid = 'public.stem_course_modules'::regclass
  ) then
    alter table public.stem_course_modules
      add constraint stem_course_modules_slug_check
      check (slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
  end if;
end
$$;

create unique index if not exists stem_course_modules_course_slug_uidx
  on public.stem_course_modules (course_id, slug)
  where slug is not null;

-- Approved is never public. Only published is catalog-visible.
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
    -- draft, review, approved, scheduled
    new.is_published := false;
    new.published_at := null;
    if new.status <> 'archived' then
      new.archived_at := null;
    end if;
  end if;

  if new.status = 'approved' then
    new.approved_at := coalesce(new.approved_at, now());
    new.approved_by := coalesce(new.approved_by, auth.uid());
  elsif new.status in ('draft', 'review', 'scheduled') then
    new.approved_at := null;
    new.approved_by := null;
  end if;

  return new;
end;
$$;

-- AP courses cannot skip draft → review → approved → published, and cannot
-- publish from draft/review. STEM may still use scheduled.
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

  if new.status = 'published' and not public.is_platform_admin() then
    raise exception 'Only a platform administrator may publish an approved AP course';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_ap_course_status_transition on public.stem_courses;
create trigger enforce_ap_course_status_transition
  before insert or update of status, course_kind
  on public.stem_courses
  for each row execute function public.enforce_ap_course_status_transition();

-- Keep STEM public catalog free of AP rows.
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
  and coalesce(course.course_kind, 'stem') = 'stem'
  and course.status = 'published'
  and course.is_published
  and course.published_at is not null
  and course.published_at <= now()
  and course.archived_at is null;

create or replace view public.published_stem_course_modules
with (security_barrier = true, security_invoker = false)
as
select
  module.id,
  module.course_id,
  module.position,
  module.title,
  module.description,
  module.estimated_minutes,
  module.slug
from public.stem_course_modules module
join public.stem_courses course on course.id = module.course_id
where module.is_published
  and coalesce(course.course_kind, 'stem') = 'stem'
  and course.is_free
  and course.status = 'published'
  and course.is_published
  and course.published_at is not null
  and course.published_at <= now()
  and course.archived_at is null;

create or replace view public.published_stem_resources
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
  and coalesce(course.course_kind, 'stem') = 'stem'
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

-- ---------------------------------------------------------------------------
-- Learning tables (no binaries — media via media_assets / course-assets)
-- ---------------------------------------------------------------------------

create table public.learning_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  module_id uuid not null references public.stem_course_modules(id) on delete cascade,
  namespace text not null check (namespace ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  position integer not null check (position >= 0),
  title text not null check (length(trim(title)) between 1 and 200),
  body_plain text not null check (length(trim(body_plain)) between 1 and 20000),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  status public.publication_status not null default 'draft',
  media_asset_id uuid references public.media_assets(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (course_id, slug),
  unique (module_id, position)
);

create table public.learning_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  namespace text not null check (namespace ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  module_id uuid references public.stem_course_modules(id) on delete cascade,
  lesson_id uuid references public.learning_lessons(id) on delete set null,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  prompt text not null check (length(trim(prompt)) between 1 and 4000),
  choices jsonb not null default '[]'::jsonb,
  answer_key jsonb not null,
  explanation text check (explanation is null or length(trim(explanation)) between 1 and 4000),
  question_type text not null check (question_type in ('multiple_choice', 'short_response')),
  objective_codes text[] not null default '{}',
  difficulty public.course_difficulty not null default 'beginner',
  source_basis text not null default 'ORIGINAL'
    check (source_basis in ('ORIGINAL', 'LICENSED_EXTERNAL')),
  status public.publication_status not null default 'draft',
  version integer not null default 1 check (version >= 1),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (namespace, slug),
  check (jsonb_typeof(choices) = 'array'),
  check (jsonb_typeof(answer_key) = 'object')
);

create table public.learning_question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.learning_questions(id) on delete cascade,
  version integer not null check (version >= 1),
  prompt text not null,
  choices jsonb not null,
  answer_key jsonb not null,
  explanation text,
  question_type text not null,
  source_basis text not null,
  status public.publication_status not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  unique (question_id, version)
);

create table public.learning_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.learning_questions(id) on delete cascade,
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  response jsonb not null,
  is_correct boolean not null,
  created_at timestamptz not null default statement_timestamp(),
  check (jsonb_typeof(response) = 'object')
);

create table public.learning_review_events (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  from_status public.publication_status not null,
  to_status public.publication_status not null,
  notes text check (notes is null or length(trim(notes)) between 1 and 2000),
  created_at timestamptz not null default statement_timestamp()
);

create table public.school_course_features (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  is_enabled boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (school_id, course_id)
);

create index if not exists learning_lessons_namespace_idx
  on public.learning_lessons (namespace, status, position);
create index if not exists learning_lessons_course_status_idx
  on public.learning_lessons (course_id, status, position);
create index if not exists learning_questions_namespace_idx
  on public.learning_questions (namespace, status);
create index if not exists learning_questions_course_idx
  on public.learning_questions (course_id, status);
create index if not exists learning_attempts_user_idx
  on public.learning_attempts (user_id, created_at desc);
create index if not exists learning_attempts_course_idx
  on public.learning_attempts (course_id, created_at desc);
create index if not exists learning_attempts_question_idx
  on public.learning_attempts (question_id, created_at desc);
create index if not exists learning_review_events_course_idx
  on public.learning_review_events (course_id, created_at desc);
create index if not exists school_course_features_school_idx
  on public.school_course_features (school_id, is_enabled);
create index if not exists stem_courses_ap_catalog_idx
  on public.stem_courses (course_kind, status, title)
  where course_kind = 'ap' and status = 'published' and is_published;
create index if not exists stem_courses_ap_namespace_status_idx
  on public.stem_courses (course_namespace, status)
  where course_kind = 'ap';

-- ---------------------------------------------------------------------------
-- Integrity: namespace isolation, no HTML blobs, version snapshots
-- ---------------------------------------------------------------------------

create or replace function public.enforce_learning_namespace_match()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  course_ns text;
  course_kind text;
  module_course uuid;
begin
  select course.course_namespace, course.course_kind
    into course_ns, course_kind
  from public.stem_courses course
  where course.id = new.course_id;

  if course_kind is distinct from 'ap' then
    raise exception 'Learning content must belong to an AP course';
  end if;
  if course_ns is null or new.namespace is distinct from course_ns then
    raise exception 'Learning namespace must match the course namespace';
  end if;

  if tg_table_name = 'learning_lessons' or new.module_id is not null then
    select module.course_id into module_course
    from public.stem_course_modules module
    where module.id = new.module_id;
    if new.module_id is not null and module_course is distinct from new.course_id then
      raise exception 'Learning module must belong to the same course';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists learning_lessons_namespace_match on public.learning_lessons;
create trigger learning_lessons_namespace_match
  before insert or update of course_id, module_id, namespace
  on public.learning_lessons
  for each row execute function public.enforce_learning_namespace_match();

drop trigger if exists learning_questions_namespace_match on public.learning_questions;
create trigger learning_questions_namespace_match
  before insert or update of course_id, module_id, namespace
  on public.learning_questions
  for each row execute function public.enforce_learning_namespace_match();

create or replace function public.snapshot_learning_question_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.learning_question_versions (
      question_id, version, prompt, choices, answer_key, explanation,
      question_type, source_basis, status, created_by
    ) values (
      new.id, new.version, new.prompt, new.choices, new.answer_key, new.explanation,
      new.question_type, new.source_basis, new.status, new.created_by
    );
    return new;
  end if;

  if new.prompt is distinct from old.prompt
    or new.choices is distinct from old.choices
    or new.answer_key is distinct from old.answer_key
    or new.explanation is distinct from old.explanation
    or new.question_type is distinct from old.question_type
    or new.source_basis is distinct from old.source_basis
    or new.status is distinct from old.status
  then
    new.version := old.version + 1;
    insert into public.learning_question_versions (
      question_id, version, prompt, choices, answer_key, explanation,
      question_type, source_basis, status, created_by
    ) values (
      new.id, new.version, new.prompt, new.choices, new.answer_key, new.explanation,
      new.question_type, new.source_basis, new.status, auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists snapshot_learning_question_version on public.learning_questions;
create trigger snapshot_learning_question_version
  before insert or update
  on public.learning_questions
  for each row execute function public.snapshot_learning_question_version();

drop trigger if exists set_updated_at_learning_lessons on public.learning_lessons;
create trigger set_updated_at_learning_lessons
  before update on public.learning_lessons
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_learning_questions on public.learning_questions;
create trigger set_updated_at_learning_questions
  before update on public.learning_questions
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_school_course_features on public.school_course_features;
create trigger set_updated_at_school_course_features
  before update on public.school_course_features
  for each row execute function public.set_updated_at();

drop trigger if exists learning_review_events_immutable on public.learning_review_events;
create trigger learning_review_events_immutable
  before update or delete on public.learning_review_events
  for each row execute function public.prevent_update_or_delete();

drop trigger if exists learning_question_versions_immutable on public.learning_question_versions;
create trigger learning_question_versions_immutable
  before update or delete on public.learning_question_versions
  for each row execute function public.prevent_update_or_delete();

drop trigger if exists learning_attempts_immutable on public.learning_attempts;
create trigger learning_attempts_immutable
  before update or delete on public.learning_attempts
  for each row execute function public.prevent_update_or_delete();

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_published_ap_course(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.stem_courses course
    where course.id = target_course_id
      and course.course_kind = 'ap'
      and course.status = 'published'
      and course.is_published
      and course.archived_at is null
      and course.published_at is not null
      and course.published_at <= now()
  );
$$;

create or replace function public.can_view_learning_aggregates(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.school_course_features feature
      join public.user_school_memberships membership
        on membership.school_id = feature.school_id
      where feature.course_id = target_course_id
        and feature.is_enabled
        and membership.user_id = auth.uid()
        and membership.status = 'active'
        and membership.role in ('school_admin', 'school_advisor', 'staff')
    )
    or exists (
      select 1
      from public.club_resource_recommendations recommendation
      join public.club_memberships membership
        on membership.club_id = recommendation.club_id
      where recommendation.course_id = target_course_id
        and membership.user_id = auth.uid()
        and membership.status = 'active'
        and membership.role in (
          'club_admin',
          'president',
          'vice_president',
          'secretary',
          'treasurer',
          'officer',
          'advisor'
        )
    );
$$;

create or replace function public.record_learning_attempt(
  target_question_id uuid,
  response jsonb
)
returns table (
  attempt_id uuid,
  is_correct boolean,
  explanation text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  question record;
  computed_correct boolean := false;
  chosen text;
  accepted text;
  inserted public.learning_attempts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if response is null or jsonb_typeof(response) <> 'object' then
    raise exception 'Attempt response must be a JSON object';
  end if;

  select
    q.id,
    q.course_id,
    q.question_type,
    q.answer_key,
    q.explanation,
    q.status as question_status
  into question
  from public.learning_questions q
  where q.id = target_question_id;

  if question.id is null then
    raise exception 'Question not found';
  end if;

  if question.question_status is distinct from 'published'
    or not public.is_published_ap_course(question.course_id)
  then
    raise exception 'Only published questions on published courses accept attempts';
  end if;

  if question.question_type = 'multiple_choice' then
    chosen := lower(trim(coalesce(response ->> 'choiceId', '')));
    accepted := lower(trim(coalesce(question.answer_key ->> 'choiceId', '')));
    computed_correct := chosen <> '' and chosen = accepted;
  else
    chosen := lower(trim(coalesce(response ->> 'text', '')));
    accepted := lower(trim(coalesce(question.answer_key ->> 'text', '')));
    computed_correct := chosen <> '' and chosen = accepted;
  end if;

  insert into public.learning_attempts (
    user_id, question_id, course_id, response, is_correct
  ) values (
    auth.uid(), question.id, question.course_id, response, computed_correct
  )
  returning * into inserted;

  attempt_id := inserted.id;
  is_correct := inserted.is_correct;
  explanation := question.explanation;
  return next;
end;
$$;

revoke all on function public.record_learning_attempt(uuid, jsonb) from public;
grant execute on function public.record_learning_attempt(uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Views: student catalog omits answer keys; officers see counts only
-- ---------------------------------------------------------------------------

create view public.learning_questions_student
with (security_barrier = true, security_invoker = false)
as
select
  question.id,
  question.course_id,
  question.namespace,
  question.module_id,
  question.lesson_id,
  question.slug,
  question.prompt,
  question.choices,
  question.question_type,
  question.objective_codes,
  question.difficulty,
  question.source_basis,
  question.status,
  question.version
from public.learning_questions question
join public.stem_courses course on course.id = question.course_id
where question.status = 'published'
  and course.course_kind = 'ap'
  and course.status = 'published'
  and course.is_published
  and course.archived_at is null
  and course.published_at is not null
  and course.published_at <= now();

create view public.learning_attempt_aggregates
with (security_barrier = true, security_invoker = false)
as
select
  attempt.course_id,
  attempt.question_id,
  count(*)::integer as attempt_count,
  count(*) filter (where attempt.is_correct)::integer as correct_count,
  count(distinct attempt.user_id)::integer as participant_count
from public.learning_attempts attempt
where public.can_view_learning_aggregates(attempt.course_id)
group by attempt.course_id, attempt.question_id;

create view public.published_ap_courses
with (security_barrier = true, security_invoker = false)
as
select
  course.id,
  course.slug,
  course.course_namespace,
  course.title,
  course.description,
  course.discipline,
  course.grade_bands,
  course.difficulty,
  course.format,
  course.estimated_minutes,
  course.thumbnail_asset_id,
  course.framework_code,
  course.framework_year,
  course.source_basis,
  course.published_at
from public.stem_courses course
where course.course_kind = 'ap'
  and course.status = 'published'
  and course.is_published
  and course.archived_at is null
  and course.published_at is not null
  and course.published_at <= now();

revoke all on public.learning_questions_student from public;
revoke all on public.learning_attempt_aggregates from public;
revoke all on public.published_ap_courses from public;
grant select on public.learning_questions_student to authenticated;
grant select on public.learning_attempt_aggregates to authenticated;
grant select on public.published_ap_courses to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.learning_lessons enable row level security;
alter table public.learning_questions enable row level security;
alter table public.learning_question_versions enable row level security;
alter table public.learning_attempts enable row level security;
alter table public.learning_review_events enable row level security;
alter table public.school_course_features enable row level security;

create policy learning_lessons_published_select on public.learning_lessons
  for select to authenticated using (
    status = 'published'
    and public.is_published_ap_course(course_id)
  );
create policy learning_lessons_admin_select on public.learning_lessons
  for select to authenticated using (public.is_platform_admin());
create policy learning_lessons_admin_insert on public.learning_lessons
  for insert to authenticated with check (public.is_platform_admin());
create policy learning_lessons_admin_update on public.learning_lessons
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy learning_lessons_admin_delete on public.learning_lessons
  for delete to authenticated using (public.is_platform_admin());

-- Students never select answer_key from the base table.
create policy learning_questions_admin_select on public.learning_questions
  for select to authenticated using (public.is_platform_admin());
create policy learning_questions_admin_insert on public.learning_questions
  for insert to authenticated with check (public.is_platform_admin());
create policy learning_questions_admin_update on public.learning_questions
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy learning_questions_admin_delete on public.learning_questions
  for delete to authenticated using (public.is_platform_admin());

create policy learning_question_versions_admin_select on public.learning_question_versions
  for select to authenticated using (public.is_platform_admin());
create policy learning_question_versions_no_insert on public.learning_question_versions
  for insert to authenticated with check (false);
create policy learning_question_versions_no_update on public.learning_question_versions
  for update to authenticated using (false);
create policy learning_question_versions_no_delete on public.learning_question_versions
  for delete to authenticated using (false);

create policy learning_attempts_own_select on public.learning_attempts
  for select to authenticated using (user_id = auth.uid());
create policy learning_attempts_own_insert on public.learning_attempts
  for insert to authenticated with check (
    user_id = auth.uid()
    and public.is_published_ap_course(course_id)
    and exists (
      select 1
      from public.learning_questions question
      where question.id = question_id
        and question.status = 'published'
        and question.course_id = course_id
    )
  );
create policy learning_attempts_no_update on public.learning_attempts
  for update to authenticated using (false);
create policy learning_attempts_no_delete on public.learning_attempts
  for delete to authenticated using (false);

create policy learning_review_events_admin_select on public.learning_review_events
  for select to authenticated using (public.is_platform_admin());
create policy learning_review_events_admin_insert on public.learning_review_events
  for insert to authenticated with check (
    public.is_platform_admin()
    and actor_id = auth.uid()
  );
create policy learning_review_events_no_update on public.learning_review_events
  for update to authenticated using (false);
create policy learning_review_events_no_delete on public.learning_review_events
  for delete to authenticated using (false);

create policy school_course_features_school_select on public.school_course_features
  for select to authenticated using (
    public.is_platform_admin()
    or public.has_school_role(
      school_id,
      array['school_admin', 'school_advisor', 'staff']::public.school_role[]
    )
  );
create policy school_course_features_school_insert on public.school_course_features
  for insert to authenticated with check (
    created_by = auth.uid()
    and (
      public.is_platform_admin()
      or public.has_school_role(
        school_id,
        array['school_admin']::public.school_role[]
      )
    )
  );
create policy school_course_features_school_update on public.school_course_features
  for update to authenticated
  using (
    public.is_platform_admin()
    or public.has_school_role(
      school_id,
      array['school_admin']::public.school_role[]
    )
  )
  with check (
    public.is_platform_admin()
    or public.has_school_role(
      school_id,
      array['school_admin']::public.school_role[]
    )
  );
create policy school_course_features_school_delete on public.school_course_features
  for delete to authenticated using (
    public.is_platform_admin()
    or public.has_school_role(
      school_id,
      array['school_admin']::public.school_role[]
    )
  );

drop trigger if exists audit_learning_review_events on public.learning_review_events;
create trigger audit_learning_review_events
  after insert on public.learning_review_events
  for each row execute function public.audit_row_change('learning_review_event');

drop trigger if exists audit_school_course_features on public.school_course_features;
create trigger audit_school_course_features
  after insert or update or delete on public.school_course_features
  for each row execute function public.audit_row_change('school_course_feature');
