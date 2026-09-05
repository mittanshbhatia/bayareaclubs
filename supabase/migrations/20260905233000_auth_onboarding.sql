begin;

create type public.account_onboarding_status as enum (
  'pending_email',
  'pending_guardian',
  'pending_school',
  'active',
  'suspended',
  'rejected'
);
create type public.account_activation_method as enum (
  'self_service',
  'guardian_authorized',
  'school_managed'
);
create type public.grade_band as enum (
  'k_2',
  'grade_3_5',
  'grade_6_8',
  'grade_9_12',
  'college',
  'adult',
  'other'
);
create type public.profile_display_format as enum (
  'first_name_last_initial',
  'first_name_only',
  'custom'
);

alter table public.profiles
  add column first_name text,
  add column last_initial text,
  add column display_format public.profile_display_format not null
    default 'first_name_last_initial',
  add column primary_school_id uuid references public.schools(id) on delete set null,
  add column grade_band public.grade_band,
  add column avatar_asset_id uuid references public.media_assets(id) on delete set null,
  add column show_avatar_to_club_members boolean not null default true,
  add column show_school_to_club_members boolean not null default true,
  add constraint profiles_first_name_length
    check (first_name is null or length(trim(first_name)) between 1 and 80),
  add constraint profiles_last_initial_format
    check (last_initial is null or last_initial ~ '^[[:alpha:]]$');

create table public.account_onboarding (
  id uuid not null unique default gen_random_uuid(),
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status public.account_onboarding_status not null,
  activation_method public.account_activation_method not null,
  requested_school_id uuid references public.schools(id) on delete restrict,
  grade_band public.grade_band,
  guardian_user_id uuid references public.profiles(id) on delete restrict,
  guardian_authorized_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (
    (guardian_user_id is null and guardian_authorized_at is null)
    or (guardian_user_id is not null and guardian_authorized_at is not null)
  ),
  check (
    (reviewed_by is null and reviewed_at is null)
    or (reviewed_by is not null and reviewed_at is not null)
  ),
  check (
    (status = 'active' and activated_at is not null)
    or (status <> 'active' and activated_at is null)
  )
);

create table public.account_onboarding_internal_notes (
  id uuid primary key default gen_random_uuid(),
  onboarding_user_id uuid not null
    references public.account_onboarding(user_id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  note text not null check (length(trim(note)) between 1 and 4000),
  created_at timestamptz not null default statement_timestamp()
);

create index account_onboarding_school_status_idx
  on public.account_onboarding (requested_school_id, status, created_at);
create index account_onboarding_guardian_status_idx
  on public.account_onboarding (guardian_user_id, status)
  where guardian_user_id is not null;
create index account_onboarding_notes_user_created_idx
  on public.account_onboarding_internal_notes (
    onboarding_user_id,
    created_at desc
  );

create trigger account_onboarding_set_updated_at
  before update on public.account_onboarding
  for each row execute function public.set_updated_at();

create function public.validate_account_onboarding()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  profile_age_band public.age_band;
  allowed boolean;
begin
  select age_band into profile_age_band
  from public.profiles
  where id = new.user_id;

  if profile_age_band = 'under_13' then
    if new.activation_method = 'self_service' then
      raise exception 'Under-13 accounts cannot use self-service activation'
        using errcode = '23514';
    end if;
    if new.requested_school_id is null then
      raise exception 'Under-13 accounts require an institutional school'
        using errcode = '23514';
    end if;
  elsif new.activation_method <> 'self_service' and new.requested_school_id is null then
    raise exception 'Managed onboarding requires a school'
      using errcode = '23514';
  end if;

  if tg_op = 'UPDATE' and new.status <> old.status then
    allowed := case old.status
      when 'pending_email' then new.status in ('active', 'suspended', 'rejected')
      when 'pending_guardian' then new.status in (
        'pending_school', 'suspended', 'rejected'
      )
      when 'pending_school' then new.status in ('active', 'suspended', 'rejected')
      when 'active' then new.status = 'suspended'
      when 'suspended' then new.status in ('active', 'rejected')
      else false
    end;
    if not allowed then
      raise exception 'Invalid onboarding transition: % -> %', old.status, new.status
        using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

create trigger account_onboarding_validate
  before insert or update on public.account_onboarding
  for each row execute function public.validate_account_onboarding();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_age_band text := new.raw_user_meta_data ->> 'age_band';
  requested_first_name text := nullif(
    trim(
      coalesce(
        new.raw_user_meta_data ->> 'first_name',
        split_part(new.raw_user_meta_data ->> 'display_name', ' ', 1)
      )
    ),
    ''
  );
  requested_last_initial text := upper(
    left(nullif(trim(new.raw_user_meta_data ->> 'last_initial'), ''), 1)
  );
  requested_school_id uuid := nullif(
    new.raw_user_meta_data ->> 'school_id',
    ''
  )::uuid;
  requested_grade_band public.grade_band := nullif(
    new.raw_user_meta_data ->> 'grade_band',
    ''
  )::public.grade_band;
  requested_activation public.account_activation_method := coalesce(
    nullif(new.raw_app_meta_data ->> 'activation_method', '')
      ::public.account_activation_method,
    'self_service'::public.account_activation_method
  );
  is_managed boolean := coalesce(
    (new.raw_app_meta_data ->> 'managed_onboarding')::boolean,
    false
  );
  initial_status public.account_onboarding_status;
  generated_display_name text;
  auth_provider text := coalesce(new.raw_app_meta_data ->> 'provider', 'email');
begin
  if auth_provider <> 'email'
    and (requested_age_band is null or requested_first_name is null) then
    return new;
  end if;
  if requested_age_band is null then
    raise exception 'An age band is required for account governance';
  end if;
  if requested_first_name is null then
    raise exception 'A first name is required';
  end if;
  if requested_age_band = 'under_13' and not is_managed then
    raise exception 'Under-13 accounts require managed onboarding';
  end if;
  if requested_age_band not in ('under_13', 'age_13_17', 'adult') then
    raise exception 'Invalid account age band';
  end if;
  if requested_age_band = 'under_13'
    and requested_activation = 'self_service' then
    raise exception 'Under-13 accounts cannot use self-service activation';
  end if;

  generated_display_name := requested_first_name
    || case
      when requested_last_initial is null then ''
      else ' ' || requested_last_initial || '.'
    end;

  initial_status := case
    when requested_age_band <> 'under_13' then 'pending_email'
    when requested_activation = 'guardian_authorized' then 'pending_guardian'
    else 'pending_school'
  end;

  insert into public.profiles (
    id,
    display_name,
    age_band,
    first_name,
    last_initial,
    primary_school_id,
    grade_band
  )
  values (
    new.id,
    generated_display_name,
    requested_age_band::public.age_band,
    requested_first_name,
    requested_last_initial,
    requested_school_id,
    requested_grade_band
  )
  on conflict (id) do nothing;

  insert into public.account_onboarding (
    user_id,
    status,
    activation_method,
    requested_school_id,
    grade_band
  )
  values (
    new.id,
    initial_status,
    requested_activation,
    requested_school_id,
    requested_grade_band
  )
  on conflict (user_id) do nothing;

  return new;
exception
  when invalid_text_representation then
    raise exception 'Invalid onboarding metadata';
end;
$$;

create function public.complete_verified_onboarding()
returns public.account_onboarding_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_age_band public.age_band;
  next_status public.account_onboarding_status;
begin
  if actor_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from auth.users
    where id = actor_id and email_confirmed_at is not null
  ) then
    raise exception 'Email verification required' using errcode = '42501';
  end if;

  select age_band into actor_age_band
  from public.profiles
  where id = actor_id;
  if actor_age_band = 'under_13' then
    select status into next_status
    from public.account_onboarding
    where user_id = actor_id;
    return next_status;
  end if;

  update public.account_onboarding
  set
    status = 'active',
    activated_at = statement_timestamp()
  where user_id = actor_id
    and status = 'pending_email'
  returning status into next_status;

  if next_status is null then
    select status into next_status
    from public.account_onboarding
    where user_id = actor_id;
  end if;

  if next_status = 'active' then
    update public.profiles
    set onboarding_completed_at = coalesce(
      onboarding_completed_at,
      statement_timestamp()
    )
    where id = actor_id;
  end if;
  return next_status;
end;
$$;

create function public.complete_oauth_profile(
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

  return 'active';
end;
$$;

create function public.record_guardian_authorization(target_user_id uuid)
returns public.account_onboarding_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  next_status public.account_onboarding_status;
begin
  if actor_id is null
    or not public.is_guardian_of(target_user_id, actor_id) then
    raise exception 'Verified guardian authorization required'
      using errcode = '42501';
  end if;

  update public.account_onboarding
  set
    guardian_user_id = actor_id,
    guardian_authorized_at = statement_timestamp(),
    status = 'pending_school'
  where user_id = target_user_id
    and status = 'pending_guardian'
    and activation_method = 'guardian_authorized'
  returning status into next_status;

  if next_status is null then
    raise exception 'Account is not awaiting guardian authorization'
      using errcode = '23514';
  end if;
  return next_status;
end;
$$;

create function public.activate_managed_account(target_user_id uuid)
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

  return 'active';
end;
$$;

revoke all on function public.complete_verified_onboarding() from public;
revoke all on function public.complete_oauth_profile(
  text,
  text,
  public.age_band,
  uuid,
  public.grade_band
) from public;
revoke all on function public.record_guardian_authorization(uuid) from public;
revoke all on function public.activate_managed_account(uuid) from public;
grant execute on function public.complete_verified_onboarding() to authenticated;
grant execute on function public.complete_oauth_profile(
  text,
  text,
  public.age_band,
  uuid,
  public.grade_band
) to authenticated;
grant execute on function public.record_guardian_authorization(uuid) to authenticated;
grant execute on function public.activate_managed_account(uuid) to authenticated;

alter table public.account_onboarding enable row level security;
alter table public.account_onboarding_internal_notes enable row level security;
grant select, insert, update, delete on public.account_onboarding to authenticated;
grant select, insert, update, delete
  on public.account_onboarding_internal_notes to authenticated;

create policy account_onboarding_authorized_select on public.account_onboarding
  for select to authenticated using (
    user_id = auth.uid()
    or guardian_user_id = auth.uid()
    or (
      requested_school_id is not null
      and public.can_manage_school(requested_school_id)
    )
    or public.is_platform_admin()
  );
create policy account_onboarding_no_direct_insert on public.account_onboarding
  for insert to authenticated with check (false);
create policy account_onboarding_school_admin_update on public.account_onboarding
  for update to authenticated using (
    requested_school_id is not null
    and public.can_manage_school(requested_school_id)
  ) with check (
    requested_school_id is not null
    and public.can_manage_school(requested_school_id)
  );
create policy account_onboarding_no_delete on public.account_onboarding
  for delete to authenticated using (false);

create policy onboarding_notes_school_admin_select
  on public.account_onboarding_internal_notes
  for select to authenticated using (
    exists (
      select 1
      from public.account_onboarding onboarding
      where onboarding.user_id = onboarding_user_id
        and onboarding.requested_school_id is not null
        and public.can_manage_school(onboarding.requested_school_id)
    )
  );
create policy onboarding_notes_school_admin_insert
  on public.account_onboarding_internal_notes
  for insert to authenticated with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.account_onboarding onboarding
      where onboarding.user_id = onboarding_user_id
        and onboarding.requested_school_id is not null
        and public.can_manage_school(onboarding.requested_school_id)
    )
  );
create policy onboarding_notes_no_update
  on public.account_onboarding_internal_notes
  for update to authenticated using (false);
create policy onboarding_notes_no_delete
  on public.account_onboarding_internal_notes
  for delete to authenticated using (false);

create function public.protect_profile_onboarding_governance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() = old.id and not public.is_platform_admin(auth.uid()) then
    if new.age_band <> old.age_band
      or new.primary_school_id is distinct from old.primary_school_id
      or new.onboarding_completed_at is distinct from old.onboarding_completed_at then
      raise exception 'Account governance fields require administration'
        using errcode = '42501';
    end if;
    if new.avatar_asset_id is not null and not exists (
      select 1 from public.media_assets
      where id = new.avatar_asset_id and uploader_id = auth.uid()
    ) then
      raise exception 'Avatar must be owned by the profile user'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_onboarding_governance
  before update on public.profiles
  for each row execute function public.protect_profile_onboarding_governance();
revoke all on function public.protect_profile_onboarding_governance() from public;

create trigger audit_account_onboarding
  after insert or update or delete on public.account_onboarding
  for each row execute function public.audit_row_change('account_onboarding');
create trigger audit_account_onboarding_notes
  after insert or delete on public.account_onboarding_internal_notes
  for each row execute function public.audit_row_change('account_onboarding_note');
create trigger audit_profile_updates
  after update on public.profiles
  for each row execute function public.audit_row_change('profile');

commit;
