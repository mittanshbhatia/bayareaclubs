-- Dashboard operating center: module catalog, scoped configs, home content,
-- user preferences, STEM/AP course metadata, and publication_status 'approved'.
-- 'approved' is a learning lifecycle state and is never public.

alter type public.publication_status add value if not exists 'approved';

do $$
begin
  create type public.dashboard_context_type as enum (
    'personal',
    'club',
    'school',
    'platform'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.dashboard_module_status as enum (
    'active',
    'deprecated'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.dashboard_mobile_visibility as enum (
    'always',
    'overflow',
    'hidden'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.dashboard_config_scope as enum (
    'global',
    'school',
    'club',
    'user'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.dashboard_home_module_type as enum (
    'announcement',
    'featured_courses',
    'featured_resources',
    'featured_events',
    'deadline',
    'school_message'
  );
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- STEM / AP course metadata (nullable / defaulted for existing rows)
-- ---------------------------------------------------------------------------

alter table public.stem_courses
  add column if not exists course_kind text not null default 'stem',
  add column if not exists course_namespace text,
  add column if not exists source_basis text not null default 'ORIGINAL',
  add column if not exists framework_code text,
  add column if not exists framework_year integer,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references public.profiles(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'stem_courses_course_kind_check'
  ) then
    alter table public.stem_courses
      add constraint stem_courses_course_kind_check
      check (course_kind in ('stem', 'ap'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'stem_courses_source_basis_check'
  ) then
    alter table public.stem_courses
      add constraint stem_courses_source_basis_check
      check (source_basis in ('ORIGINAL', 'LICENSED_EXTERNAL'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'stem_courses_course_namespace_format_check'
  ) then
    alter table public.stem_courses
      add constraint stem_courses_course_namespace_format_check
      check (
        course_namespace is null
        or course_namespace ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'stem_courses_ap_namespace_check'
  ) then
    alter table public.stem_courses
      add constraint stem_courses_ap_namespace_check
      check (
        course_kind <> 'ap'
        or (
          course_namespace is not null
          and length(trim(course_namespace)) between 1 and 80
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'stem_courses_framework_year_check'
  ) then
    alter table public.stem_courses
      add constraint stem_courses_framework_year_check
      check (
        framework_year is null
        or framework_year between 1990 and 2100
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'stem_courses_course_namespace_key'
  ) then
    alter table public.stem_courses
      add constraint stem_courses_course_namespace_key unique (course_namespace);
  end if;
end $$;

create index if not exists stem_courses_kind_idx
  on public.stem_courses (course_kind, status);

create index if not exists stem_courses_approved_by_idx
  on public.stem_courses (approved_by)
  where approved_by is not null;

-- Only `published` is public. draft / review / scheduled / approved stay private.
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
    -- draft, review, scheduled, approved (and any future non-public state)
    new.is_published := false;
    new.published_at := null;
    if new.status <> 'archived' then
      new.archived_at := null;
    end if;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Catalog + configuration
-- ---------------------------------------------------------------------------

create table if not exists public.dashboard_modules (
  id text primary key
    check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(id) between 2 and 64),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(slug) between 2 and 64),
  label text not null check (length(trim(label)) between 1 and 80),
  description text not null check (length(trim(description)) between 1 and 400),
  icon text not null check (length(trim(icon)) between 1 and 64),
  route text not null check (length(trim(route)) between 1 and 240),
  context_types public.dashboard_context_type[] not null
    check (cardinality(context_types) >= 1),
  required_permissions text[] not null default '{}'::text[],
  default_enabled boolean not null default true,
  display_order integer not null check (display_order >= 0),
  section text not null check (length(trim(section)) between 1 and 40),
  mobile_visibility public.dashboard_mobile_visibility not null default 'always',
  feature_flag text check (
    feature_flag is null or length(trim(feature_flag)) between 1 and 80
  ),
  status public.dashboard_module_status not null default 'active',
  mandatory boolean not null default false,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create index if not exists dashboard_modules_status_order_idx
  on public.dashboard_modules (status, display_order);

comment on table public.dashboard_modules is
  'Seeded dashboard module catalog. mandatory modules cannot be disabled.';

create table if not exists public.dashboard_module_configs (
  id uuid primary key default gen_random_uuid(),
  module_id text not null references public.dashboard_modules(id) on delete cascade,
  scope_type public.dashboard_config_scope not null,
  school_id uuid references public.schools(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  enabled boolean not null default true,
  display_order integer check (display_order is null or display_order >= 0),
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint dashboard_module_configs_scope_shape_check check (
    (
      scope_type = 'global'
      and school_id is null
      and club_id is null
      and user_id is null
    )
    or (
      scope_type = 'school'
      and school_id is not null
      and club_id is null
      and user_id is null
    )
    or (
      scope_type = 'club'
      and club_id is not null
      and user_id is null
    )
    or (
      scope_type = 'user'
      and user_id is not null
      and school_id is null
      and club_id is null
    )
  )
);

create unique index if not exists dashboard_module_configs_global_uidx
  on public.dashboard_module_configs (module_id)
  where scope_type = 'global';

create unique index if not exists dashboard_module_configs_school_uidx
  on public.dashboard_module_configs (module_id, school_id)
  where scope_type = 'school';

create unique index if not exists dashboard_module_configs_club_uidx
  on public.dashboard_module_configs (module_id, club_id)
  where scope_type = 'club';

create unique index if not exists dashboard_module_configs_user_uidx
  on public.dashboard_module_configs (module_id, user_id)
  where scope_type = 'user';

create index if not exists dashboard_module_configs_school_idx
  on public.dashboard_module_configs (school_id, scope_type)
  where school_id is not null;

create index if not exists dashboard_module_configs_club_idx
  on public.dashboard_module_configs (club_id, scope_type)
  where club_id is not null;

create index if not exists dashboard_module_configs_user_idx
  on public.dashboard_module_configs (user_id, scope_type)
  where user_id is not null;

comment on table public.dashboard_module_configs is
  'Enable/order overrides. Hierarchy: global → school → club → permission → user. Never grants permission.';

create table if not exists public.dashboard_home_content (
  id uuid primary key default gen_random_uuid(),
  module_type public.dashboard_home_module_type not null,
  context_type public.dashboard_context_type not null,
  school_id uuid references public.schools(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete cascade,
  title text check (title is null or length(trim(title)) between 1 and 160),
  body text not null default '',
  payload jsonb not null default '{}'::jsonb,
  status public.publication_status not null default 'draft',
  display_order integer not null default 0 check (display_order >= 0),
  created_by uuid not null references public.profiles(id) on delete restrict,
  updated_by uuid references public.profiles(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint dashboard_home_content_scope_check check (
    (
      context_type in (
        'personal'::public.dashboard_context_type,
        'platform'::public.dashboard_context_type
      )
      and school_id is null
      and club_id is null
    )
    or (
      context_type = 'club'
      and club_id is not null
    )
    or (
      context_type = 'school'
      and school_id is not null
      and club_id is null
    )
  ),
  constraint dashboard_home_content_school_message_check check (
    module_type <> 'school_message'
    or context_type = 'school'
  ),
  constraint dashboard_home_content_plain_body_check check (
    body !~ '<[^>]+>'
    and body !~* 'javascript:'
  ),
  constraint dashboard_home_content_payload_check check (
    jsonb_typeof(payload) = 'object'
    and case module_type
      when 'announcement' then
        jsonb_typeof(payload -> 'title') = 'string'
        and jsonb_typeof(payload -> 'body') = 'string'
      when 'featured_courses' then
        jsonb_typeof(payload -> 'courseIds') = 'array'
      when 'featured_resources' then
        jsonb_typeof(payload -> 'courseIds') = 'array'
      when 'featured_events' then
        jsonb_typeof(payload -> 'eventIds') = 'array'
      when 'deadline' then
        jsonb_typeof(payload -> 'title') = 'string'
        and jsonb_typeof(payload -> 'dueAt') = 'string'
      when 'school_message' then
        jsonb_typeof(payload -> 'title') = 'string'
        and jsonb_typeof(payload -> 'body') = 'string'
      else false
    end
  )
);

create index if not exists dashboard_home_content_context_idx
  on public.dashboard_home_content (context_type, status, display_order);

create index if not exists dashboard_home_content_school_idx
  on public.dashboard_home_content (school_id, status, display_order)
  where school_id is not null;

create index if not exists dashboard_home_content_club_idx
  on public.dashboard_home_content (club_id, status, display_order)
  where club_id is not null;

comment on table public.dashboard_home_content is
  'Typed dashboard home modules. Body is plain text; payload shape is constrained by module_type.';

create table if not exists public.dashboard_home_content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.dashboard_home_content(id) on delete set null,
  content_uuid uuid not null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('insert', 'update', 'delete')),
  module_type public.dashboard_home_module_type not null,
  context_type public.dashboard_context_type not null,
  school_id uuid,
  club_id uuid,
  title text,
  body text,
  payload jsonb not null default '{}'::jsonb,
  status public.publication_status not null,
  created_at timestamptz not null default statement_timestamp()
);

create index if not exists dashboard_home_content_revisions_content_idx
  on public.dashboard_home_content_revisions (content_uuid, created_at desc);

create index if not exists dashboard_home_content_revisions_school_idx
  on public.dashboard_home_content_revisions (school_id, created_at desc)
  where school_id is not null;

comment on table public.dashboard_home_content_revisions is
  'Append-only snapshots of dashboard_home_content changes.';

create table if not exists public.dashboard_user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_context_type public.dashboard_context_type not null default 'personal',
  last_club_id uuid references public.clubs(id) on delete set null,
  last_school_id uuid references public.schools(id) on delete set null,
  hidden_module_ids text[] not null default '{}'::text[],
  module_order text[] not null default '{}'::text[],
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create index if not exists dashboard_user_preferences_club_idx
  on public.dashboard_user_preferences (last_club_id)
  where last_club_id is not null;

create index if not exists dashboard_user_preferences_school_idx
  on public.dashboard_user_preferences (last_school_id)
  where last_school_id is not null;

comment on table public.dashboard_user_preferences is
  'Last dashboard context and personal nav hide/reorder. Hide never grants permission.';

-- ---------------------------------------------------------------------------
-- Helpers, triggers
-- ---------------------------------------------------------------------------

create or replace function public.can_access_school_dashboard(
  target_school_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_platform_admin($2)
    or public.has_school_role(
      $1,
      array[
        'school_admin',
        'school_advisor',
        'staff'
      ]::public.school_role[],
      $2
    );
$$;

create or replace function public.enforce_mandatory_dashboard_module_config()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  is_mandatory boolean;
begin
  select module.mandatory into is_mandatory
  from public.dashboard_modules module
  where module.id = new.module_id;

  if coalesce(is_mandatory, false) and new.enabled = false then
    raise exception 'Mandatory dashboard module % cannot be disabled', new.module_id
      using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists dashboard_module_configs_enforce_mandatory
  on public.dashboard_module_configs;
create trigger dashboard_module_configs_enforce_mandatory
  before insert or update of enabled, module_id on public.dashboard_module_configs
  for each row execute function public.enforce_mandatory_dashboard_module_config();

create or replace function public.force_mandatory_dashboard_module_configs()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.mandatory then
    update public.dashboard_module_configs
    set enabled = true,
        updated_at = statement_timestamp()
    where module_id = new.id
      and enabled = false;
  end if;
  return new;
end;
$$;

drop trigger if exists dashboard_modules_force_mandatory_configs
  on public.dashboard_modules;
create trigger dashboard_modules_force_mandatory_configs
  after update of mandatory on public.dashboard_modules
  for each row execute function public.force_mandatory_dashboard_module_configs();

create or replace function public.snapshot_dashboard_home_content()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data public.dashboard_home_content;
  op text;
begin
  op := lower(tg_op);
  if tg_op = 'DELETE' then
    row_data := old;
  else
    row_data := new;
  end if;

  insert into public.dashboard_home_content_revisions (
    content_id,
    content_uuid,
    actor_id,
    action,
    module_type,
    context_type,
    school_id,
    club_id,
    title,
    body,
    payload,
    status
  )
  values (
    case when tg_op = 'DELETE' then null else row_data.id end,
    row_data.id,
    auth.uid(),
    op,
    row_data.module_type,
    row_data.context_type,
    row_data.school_id,
    row_data.club_id,
    row_data.title,
    row_data.body,
    row_data.payload,
    row_data.status
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists dashboard_home_content_snapshot
  on public.dashboard_home_content;
create trigger dashboard_home_content_snapshot
  after insert or update or delete on public.dashboard_home_content
  for each row execute function public.snapshot_dashboard_home_content();

drop trigger if exists dashboard_home_content_revisions_immutable
  on public.dashboard_home_content_revisions;
create trigger dashboard_home_content_revisions_immutable
  before update or delete on public.dashboard_home_content_revisions
  for each row execute function public.prevent_update_or_delete();

drop trigger if exists set_updated_at_dashboard_modules on public.dashboard_modules;
create trigger set_updated_at_dashboard_modules
  before update on public.dashboard_modules
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_dashboard_module_configs
  on public.dashboard_module_configs;
create trigger set_updated_at_dashboard_module_configs
  before update on public.dashboard_module_configs
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_dashboard_home_content
  on public.dashboard_home_content;
create trigger set_updated_at_dashboard_home_content
  before update on public.dashboard_home_content
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_dashboard_user_preferences
  on public.dashboard_user_preferences;
create trigger set_updated_at_dashboard_user_preferences
  before update on public.dashboard_user_preferences
  for each row execute function public.set_updated_at();

create or replace function public.audit_dashboard_module_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;

  insert into public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    school_id,
    club_id,
    metadata
  )
  values (
    auth.uid(),
    'dashboard_module.' || lower(tg_op),
    tg_table_name,
    null,
    null,
    null,
    jsonb_strip_nulls(
      jsonb_build_object(
        'module_id', row_data ->> 'id',
        'slug', row_data ->> 'slug',
        'status', row_data ->> 'status'
      )
    )
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists audit_dashboard_modules on public.dashboard_modules;
create trigger audit_dashboard_modules
  after insert or update or delete on public.dashboard_modules
  for each row execute function public.audit_dashboard_module_change();

drop trigger if exists audit_dashboard_module_configs on public.dashboard_module_configs;
create trigger audit_dashboard_module_configs
  after insert or update or delete on public.dashboard_module_configs
  for each row execute function public.audit_row_change('dashboard_module_config');

drop trigger if exists audit_dashboard_home_content on public.dashboard_home_content;
create trigger audit_dashboard_home_content
  after insert or update or delete on public.dashboard_home_content
  for each row execute function public.audit_row_change('dashboard_home_content');

drop trigger if exists audit_dashboard_user_preferences
  on public.dashboard_user_preferences;
create trigger audit_dashboard_user_preferences
  after insert or update or delete on public.dashboard_user_preferences
  for each row execute function public.audit_row_change('dashboard_user_preference');

-- ---------------------------------------------------------------------------
-- Seed catalog (ids and mandatory flags match the architecture contract)
-- ---------------------------------------------------------------------------

insert into public.dashboard_modules (
  id, slug, label, description, icon, route, context_types, required_permissions,
  default_enabled, display_order, section, mobile_visibility, feature_flag, status, mandatory
) values
  (
    'home', 'home', 'Home', 'Context home',
    'House', '{home}',
    array['personal','club','school','platform']::public.dashboard_context_type[],
    '{}'::text[], true, 10, 'primary', 'always', null, 'active', true
  ),
  (
    'my-day', 'my-day', 'My Day', 'Next events, attendance, and learning',
    'CalendarClock', '/dashboard#my-day',
    array['personal']::public.dashboard_context_type[],
    '{}'::text[], true, 20, 'personal', 'always', null, 'active', false
  ),
  (
    'my-clubs', 'my-clubs', 'My Clubs', 'Clubs you belong to',
    'Users', '/dashboard#clubs',
    array['personal']::public.dashboard_context_type[],
    '{}'::text[], true, 30, 'personal', 'always', null, 'active', false
  ),
  (
    'learning', 'learning', 'Learning', 'AP and structured courses',
    'GraduationCap', '/dashboard/learn',
    array['personal','club']::public.dashboard_context_type[],
    '{}'::text[], true, 40, 'learning', 'always', null, 'active', false
  ),
  (
    'stem-resources', 'stem-resources', 'STEM Resources', 'Published STEM catalog',
    'BookOpen', '/resources',
    array['personal','club']::public.dashboard_context_type[],
    '{}'::text[], true, 50, 'learning', 'overflow', null, 'active', false
  ),
  (
    'ideas', 'ideas', 'Start a club', 'Submit or continue a club idea',
    'Lightbulb', '/start-a-club',
    array['personal']::public.dashboard_context_type[],
    '{}'::text[], true, 60, 'personal', 'overflow', null, 'active', false
  ),
  (
    'notifications', 'notifications', 'Notifications', 'In-app notifications',
    'Bell', '/dashboard/notifications',
    array['personal']::public.dashboard_context_type[],
    '{}'::text[], true, 70, 'account', 'always', null, 'active', false
  ),
  (
    'insights', 'insights', 'Insights', 'Participation analytics',
    'ChartNoAxesCombined', '{insights}',
    array['personal','club','school','platform']::public.dashboard_context_type[],
    '{}'::text[], true, 80, 'analytics', 'overflow', null, 'active', false
  ),
  (
    'profile', 'profile', 'Profile', 'Your profile and preferences',
    'User', '/dashboard/profile',
    array['personal']::public.dashboard_context_type[],
    '{}'::text[], true, 90, 'account', 'always', null, 'active', true
  ),
  (
    'club-overview', 'club-overview', 'Club overview', 'Club command home',
    'LayoutDashboard', '/clubs/:slug',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 100, 'club', 'always', null, 'active', true
  ),
  (
    'club-members', 'club-members', 'Members', 'Roster and roles',
    'UsersRound', '/clubs/:slug/members',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 110, 'club', 'always', null, 'active', false
  ),
  (
    'club-attendance', 'club-attendance', 'Attendance', 'Sessions and records',
    'ClipboardCheck', '/clubs/:slug/attendance',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 120, 'club', 'overflow', null, 'active', false
  ),
  (
    'club-events', 'club-events', 'Events', 'Club events and RSVPs',
    'Calendar', '/clubs/:slug/events',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 130, 'club', 'always', null, 'active', false
  ),
  (
    'club-charter', 'club-charter', 'Charter', 'Charter and renewal',
    'ScrollText', '/clubs/:slug/charter',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 140, 'club', 'overflow', null, 'active', false
  ),
  (
    'club-media', 'club-media', 'Media', 'Club media library',
    'Image', '/clubs/:slug/media',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 150, 'club', 'overflow', null, 'active', false
  ),
  (
    'club-highlights', 'club-highlights', 'Highlights', 'Published highlights',
    'Sparkles', '/clubs/:slug/highlights',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 160, 'club', 'overflow', null, 'active', false
  ),
  (
    'club-comms', 'club-comms', 'Communications', 'Campaigns and newsletters',
    'Mail', '/clubs/:slug/communications',
    array['club']::public.dashboard_context_type[],
    array['club.officer']::text[], true, 170, 'club', 'overflow', null, 'active', false
  ),
  (
    'club-resources', 'club-resources', 'Club resources', 'Learning collections',
    'Library', '/clubs/:slug/resources',
    array['club']::public.dashboard_context_type[],
    array['club.member']::text[], true, 180, 'club', 'overflow', null, 'active', false
  ),
  (
    'school-clubs', 'school-clubs', 'School clubs', 'Clubs at this school',
    'Building2', '/dashboard/schools/:schoolId',
    array['school']::public.dashboard_context_type[],
    array['school.dashboard']::text[], true, 200, 'school', 'always', null, 'active', true
  ),
  (
    'school-applications', 'school-applications', 'Applications', 'Club ideas and applications',
    'FilePlus2', '/dashboard/schools/:schoolId#applications',
    array['school']::public.dashboard_context_type[],
    array['school.dashboard']::text[], true, 210, 'school', 'always', null, 'active', false
  ),
  (
    'school-charters', 'school-charters', 'Charters', 'Charter review',
    'FileText', '/dashboard/schools/:schoolId#charters',
    array['school']::public.dashboard_context_type[],
    array['school.dashboard']::text[], true, 220, 'school', 'overflow', null, 'active', false
  ),
  (
    'school-events', 'school-events', 'School events', 'Events across school clubs',
    'CalendarRange', '/dashboard/schools/:schoolId#events',
    array['school']::public.dashboard_context_type[],
    array['school.dashboard']::text[], true, 230, 'school', 'overflow', null, 'active', false
  ),
  (
    'school-attendance', 'school-attendance', 'Attendance', 'Aggregate attendance',
    'UserCheck', '/dashboard/schools/:schoolId#attendance',
    array['school']::public.dashboard_context_type[],
    array['school.dashboard']::text[], true, 240, 'school', 'overflow', null, 'active', false
  ),
  (
    'school-learning', 'school-learning', 'Learning', 'Aggregate learning usage',
    'BookMarked', '/dashboard/schools/:schoolId#learning',
    array['school']::public.dashboard_context_type[],
    array['school.dashboard']::text[], true, 250, 'school', 'overflow', null, 'active', false
  ),
  (
    'platform-admin', 'platform-admin', 'Administration', 'Platform admin console',
    'Shield', '/admin',
    array['platform']::public.dashboard_context_type[],
    array['platform.admin']::text[], true, 300, 'platform', 'always', null, 'active', true
  ),
  (
    'platform-audit', 'platform-audit', 'Audit log', 'Platform audit trail',
    'ScrollText', '/admin/audit',
    array['platform']::public.dashboard_context_type[],
    array['platform.admin']::text[], true, 310, 'platform', 'always', null, 'active', true
  ),
  (
    'dashboard-config', 'dashboard-config', 'Dashboard configuration',
    'Enable, disable, and reorder modules',
    'Settings', '/admin/dashboard-config',
    array['platform']::public.dashboard_context_type[],
    array['platform.admin']::text[], true, 320, 'platform', 'overflow', null, 'active', false
  )
on conflict (id) do update
set
  slug = excluded.slug,
  label = excluded.label,
  description = excluded.description,
  icon = excluded.icon,
  route = excluded.route,
  context_types = excluded.context_types,
  required_permissions = excluded.required_permissions,
  default_enabled = excluded.default_enabled,
  display_order = excluded.display_order,
  section = excluded.section,
  mobile_visibility = excluded.mobile_visibility,
  feature_flag = excluded.feature_flag,
  status = excluded.status,
  mandatory = excluded.mandatory;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.dashboard_modules enable row level security;
alter table public.dashboard_module_configs enable row level security;
alter table public.dashboard_home_content enable row level security;
alter table public.dashboard_home_content_revisions enable row level security;
alter table public.dashboard_user_preferences enable row level security;

grant select on public.dashboard_modules to authenticated;
grant insert, update, delete on public.dashboard_modules to authenticated;

grant select, insert, update, delete on public.dashboard_module_configs to authenticated;
grant select, insert, update, delete on public.dashboard_home_content to authenticated;
grant select on public.dashboard_home_content_revisions to authenticated;
grant select, insert, update, delete on public.dashboard_user_preferences to authenticated;

revoke all on function public.can_access_school_dashboard(uuid, uuid) from public;
grant execute on function public.can_access_school_dashboard(uuid, uuid) to authenticated;

drop policy if exists dashboard_modules_authenticated_select on public.dashboard_modules;
create policy dashboard_modules_authenticated_select
  on public.dashboard_modules
  for select to authenticated
  using (true);

drop policy if exists dashboard_modules_admin_insert on public.dashboard_modules;
create policy dashboard_modules_admin_insert
  on public.dashboard_modules
  for insert to authenticated
  with check (public.is_platform_admin());

drop policy if exists dashboard_modules_admin_update on public.dashboard_modules;
create policy dashboard_modules_admin_update
  on public.dashboard_modules
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists dashboard_modules_admin_delete on public.dashboard_modules;
create policy dashboard_modules_admin_delete
  on public.dashboard_modules
  for delete to authenticated
  using (public.is_platform_admin());

drop policy if exists dashboard_module_configs_select on public.dashboard_module_configs;
create policy dashboard_module_configs_select
  on public.dashboard_module_configs
  for select to authenticated
  using (
    public.is_platform_admin()
    or scope_type = 'global'
    or (scope_type = 'user' and user_id = auth.uid())
    or (
      scope_type = 'school'
      and school_id is not null
      and (
        public.can_access_school_dashboard(school_id)
        or exists (
          select 1
          from public.club_memberships membership
          join public.clubs club on club.id = membership.club_id
          where membership.user_id = auth.uid()
            and membership.status = 'active'
            and club.school_id = dashboard_module_configs.school_id
        )
      )
    )
    or (
      scope_type = 'club'
      and club_id is not null
      and (
        public.is_club_member(club_id)
        or public.can_manage_club(club_id)
      )
    )
  );

drop policy if exists dashboard_module_configs_insert on public.dashboard_module_configs;
create policy dashboard_module_configs_insert
  on public.dashboard_module_configs
  for insert to authenticated
  with check (
    public.is_platform_admin()
    or (scope_type = 'user' and user_id = auth.uid())
    or (
      scope_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
    or (
      scope_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
  );

drop policy if exists dashboard_module_configs_update on public.dashboard_module_configs;
create policy dashboard_module_configs_update
  on public.dashboard_module_configs
  for update to authenticated
  using (
    public.is_platform_admin()
    or (scope_type = 'user' and user_id = auth.uid())
    or (
      scope_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
    or (
      scope_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
  )
  with check (
    public.is_platform_admin()
    or (scope_type = 'user' and user_id = auth.uid())
    or (
      scope_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
    or (
      scope_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
  );

drop policy if exists dashboard_module_configs_delete on public.dashboard_module_configs;
create policy dashboard_module_configs_delete
  on public.dashboard_module_configs
  for delete to authenticated
  using (
    public.is_platform_admin()
    or (scope_type = 'user' and user_id = auth.uid())
    or (
      scope_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
    or (
      scope_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
  );

drop policy if exists dashboard_home_content_select on public.dashboard_home_content;
create policy dashboard_home_content_select
  on public.dashboard_home_content
  for select to authenticated
  using (
    public.is_platform_admin()
    or (
      context_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
    or (
      context_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
    or (
      status = 'published'
      and (
        (
          context_type in (
            'personal'::public.dashboard_context_type,
            'platform'::public.dashboard_context_type
          )
        )
        or (
          context_type = 'club'
          and club_id is not null
          and public.can_view_club(club_id)
        )
        or (
          context_type = 'school'
          and school_id is not null
          and (
            public.can_access_school_dashboard(school_id)
            or public.is_school_member(school_id)
          )
        )
      )
    )
  );

drop policy if exists dashboard_home_content_insert on public.dashboard_home_content;
create policy dashboard_home_content_insert
  on public.dashboard_home_content
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      public.is_platform_admin()
      or (
        context_type = 'club'
        and club_id is not null
        and public.can_manage_club(club_id)
      )
      or (
        context_type = 'school'
        and school_id is not null
        and public.can_manage_school(school_id)
      )
    )
  );

drop policy if exists dashboard_home_content_update on public.dashboard_home_content;
create policy dashboard_home_content_update
  on public.dashboard_home_content
  for update to authenticated
  using (
    public.is_platform_admin()
    or (
      context_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
    or (
      context_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
  )
  with check (
    public.is_platform_admin()
    or (
      context_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
    or (
      context_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
  );

drop policy if exists dashboard_home_content_delete on public.dashboard_home_content;
create policy dashboard_home_content_delete
  on public.dashboard_home_content
  for delete to authenticated
  using (
    public.is_platform_admin()
    or (
      context_type = 'club'
      and club_id is not null
      and public.can_manage_club(club_id)
    )
    or (
      context_type = 'school'
      and school_id is not null
      and public.can_manage_school(school_id)
    )
  );

drop policy if exists dashboard_home_content_revisions_select
  on public.dashboard_home_content_revisions;
create policy dashboard_home_content_revisions_select
  on public.dashboard_home_content_revisions
  for select to authenticated
  using (
    public.is_platform_admin()
    or (
      club_id is not null
      and public.can_manage_club(club_id)
    )
    or (
      school_id is not null
      and public.can_manage_school(school_id)
    )
  );

drop policy if exists dashboard_user_preferences_own_select
  on public.dashboard_user_preferences;
create policy dashboard_user_preferences_own_select
  on public.dashboard_user_preferences
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());

drop policy if exists dashboard_user_preferences_own_insert
  on public.dashboard_user_preferences;
create policy dashboard_user_preferences_own_insert
  on public.dashboard_user_preferences
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists dashboard_user_preferences_own_update
  on public.dashboard_user_preferences;
create policy dashboard_user_preferences_own_update
  on public.dashboard_user_preferences
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists dashboard_user_preferences_own_delete
  on public.dashboard_user_preferences;
create policy dashboard_user_preferences_own_delete
  on public.dashboard_user_preferences
  for delete to authenticated
  using (user_id = auth.uid());
