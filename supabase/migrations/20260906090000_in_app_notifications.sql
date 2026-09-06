-- In-app notifications: preferences, scoped emit helpers, Realtime publication.

create type public.in_app_notification_category as enum (
  'club_ideas',
  'membership',
  'events',
  'governance',
  'communications',
  'resources'
);

alter table public.notifications
  add column if not exists club_id uuid references public.clubs(id) on delete set null,
  add column if not exists school_id uuid references public.schools(id) on delete set null,
  add column if not exists entity_type text
    check (entity_type is null or length(trim(entity_type)) between 1 and 120),
  add column if not exists entity_id uuid,
  add column if not exists payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object');

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_club_created_idx
  on public.notifications (club_id, created_at desc)
  where club_id is not null;

comment on table public.notifications is
  'Persistent in-app notifications. Realtime is UX-only; PostgreSQL is the source of truth.';

create table public.user_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category public.in_app_notification_category not null,
  in_app_enabled boolean not null default true,
  updated_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp(),
  unique (user_id, category),
  -- Critical workflow categories cannot be disabled.
  check (
    category not in (
      'club_ideas'::public.in_app_notification_category,
      'membership'::public.in_app_notification_category,
      'governance'::public.in_app_notification_category
    )
    or in_app_enabled
  )
);

create index user_notification_preferences_user_idx
  on public.user_notification_preferences (user_id);

comment on table public.user_notification_preferences is
  'Per-user in-app notification category preferences. club_ideas, membership, and governance stay on.';

create or replace function public.notification_category_for_type(p_type text)
returns public.in_app_notification_category
language sql
immutable
set search_path = ''
as $$
  select case
    when p_type in (
      'club_idea_submitted',
      'club_idea_queue',
      'club_idea_assigned',
      'review_started',
      'club_idea_under_review',
      'changes_requested',
      'club_idea_changes_requested',
      'idea_approved',
      'club_idea_approved',
      'club_idea_rejected',
      'club_idea_resubmitted',
      'club_idea_converted_to_club'
    ) then 'club_ideas'::public.in_app_notification_category
    when p_type in ('club_invitation', 'officer_assignment')
      then 'membership'::public.in_app_notification_category
    when p_type in ('upcoming_event', 'event_changed')
      then 'events'::public.in_app_notification_category
    when p_type in (
      'charter_feedback',
      'renewal_due',
      'renewal_reminder_45_day',
      'renewal_reminder_14_day',
      'renewal_reminder_7_day',
      'renewal_reminder_due'
    ) then 'governance'::public.in_app_notification_category
    when p_type in ('newsletter_published')
      then 'communications'::public.in_app_notification_category
    when p_type in ('course_recommendation')
      then 'resources'::public.in_app_notification_category
    else 'club_ideas'::public.in_app_notification_category
  end;
$$;

create or replace function public.user_allows_in_app_notification(
  target_user_id uuid,
  p_type text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.notification_category_for_type(p_type) in (
      'club_ideas'::public.in_app_notification_category,
      'membership'::public.in_app_notification_category,
      'governance'::public.in_app_notification_category
    ) then true
    when not exists (
      select 1
      from public.user_notification_preferences pref
      where pref.user_id = target_user_id
        and pref.category = public.notification_category_for_type(p_type)
    ) then true
    else exists (
      select 1
      from public.user_notification_preferences pref
      where pref.user_id = target_user_id
        and pref.category = public.notification_category_for_type(p_type)
        and pref.in_app_enabled
    )
  end;
$$;

-- Internal emitter used by trusted security-definer workflows.
create or replace function public.internal_emit_in_app_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_action_url text default null,
  p_club_id uuid default null,
  p_school_id uuid default null,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  notification_id uuid;
begin
  if p_user_id is null then
    return null;
  end if;
  if p_action_url is not null and p_action_url !~ '^/' then
    raise exception 'action_url must be an app-relative path' using errcode = '22023';
  end if;
  if not public.user_allows_in_app_notification(p_user_id, p_type) then
    return null;
  end if;

  insert into public.notifications (
    user_id,
    notification_type,
    title,
    body,
    action_url,
    club_id,
    school_id,
    entity_type,
    entity_id,
    payload
  )
  values (
    p_user_id,
    p_type,
    p_title,
    p_body,
    p_action_url,
    p_club_id,
    p_school_id,
    p_entity_type,
    p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  )
  returning id into notification_id;

  return notification_id;
end;
$$;

-- Authorized emitter for authenticated managers / platform admins.
create or replace function public.emit_in_app_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_action_url text default null,
  p_club_id uuid default null,
  p_school_id uuid default null,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if not (
    public.is_platform_admin(actor)
    or (p_club_id is not null and public.can_manage_club(p_club_id, actor))
    or (p_school_id is not null and public.can_review_school(p_school_id, actor))
  ) then
    raise exception 'Not authorized to emit this notification' using errcode = '42501';
  end if;

  -- Prevent cross-club leakage: when club-scoped, recipient must belong to that club
  -- (or be the invite target for invited memberships).
  if p_club_id is not null
     and not public.is_platform_admin(actor)
     and not exists (
       select 1
       from public.club_memberships membership
       where membership.club_id = p_club_id
         and membership.user_id = p_user_id
         and membership.status in ('active', 'invited')
     ) then
    raise exception 'Recipient is not a member of the target club' using errcode = '42501';
  end if;

  return public.internal_emit_in_app_notification(
    p_user_id,
    p_type,
    p_title,
    p_body,
    p_action_url,
    p_club_id,
    p_school_id,
    p_entity_type,
    p_entity_id,
    p_payload
  );
end;
$$;

create or replace function public.emit_in_app_notifications_to_club_members(
  p_club_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_action_url text default null,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb,
  p_roles public.club_role[] default null,
  p_exclude_user_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  school uuid;
  member record;
  emitted integer := 0;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if not (
    public.is_platform_admin(actor)
    or public.can_manage_club(p_club_id, actor)
  ) then
    raise exception 'Not authorized to notify club members' using errcode = '42501';
  end if;

  select school_id into school from public.clubs where id = p_club_id;
  if school is null then
    raise exception 'Club not found' using errcode = 'P0002';
  end if;

  for member in
    select membership.user_id
    from public.club_memberships membership
    where membership.club_id = p_club_id
      and membership.status = 'active'
      and (p_roles is null or membership.role = any (p_roles))
      and (p_exclude_user_id is null or membership.user_id <> p_exclude_user_id)
  loop
    if public.internal_emit_in_app_notification(
      member.user_id,
      p_type,
      p_title,
      p_body,
      p_action_url,
      p_club_id,
      school,
      p_entity_type,
      p_entity_id,
      p_payload
    ) is not null then
      emitted := emitted + 1;
    end if;
  end loop;

  return emitted;
end;
$$;

create or replace function public.mark_all_notifications_read()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  updated_count integer;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  update public.notifications
  set read_at = statement_timestamp()
  where user_id = actor
    and read_at is null;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

-- Refresh club-idea status notifications to use the internal emitter + canonical types.
create or replace function public.notify_club_idea_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  action_path text := '/start-a-club/' || new.id::text;
  notif_title text;
  notif_body text;
  notif_type text;
  committee record;
  reviewer record;
begin
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    notif_type := case new.status
      when 'submitted' then 'club_idea_submitted'
      when 'under_review' then 'review_started'
      when 'changes_requested' then 'changes_requested'
      when 'approved' then 'idea_approved'
      when 'rejected' then 'club_idea_rejected'
      when 'resubmitted' then 'club_idea_resubmitted'
      when 'converted_to_club' then 'club_idea_converted_to_club'
      else 'club_idea_' || new.status::text
    end;
    notif_title := case new.status
      when 'approved' then 'Club idea approved'
      when 'changes_requested' then 'Changes requested'
      when 'rejected' then 'Club idea rejected'
      when 'submitted' then 'Club idea submitted'
      when 'under_review' then 'Review started'
      when 'resubmitted' then 'Club idea resubmitted'
      when 'converted_to_club' then 'Club created from idea'
      else 'Club idea updated'
    end;
    notif_body := case new.status
      when 'approved' then 'Your idea was approved. You can create the club.'
      when 'changes_requested' then 'Reviewer feedback is available. Update and resubmit.'
      when 'rejected' then 'Your idea was rejected. See the decision feedback for details.'
      when 'submitted' then 'Your application was received and is awaiting review.'
      when 'under_review' then 'A reviewer has started evaluating your application.'
      when 'resubmitted' then 'Your revised application was received.'
      when 'converted_to_club' then 'Your approved idea was converted into a club.'
      else 'The status of your club idea changed to ' || new.status::text || '.'
    end;

    perform public.internal_emit_in_app_notification(
      new.submitter_id,
      notif_type,
      notif_title,
      notif_body,
      case
        when new.status = 'approved' then '/start-a-club/' || new.id::text || '/create-club'
        else action_path
      end,
      null,
      new.school_id,
      'club_ideas',
      new.id,
      jsonb_build_object('status', new.status)
    );

    if new.status in ('submitted', 'resubmitted') then
      for committee in
        select assignment.user_id
        from public.platform_role_assignments assignment
        where assignment.role = 'committee_reviewer'
          and assignment.revoked_at is null
      loop
        perform public.internal_emit_in_app_notification(
          committee.user_id,
          'club_idea_submitted',
          'New club idea in review queue',
          coalesce(nullif(trim(new.title), ''), 'Untitled idea') || ' is ready for review.',
          '/admin/ideas/' || new.id::text,
          null,
          new.school_id,
          'club_ideas',
          new.id,
          jsonb_build_object('status', new.status)
        );
      end loop;
    end if;

    if new.status = 'under_review' then
      for reviewer in
        select review.reviewer_id
        from public.club_idea_reviews review
        where review.idea_id = new.id
          and review.reviewed_at is null
      loop
        perform public.internal_emit_in_app_notification(
          reviewer.reviewer_id,
          'review_started',
          'Review assigned',
          'You are assigned to review ' || coalesce(nullif(trim(new.title), ''), 'a club idea') || '.',
          '/admin/ideas/' || new.id::text,
          null,
          new.school_id,
          'club_ideas',
          new.id,
          '{}'::jsonb
        );
      end loop;
    end if;
  end if;
  return new;
end;
$$;

-- Renewal reminders use the internal emitter (preserve enqueue + scheduled_for semantics).
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
  notif_type text;
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

    notif_type := case
      when reminder.reminder_kind = 'due' then 'renewal_due'
      else 'renewal_reminder_' || reminder.reminder_kind
    end;
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
      perform public.internal_emit_in_app_notification(
        officer.user_id,
        notif_type,
        title,
        body,
        '/clubs/' || coalesce(club_slug, '') || '/charter/renewal',
        reminder.club_id,
        null,
        'club_renewals',
        null,
        jsonb_build_object(
          'reminder_kind', reminder.reminder_kind,
          'school_year', reminder.school_year
        )
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

revoke all on function public.process_due_renewal_reminders(timestamptz) from public;
grant execute on function public.process_due_renewal_reminders(timestamptz) to service_role;

alter table public.user_notification_preferences enable row level security;

drop policy if exists user_notification_preferences_own_select on public.user_notification_preferences;
drop policy if exists user_notification_preferences_own_insert on public.user_notification_preferences;
drop policy if exists user_notification_preferences_own_update on public.user_notification_preferences;
drop policy if exists user_notification_preferences_own_delete on public.user_notification_preferences;

create policy user_notification_preferences_own_select
  on public.user_notification_preferences
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());

create policy user_notification_preferences_own_insert
  on public.user_notification_preferences
  for insert to authenticated
  with check (user_id = auth.uid());

create policy user_notification_preferences_own_update
  on public.user_notification_preferences
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy user_notification_preferences_own_delete
  on public.user_notification_preferences
  for delete to authenticated
  using (user_id = auth.uid());

-- Narrow SELECT for non-admins (own rows only) keeps Realtime from leaking across users.
drop policy if exists notifications_own_select on public.notifications;
create policy notifications_own_select on public.notifications
  for select to authenticated using (
    user_id = auth.uid()
    or public.is_platform_admin()
  );

drop trigger if exists set_updated_at_user_notification_preferences
  on public.user_notification_preferences;
create trigger set_updated_at_user_notification_preferences
  before update on public.user_notification_preferences
  for each row execute function public.set_updated_at();

drop trigger if exists audit_user_notification_preferences
  on public.user_notification_preferences;
create trigger audit_user_notification_preferences
  after insert or update or delete on public.user_notification_preferences
  for each row execute function public.audit_row_change('user_notification_preference');

revoke all on function public.notification_category_for_type(text) from public;
revoke all on function public.user_allows_in_app_notification(uuid, text) from public;
revoke all on function public.internal_emit_in_app_notification(
  uuid, text, text, text, text, uuid, uuid, text, uuid, jsonb
) from public;
revoke all on function public.emit_in_app_notification(
  uuid, text, text, text, text, uuid, uuid, text, uuid, jsonb
) from public;
revoke all on function public.emit_in_app_notifications_to_club_members(
  uuid, text, text, text, text, text, uuid, jsonb, public.club_role[], uuid
) from public;
revoke all on function public.mark_all_notifications_read() from public;

grant execute on function public.notification_category_for_type(text) to authenticated;
grant execute on function public.user_allows_in_app_notification(uuid, text) to authenticated;
grant execute on function public.emit_in_app_notification(
  uuid, text, text, text, text, uuid, uuid, text, uuid, jsonb
) to authenticated;
grant execute on function public.emit_in_app_notifications_to_club_members(
  uuid, text, text, text, text, text, uuid, jsonb, public.club_role[], uuid
) to authenticated;
grant execute on function public.mark_all_notifications_read() to authenticated;

-- Realtime: narrow table publication; clients must filter by user_id=eq.<self>.
alter table public.notifications replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception
  when duplicate_object then null;
  when undefined_object then
    -- Local/test environments without realtime publication.
    null;
end $$;
