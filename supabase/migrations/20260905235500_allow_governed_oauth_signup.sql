begin;

create or replace function public.restrict_under_13_self_signup(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_age_band text := event -> 'user' -> 'user_metadata' ->> 'age_band';
  auth_provider text := coalesce(
    event -> 'user' -> 'app_metadata' ->> 'provider',
    'email'
  );
  is_managed boolean := coalesce(
    (event -> 'user' -> 'app_metadata' ->> 'managed_onboarding')::boolean,
    false
  );
begin
  if requested_age_band is null and auth_provider <> 'email' then
    return '{}'::jsonb;
  end if;
  if requested_age_band is null then
    raise exception 'An age band is required for account governance';
  end if;
  if requested_age_band = 'under_13' and not is_managed then
    raise exception 'Under-13 accounts require managed onboarding';
  end if;
  if requested_age_band not in ('under_13', 'age_13_17', 'adult') then
    raise exception 'Invalid account age band';
  end if;
  return '{}'::jsonb;
end;
$$;

revoke all on function public.restrict_under_13_self_signup(jsonb) from public;
grant execute on function public.restrict_under_13_self_signup(jsonb)
  to supabase_auth_admin;

commit;
