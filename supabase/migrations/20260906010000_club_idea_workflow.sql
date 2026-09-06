-- Club idea workflow enhancements: versions, draft step, notifications, view fixes

alter table public.club_ideas
  add column if not exists draft_step smallint not null default 1
    check (draft_step between 1 and 10);

create table public.club_idea_versions (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.club_ideas(id) on delete cascade,
  version_number integer not null check (version_number >= 1),
  status_at_freeze public.club_idea_status not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  unique (idea_id, version_number)
);

create index club_idea_versions_idea_created_idx
  on public.club_idea_versions (idea_id, version_number desc);

alter table public.club_idea_versions enable row level security;

create policy idea_versions_authorized_select on public.club_idea_versions
  for select to authenticated using (public.can_view_idea(idea_id));
create policy idea_versions_no_insert on public.club_idea_versions
  for insert to authenticated with check (false);
create policy idea_versions_no_update on public.club_idea_versions
  for update to authenticated using (false);
create policy idea_versions_no_delete on public.club_idea_versions
  for delete to authenticated using (false);

create or replace function public.can_view_idea(
  target_idea_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.club_ideas idea
    where idea.id = $1
      and (
        idea.submitter_id = $2
        or public.can_manage_school(idea.school_id, $2)
        or (
          public.is_committee_reviewer($2)
          and idea.status in (
            'submitted',
            'under_review',
            'changes_requested',
            'resubmitted',
            'approved',
            'rejected',
            'converted_to_club'
          )
        )
        or exists (
          select 1
          from public.club_idea_reviews review
          where review.idea_id = idea.id
            and review.reviewer_id = $2
        )
      )
  );
$$;

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
    and new.status in ('submitted', 'resubmitted')
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

create trigger club_ideas_freeze_version
  after update of status on public.club_ideas
  for each row execute function public.freeze_club_idea_version();

create or replace function public.notify_club_idea_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reviewer record;
  committee record;
  notif_title text;
  notif_body text;
  action_path text;
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    action_path := '/start-a-club/' || new.id::text;
    notif_title := case new.status
      when 'submitted' then 'Club idea submitted'
      when 'under_review' then 'Club idea under review'
      when 'changes_requested' then 'Changes requested on your club idea'
      when 'resubmitted' then 'Club idea resubmitted'
      when 'approved' then 'Club idea approved'
      when 'rejected' then 'Club idea rejected'
      when 'converted_to_club' then 'Club created from your idea'
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

    insert into public.notifications (
      user_id, notification_type, title, body, action_url
    )
    values (
      new.submitter_id,
      'club_idea_' || new.status::text,
      notif_title,
      notif_body,
      case
        when new.status = 'approved' then '/start-a-club/' || new.id::text || '/create-club'
        else action_path
      end
    );

    if new.status in ('submitted', 'resubmitted') then
      for committee in
        select assignment.user_id
        from public.platform_role_assignments assignment
        where assignment.role = 'committee_reviewer'
          and assignment.revoked_at is null
      loop
        insert into public.notifications (
          user_id, notification_type, title, body, action_url
        )
        values (
          committee.user_id,
          'club_idea_queue',
          'New club idea in review queue',
          coalesce(nullif(trim(new.title), ''), 'Untitled idea') || ' is ready for review.',
          '/admin/ideas/' || new.id::text
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
        insert into public.notifications (
          user_id, notification_type, title, body, action_url
        )
        values (
          reviewer.reviewer_id,
          'club_idea_assigned',
          'Review assigned',
          'You are assigned to review ' || coalesce(nullif(trim(new.title), ''), 'a club idea') || '.',
          '/admin/ideas/' || new.id::text
        );
      end loop;
    end if;
  end if;
  return new;
end;
$$;

create trigger club_ideas_notify_status
  after update of status on public.club_ideas
  for each row execute function public.notify_club_idea_status();

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

    update public.club_ideas
    set status = new.decision::text::public.club_idea_status
    where id = new.idea_id
      and status = 'under_review';
    if not found then
      raise exception 'Idea must be under review before a decision'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

-- Immutable versions
create trigger club_idea_versions_immutable
  before update or delete on public.club_idea_versions
  for each row execute function public.prevent_update_or_delete();
