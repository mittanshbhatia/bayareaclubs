-- Attendance system hardening: eligible members, corrections, opt-in secure check-in

alter table public.attendance_sessions
  add column if not exists title text not null default 'Meeting',
  add column if not exists check_in_enabled boolean not null default false;

alter table public.attendance_records
  add column if not exists previous_status public.attendance_status,
  add column if not exists corrected_at timestamptz,
  add column if not exists correction_note text;

create table if not exists public.attendance_check_in_tokens (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  consumed_at timestamptz,
  consumed_by uuid references public.profiles(id) on delete set null,
  check (expires_at > created_at),
  check (
    (consumed_at is null and consumed_by is null)
    or (consumed_at is not null and consumed_by is not null)
  )
);

create index if not exists attendance_check_in_tokens_session_idx
  on public.attendance_check_in_tokens (session_id, expires_at desc);

alter table public.attendance_check_in_tokens enable row level security;

drop policy if exists attendance_tokens_manager_select on public.attendance_check_in_tokens;
drop policy if exists attendance_tokens_manager_insert on public.attendance_check_in_tokens;
drop policy if exists attendance_tokens_no_update on public.attendance_check_in_tokens;
drop policy if exists attendance_tokens_manager_delete on public.attendance_check_in_tokens;

create policy attendance_tokens_manager_select on public.attendance_check_in_tokens
  for select to authenticated using (
    exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  );
create policy attendance_tokens_manager_insert on public.attendance_check_in_tokens
  for insert to authenticated with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
        and session.check_in_enabled
    )
  );
create policy attendance_tokens_no_update on public.attendance_check_in_tokens
  for update to authenticated using (false);
create policy attendance_tokens_manager_delete on public.attendance_check_in_tokens
  for delete to authenticated using (
    exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  );

-- Eligible memberships must be active in the session club
create or replace function public.validate_attendance_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  session_club_id uuid;
  membership_club_id uuid;
  membership_status public.membership_status;
begin
  select club_id into session_club_id
  from public.attendance_sessions where id = new.session_id;
  select club_id, status
    into membership_club_id, membership_status
  from public.club_memberships where id = new.membership_id;

  if session_club_id is distinct from membership_club_id then
    raise exception 'Attendance membership must belong to the session club'
      using errcode = '23514';
  end if;
  if membership_status <> 'active' then
    raise exception 'Attendance can only be recorded for active members'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create or replace function public.record_attendance_correction()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  session_club uuid;
begin
  if tg_op = 'UPDATE'
    and new.status is distinct from old.status then
    new.recorded_by := coalesce(auth.uid(), new.recorded_by);
    new.recorded_at := statement_timestamp();

    -- Intentional officer corrections only (not routine take-attendance saves)
    if new.correction_note is not null
      and length(trim(new.correction_note)) > 0 then
      new.previous_status := old.status;
      new.corrected_at := statement_timestamp();

      select club_id into session_club
      from public.attendance_sessions
      where id = new.session_id;

      insert into public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        school_id,
        club_id,
        metadata
      )
      select
        auth.uid(),
        'attendance_record.correct',
        'attendance_records',
        new.id,
        club.school_id,
        session_club,
        jsonb_build_object(
          'session_id', new.session_id,
          'membership_id', new.membership_id,
          'from_status', old.status::text,
          'to_status', new.status::text,
          'note', new.correction_note
        )
      from public.clubs club
      where club.id = session_club;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists attendance_records_record_correction on public.attendance_records;
create trigger attendance_records_record_correction
  before update of status on public.attendance_records
  for each row execute function public.record_attendance_correction();

-- One-time redeemable check-in for authenticated club members
create or replace function public.issue_attendance_check_in_token(
  target_session_id uuid,
  ttl_seconds integer default 120
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  session_row public.attendance_sessions%rowtype;
  raw_token text;
  token_hash text;
  ttl integer := greatest(30, least(coalesce(ttl_seconds, 120), 600));
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into session_row
  from public.attendance_sessions
  where id = target_session_id
  for update;

  if not found then
    raise exception 'Attendance session not found' using errcode = 'P0002';
  end if;
  if not public.can_manage_club(session_row.club_id, actor) then
    raise exception 'Not authorized to issue check-in tokens' using errcode = '42501';
  end if;
  if not session_row.check_in_enabled then
    raise exception 'Check-in is disabled for this session' using errcode = '23514';
  end if;

  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  token_hash := encode(extensions.digest(raw_token, 'sha256'), 'hex');

  insert into public.attendance_check_in_tokens (
    session_id, token_hash, expires_at, created_by
  )
  values (
    session_row.id,
    token_hash,
    statement_timestamp() + make_interval(secs => ttl),
    actor
  );

  return raw_token;
end;
$$;

create or replace function public.redeem_attendance_check_in(raw_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  token_row public.attendance_check_in_tokens%rowtype;
  session_row public.attendance_sessions%rowtype;
  membership_id uuid;
  record_id uuid;
  computed_hash text;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if raw_token is null or length(trim(raw_token)) < 32 then
    raise exception 'Invalid check-in token' using errcode = '23514';
  end if;

  computed_hash := encode(extensions.digest(trim(raw_token), 'sha256'), 'hex');

  select * into token_row
  from public.attendance_check_in_tokens tokens
  where tokens.token_hash = computed_hash
  for update;

  if not found then
    raise exception 'Check-in token not found' using errcode = 'P0002';
  end if;
  if token_row.consumed_at is not null then
    raise exception 'Check-in token already used' using errcode = '23514';
  end if;
  if token_row.expires_at <= statement_timestamp() then
    raise exception 'Check-in token expired' using errcode = '23514';
  end if;

  select * into session_row
  from public.attendance_sessions
  where id = token_row.session_id
  for update;

  if not session_row.check_in_enabled then
    raise exception 'Check-in is disabled for this session' using errcode = '23514';
  end if;

  select membership.id into membership_id
  from public.club_memberships membership
  where membership.club_id = session_row.club_id
    and membership.user_id = actor
    and membership.status = 'active'
  order by membership.joined_at desc nulls last
  limit 1;

  if membership_id is null then
    raise exception 'You are not an active member of this club'
      using errcode = '42501';
  end if;

  insert into public.attendance_records (
    session_id,
    membership_id,
    status,
    recorded_by,
    note
  )
  values (
    session_row.id,
    membership_id,
    'present',
    actor,
    'Authenticated check-in'
  )
  on conflict (session_id, membership_id) do update
    set
      status = excluded.status,
      note = coalesce(public.attendance_records.note, excluded.note),
      recorded_by = excluded.recorded_by,
      recorded_at = statement_timestamp(),
      updated_at = statement_timestamp()
  returning id into record_id;

  update public.attendance_check_in_tokens
  set
    consumed_at = statement_timestamp(),
    consumed_by = actor
  where id = token_row.id;

  return record_id;
end;
$$;

revoke all on function public.issue_attendance_check_in_token(uuid, integer) from public;
revoke all on function public.redeem_attendance_check_in(text) from public;
grant execute on function public.issue_attendance_check_in_token(uuid, integer) to authenticated;
grant execute on function public.redeem_attendance_check_in(text) to authenticated;
