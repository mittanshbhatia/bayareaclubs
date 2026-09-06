-- Database-driven charter sections, immutable submit snapshots, renewal derived data, reminders

-- ---------------------------------------------------------------------------
-- Section definitions (schema/config — UI renders from this, not a hard-coded form)
-- ---------------------------------------------------------------------------
create table if not exists public.charter_section_definitions (
  key text primary key
    check (key ~ '^[a-z][a-z0-9_]{1,62}$'),
  label text not null check (length(trim(label)) between 1 and 120),
  description text not null default '',
  field_column text not null
    check (field_column ~ '^[a-z][a-z0-9_]{1,62}$'),
  sort_order integer not null check (sort_order > 0),
  required boolean not null default true,
  min_length integer not null default 1 check (min_length >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default statement_timestamp(),
  unique (sort_order)
);

alter table public.charter_section_definitions enable row level security;

drop policy if exists charter_sections_authenticated_select on public.charter_section_definitions;
drop policy if exists charter_sections_admin_write on public.charter_section_definitions;

create policy charter_sections_authenticated_select
  on public.charter_section_definitions
  for select to authenticated using (is_active);

create policy charter_sections_admin_write
  on public.charter_section_definitions
  for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

insert into public.charter_section_definitions (
  key, label, description, field_column, sort_order, required, min_length
)
values
  (
    'purpose',
    'Purpose',
    'Why the club exists and who it serves.',
    'purpose',
    1,
    true,
    20
  ),
  (
    'mission',
    'Mission',
    'The club’s standing mission statement.',
    'mission',
    2,
    true,
    20
  ),
  (
    'membership',
    'Membership',
    'Eligibility, expectations, and membership requirements.',
    'membership_requirements',
    3,
    true,
    20
  ),
  (
    'leadership',
    'Leadership structure',
    'Officer roles and how leadership is organized.',
    'officer_structure',
    4,
    true,
    20
  ),
  (
    'officer_responsibilities',
    'Officer responsibilities',
    'Duties for each officer role.',
    'officer_responsibilities',
    5,
    true,
    20
  ),
  (
    'elections',
    'Election / selection process',
    'How officers are elected or appointed.',
    'elections',
    6,
    true,
    20
  ),
  (
    'meetings',
    'Meetings',
    'Meeting cadence, locations, and attendance expectations.',
    'meeting_cadence',
    7,
    true,
    10
  ),
  (
    'conduct',
    'Conduct',
    'Behavioral expectations and community standards.',
    'conduct_expectations',
    8,
    true,
    20
  ),
  (
    'advisor',
    'Advisor',
    'Advisor role, contact expectations, and oversight.',
    'advisor_information',
    9,
    true,
    10
  ),
  (
    'activities',
    'Activities',
    'Planned activities for the school year.',
    'planned_activities',
    10,
    true,
    20
  ),
  (
    'finances',
    'Finances',
    'Financial policy if the club handles funds. Optional when not applicable.',
    'financial_policy',
    11,
    false,
    0
  ),
  (
    'amendments',
    'Amendments',
    'How this charter may be amended.',
    'amendment_process',
    12,
    true,
    10
  )
on conflict (key) do update
set
  label = excluded.label,
  description = excluded.description,
  field_column = excluded.field_column,
  sort_order = excluded.sort_order,
  required = excluded.required,
  min_length = excluded.min_length,
  is_active = true;

-- ---------------------------------------------------------------------------
-- Charter content columns + draft step
-- ---------------------------------------------------------------------------
alter table public.club_charters
  add column if not exists officer_responsibilities text not null default '',
  add column if not exists draft_step smallint not null default 1
    check (draft_step between 1 and 20);

-- ---------------------------------------------------------------------------
-- Immutable submitted versions
-- ---------------------------------------------------------------------------
create table if not exists public.club_charter_versions (
  id uuid primary key default gen_random_uuid(),
  charter_id uuid not null references public.club_charters(id) on delete cascade,
  version_number integer not null check (version_number >= 1),
  status_at_freeze public.charter_status not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  unique (charter_id, version_number)
);

create index if not exists club_charter_versions_charter_idx
  on public.club_charter_versions (charter_id, version_number desc);

alter table public.club_charter_versions enable row level security;

drop policy if exists charter_versions_authorized_select on public.club_charter_versions;
drop policy if exists charter_versions_no_insert on public.club_charter_versions;
drop policy if exists charter_versions_no_update on public.club_charter_versions;
drop policy if exists charter_versions_no_delete on public.club_charter_versions;

create policy charter_versions_authorized_select on public.club_charter_versions
  for select to authenticated using (
    exists (
      select 1
      from public.club_charters charter
      join public.clubs club on club.id = charter.club_id
      where charter.id = charter_id
        and (
          public.can_manage_club(charter.club_id)
          or public.can_review_school(club.school_id)
          or public.has_club_role(
            charter.club_id,
            array[
              'club_admin','president','vice_president','secretary',
              'treasurer','officer','advisor','member'
            ]::public.club_role[]
          )
        )
    )
  );
create policy charter_versions_no_insert on public.club_charter_versions
  for insert to authenticated with check (false);
create policy charter_versions_no_update on public.club_charter_versions
  for update to authenticated using (false);
create policy charter_versions_no_delete on public.club_charter_versions
  for delete to authenticated using (false);

create or replace function public.freeze_club_charter_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_version integer;
  sections jsonb := '{}'::jsonb;
  def record;
begin
  if tg_op = 'UPDATE'
    and new.status = 'submitted'
    and new.status is distinct from old.status then
    select coalesce(max(version_number), 0) + 1
      into next_version
    from public.club_charter_versions
    where charter_id = new.id;

    for def in
      select key, field_column, label, required
      from public.charter_section_definitions
      where is_active
      order by sort_order
    loop
      sections := sections || jsonb_build_object(
        def.key,
        jsonb_build_object(
          'label', def.label,
          'required', def.required,
          'value', to_jsonb(
            case def.field_column
              when 'purpose' then new.purpose
              when 'mission' then new.mission
              when 'membership_requirements' then new.membership_requirements
              when 'officer_structure' then new.officer_structure
              when 'officer_responsibilities' then new.officer_responsibilities
              when 'elections' then new.elections
              when 'meeting_cadence' then new.meeting_cadence
              when 'conduct_expectations' then new.conduct_expectations
              when 'advisor_information' then new.advisor_information
              when 'planned_activities' then new.planned_activities
              when 'financial_policy' then new.financial_policy
              when 'amendment_process' then new.amendment_process
              else ''
            end
          )
        )
      );
    end loop;

    insert into public.club_charter_versions (
      charter_id, version_number, status_at_freeze, snapshot, created_by
    )
    values (
      new.id,
      next_version,
      new.status,
      jsonb_build_object(
        'school_year', new.school_year,
        'charter_version_number', new.version_number,
        'sections', sections,
        'submitted_at', new.submitted_at
      ),
      auth.uid()
    );

    new.version_number := greatest(new.version_number, next_version);
  end if;
  return new;
end;
$$;

drop trigger if exists club_charters_freeze_version on public.club_charters;
drop trigger if exists club_charters_protect_content on public.club_charters;
drop trigger if exists club_charters_validate_transition on public.club_charters;
drop trigger if exists club_charters_00_validate_transition on public.club_charters;
drop trigger if exists club_charters_10_freeze_version on public.club_charters;
drop trigger if exists club_charters_20_protect_content on public.club_charters;

-- Block content edits once submitted/approved/expired/superseded
create or replace function public.protect_charter_content()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status not in ('draft', 'changes_requested') then
    if new.purpose is distinct from old.purpose
      or new.mission is distinct from old.mission
      or new.membership_requirements is distinct from old.membership_requirements
      or new.officer_structure is distinct from old.officer_structure
      or new.officer_responsibilities is distinct from old.officer_responsibilities
      or new.elections is distinct from old.elections
      or new.meeting_cadence is distinct from old.meeting_cadence
      or new.conduct_expectations is distinct from old.conduct_expectations
      or new.advisor_information is distinct from old.advisor_information
      or new.planned_activities is distinct from old.planned_activities
      or new.financial_policy is distinct from old.financial_policy
      or new.amendment_process is distinct from old.amendment_process
      or new.draft_step is distinct from old.draft_step then
      raise exception 'Submitted charter content is immutable; request changes or create a new draft cycle'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

-- Validate required sections from definitions (finances optional)
create or replace function public.validate_charter_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed boolean;
  def record;
  value text;
begin
  if new.status = old.status then
    return new;
  end if;
  allowed := case old.status
    when 'draft' then new.status = 'submitted'
    when 'submitted' then new.status in ('changes_requested', 'approved')
    when 'changes_requested' then new.status = 'submitted'
    when 'approved' then new.status in ('expired', 'superseded')
    else false
  end;
  if not allowed then
    raise exception 'Invalid charter transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;
  if new.status = 'submitted' then
    for def in
      select field_column, label, required, min_length
      from public.charter_section_definitions
      where is_active and required
      order by sort_order
    loop
      value := case def.field_column
        when 'purpose' then new.purpose
        when 'mission' then new.mission
        when 'membership_requirements' then new.membership_requirements
        when 'officer_structure' then new.officer_structure
        when 'officer_responsibilities' then new.officer_responsibilities
        when 'elections' then new.elections
        when 'meeting_cadence' then new.meeting_cadence
        when 'conduct_expectations' then new.conduct_expectations
        when 'advisor_information' then new.advisor_information
        when 'planned_activities' then new.planned_activities
        when 'financial_policy' then new.financial_policy
        when 'amendment_process' then new.amendment_process
        else ''
      end;
      if length(trim(coalesce(value, ''))) < def.min_length then
        raise exception 'Charter section "%" is incomplete', def.label
          using errcode = '23514';
      end if;
    end loop;
    new.submitted_at = statement_timestamp();
  end if;
  return new;
end;
$$;

-- Alphabetical order: 00 validate → 10 freeze → 20 protect
create trigger club_charters_00_validate_transition
  before update of status on public.club_charters
  for each row execute function public.validate_charter_transition();

create trigger club_charters_10_freeze_version
  before update of status on public.club_charters
  for each row execute function public.freeze_club_charter_version();

create trigger club_charters_20_protect_content
  before update on public.club_charters
  for each row execute function public.protect_charter_content();

-- Reject maps to changes_requested for charters (no rejected status in enum)
create or replace function public.apply_charter_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.club_charters
  set
    status = case
      when new.decision = 'approved' then 'approved'::public.charter_status
      else 'changes_requested'::public.charter_status
    end,
    approved_at = case
      when new.decision = 'approved' then statement_timestamp()
      else null
    end,
    expires_at = case
      when new.decision = 'approved' and expires_at is null
        then make_date(
          split_part(school_year, '-', 2)::int,
          6,
          15
        )::timestamptz
      else expires_at
    end
  where id = new.charter_id
    and status = 'submitted';
  if not found then
    raise exception 'Charter must be submitted before review'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Renewals: narrative + derived snapshot (analytics stay at source)
-- ---------------------------------------------------------------------------
alter table public.club_renewals
  add column if not exists next_year_plan text not null default '',
  add column if not exists highlights_summary text not null default '',
  add column if not exists derived_snapshot jsonb not null default '{}'::jsonb
    check (jsonb_typeof(derived_snapshot) = 'object'),
  add column if not exists derived_at timestamptz;

create or replace function public.validate_renewal_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed boolean;
begin
  if new.status = old.status then
    return new;
  end if;
  allowed := case old.status
    when 'draft' then new.status in ('submitted', 'withdrawn')
    when 'submitted' then new.status in (
      'under_review', 'changes_requested', 'approved', 'rejected', 'withdrawn'
    )
    when 'under_review' then new.status in (
      'changes_requested', 'approved', 'rejected', 'withdrawn'
    )
    when 'changes_requested' then new.status in ('submitted', 'withdrawn')
    else false
  end;
  if not allowed then
    raise exception 'Invalid renewal transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;
  if new.status = 'submitted' then
    if new.advisor_confirmed_at is null
      or length(trim(new.activity_summary)) = 0
      or length(trim(new.next_year_plan)) = 0
      or new.current_officers_snapshot = '[]'::jsonb
      or coalesce(new.derived_snapshot, '{}'::jsonb) = '{}'::jsonb then
      raise exception 'Renewal is incomplete and cannot be submitted'
        using errcode = '23514';
    end if;
    new.submitted_at = statement_timestamp();
  elsif new.status = 'approved' then
    new.approved_at = statement_timestamp();
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Renewal reminders
-- ---------------------------------------------------------------------------
create table if not exists public.renewal_reminders (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  school_year text not null check (public.is_valid_school_year(school_year)),
  reminder_kind text not null
    check (reminder_kind in ('45_day', '14_day', '7_day', 'due')),
  due_on date not null,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  unique (club_id, school_year, reminder_kind)
);

create index if not exists renewal_reminders_due_idx
  on public.renewal_reminders (scheduled_for)
  where sent_at is null;

alter table public.renewal_reminders enable row level security;

drop policy if exists renewal_reminders_manager_select on public.renewal_reminders;
drop policy if exists renewal_reminders_no_client_write on public.renewal_reminders;

create policy renewal_reminders_manager_select on public.renewal_reminders
  for select to authenticated using (
    public.can_manage_club(club_id)
    or exists (
      select 1 from public.clubs club
      where club.id = club_id and public.can_review_school(club.school_id)
    )
  );
create policy renewal_reminders_no_client_write on public.renewal_reminders
  for all to authenticated using (false) with check (false);

create or replace function public.enqueue_renewal_reminders(
  as_of timestamptz default statement_timestamp()
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted integer := 0;
  row record;
  due_date date;
  kinds text[] := array['45_day', '14_day', '7_day', 'due'];
  kind text;
  offset_days integer;
  schedule_at timestamptz;
begin
  for row in
    select
      club.id as club_id,
      charter.school_year,
      coalesce(
        charter.expires_at::date,
        make_date(
          split_part(charter.school_year, '-', 2)::int,
          6,
          15
        )
      ) as due_on
    from public.club_charters charter
    join public.clubs club on club.id = charter.club_id
    where charter.status = 'approved'
      and not exists (
        select 1
        from public.club_renewals renewal
        where renewal.club_id = club.id
          and renewal.school_year = charter.school_year
          and renewal.status = 'approved'
      )
  loop
    due_date := row.due_on;
    foreach kind in array kinds loop
      offset_days := case kind
        when '45_day' then 45
        when '14_day' then 14
        when '7_day' then 7
        else 0
      end;
      schedule_at := ((due_date - offset_days)::timestamptz);
      insert into public.renewal_reminders (
        club_id, school_year, reminder_kind, due_on, scheduled_for
      )
      values (row.club_id, row.school_year, kind, due_date, schedule_at)
      on conflict (club_id, school_year, reminder_kind) do nothing;
      if found then
        inserted := inserted + 1;
      end if;
    end loop;
  end loop;
  return inserted;
end;
$$;

create or replace function public.process_due_renewal_reminders(
  as_of timestamptz default statement_timestamp()
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  processed integer := 0;
  reminder record;
  officer record;
  club_slug text;
  title text;
  body text;
begin
  perform public.enqueue_renewal_reminders(as_of);

  for reminder in
    select *
    from public.renewal_reminders
    where sent_at is null
      and scheduled_for <= as_of
    order by scheduled_for
    for update skip locked
  loop
    select club.slug into club_slug
    from public.clubs club
    where club.id = reminder.club_id;

    title := case reminder.reminder_kind
      when 'due' then 'Club renewal is due'
      else format(
        'Club renewal due in %s days',
        replace(reminder.reminder_kind, '_day', '')
      )
    end;
    body := format(
      'Renewal for school year %s is due on %s. Open Charter → Renewal to review auto-pulled activity and submit.',
      reminder.school_year,
      reminder.due_on
    );

    for officer in
      select distinct membership.user_id
      from public.club_memberships membership
      where membership.club_id = reminder.club_id
        and membership.status = 'active'
        and membership.role in (
          'club_admin','president','vice_president','secretary',
          'treasurer','officer','advisor'
        )
    loop
      insert into public.notifications (
        user_id, notification_type, title, body, action_url
      )
      values (
        officer.user_id,
        'renewal_reminder_' || reminder.reminder_kind,
        title,
        body,
        '/clubs/' || coalesce(club_slug, '') || '/charter/renewal'
      );
    end loop;

    update public.renewal_reminders
    set sent_at = as_of
    where id = reminder.id;
    processed := processed + 1;
  end loop;

  return processed;
end;
$$;

revoke all on function public.enqueue_renewal_reminders(timestamptz) from public;
revoke all on function public.process_due_renewal_reminders(timestamptz) from public;
grant execute on function public.enqueue_renewal_reminders(timestamptz) to service_role;
grant execute on function public.process_due_renewal_reminders(timestamptz) to service_role;
-- Managers may enqueue (not send) for visibility in UI
grant execute on function public.enqueue_renewal_reminders(timestamptz) to authenticated;

-- ---------------------------------------------------------------------------
-- Audit for new tables
-- ---------------------------------------------------------------------------
drop trigger if exists audit_club_charter_versions on public.club_charter_versions;
create trigger audit_club_charter_versions
  after insert or delete on public.club_charter_versions
  for each row execute function public.audit_row_change('club_charter_version');

drop trigger if exists audit_renewal_reminders on public.renewal_reminders;
create trigger audit_renewal_reminders
  after insert or update or delete on public.renewal_reminders
  for each row execute function public.audit_row_change('renewal_reminder');
