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

-- Hostile / Part Z cases. Every assertion is DENY. UUIDs 18* avoid 001/010.
-- plan() must match the assertion count below (24).
select plan(24);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '18000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-student-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Student A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-student-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Student B","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-officer-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Officer A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-admin-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Admin A","age_band":"adult"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-admin-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Admin B","age_band":"adult"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-platform@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Platform","age_band":"adult"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-reviewer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Reviewer","age_band":"adult"}',
    now(), now()
  ),
  (
    '18000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dash-hostile-officer-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Officer B","age_band":"age_13_17"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values
  (
    '18100000-0000-0000-0000-000000000001',
    'Hostile School A',
    'hostile-school-a',
    'high',
    'San Jose'
  ),
  (
    '18100000-0000-0000-0000-000000000002',
    'Hostile School B',
    'hostile-school-b',
    'high',
    'Oakland'
  );

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '18100000-0000-0000-0000-000000000001'
where user_id in (
  '18000000-0000-0000-0000-000000000001',
  '18000000-0000-0000-0000-000000000002',
  '18000000-0000-0000-0000-000000000003',
  '18000000-0000-0000-0000-000000000004',
  '18000000-0000-0000-0000-000000000006',
  '18000000-0000-0000-0000-000000000007'
);

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '18100000-0000-0000-0000-000000000002'
where user_id in (
  '18000000-0000-0000-0000-000000000005',
  '18000000-0000-0000-0000-000000000008'
);

insert into public.platform_role_assignments (user_id, role, assigned_by)
values
  (
    '18000000-0000-0000-0000-000000000006',
    'platform_admin',
    '18000000-0000-0000-0000-000000000006'
  ),
  (
    '18000000-0000-0000-0000-000000000007',
    'committee_reviewer',
    '18000000-0000-0000-0000-000000000006'
  );

insert into public.user_school_memberships (
  user_id, school_id, role, status, joined_at
)
values
  (
    '18000000-0000-0000-0000-000000000001',
    '18100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '18000000-0000-0000-0000-000000000002',
    '18100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '18000000-0000-0000-0000-000000000003',
    '18100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '18000000-0000-0000-0000-000000000004',
    '18100000-0000-0000-0000-000000000001',
    'school_admin',
    'active',
    now()
  ),
  (
    '18000000-0000-0000-0000-000000000005',
    '18100000-0000-0000-0000-000000000002',
    'school_admin',
    'active',
    now()
  ),
  (
    '18000000-0000-0000-0000-000000000008',
    '18100000-0000-0000-0000-000000000002',
    'student',
    'active',
    now()
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values
  (
    '18200000-0000-0000-0000-000000000001',
    '18100000-0000-0000-0000-000000000001',
    'Hostile Club A',
    'hostile-club-a',
    'Private Club A',
    'Build responsibly',
    'STEM',
    'private',
    '18000000-0000-0000-0000-000000000004'
  ),
  (
    '18200000-0000-0000-0000-000000000002',
    '18100000-0000-0000-0000-000000000002',
    'Hostile Club B',
    'hostile-club-b',
    'Private Club B',
    'Learn together',
    'STEM',
    'private',
    '18000000-0000-0000-0000-000000000005'
  );

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  (
    '18300000-0000-0000-0000-000000000001',
    '18200000-0000-0000-0000-000000000001',
    '18000000-0000-0000-0000-000000000003',
    'president',
    'active',
    '2026-2027',
    now()
  ),
  (
    '18300000-0000-0000-0000-000000000002',
    '18200000-0000-0000-0000-000000000001',
    '18000000-0000-0000-0000-000000000001',
    'member',
    'active',
    '2026-2027',
    now()
  ),
  (
    '18300000-0000-0000-0000-000000000003',
    '18200000-0000-0000-0000-000000000002',
    '18000000-0000-0000-0000-000000000008',
    'president',
    'active',
    '2026-2027',
    now()
  );

insert into public.dashboard_module_configs (
  id, module_id, scope_type, school_id, enabled, display_order
)
values
  (
    '18400000-0000-0000-0000-000000000001',
    (select id from public.dashboard_modules where slug = 'school-learning'),
    'school',
    '18100000-0000-0000-0000-000000000002',
    true,
    30
  ),
  (
    '18400000-0000-0000-0000-000000000011',
    (select id from public.dashboard_modules where slug = 'platform-admin'),
    'global',
    null,
    true,
    1
  ),
  (
    '18400000-0000-0000-0000-000000000012',
    (select id from public.dashboard_modules where slug = 'platform-audit'),
    'global',
    null,
    true,
    2
  );

insert into public.dashboard_module_configs (
  id, module_id, scope_type, club_id, enabled, display_order
)
values (
  '18400000-0000-0000-0000-000000000002',
  (select id from public.dashboard_modules where slug = 'insights'),
  'club',
  '18200000-0000-0000-0000-000000000002',
  true,
  20
);

insert into public.dashboard_module_configs (
  id, module_id, scope_type, user_id, enabled, display_order
)
values (
  '18400000-0000-0000-0000-000000000003',
  (select id from public.dashboard_modules where slug = 'my-day'),
  'user',
  '18000000-0000-0000-0000-000000000002',
  true,
  10
);

insert into public.dashboard_home_content (
  id, module_type, context_type, club_id, body, payload, created_by
)
values (
  '18500000-0000-0000-0000-000000000001',
  'announcement',
  'club',
  '18200000-0000-0000-0000-000000000002',
  'Club B private briefing.',
  '{"title":"Club B","body":"Club B private briefing."}'::jsonb,
  '18000000-0000-0000-0000-000000000008'
);

insert into public.dashboard_home_content (
  id, module_type, context_type, school_id, body, payload, created_by
)
values (
  '18500000-0000-0000-0000-000000000002',
  'school_message',
  'school',
  '18100000-0000-0000-0000-000000000001',
  'School A admin only.',
  '{"title":"Admin","body":"School A admin only."}'::jsonb,
  '18000000-0000-0000-0000-000000000004'
);

insert into public.dashboard_user_preferences (
  user_id, last_context_type, last_club_id, last_school_id
)
values
  (
    '18000000-0000-0000-0000-000000000002',
    'personal',
    null,
    '18100000-0000-0000-0000-000000000001'
  ),
  (
    '18000000-0000-0000-0000-000000000008',
    'club',
    '18200000-0000-0000-0000-000000000002',
    '18100000-0000-0000-0000-000000000002'
  );

insert into public.stem_courses (
  id, slug, title, description, discipline, grade_bands, difficulty, format,
  estimated_minutes, provider_name, source_url, license_name, license_url,
  is_free, status, last_verified_at, created_by,
  course_kind, course_namespace, source_basis
)
values (
  '18600000-0000-0000-0000-000000000001',
  'hostile-draft-ap',
  'Hostile Draft AP',
  'Draft course used for hostile publish attempts.',
  'computer_science',
  array['age_13_17'::public.age_band],
  'beginner',
  'reading',
  60,
  'BayAreaClubs',
  'https://bayareaclubs.example/hostile-draft',
  'Original',
  'https://bayareaclubs.example/license',
  true,
  'draft',
  current_date,
  '18000000-0000-0000-0000-000000000006',
  'ap',
  'hostile-ap-csp',
  'ORIGINAL'
);

insert into public.stem_course_modules (
  id, course_id, position, title, estimated_minutes, is_published
)
values (
  '18600000-0000-0000-0000-000000000011',
  '18600000-0000-0000-0000-000000000001',
  0,
  'Hostile unit',
  30,
  false
);

insert into public.learning_lessons (
  id, course_id, module_id, namespace, slug, position, title, body_plain,
  estimated_minutes, status, created_by
)
values (
  '18600000-0000-0000-0000-000000000021',
  '18600000-0000-0000-0000-000000000001',
  '18600000-0000-0000-0000-000000000011',
  'hostile-ap-csp',
  'hostile-draft-lesson',
  0,
  'Hostile draft lesson',
  'Unpublished lesson body.',
  10,
  'draft',
  '18000000-0000-0000-0000-000000000001'
);

insert into public.learning_questions (
  id, course_id, namespace, module_id, lesson_id, slug, prompt, choices,
  answer_key, explanation, question_type, objective_codes, difficulty,
  source_basis, status, version, created_by
)
values (
  '18600000-0000-0000-0000-000000000031',
  '18600000-0000-0000-0000-000000000001',
  'hostile-ap-csp',
  '18600000-0000-0000-0000-000000000011',
  '18600000-0000-0000-0000-000000000021',
  'hostile-draft-question',
  'Unpublished prompt?',
  '[{"id":"a","text":"One"},{"id":"b","text":"Two"}]'::jsonb,
  '{"correct":"a"}'::jsonb,
  'Secret explanation.',
  'multiple_choice',
  array['CRD-1.A'],
  'beginner',
  'ORIGINAL',
  'draft',
  1,
  '18000000-0000-0000-0000-000000000006'
);

insert into public.learning_attempts (
  id, user_id, question_id, course_id, response, is_correct
)
values (
  '18600000-0000-0000-0000-000000000041',
  '18000000-0000-0000-0000-000000000002',
  '18600000-0000-0000-0000-000000000031',
  '18600000-0000-0000-0000-000000000001',
  '{"choice":"a"}'::jsonb,
  true
);

insert into public.school_course_features (
  id, school_id, course_id, created_by
)
values (
  '18600000-0000-0000-0000-000000000051',
  '18100000-0000-0000-0000-000000000002',
  '18600000-0000-0000-0000-000000000001',
  '18000000-0000-0000-0000-000000000005'
);

-- Forged JWT claims must never become authority.
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"18000000-0000-0000-0000-000000000001","role":"authenticated","app_role":"platform_admin","school_id":"18100000-0000-0000-0000-000000000002","club_id":"18200000-0000-0000-0000-000000000002"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.dashboard_module_configs
    where id = '18400000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'DENY: forged role/school_id claims cannot read School B configs'
);
select throws_ok(
  $$insert into public.dashboard_module_configs (
      id, module_id, scope_type, club_id, enabled, display_order
    ) values (
      '18400000-0000-0000-0000-000000000090',
      (select id from public.dashboard_modules where slug = 'insights'),
      'club',
      '18200000-0000-0000-0000-000000000002',
      true,
      99
    )$$,
  '42501',
  null,
  'DENY: forged club_id claims cannot insert Club B configs'
);
select results_eq(
  $$with changed as (
      update public.stem_courses
      set status = 'published'
      where id = '18600000-0000-0000-0000-000000000001'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: forged platform_admin claim cannot publish a course'
);
select throws_ok(
  $$insert into public.dashboard_home_content (
      id, module_type, context_type, school_id, body, payload, created_by
    ) values (
      '18500000-0000-0000-0000-000000000090',
      'school_message',
      'school',
      '18100000-0000-0000-0000-000000000002',
      'Forged school B message.',
      '{"title":"Forged","body":"Forged school B message."}'::jsonb,
      '18000000-0000-0000-0000-000000000001'
    )$$,
  '42501',
  null,
  'DENY: forged school_id cannot insert School B home content'
);
select throws_ok(
  $$insert into public.learning_attempts (
      id, user_id, question_id, course_id, response, is_correct
    ) values (
      '18600000-0000-0000-0000-000000000091',
      '18000000-0000-0000-0000-000000000002',
      '18600000-0000-0000-0000-000000000031',
      '18600000-0000-0000-0000-000000000001',
      '{"choice":"b"}'::jsonb,
      false
    )$$,
  '42501',
  null,
  'DENY: user cannot insert a learning_attempt as another student'
);
select throws_ok(
  $$insert into public.school_course_features (
      id, school_id, course_id, created_by
    ) values (
      '18600000-0000-0000-0000-000000000092',
      '18100000-0000-0000-0000-000000000002',
      '18600000-0000-0000-0000-000000000001',
      '18000000-0000-0000-0000-000000000001'
    )$$,
  '42501',
  null,
  'DENY: student cannot insert school_course_features for another school'
);
select throws_ok(
  $$insert into public.dashboard_module_configs (
      id, module_id, scope_type, school_id, enabled, display_order
    ) values (
      '18400000-0000-0000-0000-000000000091',
      (select id from public.dashboard_modules where slug = 'school-learning'),
      'school',
      '18100000-0000-0000-0000-000000000002',
      false,
      99
    )$$,
  '42501',
  null,
  'DENY: student cannot insert School B module configs'
);
select throws_ok(
  $$insert into public.dashboard_module_configs (
      id, module_id, scope_type, user_id, enabled, display_order
    ) values (
      '18400000-0000-0000-0000-000000000092',
      (select id from public.dashboard_modules where slug = 'my-day'),
      'user',
      '18000000-0000-0000-0000-000000000002',
      false,
      99
    )$$,
  '42501',
  null,
  'DENY: user cannot upsert dashboard_module_configs for another user'
);
select throws_ok(
  $$insert into public.learning_lessons (
      id, course_id, module_id, namespace, slug, position, title, body_plain,
      estimated_minutes, status
    ) values (
      '18600000-0000-0000-0000-000000000093',
      '18600000-0000-0000-0000-000000000001',
      '18600000-0000-0000-0000-000000000011',
      'hostile-ap-csp',
      'forged-lesson',
      1,
      'Forged lesson',
      'Forged body.',
      10,
      'published'
    )$$,
  'P0001',
  null,
  'DENY: student cannot insert learning_lessons'
);
select throws_ok(
  $$insert into public.learning_questions (
      id, course_id, namespace, module_id, lesson_id, slug, prompt, choices,
      answer_key, explanation, question_type, source_basis, status, version,
      created_by
    ) values (
      '18600000-0000-0000-0000-000000000094',
      '18600000-0000-0000-0000-000000000001',
      'hostile-ap-csp',
      '18600000-0000-0000-0000-000000000011',
      '18600000-0000-0000-0000-000000000021',
      'forged-question',
      'Forged prompt?',
      '[{"id":"a","text":"One"}]'::jsonb,
      '{"correct":"a"}'::jsonb,
      'Forged.',
      'multiple_choice',
      'ORIGINAL',
      'published',
      1,
      '18000000-0000-0000-0000-000000000001'
    )$$,
  'P0001',
  null,
  'DENY: student cannot insert learning_questions'
);
select throws_ok(
  $$insert into public.learning_review_events (
      course_id, actor_id, from_status, to_status, notes
    ) values (
      '18600000-0000-0000-0000-000000000001',
      '18000000-0000-0000-0000-000000000001',
      'draft',
      'published',
      'forged publish'
    )$$,
  '42501',
  null,
  'DENY: student cannot insert learning_review_events to publish'
);
select results_eq(
  $$select count(*)::bigint from public.learning_review_events$$,
  array[0::bigint],
  'DENY: student cannot SELECT learning_review_events'
);
select results_eq(
  $$select count(*)::bigint from public.school_course_features
    where school_id = '18100000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: student cannot read another school course features'
);
select results_eq(
  $$select count(*)::bigint from public.learning_attempts
    where user_id = '18000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: student A cannot SELECT student B learning_attempts'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '18500000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: student cannot open school-scoped admin home content'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"18000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select throws_ok(
  $$insert into public.dashboard_home_content (
      id, module_type, context_type, club_id, body, payload, created_by
    ) values (
      '18500000-0000-0000-0000-000000000091',
      'announcement',
      'club',
      '18200000-0000-0000-0000-000000000002',
      'Cross club insert.',
      '{"title":"Cross","body":"Cross club insert."}'::jsonb,
      '18000000-0000-0000-0000-000000000003'
    )$$,
  '42501',
  null,
  'DENY: Club A officer cannot insert Club B home content'
);
select results_eq(
  $$with changed as (
      update public.dashboard_module_configs
      set enabled = false
      where id = '18400000-0000-0000-0000-000000000002'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: Club A officer cannot update Club B module configs'
);
select results_eq(
  $$select count(*)::bigint from public.dashboard_home_content
    where id = '18500000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'DENY: Club A officer cannot read Club B home content'
);
select results_eq(
  $$with changed as (
      update public.dashboard_user_preferences
      set last_club_id = '18200000-0000-0000-0000-000000000001'
      where user_id = '18000000-0000-0000-0000-000000000002'
      returning user_id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: user cannot update another user dashboard preferences'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"18000000-0000-0000-0000-000000000007","role":"authenticated"}',
  true
);

select results_eq(
  $$with changed as (
      update public.stem_courses
      set status = 'published'
      where id = '18600000-0000-0000-0000-000000000001'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: committee reviewer cannot publish a course as platform admin'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"18000000-0000-0000-0000-000000000004","role":"authenticated"}',
  true
);

select results_eq(
  $$with changed as (
      update public.dashboard_module_configs
      set enabled = false
      where id = '18400000-0000-0000-0000-000000000011'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: school admin cannot disable mandatory platform-admin module'
);
select results_eq(
  $$with changed as (
      update public.dashboard_module_configs
      set enabled = false
      where id = '18400000-0000-0000-0000-000000000012'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: school admin cannot disable mandatory platform-audit module'
);
select throws_ok(
  $$insert into public.dashboard_module_configs (
      id, module_id, scope_type, enabled, display_order
    ) values (
      '18400000-0000-0000-0000-000000000093',
      (select id from public.dashboard_modules where slug = 'home'),
      'global',
      false,
      1
    )$$,
  '23514',
  null,
  'DENY: non-admin cannot insert a global config that disables home'
);

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);

select throws_ok(
  $$insert into public.dashboard_home_content (
      id, module_type, context_type, school_id, body, payload, created_by
    ) values (
      '18500000-0000-0000-0000-000000000092',
      'announcement',
      'school',
      '18100000-0000-0000-0000-000000000001',
      'Anon insert.',
      '{"title":"Anon","body":"Anon insert."}'::jsonb,
      '18000000-0000-0000-0000-000000000001'
    )$$,
  '42501',
  null,
  'DENY: anonymous users cannot insert dashboard_home_content'
);

select * from finish();
rollback;
