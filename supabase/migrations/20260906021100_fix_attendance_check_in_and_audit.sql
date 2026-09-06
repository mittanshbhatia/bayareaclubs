-- Fix ambiguous token_hash lookup and scope correction audit to intentional notes

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
