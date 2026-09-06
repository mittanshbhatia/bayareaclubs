-- Fix waitlist promotion seeing freed seats within the same transaction
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

  -- Inline count so promotion sees seats freed earlier in this transaction
  select count(*)::integer into going_count
  from public.event_rsvps
  where event_id = target_event_id
    and status = 'going';

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
