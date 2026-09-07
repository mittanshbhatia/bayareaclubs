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

-- Dashboard tenant isolation. UUIDs 16* avoid 001/010 fixtures.
-- plan() must match the assertion count below (26).
select plan(26);

select has_table('public', 'dashboard_modules', 'dashboard module catalog exists');
select has_table(
  'public',
  'dashboard_module_configs',
  'dashboard module configs exist'
);
select has_table('public', 'dashboard_home_content', 'dashboard home content exists');
select has_table(
  'public',
  'dashboard_user_preferences',
  'dashboard user preferences exist'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '16000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-iso-admin-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Dash Iso Admin A","age_band":"adult"}',
    now(), now()
  ),
  (
    '16000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-iso-officer-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Dash Iso Officer A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '16000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-iso-student-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Dash Iso Student A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '16000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-iso-admin-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Dash Iso Admin B","age_band":"adult"}',
    now(), now()
  ),
  (
    '16000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-iso-officer-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Dash Iso Officer B","age_band":"age_13_17"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values
  (
    '16100000-0000-0000-0000-000000000001',
    'Dash Iso School A',
    'dash-iso-school-a',
    'high',
    'San Jose'
  ),
  (
    '16100000-0000-0000-0000-000000000002',
    'Dash Iso School B',
    'dash-iso-school-b',
    'high',
    'Oakland'
  );

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '16100000-0000-0000-0000-000000000001'
where user_id in (
  '16000000-0000-0000-0000-000000000001',
  '16000000-0000-0000-0000-000000000002',
  '16000000-0000-0000-0000-000000000003'
);

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '16100000-0000-0000-0000-000000000002'
where user_id in (
  '16000000-0000-0000-0000-000000000004',
  '16000000-0000-0000-0000-000000000005'
);

insert into public.user_school_memberships (
  user_id, school_id, role, status, joined_at
)
values
  (
    '16000000-0000-0000-0000-000000000001',
    '16100000-0000-0000-0000-000000000001',
    'school_admin',
    'active',
    now()
  ),
  (
    '16000000-0000-0000-0000-000000000002',
    '16100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '16000000-0000-0000-0000-000000000003',
    '16100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '16000000-0000-0000-0000-000000000004',
    '16100000-0000-0000-0000-000000000002',
    'school_admin',
    'active',
    now()
  ),
  (
    '16000000-0000-0000-0000-000000000005',
    '16100000-0000-0000-0000-000000000002',
    'student',
    'active',
    now()
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values
  (
    '16200000-0000-0000-0000-000000000001',
    '16100000-0000-0000-0000-000000000001',
    'Dash Iso Club A',
    'dash-iso-club-a',
    'Private Club A',
    'Build responsibly',
    'STEM',
    'private',
    '16000000-0000-0000-0000-000000000001'
  ),
  (
    '16200000-0000-0000-0000-000000000002',
    '16100000-0000-0000-0000-000000000002',
    'Dash Iso Club B',
    'dash-iso-club-b',
    'Private Club B',
    'Learn together',
    'STEM',
    'private',
    '16000000-0000-0000-0000-000000000004'
  );

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  (
    '16300000-0000-0000-0000-000000000001',
    '16200000-0000-0000-0000-000000000001',
    '16000000-0000-0000-0000-000000000002',
    'president',
    'active',
    '2026-2027',
    now()
  ),
  (
    '16300000-0000-0000-0000-000000000002',
    '16200000-0000-0000-0000-000000000001',
    '16000000-0000-0000-0000-000000000003',
    'member',
    'active',
    '2026-2027',
    now()
  ),
  (
    '16300000-0000-0000-0000-000000000003',
    '16200000-0000-0000-0000-000000000002',
    '16000000-0000-0000-0000-000000000005',
    'president',
    'active',
    '2026-2027',
    now()
  );

insert into public.dashboard_module_configs (
  id, module_id, scope_type, club_id, enabled, display_order
)
values
  (
    '16400000-0000-0000-0000-000000000001',
    (select id from public.dashboard_modules where slug = 'insights'),
    'club',
    '16200000-0000-0000-0000-000000000001',
    true,
    20
  ),
  (
    '16400000-0000-0000-0000-000000000002',
    (select id from public.dashboard_modules where slug = 'insights'),
    'club',
    '16200000-0000-0000-0000-000000000002',
    true,
    20
  ),
  (
    '16400000-0000-0000-0000-000000000012',
    (select id from public.dashboard_modules where slug = 'club-overview'),
    'club',
    '16200000-0000-0000-0000-000000000001',
    true,
    1
  );

insert into public.dashboard_module_configs (
  id, module_id, scope_type, school_id, enabled, display_order
)
values
  (
    '16400000-0000-0000-0000-000000000003',
    (select id from public.dashboard_modules where slug = 'school-learning'),
    'school',
    '16100000-0000-0000-0000-000000000001',
    true,
    30
  ),
  (
    '16400000-0000-0000-0000-000000000004',
    (select id from public.dashboard_modules where slug = 'school-learning'),
    'school',
    '16100000-0000-0000-0000-000000000002',
    true,
    30
  ),
  (
    '16400000-0000-0000-0000-000000000013',
    (select id from public.dashboard_modules where slug = 'school-clubs'),
    'school',
    '16100000-0000-0000-0000-000000000001',
    true,
    1
  );

insert into public.dashboard_module_configs (
  id, module_id, scope_type, user_id, enabled, display_order
)
values
  (
    '16400000-0000-0000-0000-000000000010',
    (select id from public.dashboard_modules where slug = 'home'),
    'user',
    '16000000-0000-0000-0000-000000000003',
    true,
    1
  ),
  (
    '16400000-0000-0000-0000-000000000011',
    (select id from public.dashboard_modules where slug = 'profile'),
    'user',
    '16000000-0000-0000-0000-000000000003',
    true,
    2
  ),
  (
    '16400000-0000-0000-0000-000000000014',
    (select id from public.dashboard_modules where slug = 'my-day'),
    'user',
    '16000000-0000-0000-0000-000000000002',
    true,
    10
  );

insert into public.dashboard_home_content (
  id, module_type, context_type, club_id, body, payload, created_by
)
values
  (
    '16500000-0000-0000-0000-000000000001',
    'announcement',
    'club',
    '16200000-0000-0000-0000-000000000001',
    'Club A meets after school.',
    '{"title":"Club A update","body":"Club A meets after school."}'::jsonb,
    '16000000-0000-0000-0000-000000000002'
  ),
  (
    '16500000-0000-0000-0000-000000000002',
    'announcement',
    'club',
    '16200000-0000-0000-0000-000000000002',
    'Club B private briefing.',
    '{"title":"Club B update","body":"Club B private briefing."}'::jsonb,
    '16000000-0000-0000-0000-000000000005'
  );

insert into public.dashboard_home_content (
  id, module_type, context_type, school_id, body, payload, created_by
)
values
  (
    '16500000-0000-0000-0000-000000000003',
    'school_message',
    'school',
    '16100000-0000-0000-0000-000000000001',
    'School A admin deadline.',
    '{"title":"Admin only","body":"School A admin deadline."}'::jsonb,
    '16000000-0000-0000-0000-000000000001'
  ),
  (
    '16500000-0000-0000-0000-000000000004',
    'school_message',
    'school',
    '16100000-0000-0000-0000-000000000002',
    'School B admin deadline.',
    '{"title":"Admin only B","body":"School B admin deadline."}'::jsonb,
    '16000000-0000-0000-0000-000000000004'
  );

insert into public.dashboard_user_preferences (
  user_id, last_context_type, last_club_id, last_school_id
)
values
  (
    '16000000-0000-0000-0000-000000000002',
    'club',
    '16200000-0000-0000-0000-000000000001',
    '16100000-0000-0000-0000-000000000001'
  ),
  (
    '16000000-0000-0000-0000-000000000005',
    'club',
    '16200000-0000-0000-0000-000000000002',
    '16100000-0000-0000-0000-000000000002'
  );

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"16000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.dashboard_module_configs
    where id = '16400000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'ALLOW: Club A officer can read Club A dashboard_module_configs'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_module_configs
    where id = '16400000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: Club A officer cannot read Club B dashboard_module_configs'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '16500000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'ALLOW: Club A officer can read Club A home content'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '16500000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: Club A officer cannot read Club B home content'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_user_preferences
    where user_id = '16000000-0000-0000-0000-000000000002'$$,
  array[1::bigint],
  'ALLOW: Club A officer can read own dashboard preferences'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_user_preferences
    where user_id = '16000000-0000-0000-0000-000000000005'$$,
  array[0::bigint],
  'DENY: Club A officer cannot read Club B officer preferences'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"16000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.dashboard_module_configs
    where id = '16400000-0000-0000-0000-000000000003'$$,
  array[1::bigint],
  'ALLOW: School A admin can read School A dashboard_module_configs'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_module_configs
    where id = '16400000-0000-0000-0000-000000000004'$$,
  array[0::bigint],
  'DENY: School A admin cannot read School B dashboard_module_configs'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '16500000-0000-0000-0000-000000000003'$$,
  array[1::bigint],
  'ALLOW: School A admin can read School A admin home content'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '16500000-0000-0000-0000-000000000004'$$,
  array[0::bigint],
  'DENY: School A admin cannot read School B home content'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"16000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '16500000-0000-0000-0000-000000000003'$$,
  array[0::bigint],
  'DENY: student cannot SELECT school-scoped admin home content'
);
select lives_ok(
  $$insert into public.dashboard_module_configs (
      id, module_id, scope_type, user_id, enabled, display_order
    ) values (
      '16400000-0000-0000-0000-000000000099',
      (select id from public.dashboard_modules where slug = 'my-day'),
      'user',
      '16000000-0000-0000-0000-000000000003',
      false,
      50
    )$$,
  'ALLOW: student can upsert own non-mandatory module preference'
);
select throws_ok(
  $$insert into public.dashboard_module_configs (
      id, module_id, scope_type, user_id, enabled, display_order
    ) values (
      '16400000-0000-0000-0000-000000000098',
      (select id from public.dashboard_modules where slug = 'my-day'),
      'user',
      '16000000-0000-0000-0000-000000000002',
      false,
      50
    )$$,
  '42501',
  null,
  'DENY: user cannot upsert dashboard_module_configs for another user'
);
select throws_ok(
  $$update public.dashboard_module_configs
    set enabled = false
    where id = '16400000-0000-0000-0000-000000000010'$$,
  null,
  null,
  'DENY: user cannot disable mandatory home module'
);
select throws_ok(
  $$update public.dashboard_module_configs
    set enabled = false
    where id = '16400000-0000-0000-0000-000000000011'$$,
  null,
  null,
  'DENY: user cannot disable mandatory profile module'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"16000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select throws_ok(
  $$update public.dashboard_module_configs
    set enabled = false
    where id = '16400000-0000-0000-0000-000000000012'$$,
  null,
  null,
  'DENY: officer cannot disable mandatory club-overview module'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"16000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select throws_ok(
  $$update public.dashboard_module_configs
    set enabled = false
    where id = '16400000-0000-0000-0000-000000000013'$$,
  null,
  null,
  'DENY: school admin cannot disable mandatory school-clubs module'
);

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);

select results_eq(
  $$select count(*)::bigint from public.dashboard_modules$$,
  array[0::bigint],
  'DENY: anonymous users cannot read dashboard_modules'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_module_configs$$,
  array[0::bigint],
  'DENY: anonymous users cannot read dashboard_module_configs'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content$$,
  array[0::bigint],
  'DENY: anonymous users cannot read dashboard_home_content'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content_revisions$$,
  array[0::bigint],
  'DENY: anonymous users cannot read dashboard_home_content_revisions'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_user_preferences$$,
  array[0::bigint],
  'DENY: anonymous users cannot read dashboard_user_preferences'
);

select * from finish();
rollback;
