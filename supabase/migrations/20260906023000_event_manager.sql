-- Event Manager: RSVP capacity/waitlist, logistics status, builder fields, admin override audit

alter table public.events
  add column if not exists maybe_rsvp_enabled boolean not null default true,
  add column if not exists audience_notes text not null default '',
  add column if not exists permissions_notes text not null default '',
  add column if not exists builder_step smallint not null default 1
    check (builder_step between 1 and 20);

-- Soften location requirements for drafts so the builder can autosave section-by-section
do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.events'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%format%'
  loop
    execute format('alter table public.events drop constraint %I', constraint_row.conname);
  end loop;
end $$;

alter table public.events
  add constraint events_format_location_check check (
    status = 'draft'
    or (
      (format = 'in_person' and nullif(trim(location_name), '') is not null)
      or (format = 'online' and nullif(trim(online_url), '') is not null)
      or (
        format = 'hybrid'
        and nullif(trim(location_name), '') is not null
        and nullif(trim(online_url), '') is not null
      )
    )
  );

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'logistics_item_status'
  ) then
    create type public.logistics_item_status as enum (
      'not_started',
      'in_progress',
      'blocked',
      'complete'
    );
  end if;
end $$;

alter table public.event_logistics
  add column if not exists status public.logistics_item_status not null default 'not_started',
  add column if not exists notes text not null default '';

create or replace function public.sync_logistics_completion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'complete' and new.completed_at is null then
    new.completed_at := statement_timestamp();
  elsif new.status <> 'complete' then
    new.completed_at := null;
  end if;
  if new.notes is null then
    new.notes := '';
  end if;
  if nullif(trim(new.details), '') is null then
    new.details := coalesce(nullif(trim(new.notes), ''), new.title);
  end if;
  return new;
end;
$$;

drop trigger if exists event_logistics_sync_completion on public.event_logistics;
create trigger event_logistics_sync_completion
  before insert or update on public.event_logistics
  for each row execute function public.sync_logistics_completion();

do $$
begin
  alter type public.event_task_status add value if not exists 'blocked';
exception
  when duplicate_object then null;
end $$;

alter table public.event_rsvps
  add column if not exists waitlisted_at timestamptz,
  add column if not exists previous_status public.rsvp_status,
  add column if not exists override_note text,
  add column if not exists overridden_by uuid references public.profiles(id) on delete set null,
  add column if not exists overridden_at timestamptz;

create index if not exists event_rsvps_waitlist_fifo_idx
  on public.event_rsvps (event_id, waitlisted_at, created_at, id)
  where status = 'waitlisted';

create or replace function public.count_event_going(target_event_id uuid)
returns integer
language sql
volatile
set search_path = ''
as $$
  select count(*)::integer
  from public.event_rsvps
  where event_id = target_event_id
    and status = 'going';
$$;

create or replace function public.promote_event_waitlist(target_event_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_row public.events%rowtype;
  going_count integer;
  slots integer;
  promoted integer := 0;
  candidate record;
begin
  select * into event_row
  from public.events
  where id = target_event_id
  for update;

  if not found then
    return 0;
  end if;
  if event_row.capacity is null or not event_row.waitlist_enabled then
    return 0;
  end if;

  going_count := public.count_event_going(target_event_id);
  slots := greatest(event_row.capacity - going_count, 0);
  if slots <= 0 then
    return 0;
  end if;

  for candidate in
    select id
    from public.event_rsvps
    where event_id = target_event_id
      and status = 'waitlisted'
    order by waitlisted_at asc nulls last, created_at asc, id asc
    limit slots
    for update skip locked
  loop
    update public.event_rsvps
    set
      status = 'going',
      waitlisted_at = null,
      responded_at = statement_timestamp(),
      updated_at = statement_timestamp()
    where id = candidate.id;
    promoted := promoted + 1;
  end loop;

  return promoted;
end;
$$;

create or replace function public.upsert_event_rsvp(
  target_event_id uuid,
  desired_status public.rsvp_status
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  event_row public.events%rowtype;
  existing public.event_rsvps%rowtype;
  going_count integer;
  next_status public.rsvp_status := desired_status;
  result_id uuid;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if desired_status not in ('going', 'maybe', 'not_going', 'cancelled') then
    raise exception 'Invalid RSVP status for self-service' using errcode = '23514';
  end if;

  select * into event_row
  from public.events
  where id = target_event_id
  for update;

  if not found then
    raise exception 'Event not found' using errcode = 'P0002';
  end if;
  if event_row.status <> 'published' then
    raise exception 'RSVPs are only open for published events' using errcode = '23514';
  end if;
  if event_row.rsvp_deadline is not null
    and event_row.rsvp_deadline < statement_timestamp() then
    raise exception 'RSVP deadline has passed' using errcode = '23514';
  end if;
  if not public.can_view_event(target_event_id, actor) then
    raise exception 'Not authorized to RSVP' using errcode = '42501';
  end if;
  if desired_status = 'maybe' and not event_row.maybe_rsvp_enabled then
    raise exception 'Maybe RSVP is disabled for this event' using errcode = '23514';
  end if;

  select * into existing
  from public.event_rsvps
  where event_id = target_event_id
    and user_id = actor
  for update;

  if desired_status = 'going' then
    going_count := public.count_event_going(target_event_id);
    if not (existing.id is not null and existing.status = 'going')
      and event_row.capacity is not null
      and going_count >= event_row.capacity then
      if event_row.waitlist_enabled then
        next_status := 'waitlisted';
      else
        raise exception 'Event is at capacity' using errcode = '23514';
      end if;
    end if;
  end if;

  if existing.id is null then
    insert into public.event_rsvps (
      event_id, user_id, status, waitlisted_at, responded_at
    )
    values (
      target_event_id,
      actor,
      next_status,
      case when next_status = 'waitlisted' then statement_timestamp() else null end,
      statement_timestamp()
    )
    returning id into result_id;
  else
    update public.event_rsvps
    set
      status = next_status,
      waitlisted_at = case
        when next_status = 'waitlisted'
          and (existing.status is distinct from 'waitlisted' or existing.waitlisted_at is null)
          then statement_timestamp()
        when next_status = 'waitlisted' then existing.waitlisted_at
        else null
      end,
      responded_at = statement_timestamp(),
      updated_at = statement_timestamp()
    where id = existing.id
    returning id into result_id;
  end if;

  if existing.status = 'going' and next_status is distinct from 'going' then
    perform public.promote_event_waitlist(target_event_id);
  end if;

  return result_id;
end;
$$;

create or replace function public.admin_override_event_rsvp(
  target_rsvp_id uuid,
  desired_status public.rsvp_status,
  override_note text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  rsvp_row public.event_rsvps%rowtype;
  event_row public.events%rowtype;
  going_count integer;
  note text := trim(coalesce(override_note, ''));
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if length(note) < 3 then
    raise exception 'Override note is required' using errcode = '23514';
  end if;

  select * into rsvp_row
  from public.event_rsvps
  where id = target_rsvp_id
  for update;
  if not found then
    raise exception 'RSVP not found' using errcode = 'P0002';
  end if;

  select * into event_row
  from public.events
  where id = rsvp_row.event_id
  for update;

  if not (
    public.can_manage_club(event_row.club_id, actor)
    or public.can_review_school(event_row.school_id, actor)
  ) then
    raise exception 'Not authorized to override RSVP' using errcode = '42501';
  end if;

  if desired_status = 'going'
    and event_row.capacity is not null
    and rsvp_row.status is distinct from 'going' then
    going_count := public.count_event_going(event_row.id);
    if going_count >= event_row.capacity then
      raise exception 'Cannot override to going: event is at capacity'
        using errcode = '23514';
    end if;
  end if;

  update public.event_rsvps
  set
    previous_status = rsvp_row.status,
    status = desired_status,
    waitlisted_at = case
      when desired_status = 'waitlisted' then coalesce(waitlisted_at, statement_timestamp())
      else null
    end,
    override_note = note,
    overridden_by = actor,
    overridden_at = statement_timestamp(),
    responded_at = statement_timestamp(),
    updated_at = statement_timestamp()
  where id = rsvp_row.id;

  insert into public.audit_logs (
    actor_id, action, entity_type, entity_id, school_id, club_id, metadata
  )
  values (
    actor,
    'event_rsvp.admin_override',
    'event_rsvps',
    rsvp_row.id,
    event_row.school_id,
    event_row.club_id,
    jsonb_build_object(
      'event_id', event_row.id,
      'user_id', rsvp_row.user_id,
      'from_status', rsvp_row.status::text,
      'to_status', desired_status::text,
      'note', note
    )
  );

  if rsvp_row.status = 'going' and desired_status is distinct from 'going' then
    perform public.promote_event_waitlist(event_row.id);
  end if;

  return rsvp_row.id;
end;
$$;

drop policy if exists events_manager_update on public.events;
create policy events_manager_update on public.events
  for update to authenticated using (
    public.can_manage_club(club_id)
    or public.can_review_school(school_id)
  )
  with check (
    public.can_manage_club(club_id)
    or public.can_review_school(school_id)
  );

drop policy if exists events_authorized_select on public.events;
create policy events_authorized_select on public.events
  for select to authenticated using (
    public.is_club_member(club_id)
    or public.can_manage_club(club_id)
    or public.can_review_school(school_id)
    or (
      status = 'published'
      and visibility = 'school'
      and public.is_school_member(school_id)
    )
  );

create or replace function public.audit_event_admin_intervention()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
    and auth.uid() is not null
    and (
      new.status is distinct from old.status
      or new.capacity is distinct from old.capacity
      or new.waitlist_enabled is distinct from old.waitlist_enabled
      or new.approval_required is distinct from old.approval_required
    )
    and public.can_review_school(new.school_id)
    and not public.has_club_role(
      new.club_id,
      array[
        'club_admin','president','vice_president','secretary',
        'treasurer','officer','advisor'
      ]::public.club_role[]
    ) then
    insert into public.audit_logs (
      actor_id, action, entity_type, entity_id, school_id, club_id, metadata
    )
    values (
      auth.uid(),
      'event.admin_intervention',
      'events',
      new.id,
      new.school_id,
      new.club_id,
      jsonb_build_object(
        'from_status', old.status::text,
        'to_status', new.status::text,
        'from_capacity', old.capacity,
        'to_capacity', new.capacity
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists events_audit_admin_intervention on public.events;
create trigger events_audit_admin_intervention
  after update on public.events
  for each row execute function public.audit_event_admin_intervention();

create or replace function public.refresh_event_club_analytics(target_event_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_row public.events%rowtype;
  metric_day date := current_date;
  rsvp_count integer;
begin
  select * into event_row from public.events where id = target_event_id;
  if not found then
    return;
  end if;

  select count(*)::integer
  into rsvp_count
  from public.event_rsvps
  where event_id = target_event_id
    and status <> 'cancelled';

  insert into public.analytics_daily_club (
    club_id, metric_date, events, rsvps
  )
  values (
    event_row.club_id,
    metric_day,
    case when event_row.status in ('published', 'completed') then 1 else 0 end,
    rsvp_count
  )
  on conflict (club_id, metric_date) do update
  set
    events = greatest(public.analytics_daily_club.events, excluded.events),
    rsvps = greatest(public.analytics_daily_club.rsvps, excluded.rsvps);
end;
$$;

create or replace function public.touch_event_analytics_from_rsvp()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.refresh_event_club_analytics(coalesce(new.event_id, old.event_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists event_rsvps_touch_analytics on public.event_rsvps;
create trigger event_rsvps_touch_analytics
  after insert or update or delete on public.event_rsvps
  for each row execute function public.touch_event_analytics_from_rsvp();

create or replace function public.touch_event_analytics_from_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
    and (
      new.status is distinct from old.status
      or new.starts_at is distinct from old.starts_at
    ) then
    perform public.refresh_event_club_analytics(new.id);
  elsif tg_op = 'INSERT' then
    perform public.refresh_event_club_analytics(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists events_touch_analytics on public.events;
create trigger events_touch_analytics
  after insert or update of status, starts_at on public.events
  for each row execute function public.touch_event_analytics_from_event();

drop trigger if exists audit_event_rsvps on public.event_rsvps;
create trigger audit_event_rsvps
  after insert or update or delete on public.event_rsvps
  for each row execute function public.audit_row_change('event_rsvp');

drop trigger if exists audit_event_logistics on public.event_logistics;
create trigger audit_event_logistics
  after insert or update or delete on public.event_logistics
  for each row execute function public.audit_row_change('event_logistics');

revoke all on function public.upsert_event_rsvp(uuid, public.rsvp_status) from public;
revoke all on function public.admin_override_event_rsvp(uuid, public.rsvp_status, text) from public;
revoke all on function public.promote_event_waitlist(uuid) from public;
grant execute on function public.upsert_event_rsvp(uuid, public.rsvp_status) to authenticated;
grant execute on function public.admin_override_event_rsvp(uuid, public.rsvp_status, text) to authenticated;
grant execute on function public.promote_event_waitlist(uuid) to authenticated;
grant execute on function public.count_event_going(uuid) to authenticated;
