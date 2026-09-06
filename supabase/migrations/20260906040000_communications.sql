-- BayAreaClubs Communications: audiences, preferences, outbox jobs, delivery fields.

create type public.email_campaign_kind as enum (
  'invitation',
  'approval',
  'event_update',
  'charter_status',
  'renewal_reminder',
  'announcement',
  'newsletter',
  'event_promotion',
  'highlight_digest'
);

create type public.email_audience_type as enum (
  'all_members',
  'officers',
  'membership_segment',
  'event_attendees',
  'event_registrants'
);

create type public.email_preference_category as enum (
  'transactional',
  'announcement',
  'newsletter',
  'event_promotion',
  'highlight_digest'
);

create type public.communication_job_status as enum (
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
);

create type public.communication_job_type as enum (
  'prepare_campaign_recipients',
  'send_campaign_batch',
  'send_test_email'
);

-- Expand campaigns for composer + async delivery.
alter table public.email_campaigns
  add column if not exists campaign_kind public.email_campaign_kind
    not null default 'announcement',
  add column if not exists audience_type public.email_audience_type
    not null default 'all_members',
  add column if not exists audience_filter jsonb not null default '{}'::jsonb
    check (jsonb_typeof(audience_filter) = 'object'),
  add column if not exists preference_category public.email_preference_category
    not null default 'announcement',
  add column if not exists message_body text not null default '',
  add column if not exists cta_label text
    check (cta_label is null or length(trim(cta_label)) between 1 and 80),
  add column if not exists cta_url text
    check (cta_url is null or cta_url ~ '^https://'),
  add column if not exists recipient_count integer not null default 0
    check (recipient_count >= 0),
  add column if not exists idempotency_key text
    check (idempotency_key is null or length(trim(idempotency_key)) between 8 and 200),
  add column if not exists started_sending_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists last_error text;

create unique index if not exists email_campaigns_idempotency_key_uidx
  on public.email_campaigns (idempotency_key)
  where idempotency_key is not null;

alter table public.email_campaigns
  drop constraint if exists email_campaigns_cta_pair;
alter table public.email_campaigns
  add constraint email_campaigns_cta_pair check (
    (cta_label is null and cta_url is null)
    or (cta_label is not null and cta_url is not null)
  );

alter table public.email_campaigns
  drop constraint if exists email_campaigns_message_safe;
alter table public.email_campaigns
  add constraint email_campaigns_message_safe check (
    message_body !~* '<\s*script'
    and message_body !~* 'javascript:'
    and length(message_body) <= 20000
  );

alter table public.email_campaigns
  drop constraint if exists email_campaigns_subject_safe;
alter table public.email_campaigns
  add constraint email_campaigns_subject_safe check (
    subject !~* '<\s*script'
    and subject !~* 'javascript:'
  );

-- Per-recipient delivery retries.
alter table public.email_recipients
  add column if not exists attempt_count integer not null default 0
    check (attempt_count >= 0),
  add column if not exists max_attempts integer not null default 5
    check (max_attempts between 1 and 10),
  add column if not exists next_attempt_at timestamptz
    not null default statement_timestamp(),
  add column if not exists last_error text,
  add column if not exists permanent_failure boolean not null default false,
  add column if not exists idempotency_key text
    check (idempotency_key is null or length(trim(idempotency_key)) between 8 and 220);

create unique index if not exists email_recipients_idempotency_key_uidx
  on public.email_recipients (idempotency_key)
  where idempotency_key is not null;

create index if not exists email_recipients_due_send_idx
  on public.email_recipients (campaign_id, status, next_attempt_at)
  where status = 'pending' and permanent_failure = false;

-- Preference categories + user opt-outs (transactional not opt-outable in app logic).
create table if not exists public.user_email_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category public.email_preference_category not null,
  opted_in boolean not null default true,
  unsubscribed_at timestamptz,
  updated_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp(),
  unique (user_id, category),
  check (
    (opted_in and unsubscribed_at is null)
    or (not opted_in and unsubscribed_at is not null)
  ),
  check (category <> 'transactional' or opted_in)
);

create index if not exists user_email_preferences_user_idx
  on public.user_email_preferences (user_id);

-- Durable outbox / jobs for async processing.
create table if not exists public.communication_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type public.communication_job_type not null,
  status public.communication_job_status not null default 'pending',
  campaign_id uuid references public.email_campaigns(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  club_id uuid references public.clubs(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object'),
  idempotency_key text not null
    check (length(trim(idempotency_key)) between 8 and 220),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 8 check (max_attempts between 1 and 20),
  run_after timestamptz not null default statement_timestamp(),
  locked_at timestamptz,
  locked_by text,
  completed_at timestamptz,
  last_error text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (idempotency_key)
);

create index if not exists communication_jobs_due_idx
  on public.communication_jobs (status, run_after, created_at)
  where status in ('pending', 'failed');

create index if not exists communication_jobs_campaign_idx
  on public.communication_jobs (campaign_id, created_at desc)
  where campaign_id is not null;

-- Map campaign kinds to preference categories.
create or replace function public.preference_category_for_campaign_kind(
  kind public.email_campaign_kind
)
returns public.email_preference_category
language sql
immutable
set search_path = ''
as $$
  select case kind
    when 'announcement' then 'announcement'::public.email_preference_category
    when 'newsletter' then 'newsletter'::public.email_preference_category
    when 'event_promotion' then 'event_promotion'::public.email_preference_category
    when 'highlight_digest' then 'highlight_digest'::public.email_preference_category
    else 'transactional'::public.email_preference_category
  end;
$$;

create or replace function public.user_allows_email_category(
  target_user_id uuid,
  category public.email_preference_category
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when category = 'transactional' then true
    when not exists (
      select 1 from public.user_email_preferences pref
      where pref.user_id = target_user_id and pref.category = category
    ) then true
    else exists (
      select 1 from public.user_email_preferences pref
      where pref.user_id = target_user_id
        and pref.category = category
        and pref.opted_in
    )
  end;
$$;

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
  event_uuid uuid := nullif(filter ->> 'event_id', '')::uuid;
  roles text[] := coalesce(
    array(select jsonb_array_elements_text(coalesce(filter -> 'roles', '[]'::jsonb))),
    array[]::text[]
  );
begin
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
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.resolve_email_audience_user_ids(target_club_id, audience, filter) audience_user
  where public.user_allows_email_category(audience_user.user_id, category);
$$;

create or replace function public.enqueue_communication_job(
  p_job_type public.communication_job_type,
  p_idempotency_key text,
  p_campaign_id uuid default null,
  p_payload jsonb default '{}'::jsonb,
  p_run_after timestamptz default statement_timestamp()
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_id uuid;
  campaign_row public.email_campaigns%rowtype;
  new_id uuid;
begin
  select id into existing_id
  from public.communication_jobs
  where idempotency_key = p_idempotency_key;

  if existing_id is not null then
    return existing_id;
  end if;

  if p_campaign_id is not null then
    select * into campaign_row from public.email_campaigns where id = p_campaign_id;
    if not found then
      raise exception 'Campaign not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.communication_jobs (
    job_type, campaign_id, school_id, club_id, payload, idempotency_key, run_after
  )
  values (
    p_job_type,
    p_campaign_id,
    campaign_row.school_id,
    campaign_row.club_id,
    coalesce(p_payload, '{}'::jsonb),
    p_idempotency_key,
    coalesce(p_run_after, statement_timestamp())
  )
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.claim_communication_jobs(
  worker_id text,
  batch_size integer default 10
)
returns setof public.communication_jobs
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with due as (
    select job.id
    from public.communication_jobs job
    where job.status in ('pending', 'failed')
      and job.run_after <= statement_timestamp()
      and job.attempt_count < job.max_attempts
      and (job.locked_at is null or job.locked_at < statement_timestamp() - interval '15 minutes')
    order by job.run_after asc, job.created_at asc
    for update skip locked
    limit greatest(batch_size, 1)
  )
  update public.communication_jobs job
  set
    status = 'processing',
    locked_at = statement_timestamp(),
    locked_by = worker_id,
    attempt_count = job.attempt_count + 1,
    updated_at = statement_timestamp()
  from due
  where job.id = due.id
  returning job.*;
end;
$$;

create or replace function public.complete_communication_job(
  target_job_id uuid,
  succeeded boolean,
  error_message text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  job_row public.communication_jobs%rowtype;
begin
  select * into job_row
  from public.communication_jobs
  where id = target_job_id
  for update;

  if not found then
    return;
  end if;

  if succeeded then
    update public.communication_jobs
    set
      status = 'completed',
      completed_at = statement_timestamp(),
      locked_at = null,
      locked_by = null,
      last_error = null,
      updated_at = statement_timestamp()
    where id = target_job_id;
  elsif job_row.attempt_count >= job_row.max_attempts then
    update public.communication_jobs
    set
      status = 'failed',
      last_error = left(coalesce(error_message, 'max attempts exceeded'), 1000),
      locked_at = null,
      locked_by = null,
      updated_at = statement_timestamp(),
      run_after = statement_timestamp() + interval '1 day'
    where id = target_job_id;
  else
    update public.communication_jobs
    set
      status = 'failed',
      last_error = left(coalesce(error_message, 'transient failure'), 1000),
      locked_at = null,
      locked_by = null,
      run_after = statement_timestamp() + make_interval(secs => least(3600, power(2, job_row.attempt_count)::integer * 30)),
      updated_at = statement_timestamp()
    where id = target_job_id;
  end if;
end;
$$;

create or replace function public.claim_pending_email_recipients(
  target_campaign_id uuid,
  batch_size integer default 50
)
returns setof public.email_recipients
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with due as (
    select recipient.id
    from public.email_recipients recipient
    where recipient.campaign_id = target_campaign_id
      and recipient.status = 'pending'
      and recipient.permanent_failure = false
      and recipient.next_attempt_at <= statement_timestamp()
      and recipient.attempt_count < recipient.max_attempts
      and recipient.provider_message_id is null
    order by recipient.created_at asc
    for update skip locked
    limit greatest(batch_size, 1)
  )
  update public.email_recipients recipient
  set
    attempt_count = recipient.attempt_count + 1,
    updated_at = statement_timestamp()
  from due
  where recipient.id = due.id
  returning recipient.*;
end;
$$;

-- RLS
alter table public.user_email_preferences enable row level security;
alter table public.communication_jobs enable row level security;

drop policy if exists user_email_preferences_own_select on public.user_email_preferences;
drop policy if exists user_email_preferences_own_upsert on public.user_email_preferences;
drop policy if exists user_email_preferences_own_update on public.user_email_preferences;
create policy user_email_preferences_own_select on public.user_email_preferences
  for select to authenticated using (user_id = auth.uid());
create policy user_email_preferences_own_insert on public.user_email_preferences
  for insert to authenticated with check (
    user_id = auth.uid() and category <> 'transactional'
  );
create policy user_email_preferences_own_update on public.user_email_preferences
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid() and category <> 'transactional');

drop policy if exists communication_jobs_manager_select on public.communication_jobs;
create policy communication_jobs_manager_select on public.communication_jobs
  for select to authenticated using (
    (club_id is not null and public.can_manage_club(club_id))
    or (school_id is not null and public.can_manage_school(school_id))
    or public.is_platform_admin()
  );
-- Clients never write jobs directly.
drop policy if exists communication_jobs_no_client_write on public.communication_jobs;
create policy communication_jobs_no_client_insert on public.communication_jobs
  for insert to authenticated with check (false);
create policy communication_jobs_no_client_update on public.communication_jobs
  for update to authenticated using (false);
create policy communication_jobs_no_client_delete on public.communication_jobs
  for delete to authenticated using (false);

drop trigger if exists audit_user_email_preferences on public.user_email_preferences;
create trigger audit_user_email_preferences
  after insert or update or delete on public.user_email_preferences
  for each row execute function public.audit_row_change('user_email_preference');

drop trigger if exists audit_communication_jobs on public.communication_jobs;
create trigger audit_communication_jobs
  after insert or update or delete on public.communication_jobs
  for each row execute function public.audit_row_change('communication_job');

drop trigger if exists set_updated_at_user_email_preferences on public.user_email_preferences;
create trigger set_updated_at_user_email_preferences
  before update on public.user_email_preferences
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_communication_jobs on public.communication_jobs;
create trigger set_updated_at_communication_jobs
  before update on public.communication_jobs
  for each row execute function public.set_updated_at();

revoke all on function public.preference_category_for_campaign_kind(public.email_campaign_kind) from public;
revoke all on function public.user_allows_email_category(uuid, public.email_preference_category) from public;
revoke all on function public.resolve_email_audience_user_ids(uuid, public.email_audience_type, jsonb) from public;
revoke all on function public.count_email_audience(uuid, public.email_audience_type, jsonb, public.email_preference_category) from public;
revoke all on function public.enqueue_communication_job(public.communication_job_type, text, uuid, jsonb, timestamptz) from public;
revoke all on function public.claim_communication_jobs(text, integer) from public;
revoke all on function public.complete_communication_job(uuid, boolean, text) from public;
revoke all on function public.claim_pending_email_recipients(uuid, integer) from public;

grant execute on function public.preference_category_for_campaign_kind(public.email_campaign_kind) to authenticated, service_role;
grant execute on function public.user_allows_email_category(uuid, public.email_preference_category) to authenticated, service_role;
grant execute on function public.resolve_email_audience_user_ids(uuid, public.email_audience_type, jsonb) to authenticated, service_role;
grant execute on function public.count_email_audience(uuid, public.email_audience_type, jsonb, public.email_preference_category) to authenticated, service_role;
grant execute on function public.enqueue_communication_job(public.communication_job_type, text, uuid, jsonb, timestamptz) to service_role;
-- Officers enqueue via security-definer helper wrapped in app with manage checks; grant to authenticated
-- only through a guarded wrapper below.
grant execute on function public.claim_communication_jobs(text, integer) to service_role;
grant execute on function public.complete_communication_job(uuid, boolean, text) to service_role;
grant execute on function public.claim_pending_email_recipients(uuid, integer) to service_role;

create or replace function public.officer_enqueue_campaign_send(
  target_campaign_id uuid,
  send_immediately boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  campaign_row public.email_campaigns%rowtype;
  job_id uuid;
  run_at timestamptz;
  key text;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into campaign_row
  from public.email_campaigns
  where id = target_campaign_id
  for update;

  if not found then
    raise exception 'Campaign not found' using errcode = 'P0002';
  end if;
  if campaign_row.club_id is null or not public.can_manage_club(campaign_row.club_id, actor) then
    raise exception 'Not authorized to send this campaign' using errcode = '42501';
  end if;
  if campaign_row.status not in ('draft', 'scheduled') then
    -- Idempotent re-queue: return existing prepare job when already in flight.
    key := 'prepare:' || target_campaign_id::text || ':' || coalesce(campaign_row.idempotency_key, target_campaign_id::text);
    select id into job_id
    from public.communication_jobs
    where idempotency_key = key;
    if job_id is not null then
      return job_id;
    end if;
    raise exception 'Campaign cannot be queued from status %', campaign_row.status
      using errcode = '23514';
  end if;

  run_at := case
    when send_immediately then statement_timestamp()
    else coalesce(campaign_row.scheduled_for, statement_timestamp())
  end;

  update public.email_campaigns
  set
    status = case
      when run_at > statement_timestamp() then 'scheduled'::public.email_campaign_status
      else 'sending'::public.email_campaign_status
    end,
    scheduled_for = run_at,
    preference_category = public.preference_category_for_campaign_kind(campaign_row.campaign_kind),
    updated_at = statement_timestamp()
  where id = target_campaign_id;

  key := 'prepare:' || target_campaign_id::text || ':' || coalesce(campaign_row.idempotency_key, target_campaign_id::text);

  job_id := public.enqueue_communication_job(
    'prepare_campaign_recipients',
    key,
    target_campaign_id,
    jsonb_build_object('requested_by', actor),
    run_at
  );

  insert into public.audit_logs (
    actor_id, action, entity_type, entity_id, school_id, club_id, metadata
  )
  values (
    actor,
    'email_campaign.enqueue_send',
    'email_campaigns',
    target_campaign_id,
    campaign_row.school_id,
    campaign_row.club_id,
    jsonb_build_object(
      'audience_type', campaign_row.audience_type::text,
      'campaign_kind', campaign_row.campaign_kind::text,
      'run_at', run_at,
      'job_id', job_id
    )
  );

  return job_id;
end;
$$;

-- Allow event-audience recipients who are authorized for the campaign event
-- even when they are school peers rather than club members.
create or replace function public.validate_email_recipient_scope()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  campaign_club_id uuid;
  campaign_school_id uuid;
  audience public.email_audience_type;
  event_uuid uuid;
begin
  select club_id, school_id, audience_type,
         nullif(audience_filter ->> 'event_id', '')::uuid
    into campaign_club_id, campaign_school_id, audience, event_uuid
  from public.email_campaigns
  where id = new.campaign_id;

  if campaign_club_id is not null then
    if exists (
      select 1
      from public.club_memberships
      where club_id = campaign_club_id
        and user_id = new.recipient_user_id
        and status = 'active'
    ) then
      return new;
    end if;

    if audience in ('event_registrants', 'event_attendees')
      and event_uuid is not null
      and exists (
        select 1 from public.events
        where id = event_uuid and club_id = campaign_club_id
      )
      and (
        exists (
          select 1 from public.event_rsvps
          where event_id = event_uuid
            and user_id = new.recipient_user_id
        )
        or exists (
          select 1
          from public.attendance_sessions session
          join public.attendance_records record on record.session_id = session.id
          join public.club_memberships membership on membership.id = record.membership_id
          where session.event_id = event_uuid
            and membership.user_id = new.recipient_user_id
        )
      )
    then
      return new;
    end if;

    raise exception 'Campaign recipient must be an authorized club or event audience member'
      using errcode = '23514';
  elsif not exists (
    select 1
    from public.user_school_memberships
    where school_id = campaign_school_id
      and user_id = new.recipient_user_id
      and status = 'active'
  ) then
    raise exception 'Campaign recipient must be an active school member'
      using errcode = '23514';
  end if;
  return new;
end;
$$;
