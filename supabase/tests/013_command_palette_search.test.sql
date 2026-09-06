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

select plan(4);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
(
  'd0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'cmd-officer@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Cmd Officer","age_band":"adult"}',
  now(), now()
),
(
  'd0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'cmd-outsider@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Cmd Outsider","age_band":"adult"}',
  now(), now()
);

insert into public.schools (id, name, slug, level, city)
values (
  'd1000000-0000-0000-0000-000000000001',
  'Command High',
  'command-high',
  'high',
  'Fremont'
);

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'd2000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'Command Robotics',
  'command-robotics',
  'Build robots',
  'Mission',
  'STEM',
  'private',
  'd0000000-0000-0000-0000-000000000001'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'd1000000-0000-0000-0000-000000000001'
where user_id in (
  'd0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000002'
);

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  ('d0000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'student', 'active', now());

insert into public.club_memberships (
  club_id, user_id, role, status, school_year, joined_at
)
values (
  'd2000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'president',
  'active',
  '2026-2027',
  now()
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"d0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select ok(
  exists (
    select 1
    from public.search_command_palette('create event', 20)
    where result_id like 'action:create-event:%'
      and href = '/clubs/command-robotics/events/new'
  ),
  'officer can see create event action for managed club'
);

select ok(
  exists (
    select 1
    from public.search_command_palette('Command Robotics', 20)
    where result_id = 'club:d2000000-0000-0000-0000-000000000001'
  ),
  'officer can search their private club'
);

select ok(
  not exists (
    select 1
    from public.search_command_palette('admin', 20)
    where result_group = 'Admin'
  ),
  'non-admin does not receive admin entities'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"d0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select ok(
  not exists (
    select 1
    from public.search_command_palette('Command Robotics', 20)
    where result_id = 'club:d2000000-0000-0000-0000-000000000001'
  ),
  'outsider cannot search a private club they cannot view'
);

select * from finish();
rollback;
