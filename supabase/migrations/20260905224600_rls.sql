begin;

create function public.is_platform_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_role_assignments
    where platform_role_assignments.user_id = $1
      and role = 'platform_admin'
      and revoked_at is null
  );
$$;

create function public.is_committee_reviewer(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_role_assignments
    where platform_role_assignments.user_id = $1
      and role = 'committee_reviewer'
      and revoked_at is null
  );
$$;

create function public.has_school_role(
  target_school_id uuid,
  allowed_roles public.school_role[],
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
    from public.user_school_memberships
    where school_id = target_school_id
      and user_school_memberships.user_id = $3
      and role = any(allowed_roles)
      and status = 'active'
  );
$$;

create function public.is_school_member(
  target_school_id uuid,
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
    from public.user_school_memberships
    where school_id = target_school_id
      and user_school_memberships.user_id = $2
      and status = 'active'
  );
$$;

create function public.has_club_role(
  target_club_id uuid,
  allowed_roles public.club_role[],
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
    from public.club_memberships
    where club_id = target_club_id
      and club_memberships.user_id = $3
      and role = any(allowed_roles)
      and status = 'active'
  );
$$;

create function public.is_club_member(
  target_club_id uuid,
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
    from public.club_memberships
    where club_id = target_club_id
      and club_memberships.user_id = $2
      and status = 'active'
  );
$$;

create function public.can_manage_school(
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
      array['school_admin']::public.school_role[],
      $2
    );
$$;

create function public.can_review_school(
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
    or public.is_committee_reviewer($2)
    or public.has_school_role(
      $1,
      array['school_admin', 'school_advisor']::public.school_role[],
      $2
    );
$$;

create function public.can_manage_club(
  target_club_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_platform_admin($2)
    or exists (
      select 1
      from public.clubs
      where id = $1
        and public.can_manage_school(school_id, $2)
    )
    or public.has_club_role(
      $1,
      array[
        'club_admin',
        'president',
        'vice_president',
        'secretary',
        'treasurer',
        'officer',
        'advisor'
      ]::public.club_role[],
      $2
    );
$$;

create function public.can_view_club(
  target_club_id uuid,
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
    from public.clubs
    where id = $1
      and (
        (status = 'active' and visibility = 'public')
        or (
          status = 'active'
          and visibility = 'school'
          and public.is_school_member(school_id, $2)
        )
        or public.is_club_member(id, $2)
        or public.can_manage_school(school_id, $2)
        or public.is_platform_admin($2)
      )
  );
$$;

create function public.can_view_idea(
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

create function public.can_edit_idea(
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
    from public.club_ideas
    where id = $1
      and (
        (
          submitter_id = $2
          and status in ('draft', 'changes_requested')
        )
        or public.can_review_school(school_id, $2)
      )
  );
$$;

create function public.is_guardian_of(
  target_student_id uuid,
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
    from public.user_guardian_relationships
    where student_user_id = $1
      and guardian_user_id = $2
      and verified_at is not null
      and revoked_at is null
  );
$$;

create function public.can_view_profile(
  target_profile_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select $1 = $2
    or public.is_platform_admin($2)
    or public.is_guardian_of($1, $2)
    or exists (
      select 1
      from public.user_school_memberships target_membership
      join public.user_school_memberships viewer_membership
        on viewer_membership.school_id = target_membership.school_id
      where target_membership.user_id = $1
        and target_membership.status = 'active'
        and viewer_membership.user_id = $2
        and viewer_membership.status = 'active'
        and viewer_membership.role in ('school_admin', 'school_advisor')
    )
    or exists (
      select 1
      from public.club_memberships target_membership
      join public.club_memberships viewer_membership
        on viewer_membership.club_id = target_membership.club_id
      where target_membership.user_id = $1
        and target_membership.status = 'active'
        and viewer_membership.user_id = $2
        and viewer_membership.status = 'active'
    )
    or exists (
      select 1
      from public.club_ideas
      where submitter_id = $1
        and public.can_view_idea(id, $2)
    );
$$;

create function public.can_view_event(
  target_event_id uuid,
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
    from public.events event
    where event.id = $1
      and (
        (
          event.status = 'published'
          and event.visibility = 'public'
        )
        or (
          event.status = 'published'
          and event.visibility = 'school'
          and public.is_school_member(event.school_id, $2)
        )
        or public.is_club_member(event.club_id, $2)
        or public.can_manage_club(event.club_id, $2)
      )
  );
$$;

create function public.can_manage_campaign(
  target_campaign_id uuid,
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
    from public.email_campaigns campaign
    where campaign.id = $1
      and (
        public.can_manage_school(campaign.school_id, $2)
        or (
          campaign.club_id is not null
          and public.can_manage_club(campaign.club_id, $2)
        )
      )
  );
$$;

create function public.can_view_media_asset(
  target_asset_id uuid,
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
    from public.media_assets asset
    where asset.id = $1
      and (
        (
          asset.visibility = 'public'
          and asset.approved_for_public_at is not null
          and (
            not asset.consent_required
            or (
              exists (
                select 1
                from public.media_consents consent
                where consent.media_asset_id = asset.id
                  and consent.status = 'granted'
                  and (consent.expires_at is null or consent.expires_at > now())
              )
              and not exists (
                select 1
                from public.media_consents consent
                where consent.media_asset_id = asset.id
                  and (
                    consent.status <> 'granted'
                    or consent.revoked_at is not null
                    or consent.expires_at <= now()
                  )
              )
            )
          )
        )
        or asset.uploader_id = $2
        or (
          asset.club_id is not null
          and public.can_view_club(asset.club_id, $2)
        )
        or (
          asset.idea_id is not null
          and public.can_view_idea(asset.idea_id, $2)
        )
        or public.can_manage_school(asset.school_id, $2)
      )
  );
$$;

revoke all on function public.is_platform_admin(uuid) from public;
revoke all on function public.is_committee_reviewer(uuid) from public;
revoke all on function public.has_school_role(uuid, public.school_role[], uuid) from public;
revoke all on function public.is_school_member(uuid, uuid) from public;
revoke all on function public.has_club_role(uuid, public.club_role[], uuid) from public;
revoke all on function public.is_club_member(uuid, uuid) from public;
revoke all on function public.can_manage_school(uuid, uuid) from public;
revoke all on function public.can_review_school(uuid, uuid) from public;
revoke all on function public.can_manage_club(uuid, uuid) from public;
revoke all on function public.can_view_club(uuid, uuid) from public;
revoke all on function public.can_view_idea(uuid, uuid) from public;
revoke all on function public.can_edit_idea(uuid, uuid) from public;
revoke all on function public.is_guardian_of(uuid, uuid) from public;
revoke all on function public.can_view_profile(uuid, uuid) from public;
revoke all on function public.can_view_event(uuid, uuid) from public;
revoke all on function public.can_manage_campaign(uuid, uuid) from public;
revoke all on function public.can_view_media_asset(uuid, uuid) from public;

grant execute on function public.is_platform_admin(uuid) to authenticated;
grant execute on function public.is_committee_reviewer(uuid) to authenticated;
grant execute on function public.has_school_role(uuid, public.school_role[], uuid) to authenticated;
grant execute on function public.is_school_member(uuid, uuid) to authenticated;
grant execute on function public.has_club_role(uuid, public.club_role[], uuid) to authenticated;
grant execute on function public.is_club_member(uuid, uuid) to authenticated;
grant execute on function public.can_manage_school(uuid, uuid) to authenticated;
grant execute on function public.can_review_school(uuid, uuid) to authenticated;
grant execute on function public.can_manage_club(uuid, uuid) to authenticated;
grant execute on function public.can_view_club(uuid, uuid) to authenticated;
grant execute on function public.can_view_idea(uuid, uuid) to authenticated;
grant execute on function public.can_edit_idea(uuid, uuid) to authenticated;
grant execute on function public.is_guardian_of(uuid, uuid) to authenticated;
grant execute on function public.can_view_profile(uuid, uuid) to authenticated;
grant execute on function public.can_view_event(uuid, uuid) to anon, authenticated;
grant execute on function public.can_manage_campaign(uuid, uuid) to authenticated;
grant execute on function public.can_view_media_asset(uuid, uuid) to anon, authenticated;

create function public.protect_profile_governance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.id <> old.id then
    raise exception 'Profile identity is immutable' using errcode = '23514';
  end if;
  if new.age_band <> old.age_band and not public.is_platform_admin(auth.uid()) then
    raise exception 'Age band requires an administrative governance change'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_governance
  before update on public.profiles
  for each row execute function public.protect_profile_governance();

create function public.protect_assignment_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_table_name = 'platform_role_assignments' then
    if new.user_id <> old.user_id or new.role <> old.role then
      raise exception 'Platform assignment identity and role are immutable'
        using errcode = '23514';
    end if;
  elsif tg_table_name = 'user_school_memberships' then
    if new.user_id <> old.user_id
      or new.school_id <> old.school_id
      or new.role <> old.role then
      raise exception 'School membership identity and role are immutable'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

create trigger platform_roles_protect_identity
  before update on public.platform_role_assignments
  for each row execute function public.protect_assignment_identity();
create trigger school_memberships_protect_identity
  before update on public.user_school_memberships
  for each row execute function public.protect_assignment_identity();

create function public.protect_club_membership_authority()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_school_id uuid;
begin
  if new.club_id <> old.club_id
    or new.user_id <> old.user_id
    or new.school_year <> old.school_year then
    raise exception 'Club membership tenant, user, and year are immutable'
      using errcode = '23514';
  end if;

  if new.role <> old.role then
    select school_id into target_school_id
    from public.clubs where id = old.club_id;

    if new.user_id = auth.uid()
      and not public.can_manage_school(target_school_id, auth.uid()) then
      raise exception 'Users cannot change their own club role'
        using errcode = '42501';
    end if;

    if new.role in ('club_admin', 'president', 'advisor')
      and not public.can_manage_school(target_school_id, auth.uid()) then
      raise exception 'Top club roles require school administration'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger club_memberships_protect_authority
  before update on public.club_memberships
  for each row execute function public.protect_club_membership_authority();

create function public.protect_workflow_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_table_name = 'club_ideas' then
    if new.school_id <> old.school_id or new.submitter_id <> old.submitter_id then
      raise exception 'Idea school and submitter are immutable'
        using errcode = '23514';
    end if;
  elsif tg_table_name = 'club_idea_reviews' then
    if new.idea_id <> old.idea_id
      or new.reviewer_id <> old.reviewer_id
      or new.assigned_by is distinct from old.assigned_by
      or new.assigned_at <> old.assigned_at then
      raise exception 'Review assignment fields are immutable'
        using errcode = '23514';
    end if;
  elsif tg_table_name = 'clubs' then
    if new.school_id <> old.school_id
      or new.originating_idea_id is distinct from old.originating_idea_id
      or new.approved_by <> old.approved_by
      or new.approved_at <> old.approved_at then
      raise exception 'Club tenant and approval provenance are immutable'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

create trigger club_ideas_protect_identity
  before update on public.club_ideas
  for each row execute function public.protect_workflow_identity();
create trigger club_idea_reviews_protect_identity
  before update on public.club_idea_reviews
  for each row execute function public.protect_workflow_identity();
create trigger clubs_protect_identity
  before update on public.clubs
  for each row execute function public.protect_workflow_identity();

revoke all on function public.protect_profile_governance() from public;
revoke all on function public.protect_assignment_identity() from public;
revoke all on function public.protect_club_membership_authority() from public;
revoke all on function public.protect_workflow_identity() from public;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'schools',
    'profiles',
    'platform_role_assignments',
    'user_school_memberships',
    'user_guardian_relationships',
    'club_ideas',
    'club_idea_proposed_officers',
    'club_idea_links',
    'club_idea_reviews',
    'club_idea_status_history',
    'clubs',
    'club_memberships',
    'club_officer_terms',
    'club_charters',
    'club_charter_reviews',
    'club_renewals',
    'club_renewal_reviews',
    'club_activities',
    'attendance_sessions',
    'attendance_records',
    'events',
    'event_tasks',
    'event_rsvps',
    'event_logistics',
    'media_assets',
    'media_consents',
    'email_campaigns',
    'email_recipients',
    'email_events',
    'club_highlights',
    'newsletters',
    'newsletter_sections',
    'stem_courses',
    'stem_course_modules',
    'stem_resources',
    'course_subscriptions',
    'course_progress',
    'notifications',
    'audit_logs',
    'analytics_daily_club',
    'analytics_daily_school',
    'analytics_daily_platform'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'grant select, insert, update, delete on public.%I to authenticated',
      table_name
    );
    execute format('grant select on public.%I to anon', table_name);
  end loop;
end;
$$;

grant usage, select on all sequences in schema public to authenticated;

create policy schools_public_select on public.schools
  for select to anon, authenticated using (is_active);
create policy schools_member_select on public.schools
  for select to authenticated using (
    public.is_school_member(id) or public.is_platform_admin()
  );
create policy schools_admin_insert on public.schools
  for insert to authenticated with check (public.is_platform_admin());
create policy schools_admin_update on public.schools
  for update to authenticated using (public.can_manage_school(id))
  with check (public.can_manage_school(id));
create policy schools_admin_delete on public.schools
  for delete to authenticated using (public.is_platform_admin());

create policy profiles_authorized_select on public.profiles
  for select to authenticated using (public.can_view_profile(id));
create policy profiles_self_insert on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy profiles_self_update on public.profiles
  for update to authenticated using (
    id = auth.uid() or public.is_platform_admin()
  ) with check (
    id = auth.uid() or public.is_platform_admin()
  );
create policy profiles_no_delete on public.profiles
  for delete to authenticated using (false);

create policy platform_roles_self_or_admin_select on public.platform_role_assignments
  for select to authenticated using (
    user_id = auth.uid() or public.is_platform_admin()
  );
create policy platform_roles_admin_insert on public.platform_role_assignments
  for insert to authenticated with check (public.is_platform_admin());
create policy platform_roles_admin_update on public.platform_role_assignments
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy platform_roles_admin_delete on public.platform_role_assignments
  for delete to authenticated using (public.is_platform_admin());

create policy school_memberships_authorized_select on public.user_school_memberships
  for select to authenticated using (
    user_id = auth.uid() or public.can_manage_school(school_id)
  );
create policy school_memberships_admin_insert on public.user_school_memberships
  for insert to authenticated with check (public.can_manage_school(school_id));
create policy school_memberships_admin_update on public.user_school_memberships
  for update to authenticated using (public.can_manage_school(school_id))
  with check (public.can_manage_school(school_id));
create policy school_memberships_admin_delete on public.user_school_memberships
  for delete to authenticated using (public.is_platform_admin());

create policy guardian_relationships_authorized_select on public.user_guardian_relationships
  for select to authenticated using (
    student_user_id = auth.uid()
    or guardian_user_id = auth.uid()
    or public.is_platform_admin()
    or exists (
      select 1
      from public.user_school_memberships membership
      where membership.user_id = student_user_id
        and public.can_manage_school(membership.school_id)
    )
  );
create policy guardian_relationships_admin_insert on public.user_guardian_relationships
  for insert to authenticated with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.user_school_memberships membership
      where membership.user_id = student_user_id
        and public.can_manage_school(membership.school_id)
    )
  );
create policy guardian_relationships_admin_update on public.user_guardian_relationships
  for update to authenticated using (
    public.is_platform_admin()
    or exists (
      select 1
      from public.user_school_memberships membership
      where membership.user_id = student_user_id
        and public.can_manage_school(membership.school_id)
    )
  ) with check (
    public.is_platform_admin()
    or exists (
      select 1
      from public.user_school_memberships membership
      where membership.user_id = student_user_id
        and public.can_manage_school(membership.school_id)
    )
  );
create policy guardian_relationships_admin_delete on public.user_guardian_relationships
  for delete to authenticated using (public.is_platform_admin());

create policy club_ideas_authorized_select on public.club_ideas
  for select to authenticated using (public.can_view_idea(id));
create policy club_ideas_submitter_insert on public.club_ideas
  for insert to authenticated with check (
    submitter_id = auth.uid()
    and status = 'draft'
    and public.is_school_member(school_id)
  );
create policy club_ideas_authorized_update on public.club_ideas
  for update to authenticated using (public.can_edit_idea(id))
  with check (
    submitter_id = auth.uid()
    or public.can_review_school(school_id)
  );
create policy club_ideas_draft_delete on public.club_ideas
  for delete to authenticated using (
    (submitter_id = auth.uid() and status = 'draft')
    or public.is_platform_admin()
  );

create policy idea_officers_authorized_select on public.club_idea_proposed_officers
  for select to authenticated using (public.can_view_idea(idea_id));
create policy idea_officers_authorized_insert on public.club_idea_proposed_officers
  for insert to authenticated with check (public.can_edit_idea(idea_id));
create policy idea_officers_authorized_update on public.club_idea_proposed_officers
  for update to authenticated using (public.can_edit_idea(idea_id))
  with check (public.can_edit_idea(idea_id));
create policy idea_officers_authorized_delete on public.club_idea_proposed_officers
  for delete to authenticated using (public.can_edit_idea(idea_id));

create policy idea_links_authorized_select on public.club_idea_links
  for select to authenticated using (public.can_view_idea(idea_id));
create policy idea_links_authorized_insert on public.club_idea_links
  for insert to authenticated with check (public.can_edit_idea(idea_id));
create policy idea_links_authorized_update on public.club_idea_links
  for update to authenticated using (public.can_edit_idea(idea_id))
  with check (public.can_edit_idea(idea_id));
create policy idea_links_authorized_delete on public.club_idea_links
  for delete to authenticated using (public.can_edit_idea(idea_id));

create policy idea_reviews_reviewer_select on public.club_idea_reviews
  for select to authenticated using (
    reviewer_id = auth.uid()
    or exists (
      select 1 from public.club_ideas idea
      where idea.id = idea_id and public.can_manage_school(idea.school_id)
    )
    or public.is_platform_admin()
  );
create policy idea_reviews_assign_insert on public.club_idea_reviews
  for insert to authenticated with check (
    decision is null
    and (
      public.is_platform_admin()
      or exists (
        select 1 from public.club_ideas idea
        where idea.id = idea_id and public.can_review_school(idea.school_id)
      )
    )
  );
create policy idea_reviews_reviewer_update on public.club_idea_reviews
  for update to authenticated using (
    (reviewer_id = auth.uid() and reviewed_at is null)
    or public.is_platform_admin()
  ) with check (
    reviewer_id = auth.uid() or public.is_platform_admin()
  );
create policy idea_reviews_admin_delete on public.club_idea_reviews
  for delete to authenticated using (public.is_platform_admin());

create policy idea_history_authorized_select on public.club_idea_status_history
  for select to authenticated using (public.can_view_idea(idea_id));
create policy idea_history_no_insert on public.club_idea_status_history
  for insert to authenticated with check (false);
create policy idea_history_no_update on public.club_idea_status_history
  for update to authenticated using (false);
create policy idea_history_no_delete on public.club_idea_status_history
  for delete to authenticated using (false);

create policy clubs_public_select on public.clubs
  for select to anon using (false);
create policy clubs_authorized_select on public.clubs
  for select to authenticated using (
    public.is_club_member(id)
    or public.can_manage_school(school_id)
    or (
      status = 'active'
      and visibility = 'school'
      and public.is_school_member(school_id)
    )
  );
create policy clubs_reviewer_insert on public.clubs
  for insert to authenticated with check (
    approved_by = auth.uid()
    and (
      public.can_review_school(school_id)
      or public.is_committee_reviewer()
    )
  );
create policy clubs_manager_update on public.clubs
  for update to authenticated using (public.can_manage_club(id))
  with check (public.can_manage_school(school_id) or public.can_manage_club(id));
create policy clubs_admin_delete on public.clubs
  for delete to authenticated using (public.is_platform_admin());

create policy club_memberships_roster_select on public.club_memberships
  for select to authenticated using (
    user_id = auth.uid()
    or public.is_club_member(club_id)
    or public.can_manage_club(club_id)
  );
create policy club_memberships_manager_insert on public.club_memberships
  for insert to authenticated with check (public.can_manage_club(club_id));
create policy club_memberships_manager_update on public.club_memberships
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy club_memberships_admin_delete on public.club_memberships
  for delete to authenticated using (public.is_platform_admin());

create policy officer_terms_member_select on public.club_officer_terms
  for select to authenticated using (
    public.is_club_member(club_id) or public.can_manage_club(club_id)
  );
create policy officer_terms_manager_insert on public.club_officer_terms
  for insert to authenticated with check (public.can_manage_club(club_id));
create policy officer_terms_manager_update on public.club_officer_terms
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy officer_terms_admin_delete on public.club_officer_terms
  for delete to authenticated using (public.is_platform_admin());

create policy charters_member_select on public.club_charters
  for select to authenticated using (
    public.is_club_member(club_id)
    or public.can_manage_club(club_id)
    or exists (
      select 1 from public.clubs club
      where club.id = club_id and public.can_review_school(club.school_id)
    )
  );
create policy charters_manager_insert on public.club_charters
  for insert to authenticated with check (
    created_by = auth.uid() and public.can_manage_club(club_id)
  );
create policy charters_manager_update on public.club_charters
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy charters_admin_delete on public.club_charters
  for delete to authenticated using (public.is_platform_admin());

create policy charter_reviews_reviewer_select on public.club_charter_reviews
  for select to authenticated using (
    reviewer_id = auth.uid()
    or exists (
      select 1
      from public.club_charters charter
      join public.clubs club on club.id = charter.club_id
      where charter.id = charter_id
        and public.can_review_school(club.school_id)
    )
  );
create policy charter_reviews_reviewer_insert on public.club_charter_reviews
  for insert to authenticated with check (
    reviewer_id = auth.uid()
    and exists (
      select 1
      from public.club_charters charter
      join public.clubs club on club.id = charter.club_id
      where charter.id = charter_id
        and public.can_review_school(club.school_id)
    )
  );
create policy charter_reviews_no_update on public.club_charter_reviews
  for update to authenticated using (false);
create policy charter_reviews_admin_delete on public.club_charter_reviews
  for delete to authenticated using (public.is_platform_admin());

create policy renewals_member_select on public.club_renewals
  for select to authenticated using (
    public.is_club_member(club_id)
    or public.can_manage_club(club_id)
    or exists (
      select 1 from public.clubs club
      where club.id = club_id and public.can_review_school(club.school_id)
    )
  );
create policy renewals_manager_insert on public.club_renewals
  for insert to authenticated with check (
    submitted_by = auth.uid() and public.can_manage_club(club_id)
  );
create policy renewals_manager_update on public.club_renewals
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy renewals_admin_delete on public.club_renewals
  for delete to authenticated using (public.is_platform_admin());

create policy renewal_reviews_reviewer_select on public.club_renewal_reviews
  for select to authenticated using (
    reviewer_id = auth.uid()
    or exists (
      select 1
      from public.club_renewals renewal
      join public.clubs club on club.id = renewal.club_id
      where renewal.id = renewal_id
        and public.can_review_school(club.school_id)
    )
  );
create policy renewal_reviews_reviewer_insert on public.club_renewal_reviews
  for insert to authenticated with check (
    reviewer_id = auth.uid()
    and exists (
      select 1
      from public.club_renewals renewal
      join public.clubs club on club.id = renewal.club_id
      where renewal.id = renewal_id
        and public.can_review_school(club.school_id)
    )
  );
create policy renewal_reviews_no_update on public.club_renewal_reviews
  for update to authenticated using (false);
create policy renewal_reviews_admin_delete on public.club_renewal_reviews
  for delete to authenticated using (public.is_platform_admin());

create policy activities_member_select on public.club_activities
  for select to authenticated using (
    public.is_club_member(club_id) or public.can_manage_club(club_id)
  );
create policy activities_manager_insert on public.club_activities
  for insert to authenticated with check (
    created_by = auth.uid() and public.can_manage_club(club_id)
  );
create policy activities_manager_update on public.club_activities
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy activities_manager_delete on public.club_activities
  for delete to authenticated using (public.can_manage_club(club_id));

create policy events_public_select on public.events
  for select to anon using (false);
create policy events_authorized_select on public.events
  for select to authenticated using (
    public.is_club_member(club_id)
    or public.can_manage_club(club_id)
    or (
      status = 'published'
      and visibility = 'school'
      and public.is_school_member(school_id)
    )
  );
create policy events_manager_insert on public.events
  for insert to authenticated with check (
    organizer_id = auth.uid() and public.can_manage_club(club_id)
  );
create policy events_manager_update on public.events
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy events_manager_delete on public.events
  for delete to authenticated using (public.can_manage_club(club_id));

create policy event_tasks_member_select on public.event_tasks
  for select to authenticated using (
    assigned_to = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.is_club_member(event.club_id)
    )
  );
create policy event_tasks_manager_insert on public.event_tasks
  for insert to authenticated with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );
create policy event_tasks_assignee_update on public.event_tasks
  for update to authenticated using (
    assigned_to = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  ) with check (
    assigned_to = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );
create policy event_tasks_manager_delete on public.event_tasks
  for delete to authenticated using (
    exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );

create policy event_rsvps_own_or_manager_select on public.event_rsvps
  for select to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );
create policy event_rsvps_own_insert on public.event_rsvps
  for insert to authenticated with check (
    user_id = auth.uid() and public.can_view_event(event_id)
  );
create policy event_rsvps_own_update on public.event_rsvps
  for update to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  ) with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );
create policy event_rsvps_own_or_manager_delete on public.event_rsvps
  for delete to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );

create policy event_logistics_member_select on public.event_logistics
  for select to authenticated using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.is_club_member(event.club_id)
    )
  );
create policy event_logistics_manager_insert on public.event_logistics
  for insert to authenticated with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );
create policy event_logistics_owner_update on public.event_logistics
  for update to authenticated using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  ) with check (
    owner_id = auth.uid()
    or exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );
create policy event_logistics_manager_delete on public.event_logistics
  for delete to authenticated using (
    exists (
      select 1 from public.events event
      where event.id = event_id and public.can_manage_club(event.club_id)
    )
  );

create policy attendance_sessions_member_select on public.attendance_sessions
  for select to authenticated using (
    public.is_club_member(club_id) or public.can_manage_club(club_id)
  );
create policy attendance_sessions_manager_insert on public.attendance_sessions
  for insert to authenticated with check (
    created_by = auth.uid() and public.can_manage_club(club_id)
  );
create policy attendance_sessions_manager_update on public.attendance_sessions
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy attendance_sessions_manager_delete on public.attendance_sessions
  for delete to authenticated using (public.can_manage_club(club_id));

create policy attendance_records_private_select on public.attendance_records
  for select to authenticated using (
    exists (
      select 1
      from public.club_memberships membership
      where membership.id = membership_id
        and membership.user_id = auth.uid()
    )
    or exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  );
create policy attendance_records_manager_insert on public.attendance_records
  for insert to authenticated with check (
    recorded_by = auth.uid()
    and exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  );
create policy attendance_records_manager_update on public.attendance_records
  for update to authenticated using (
    exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  ) with check (
    exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  );
create policy attendance_records_manager_delete on public.attendance_records
  for delete to authenticated using (
    exists (
      select 1
      from public.attendance_sessions session
      where session.id = session_id
        and public.can_manage_club(session.club_id)
    )
  );

create policy media_assets_authorized_select on public.media_assets
  for select to authenticated using (
    uploader_id = auth.uid()
    or (club_id is not null and public.can_view_club(club_id))
    or (idea_id is not null and public.can_view_idea(idea_id))
    or public.can_manage_school(school_id)
  );
create policy media_assets_member_insert on public.media_assets
  for insert to authenticated with check (
    uploader_id = auth.uid()
    and visibility <> 'public'
    and (
      (club_id is not null and public.is_club_member(club_id))
      or (idea_id is not null and public.can_edit_idea(idea_id))
      or public.can_manage_school(school_id)
    )
  );
create policy media_assets_authorized_update on public.media_assets
  for update to authenticated using (
    (uploader_id = auth.uid() and visibility <> 'public')
    or (club_id is not null and public.can_manage_club(club_id))
    or public.can_manage_school(school_id)
  ) with check (
    (
      uploader_id = auth.uid()
      and visibility <> 'public'
      and approved_for_public_at is null
      and approved_for_public_by is null
    )
    or (club_id is not null and public.can_manage_club(club_id))
    or public.can_manage_school(school_id)
  );
create policy media_assets_manager_delete on public.media_assets
  for delete to authenticated using (
    uploader_id = auth.uid()
    or (club_id is not null and public.can_manage_club(club_id))
    or public.can_manage_school(school_id)
  );

create policy media_consents_authorized_select on public.media_consents
  for select to authenticated using (
    subject_user_id = auth.uid()
    or granted_by = auth.uid()
    or public.is_guardian_of(subject_user_id)
    or (club_id is not null and public.can_manage_club(club_id))
    or public.is_platform_admin()
  );
create policy media_consents_authorized_insert on public.media_consents
  for insert to authenticated with check (
    (
      granted_by = auth.uid()
      and (
        (
          subject_user_id = auth.uid()
          and not exists (
            select 1 from public.profiles
            where id = auth.uid() and age_band = 'under_13'
          )
        )
        or public.is_guardian_of(subject_user_id)
      )
    )
    or (club_id is not null and public.can_manage_club(club_id))
  );
create policy media_consents_authorized_update on public.media_consents
  for update to authenticated using (
    granted_by = auth.uid()
    or public.is_guardian_of(subject_user_id)
    or (club_id is not null and public.can_manage_club(club_id))
  ) with check (
    granted_by = auth.uid()
    or public.is_guardian_of(subject_user_id)
    or (club_id is not null and public.can_manage_club(club_id))
  );
create policy media_consents_admin_delete on public.media_consents
  for delete to authenticated using (public.is_platform_admin());

create policy email_campaigns_manager_select on public.email_campaigns
  for select to authenticated using (
    public.can_manage_school(school_id)
    or (club_id is not null and public.can_manage_club(club_id))
  );
create policy email_campaigns_manager_insert on public.email_campaigns
  for insert to authenticated with check (
    created_by = auth.uid()
    and (
      public.can_manage_school(school_id)
      or (club_id is not null and public.can_manage_club(club_id))
    )
  );
create policy email_campaigns_manager_update on public.email_campaigns
  for update to authenticated using (
    public.can_manage_school(school_id)
    or (club_id is not null and public.can_manage_club(club_id))
  ) with check (
    public.can_manage_school(school_id)
    or (club_id is not null and public.can_manage_club(club_id))
  );
create policy email_campaigns_admin_delete on public.email_campaigns
  for delete to authenticated using (public.is_platform_admin());

create policy email_recipients_own_or_manager_select on public.email_recipients
  for select to authenticated using (
    recipient_user_id = auth.uid()
    or public.can_manage_campaign(campaign_id)
  );
create policy email_recipients_manager_insert on public.email_recipients
  for insert to authenticated with check (public.can_manage_campaign(campaign_id));
create policy email_recipients_manager_update on public.email_recipients
  for update to authenticated using (public.can_manage_campaign(campaign_id))
  with check (public.can_manage_campaign(campaign_id));
create policy email_recipients_admin_delete on public.email_recipients
  for delete to authenticated using (public.is_platform_admin());

create policy email_events_own_or_manager_select on public.email_events
  for select to authenticated using (
    exists (
      select 1
      from public.email_recipients recipient
      where recipient.id = recipient_id
        and (
          recipient.recipient_user_id = auth.uid()
          or public.can_manage_campaign(recipient.campaign_id)
        )
    )
  );
create policy email_events_no_insert on public.email_events
  for insert to authenticated with check (false);
create policy email_events_no_update on public.email_events
  for update to authenticated using (false);
create policy email_events_no_delete on public.email_events
  for delete to authenticated using (false);

create policy highlights_public_select on public.club_highlights
  for select to anon using (false);
create policy highlights_authorized_select on public.club_highlights
  for select to authenticated using (
    public.is_club_member(club_id) or public.can_manage_club(club_id)
  );
create policy highlights_manager_insert on public.club_highlights
  for insert to authenticated with check (
    created_by = auth.uid() and public.can_manage_club(club_id)
  );
create policy highlights_manager_update on public.club_highlights
  for update to authenticated using (public.can_manage_club(club_id))
  with check (public.can_manage_club(club_id));
create policy highlights_manager_delete on public.club_highlights
  for delete to authenticated using (public.can_manage_club(club_id));

create policy newsletters_public_select on public.newsletters
  for select to anon using (false);
create policy newsletters_authorized_select on public.newsletters
  for select to authenticated using (
    public.can_manage_school(school_id)
    or (club_id is not null and public.is_club_member(club_id))
  );
create policy newsletters_manager_insert on public.newsletters
  for insert to authenticated with check (
    created_by = auth.uid()
    and (
      public.can_manage_school(school_id)
      or (club_id is not null and public.can_manage_club(club_id))
    )
  );
create policy newsletters_manager_update on public.newsletters
  for update to authenticated using (
    public.can_manage_school(school_id)
    or (club_id is not null and public.can_manage_club(club_id))
  ) with check (
    public.can_manage_school(school_id)
    or (club_id is not null and public.can_manage_club(club_id))
  );
create policy newsletters_manager_delete on public.newsletters
  for delete to authenticated using (
    public.can_manage_school(school_id)
    or (club_id is not null and public.can_manage_club(club_id))
  );

create policy newsletter_sections_public_select on public.newsletter_sections
  for select to anon using (false);
create policy newsletter_sections_authorized_select on public.newsletter_sections
  for select to authenticated using (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.is_club_member(newsletter.club_id)
          )
        )
    )
  );
create policy newsletter_sections_manager_insert on public.newsletter_sections
  for insert to authenticated with check (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  );
create policy newsletter_sections_manager_update on public.newsletter_sections
  for update to authenticated using (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  ) with check (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  );
create policy newsletter_sections_manager_delete on public.newsletter_sections
  for delete to authenticated using (
    exists (
      select 1 from public.newsletters newsletter
      where newsletter.id = newsletter_id
        and (
          public.can_manage_school(newsletter.school_id)
          or (
            newsletter.club_id is not null
            and public.can_manage_club(newsletter.club_id)
          )
        )
    )
  );

create policy courses_public_select on public.stem_courses
  for select to anon using (false);
create policy courses_admin_select on public.stem_courses
  for select to authenticated using (public.is_platform_admin());
create policy courses_admin_insert on public.stem_courses
  for insert to authenticated with check (
    created_by = auth.uid() and public.is_platform_admin()
  );
create policy courses_admin_update on public.stem_courses
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy courses_admin_delete on public.stem_courses
  for delete to authenticated using (public.is_platform_admin());

create policy modules_public_select on public.stem_course_modules
  for select to anon using (false);
create policy modules_admin_select on public.stem_course_modules
  for select to authenticated using (public.is_platform_admin());
create policy modules_admin_insert on public.stem_course_modules
  for insert to authenticated with check (public.is_platform_admin());
create policy modules_admin_update on public.stem_course_modules
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy modules_admin_delete on public.stem_course_modules
  for delete to authenticated using (public.is_platform_admin());

create policy resources_public_select on public.stem_resources
  for select to anon using (false);
create policy resources_admin_select on public.stem_resources
  for select to authenticated using (public.is_platform_admin());
create policy resources_admin_insert on public.stem_resources
  for insert to authenticated with check (public.is_platform_admin());
create policy resources_admin_update on public.stem_resources
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy resources_admin_delete on public.stem_resources
  for delete to authenticated using (public.is_platform_admin());

create policy subscriptions_own_select on public.course_subscriptions
  for select to authenticated using (
    user_id = auth.uid() or public.is_platform_admin()
  );
create policy subscriptions_own_insert on public.course_subscriptions
  for insert to authenticated with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.stem_courses
      where id = course_id and is_published and is_free
    )
  );
create policy subscriptions_own_update on public.course_subscriptions
  for update to authenticated using (
    user_id = auth.uid() or public.is_platform_admin()
  ) with check (
    user_id = auth.uid() or public.is_platform_admin()
  );
create policy subscriptions_own_delete on public.course_subscriptions
  for delete to authenticated using (
    user_id = auth.uid() or public.is_platform_admin()
  );

create policy progress_own_select on public.course_progress
  for select to authenticated using (
    exists (
      select 1 from public.course_subscriptions subscription
      where subscription.id = subscription_id
        and (
          subscription.user_id = auth.uid()
          or public.is_platform_admin()
        )
    )
  );
create policy progress_own_insert on public.course_progress
  for insert to authenticated with check (
    exists (
      select 1 from public.course_subscriptions subscription
      where subscription.id = subscription_id
        and subscription.user_id = auth.uid()
    )
  );
create policy progress_own_update on public.course_progress
  for update to authenticated using (
    exists (
      select 1 from public.course_subscriptions subscription
      where subscription.id = subscription_id
        and subscription.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.course_subscriptions subscription
      where subscription.id = subscription_id
        and subscription.user_id = auth.uid()
    )
  );
create policy progress_own_delete on public.course_progress
  for delete to authenticated using (
    exists (
      select 1 from public.course_subscriptions subscription
      where subscription.id = subscription_id
        and subscription.user_id = auth.uid()
    )
  );

create policy notifications_own_select on public.notifications
  for select to authenticated using (
    user_id = auth.uid() or public.is_platform_admin()
  );
create policy notifications_admin_insert on public.notifications
  for insert to authenticated with check (public.is_platform_admin());
create policy notifications_own_update on public.notifications
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy notifications_admin_delete on public.notifications
  for delete to authenticated using (public.is_platform_admin());

create policy audit_logs_authorized_select on public.audit_logs
  for select to authenticated using (
    public.is_platform_admin()
    or (school_id is not null and public.can_manage_school(school_id))
    or (club_id is not null and public.can_manage_club(club_id))
  );
create policy audit_logs_no_insert on public.audit_logs
  for insert to authenticated with check (false);
create policy audit_logs_no_update on public.audit_logs
  for update to authenticated using (false);
create policy audit_logs_no_delete on public.audit_logs
  for delete to authenticated using (false);

create policy club_analytics_authorized_select on public.analytics_daily_club
  for select to authenticated using (
    public.can_manage_club(club_id)
    or exists (
      select 1 from public.clubs club
      where club.id = club_id and public.can_manage_school(club.school_id)
    )
  );
create policy club_analytics_admin_insert on public.analytics_daily_club
  for insert to authenticated with check (public.is_platform_admin());
create policy club_analytics_admin_update on public.analytics_daily_club
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy club_analytics_admin_delete on public.analytics_daily_club
  for delete to authenticated using (public.is_platform_admin());

create policy school_analytics_authorized_select on public.analytics_daily_school
  for select to authenticated using (public.can_manage_school(school_id));
create policy school_analytics_admin_insert on public.analytics_daily_school
  for insert to authenticated with check (public.is_platform_admin());
create policy school_analytics_admin_update on public.analytics_daily_school
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy school_analytics_admin_delete on public.analytics_daily_school
  for delete to authenticated using (public.is_platform_admin());

create policy platform_analytics_admin_select on public.analytics_daily_platform
  for select to authenticated using (public.is_platform_admin());
create policy platform_analytics_admin_insert on public.analytics_daily_platform
  for insert to authenticated with check (public.is_platform_admin());
create policy platform_analytics_admin_update on public.analytics_daily_platform
  for update to authenticated using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy platform_analytics_admin_delete on public.analytics_daily_platform
  for delete to authenticated using (public.is_platform_admin());

create view public.published_clubs
with (security_barrier = true)
as
select
  club.id,
  club.school_id,
  club.name,
  club.slug,
  club.description,
  club.mission,
  club.category,
  club.logo_asset_id,
  club.founded_on,
  club.grade_min,
  club.grade_max
from public.clubs club
where club.status = 'active'
  and club.visibility = 'public';

create view public.published_events
with (security_barrier = true)
as
select
  event.id,
  event.school_id,
  event.club_id,
  event.event_type,
  event.title,
  event.description,
  event.starts_at,
  event.ends_at,
  event.timezone,
  event.format,
  event.location_name,
  event.online_url,
  event.capacity,
  event.rsvp_deadline,
  event.waitlist_enabled
from public.events event
where event.status = 'published'
  and event.visibility = 'public';

create view public.published_media_assets
with (security_barrier = true)
as
select
  asset.id,
  asset.club_id,
  asset.media_type,
  asset.mime_type,
  asset.size_bytes,
  asset.title,
  asset.description,
  asset.created_at
from public.media_assets asset
where asset.visibility = 'public'
  and asset.approved_for_public_at is not null
  and (
    not asset.consent_required
    or (
      exists (
        select 1
        from public.media_consents consent
        where consent.media_asset_id = asset.id
          and consent.status = 'granted'
          and (consent.expires_at is null or consent.expires_at > now())
      )
      and not exists (
        select 1
        from public.media_consents consent
        where consent.media_asset_id = asset.id
          and (
            consent.status <> 'granted'
            or consent.revoked_at is not null
            or consent.expires_at <= now()
          )
      )
    )
  );

create view public.published_club_highlights
with (security_barrier = true)
as
select
  highlight.id,
  highlight.club_id,
  highlight.title,
  highlight.summary,
  highlight.body,
  highlight.cover_asset_id,
  highlight.published_at
from public.club_highlights highlight
where highlight.status = 'published'
  and highlight.visibility = 'public'
  and highlight.published_at is not null
  and highlight.published_at <= now();

create view public.published_newsletters
with (security_barrier = true)
as
select
  newsletter.id,
  newsletter.school_id,
  newsletter.club_id,
  newsletter.title,
  newsletter.issue_label,
  newsletter.published_at
from public.newsletters newsletter
where newsletter.status = 'published'
  and newsletter.visibility = 'public'
  and newsletter.published_at is not null
  and newsletter.published_at <= now();

create view public.published_newsletter_sections
with (security_barrier = true)
as
select
  section.id,
  section.newsletter_id,
  section.position,
  section.heading,
  section.body,
  section.media_asset_id
from public.newsletter_sections section
join public.newsletters newsletter on newsletter.id = section.newsletter_id
where newsletter.status = 'published'
  and newsletter.visibility = 'public'
  and newsletter.published_at is not null
  and newsletter.published_at <= now();

create view public.published_stem_courses
with (security_barrier = true)
as
select
  course.id,
  course.slug,
  course.title,
  course.description,
  course.discipline,
  course.grade_bands,
  course.difficulty,
  course.thumbnail_asset_id,
  course.provider_name,
  course.source_url,
  course.license_name,
  course.license_url,
  course.published_at
from public.stem_courses course
where course.is_free
  and course.is_published
  and course.published_at is not null
  and course.published_at <= now();

create view public.published_stem_course_modules
with (security_barrier = true)
as
select
  module.id,
  module.course_id,
  module.position,
  module.title,
  module.description,
  module.estimated_minutes
from public.stem_course_modules module
join public.stem_courses course on course.id = module.course_id
where module.is_published
  and course.is_free
  and course.is_published
  and course.published_at <= now();

create view public.published_stem_resources
with (security_barrier = true)
as
select
  resource.id,
  resource.module_id,
  resource.position,
  resource.resource_type,
  resource.title,
  resource.description,
  resource.external_url,
  resource.media_asset_id,
  resource.estimated_minutes
from public.stem_resources resource
join public.stem_course_modules module on module.id = resource.module_id
join public.stem_courses course on course.id = module.course_id
where resource.is_published
  and module.is_published
  and course.is_free
  and course.is_published
  and course.published_at <= now();

create view public.club_idea_applicant_feedback
with (security_barrier = true)
as
select
  review.id,
  review.idea_id,
  review.decision,
  review.applicant_feedback,
  review.assigned_at,
  review.reviewed_at
from public.club_idea_reviews review
join public.club_ideas idea on idea.id = review.idea_id
where idea.submitter_id = auth.uid()
  or public.can_review_school(idea.school_id);

create view public.club_charter_applicant_feedback
with (security_barrier = true)
as
select
  review.id,
  review.charter_id,
  review.decision,
  review.applicant_feedback,
  review.reviewed_at
from public.club_charter_reviews review
join public.club_charters charter on charter.id = review.charter_id
join public.clubs club on club.id = charter.club_id
where public.is_club_member(club.id)
  or public.can_review_school(club.school_id);

create view public.club_renewal_applicant_feedback
with (security_barrier = true)
as
select
  review.id,
  review.renewal_id,
  review.decision,
  review.applicant_feedback,
  review.reviewed_at
from public.club_renewal_reviews review
join public.club_renewals renewal on renewal.id = review.renewal_id
join public.clubs club on club.id = renewal.club_id
where public.is_club_member(club.id)
  or public.can_review_school(club.school_id);

revoke all on public.club_idea_applicant_feedback from public;
revoke all on public.club_charter_applicant_feedback from public;
revoke all on public.club_renewal_applicant_feedback from public;
grant select on public.club_idea_applicant_feedback to authenticated;
grant select on public.club_charter_applicant_feedback to authenticated;
grant select on public.club_renewal_applicant_feedback to authenticated;

revoke all on public.published_clubs from public;
revoke all on public.published_events from public;
revoke all on public.published_media_assets from public;
revoke all on public.published_club_highlights from public;
revoke all on public.published_newsletters from public;
revoke all on public.published_newsletter_sections from public;
revoke all on public.published_stem_courses from public;
revoke all on public.published_stem_course_modules from public;
revoke all on public.published_stem_resources from public;
grant select on public.published_clubs to anon, authenticated;
grant select on public.published_events to anon, authenticated;
grant select on public.published_media_assets to anon, authenticated;
grant select on public.published_club_highlights to anon, authenticated;
grant select on public.published_newsletters to anon, authenticated;
grant select on public.published_newsletter_sections to anon, authenticated;
grant select on public.published_stem_courses to anon, authenticated;
grant select on public.published_stem_course_modules to anon, authenticated;
grant select on public.published_stem_resources to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('club-branding', 'club-branding', false, 5242880),
  ('club-media', 'club-media', false, 524288000),
  ('club-documents', 'club-documents', false, 52428800),
  ('course-assets', 'course-assets', false, 524288000)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

create policy storage_authorized_read on storage.objects
  for select to anon, authenticated using (
    bucket_id in ('club-branding', 'club-media', 'club-documents', 'course-assets')
    and exists (
      select 1
      from public.media_assets asset
      where asset.storage_bucket = bucket_id
        and asset.storage_path = name
        and public.can_view_media_asset(asset.id)
    )
  );

create policy storage_user_upload on storage.objects
  for insert to authenticated with check (
    bucket_id in ('club-branding', 'club-media', 'club-documents', 'course-assets')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy storage_owner_update on storage.objects
  for update to authenticated using (
    owner_id = auth.uid()::text
    or exists (
      select 1
      from public.media_assets asset
      where asset.storage_bucket = bucket_id
        and asset.storage_path = name
        and (
          (asset.club_id is not null and public.can_manage_club(asset.club_id))
          or public.can_manage_school(asset.school_id)
        )
    )
  ) with check (
    bucket_id in ('club-branding', 'club-media', 'club-documents', 'course-assets')
  );

create policy storage_owner_delete on storage.objects
  for delete to authenticated using (
    owner_id = auth.uid()::text
    or exists (
      select 1
      from public.media_assets asset
      where asset.storage_bucket = bucket_id
        and asset.storage_path = name
        and (
          (asset.club_id is not null and public.can_manage_club(asset.club_id))
          or public.can_manage_school(asset.school_id)
        )
    )
  );

commit;
