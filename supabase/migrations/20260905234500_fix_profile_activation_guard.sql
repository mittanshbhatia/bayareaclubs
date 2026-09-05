begin;

create or replace function public.protect_profile_onboarding_governance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() = old.id and not public.is_platform_admin(auth.uid()) then
    if new.age_band <> old.age_band
      or new.primary_school_id is distinct from old.primary_school_id then
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

revoke all on function public.protect_profile_onboarding_governance()
  from public;

commit;
