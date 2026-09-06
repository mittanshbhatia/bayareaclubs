-- Admin console: school email domain + guarded platform role assignment.

alter table public.schools
  add column if not exists email_domain text
    check (
      email_domain is null
      or email_domain ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$'
    );

comment on column public.schools.email_domain is
  'Optional institutional email domain (e.g. school.edu). Never store student home locations.';

create or replace function public.count_active_platform_admins()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.platform_role_assignments
  where role = 'platform_admin'
    and revoked_at is null;
$$;

create or replace function public.assign_platform_role(
  target_user_id uuid,
  target_role public.platform_role
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  assignment_id uuid;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if not public.is_platform_admin(actor) then
    raise exception 'Platform administrator role required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where id = target_user_id) then
    raise exception 'User profile not found' using errcode = 'P0002';
  end if;

  -- Return existing active assignment.
  select id into assignment_id
  from public.platform_role_assignments
  where user_id = target_user_id
    and role = target_role
    and revoked_at is null
  limit 1;

  if assignment_id is not null then
    return assignment_id;
  end if;

  -- Reactivate the most recent revoked row if present.
  update public.platform_role_assignments
  set revoked_at = null,
      assigned_by = actor,
      assigned_at = statement_timestamp()
  where id = (
    select id
    from public.platform_role_assignments
    where user_id = target_user_id
      and role = target_role
      and revoked_at is not null
    order by assigned_at desc
    limit 1
  )
  returning id into assignment_id;

  if assignment_id is null then
    insert into public.platform_role_assignments (user_id, role, assigned_by)
    values (target_user_id, target_role, actor)
    returning id into assignment_id;
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    actor,
    'platform_role.assign',
    'platform_role_assignments',
    assignment_id,
    jsonb_build_object('user_id', target_user_id, 'role', target_role)
  );

  return assignment_id;
end;
$$;

create or replace function public.revoke_platform_role(
  target_assignment_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  target record;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if not public.is_platform_admin(actor) then
    raise exception 'Platform administrator role required' using errcode = '42501';
  end if;

  select * into target
  from public.platform_role_assignments
  where id = target_assignment_id
    and revoked_at is null;

  if target.id is null then
    raise exception 'Active assignment not found' using errcode = 'P0002';
  end if;

  if target.role = 'platform_admin'
     and public.count_active_platform_admins() <= 1 then
    raise exception 'Cannot remove the final platform administrator'
      using errcode = 'P0001';
  end if;

  update public.platform_role_assignments
  set revoked_at = statement_timestamp()
  where id = target_assignment_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    actor,
    'platform_role.revoke',
    'platform_role_assignments',
    target_assignment_id,
    jsonb_build_object('user_id', target.user_id, 'role', target.role)
  );

  return target_assignment_id;
end;
$$;

revoke all on function public.count_active_platform_admins() from public;
revoke all on function public.assign_platform_role(uuid, public.platform_role) from public;
revoke all on function public.revoke_platform_role(uuid) from public;
grant execute on function public.count_active_platform_admins() to authenticated;
grant execute on function public.assign_platform_role(uuid, public.platform_role) to authenticated;
grant execute on function public.revoke_platform_role(uuid) to authenticated;
