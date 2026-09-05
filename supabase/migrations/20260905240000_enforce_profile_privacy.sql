begin;

create or replace function public.can_view_profile(
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
      from public.club_ideas
      where submitter_id = $1
        and public.can_view_idea(id, $2)
    );
$$;

create view public.club_member_directory
with (security_barrier = true)
as
select
  membership.club_id,
  profile.id as user_id,
  profile.display_name,
  case
    when profile.show_avatar_to_club_members then profile.avatar_asset_id
    else null
  end as avatar_asset_id,
  case
    when profile.show_school_to_club_members then profile.primary_school_id
    else null
  end as school_id
from public.club_memberships membership
join public.profiles profile on profile.id = membership.user_id
where membership.status = 'active'
  and exists (
    select 1
    from public.club_memberships viewer_membership
    where viewer_membership.club_id = membership.club_id
      and viewer_membership.user_id = auth.uid()
      and viewer_membership.status = 'active'
  );

revoke all on public.club_member_directory from public, anon;
grant select on public.club_member_directory to authenticated;

commit;
