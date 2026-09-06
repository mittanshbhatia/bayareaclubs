-- Cast command palette match_score to integer (row_number arithmetic yields bigint).
create or replace function public.search_command_palette(
  p_query text default '',
  p_limit integer default 24
)
returns table (
  result_id text,
  result_group text,
  label text,
  description text,
  href text,
  icon text,
  rank integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  q text := lower(trim(coalesce(p_query, '')));
  lim integer := greatest(1, least(coalesce(p_limit, 24), 40));
  is_admin boolean;
  is_committee boolean;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  is_admin := public.is_platform_admin(actor);
  is_committee := public.is_committee_reviewer(actor);

  return query
  with managed_clubs as (
    select club.id, club.name, club.slug, club.category, club.status
    from public.clubs club
    where public.can_manage_club(club.id, actor)
      and club.status = 'active'
  ),
  visible_clubs as (
    select club.id, club.name, club.slug, club.category, club.status
    from public.clubs club
    where public.can_view_club(club.id, actor)
  ),
  action_catalog as (
    select *
    from (
      values
        ('create-event', 'Create event', 'Open the event builder', '/events/new', 'calendar'),
        ('record-attendance', 'Record attendance', 'Take or review attendance', '/attendance', 'clipboard'),
        ('invite-member', 'Invite member', 'Invite someone to this club', '/members', 'user-plus'),
        ('create-activity', 'Create activity', 'Log a club activity', '/activities', 'sparkles'),
        ('open-charter', 'Open charter', 'View or update the charter', '/charter', 'file-text'),
        ('create-newsletter', 'Create newsletter', 'Open Newsletter Studio', '/newsletter/new', 'mail'),
        ('browse-resources', 'Browse STEM resources', 'Club learning resources', '/resources', 'graduation-cap')
    ) as action(key, label, description, path, icon)
  ),
  action_rows as (
    select
      'action:' || action.key || ':' || club.id::text as result_id,
      'Actions'::text as result_group,
      action.label || ' · ' || club.name as label,
      action.description,
      '/clubs/' || club.slug || action.path as href,
      action.icon,
      (
        case
          when q = '' then 70 - club.club_ord
          when lower(action.label) like '%' || q || '%' then 100
          when lower(club.name) like '%' || q || '%' then 80
          else 0
        end
      )::integer as match_score
    from (
      select
        managed.id,
        managed.name,
        managed.slug,
        row_number() over (order by managed.name) as club_ord
      from managed_clubs managed
    ) club
    cross join action_catalog action
    where club.club_ord <= case when q = '' then 2 else 40 end
      and (
        q = ''
        or lower(action.label) like '%' || q || '%'
        or lower(action.key) like '%' || replace(q, ' ', '-') || '%'
        or lower(club.name) like '%' || q || '%'
        or lower(club.slug) like '%' || q || '%'
      )
  ),
  global_actions as (
    select
      'action:browse-stem-global'::text as result_id,
      'Actions'::text as result_group,
      'Browse STEM resources'::text as label,
      'Open the free STEM catalog'::text as description,
      '/resources'::text as href,
      'graduation-cap'::text as icon,
      70::integer as match_score
    where q = ''
       or q like '%stem%'
       or q like '%resource%'
       or q like '%course%'
       or q like '%browse%'
  ),
  club_rows as (
    select
      'club:' || club.id::text as result_id,
      'Clubs'::text as result_group,
      club.name as label,
      coalesce(club.category, 'Club') || ' · /' || club.slug as description,
      '/clubs/' || club.slug as href,
      'shield'::text as icon,
      (
        case
          when q <> '' and lower(club.name) like q || '%' then 95
          when q <> '' and lower(club.name) like '%' || q || '%' then 85
          when q = '' then 60
          else 0
        end
      )::integer as match_score
    from visible_clubs club
    where
      q = ''
      or lower(club.name) like '%' || q || '%'
      or lower(club.slug) like '%' || q || '%'
      or lower(coalesce(club.category, '')) like '%' || q || '%'
  ),
  member_rows as (
    select
      'member:' || membership.club_id::text || ':' || membership.user_id::text as result_id,
      'Members'::text as result_group,
      profile.display_name as label,
      initcap(replace(membership.role::text, '_', ' ')) || ' · ' || club.name as description,
      '/clubs/' || club.slug || '/members' as href,
      'user'::text as icon,
      (
        case
          when q <> '' and lower(profile.display_name) like q || '%' then 90
          when q <> '' and lower(profile.display_name) like '%' || q || '%' then 75
          when q = '' then 40
          else 0
        end
      )::integer as match_score
    from public.club_memberships membership
    join public.profiles profile on profile.id = membership.user_id
    join public.clubs club on club.id = membership.club_id
    where membership.status = 'active'
      and (
        public.is_club_member(membership.club_id, actor)
        or public.can_manage_club(membership.club_id, actor)
      )
      and (
        q = ''
        or lower(profile.display_name) like '%' || q || '%'
        or lower(coalesce(profile.first_name, '')) like '%' || q || '%'
      )
  ),
  event_rows as (
    select
      'event:' || event.id::text as result_id,
      'Events'::text as result_group,
      event.title as label,
      to_char(timezone('UTC', event.starts_at), 'Mon DD') || ' · ' || club.name as description,
      '/clubs/' || club.slug || '/events/' || event.id::text as href,
      'calendar'::text as icon,
      (
        case
          when q <> '' and lower(event.title) like '%' || q || '%' then 88
          when q = '' then 55
          else 0
        end
      )::integer as match_score
    from public.events event
    join public.clubs club on club.id = event.club_id
    where public.can_view_club(event.club_id, actor)
      and (
        event.status in ('published', 'pending_approval')
        or (event.status = 'draft' and public.can_manage_club(event.club_id, actor))
      )
      and (
        q = ''
        or lower(event.title) like '%' || q || '%'
        or lower(club.name) like '%' || q || '%'
      )
  ),
  resource_rows as (
    select
      'resource:' || course.id::text as result_id,
      'Resources'::text as result_group,
      course.title as label,
      course.provider_name || ' · ' || course.discipline::text as description,
      '/resources/' || course.slug as href,
      'book-open'::text as icon,
      (
        case
          when q <> '' and lower(course.title) like q || '%' then 88
          when q <> '' and lower(course.title) like '%' || q || '%' then 70
          when q = '' then 40
          else 0
        end
      )::integer as match_score
    from public.published_stem_courses course
    where
      q = ''
      or lower(course.title) like '%' || q || '%'
      or lower(coalesce(course.provider_name, '')) like '%' || q || '%'
      or lower(course.discipline::text) like '%' || q || '%'
  ),
  admin_rows as (
    select *
    from (
      values
        (
          'admin:overview',
          'Admin',
          'Administration overview',
          'Platform administration home',
          '/admin',
          'layout-dashboard',
          65
        ),
        (
          'admin:ideas',
          'Admin',
          'Idea review queue',
          'Review submitted club ideas',
          '/admin/ideas',
          'inbox',
          65
        ),
        (
          'admin:users',
          'Admin',
          'Users & roles',
          'Manage platform role assignments',
          '/admin/users',
          'shield',
          65
        ),
        (
          'admin:audit',
          'Admin',
          'Audit log',
          'Review security-sensitive actions',
          '/admin/audit',
          'scroll-text',
          65
        )
    ) as admin(result_id, result_group, label, description, href, icon, match_score)
    where (is_admin or is_committee)
      and (
        q = ''
        or lower(admin.label) like '%' || q || '%'
        or lower(admin.result_id) like '%' || q || '%'
      )
  ),
  school_rows as (
    select
      'school:' || school.id::text as result_id,
      'Schools'::text as result_group,
      school.name as label,
      school.city || ' · /' || school.slug as description,
      '/admin/schools' as href,
      'building-2'::text as icon,
      (
        case
          when q <> '' and lower(school.name) like q || '%' then 92
          when q <> '' and lower(school.name) like '%' || q || '%' then 84
          when q = '' then 20
          else 0
        end
      )::integer as match_score
    from public.schools school
    where is_admin
      and (
        q = ''
        or lower(school.name) like '%' || q || '%'
        or lower(school.city) like '%' || q || '%'
        or lower(school.slug) like '%' || q || '%'
      )
  ),
  combined as (
    select * from action_rows where action_rows.match_score > 0
    union all
    select * from global_actions
    union all
    select * from club_rows where club_rows.match_score > 0
    union all
    select * from member_rows where member_rows.match_score > 0
    union all
    select * from event_rows where event_rows.match_score > 0
    union all
    select * from resource_rows where resource_rows.match_score > 0
    union all
    select * from admin_rows
    union all
    select * from school_rows where school_rows.match_score > 0
  )
  select
    combined.result_id,
    combined.result_group,
    combined.label,
    combined.description,
    combined.href,
    combined.icon,
    combined.match_score
  from combined
  order by combined.match_score desc, combined.result_group, combined.label
  limit lim;
end;
$$;
