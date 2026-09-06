-- Fix parameter/column name collisions introduced in 20260906110000 that made
-- has_club_role / has_school_role match ANY member with a role (cross-tenant).
-- Also disambiguate user_allows_email_category variable vs column.

drop function if exists public.user_allows_email_category(uuid, public.email_preference_category);

create function public.user_allows_email_category(
  target_user_id uuid,
  target_category public.email_preference_category
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is not null
     and target_user_id is distinct from actor
     and not exists (
       select 1
       from public.platform_role_assignments assignment
       where assignment.user_id = actor
         and assignment.role = 'platform_admin'
         and assignment.revoked_at is null
     ) then
    if not exists (
      select 1
      from public.club_memberships membership
      where membership.user_id = target_user_id
        and membership.status = 'active'
        and public.can_manage_club(membership.club_id, actor)
    ) then
      raise exception 'Not authorized to inspect email preferences'
        using errcode = '42501';
    end if;
  end if;

  return case
    when target_category = 'transactional' then true
    when not exists (
      select 1 from public.user_email_preferences pref
      where pref.user_id = target_user_id and pref.category = target_category
    ) then true
    else exists (
      select 1 from public.user_email_preferences pref
      where pref.user_id = target_user_id
        and pref.category = target_category
        and pref.opted_in
    )
  end;
end;
$$;

revoke all on function public.user_allows_email_category(uuid, public.email_preference_category) from public;
grant execute on function public.user_allows_email_category(uuid, public.email_preference_category) to authenticated;
grant execute on function public.user_allows_email_category(uuid, public.email_preference_category) to service_role;

create or replace function public.may_inspect_user(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is null
    or $1 is not distinct from auth.uid()
    or exists (
      select 1
      from public.platform_role_assignments assignment
      where assignment.user_id = auth.uid()
        and assignment.role = 'platform_admin'
        and assignment.revoked_at is null
    );
$$;

create or replace function public.is_platform_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($1)
    and exists (
      select 1
      from public.platform_role_assignments assignment
      where assignment.user_id = $1
        and assignment.role = 'platform_admin'
        and assignment.revoked_at is null
    );
$$;

create or replace function public.is_committee_reviewer(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($1)
    and exists (
      select 1
      from public.platform_role_assignments assignment
      where assignment.user_id = $1
        and assignment.role = 'committee_reviewer'
        and assignment.revoked_at is null
    );
$$;

create or replace function public.is_club_member(
  target_club_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($2)
    and exists (
      select 1
      from public.club_memberships membership
      where membership.club_id = $1
        and membership.user_id = $2
        and membership.status = 'active'
    );
$$;

create or replace function public.has_club_role(
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
  select public.may_inspect_user($3)
    and exists (
      select 1
      from public.club_memberships membership
      where membership.club_id = $1
        and membership.user_id = $3
        and membership.role = any ($2)
        and membership.status = 'active'
    );
$$;

create or replace function public.is_school_member(
  target_school_id uuid,
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.may_inspect_user($2)
    and exists (
      select 1
      from public.user_school_memberships membership
      where membership.school_id = $1
        and membership.user_id = $2
        and membership.status = 'active'
    );
$$;

create or replace function public.has_school_role(
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
  select public.may_inspect_user($3)
    and exists (
      select 1
      from public.user_school_memberships membership
      where membership.school_id = $1
        and membership.user_id = $3
        and membership.role = any ($2)
        and membership.status = 'active'
    );
$$;
