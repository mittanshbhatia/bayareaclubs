begin;

create or replace function public.complete_oauth_profile(
  first_name text,
  last_initial text,
  selected_age_band public.age_band,
  school_id uuid default null,
  selected_grade_band public.grade_band default null
)
returns public.account_onboarding_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_first_name text := nullif(trim(first_name), '');
  normalized_last_initial text := upper(left(nullif(trim(last_initial), ''), 1));
  generated_display_name text;
begin
  if actor_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if exists (select 1 from public.profiles where id = actor_id) then
    raise exception 'Profile already exists' using errcode = '23514';
  end if;
  if selected_age_band = 'under_13' then
    raise exception 'Under-13 accounts require managed onboarding'
      using errcode = '42501';
  end if;
  if normalized_first_name is null or normalized_last_initial is null then
    raise exception 'First name and last initial are required'
      using errcode = '23514';
  end if;
  if selected_age_band = 'age_13_17'
    and (school_id is null or selected_grade_band is null) then
    raise exception 'Student onboarding requires school and grade band'
      using errcode = '23514';
  end if;

  generated_display_name := normalized_first_name
    || ' ' || normalized_last_initial || '.';

  insert into public.profiles (
    id,
    display_name,
    age_band,
    first_name,
    last_initial,
    primary_school_id,
    grade_band,
    onboarding_completed_at
  )
  values (
    actor_id,
    generated_display_name,
    selected_age_band,
    normalized_first_name,
    normalized_last_initial,
    school_id,
    selected_grade_band,
    statement_timestamp()
  );

  insert into public.account_onboarding (
    user_id,
    status,
    activation_method,
    requested_school_id,
    grade_band,
    activated_at
  )
  values (
    actor_id,
    'active',
    'self_service',
    school_id,
    selected_grade_band,
    statement_timestamp()
  );

  return 'active'::public.account_onboarding_status;
end;
$$;

create or replace function public.activate_managed_account(target_user_id uuid)
returns public.account_onboarding_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  onboarding_record public.account_onboarding%rowtype;
begin
  if actor_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into onboarding_record
  from public.account_onboarding
  where user_id = target_user_id
  for update;

  if onboarding_record.user_id is null
    or onboarding_record.status <> 'pending_school' then
    raise exception 'Account is not awaiting school activation'
      using errcode = '23514';
  end if;
  if not public.can_manage_school(
    onboarding_record.requested_school_id,
    actor_id
  ) then
    raise exception 'School administration required' using errcode = '42501';
  end if;
  if onboarding_record.activation_method = 'guardian_authorized'
    and onboarding_record.guardian_authorized_at is null then
    raise exception 'Guardian authorization has not been recorded'
      using errcode = '23514';
  end if;

  update public.account_onboarding
  set
    status = 'active',
    reviewed_by = actor_id,
    reviewed_at = statement_timestamp(),
    activated_at = statement_timestamp()
  where user_id = target_user_id;

  update public.profiles
  set onboarding_completed_at = coalesce(
    onboarding_completed_at,
    statement_timestamp()
  )
  where id = target_user_id;

  return 'active'::public.account_onboarding_status;
end;
$$;

revoke all on function public.complete_oauth_profile(
  text,
  text,
  public.age_band,
  uuid,
  public.grade_band
) from public;
revoke all on function public.activate_managed_account(uuid) from public;
grant execute on function public.complete_oauth_profile(
  text,
  text,
  public.age_band,
  uuid,
  public.grade_band
) to authenticated;
grant execute on function public.activate_managed_account(uuid) to authenticated;

commit;
