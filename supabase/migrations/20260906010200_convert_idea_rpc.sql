-- Idempotent approved-idea → club conversion under RLS, freeze approved version

create or replace function public.freeze_club_idea_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_version integer;
  officers jsonb;
  links jsonb;
begin
  if tg_op = 'UPDATE'
    and new.status in ('submitted', 'resubmitted', 'approved')
    and new.status is distinct from old.status then
    select coalesce(max(version_number), 0) + 1
      into next_version
    from public.club_idea_versions
    where idea_id = new.id;

    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'proposed_user_id', officer.proposed_user_id,
          'proposed_name', officer.proposed_name,
          'proposed_role', officer.proposed_role
        )
        order by officer.created_at
      ),
      '[]'::jsonb
    )
      into officers
    from public.club_idea_proposed_officers officer
    where officer.idea_id = new.id;

    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', link.title,
          'url', link.url
        )
        order by link.created_at
      ),
      '[]'::jsonb
    )
      into links
    from public.club_idea_links link
    where link.idea_id = new.id;

    insert into public.club_idea_versions (
      idea_id,
      version_number,
      status_at_freeze,
      snapshot,
      created_by
    )
    values (
      new.id,
      next_version,
      new.status,
      jsonb_build_object(
        'title', new.title,
        'category', new.category,
        'description', new.description,
        'mission', new.mission,
        'problem_opportunity', new.problem_opportunity,
        'expected_activities', to_jsonb(new.expected_activities),
        'expected_membership', new.expected_membership,
        'proposed_meeting_cadence', new.proposed_meeting_cadence,
        'proposed_advisor_id', new.proposed_advisor_id,
        'grade_min', new.grade_min,
        'grade_max', new.grade_max,
        'school_id', new.school_id,
        'officers', officers,
        'links', links
      ),
      auth.uid()
    );
  end if;
  return new;
end;
$$;

create or replace function public.convert_approved_idea_to_club(
  target_idea_id uuid,
  confirm_name text,
  confirm_slug text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  idea public.club_ideas%rowtype;
  existing_club_id uuid;
  new_club_id uuid;
  school_year text;
  officer record;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if length(trim(confirm_name)) < 2 or length(trim(confirm_name)) > 160 then
    raise exception 'Invalid club name' using errcode = '23514';
  end if;

  if confirm_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Invalid club slug' using errcode = '23514';
  end if;

  select *
    into idea
  from public.club_ideas
  where id = target_idea_id
  for update;

  if not found then
    raise exception 'Idea not found' using errcode = 'P0002';
  end if;

  if idea.submitter_id <> actor
    and not public.can_review_school(idea.school_id, actor) then
    raise exception 'Not authorized to convert this idea' using errcode = '42501';
  end if;

  select club.id
    into existing_club_id
  from public.clubs club
  where club.originating_idea_id = idea.id;

  if existing_club_id is not null then
    return existing_club_id;
  end if;

  if idea.status <> 'approved' then
    raise exception 'Only approved ideas can become clubs' using errcode = '23514';
  end if;

  school_year := to_char(timezone('America/Los_Angeles', now()), 'YYYY')
    || '-'
    || to_char(timezone('America/Los_Angeles', now()) + interval '1 year', 'YYYY');

  insert into public.clubs (
    school_id,
    originating_idea_id,
    name,
    slug,
    description,
    mission,
    category,
    grade_min,
    grade_max,
    approved_by,
    visibility,
    status
  )
  values (
    idea.school_id,
    idea.id,
    trim(confirm_name),
    confirm_slug,
    idea.description,
    idea.mission,
    idea.category,
    idea.grade_min,
    idea.grade_max,
    actor,
    'school',
    'active'
  )
  returning id into new_club_id;

  insert into public.club_memberships (
    club_id,
    user_id,
    role,
    status,
    school_year,
    joined_at
  )
  values (
    new_club_id,
    idea.submitter_id,
    'club_admin',
    'active',
    school_year,
    statement_timestamp()
  );

  for officer in
    select *
    from public.club_idea_proposed_officers
    where idea_id = idea.id
      and proposed_user_id is not null
      and proposed_user_id <> idea.submitter_id
  loop
    insert into public.club_memberships (
      club_id,
      user_id,
      role,
      status,
      school_year,
      invited_at,
      invited_by
    )
    values (
      new_club_id,
      officer.proposed_user_id,
      officer.proposed_role,
      'invited',
      school_year,
      statement_timestamp(),
      actor
    )
    on conflict (club_id, user_id, school_year) do nothing;
  end loop;

  if idea.proposed_advisor_id is not null
    and idea.proposed_advisor_id <> idea.submitter_id then
    insert into public.club_memberships (
      club_id,
      user_id,
      role,
      status,
      school_year,
      invited_at,
      invited_by
    )
    values (
      new_club_id,
      idea.proposed_advisor_id,
      'advisor',
      'invited',
      school_year,
      statement_timestamp(),
      actor
    )
    on conflict (club_id, user_id, school_year) do nothing;
  end if;

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
    actor,
    'club_idea.convert',
    'club_ideas',
    idea.id,
    idea.school_id,
    new_club_id,
    jsonb_build_object(
      'club_id', new_club_id,
      'slug', confirm_slug,
      'name', trim(confirm_name)
    )
  );

  return new_club_id;
exception
  when unique_violation then
    select club.id
      into existing_club_id
    from public.clubs club
    where club.originating_idea_id = target_idea_id;
    if existing_club_id is not null then
      return existing_club_id;
    end if;
    raise;
end;
$$;

revoke all on function public.convert_approved_idea_to_club(uuid, text, text) from public;
grant execute on function public.convert_approved_idea_to_club(uuid, text, text) to authenticated;

-- Concurrent decisions: second decision fails if idea left under_review
create or replace function public.apply_club_idea_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.decision is not null
    and new.decision is distinct from old.decision then
    if new.decision = 'changes_requested'
      and length(trim(coalesce(new.applicant_feedback, ''))) < 12 then
      raise exception 'Meaningful applicant feedback is required for changes requested'
        using errcode = '23514';
    end if;
    if new.decision = 'rejected'
      and length(trim(coalesce(new.applicant_feedback, ''))) < 12 then
      raise exception 'A decision reason is required for rejection'
        using errcode = '23514';
    end if;

    perform pg_advisory_xact_lock(hashtext(new.idea_id::text));

    update public.club_ideas
    set status = new.decision::text::public.club_idea_status
    where id = new.idea_id
      and status = 'under_review';
    if not found then
      raise exception 'Idea must be under review before a decision'
        using errcode = '23514';
    end if;

    insert into public.audit_logs (
      actor_id,
      action,
      entity_type,
      entity_id,
      school_id,
      metadata
    )
    select
      auth.uid(),
      'club_idea.' || new.decision::text,
      'club_ideas',
      idea.id,
      idea.school_id,
      jsonb_build_object(
        'review_id', new.id,
        'decision', new.decision::text
      )
    from public.club_ideas idea
    where idea.id = new.idea_id;
  end if;
  return new;
end;
$$;
