begin;

set local role postgres;
create extension if not exists pgtap with schema extensions;
select set_config(
  'search_path',
  (
    select format('%I, public, extensions', namespace.nspname)
    from pg_extension extension
    join pg_namespace namespace on namespace.oid = extension.extnamespace
    where extension.extname = 'pgtap'
  ),
  true
);

select plan(6);

-- Isolate final-administrator assertions from persistent demo or production
-- assignments. The surrounding transaction restores every row on rollback.
update public.platform_role_assignments
set revoked_at = statement_timestamp()
where role = 'platform_admin'
  and revoked_at is null;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
(
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'admin-a@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Admin A","age_band":"adult"}',
  now(), now()
),
(
  'b0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'admin-b@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Admin B","age_band":"adult"}',
  now(), now()
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp()
where user_id in (
  'b0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002'
);

insert into public.schools (id, name, slug, level, city)
values (
  'b1000000-0000-0000-0000-000000000001',
  'Admin Console High',
  'admin-console-high',
  'high',
  'Berkeley'
);

insert into public.platform_role_assignments (user_id, role, assigned_by)
values (
  'b0000000-0000-0000-0000-000000000001',
  'platform_admin',
  'b0000000-0000-0000-0000-000000000001'
);

select is(
  public.count_active_platform_admins(),
  1,
  'counts the sole platform administrator'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', 'b0000000-0000-0000-0000-000000000001',
    'role', 'authenticated'
  )::text,
  true
);

select lives_ok(
  $$select public.assign_platform_role(
    'b0000000-0000-0000-0000-000000000002',
    'platform_admin'
  )$$,
  'platform admin can assign another platform admin'
);

select is(
  public.count_active_platform_admins(),
  2,
  'two platform administrators after assignment'
);

select lives_ok(
  $$select public.revoke_platform_role(
    (select id from public.platform_role_assignments
     where user_id = 'b0000000-0000-0000-0000-000000000002'
       and role = 'platform_admin'
       and revoked_at is null
     limit 1)
  )$$,
  'can revoke a non-final platform administrator'
);

select throws_ok(
  $$select public.revoke_platform_role(
    (select id from public.platform_role_assignments
     where user_id = 'b0000000-0000-0000-0000-000000000001'
       and role = 'platform_admin'
       and revoked_at is null
     limit 1)
  )$$,
  'P0001',
  'Cannot remove the final platform administrator',
  'blocks removing the final platform administrator'
);

set local role postgres;
select lives_ok(
  $$update public.schools
    set email_domain = 'example.edu'
    where id = 'b1000000-0000-0000-0000-000000000001'$$,
  'email_domain can be set without student home location fields'
);

select * from finish();
rollback;
