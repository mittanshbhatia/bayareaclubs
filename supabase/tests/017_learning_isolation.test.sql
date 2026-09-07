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

-- Learning tenant isolation. UUIDs 17* avoid 001/010 fixtures.
-- plan() must match the assertion count below (26).
select plan(26);

select has_table('public', 'learning_lessons', 'learning_lessons exists');
select has_table('public', 'learning_questions', 'learning_questions exists');
select has_table('public', 'learning_attempts', 'learning_attempts exists');
select has_table(
  'public',
  'school_course_features',
  'school_course_features exists'
);
select has_view(
  'public',
  'learning_questions_student',
  'student question view exists'
);
select hasnt_column(
  'public',
  'learning_questions_student',
  'answer_key',
  'student question view omits answer_key'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '17000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'learn-iso-admin@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Learn Iso Admin","age_band":"adult"}',
    now(), now()
  ),
  (
    '17000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'learn-iso-student-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Learn Iso Student A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '17000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'learn-iso-student-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Learn Iso Student B","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '17000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'learn-iso-school-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Learn Iso School A","age_band":"adult"}',
    now(), now()
  ),
  (
    '17000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'learn-iso-school-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Learn Iso School B","age_band":"adult"}',
    now(), now()
  ),
  (
    '17000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'learn-iso-officer-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Learn Iso Officer A","age_band":"age_13_17"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values
  (
    '17100000-0000-0000-0000-000000000001',
    'Learn Iso School A',
    'learn-iso-school-a',
    'high',
    'San Jose'
  ),
  (
    '17100000-0000-0000-0000-000000000002',
    'Learn Iso School B',
    'learn-iso-school-b',
    'high',
    'Oakland'
  );

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '17100000-0000-0000-0000-000000000001'
where user_id in (
  '17000000-0000-0000-0000-000000000001',
  '17000000-0000-0000-0000-000000000002',
  '17000000-0000-0000-0000-000000000003',
  '17000000-0000-0000-0000-000000000004',
  '17000000-0000-0000-0000-000000000006'
);

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '17100000-0000-0000-0000-000000000002'
where user_id = '17000000-0000-0000-0000-000000000005';

insert into public.platform_role_assignments (user_id, role, assigned_by)
values (
  '17000000-0000-0000-0000-000000000001',
  'platform_admin',
  '17000000-0000-0000-0000-000000000001'
);

insert into public.user_school_memberships (
  user_id, school_id, role, status, joined_at
)
values
  (
    '17000000-0000-0000-0000-000000000002',
    '17100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '17000000-0000-0000-0000-000000000003',
    '17100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '17000000-0000-0000-0000-000000000004',
    '17100000-0000-0000-0000-000000000001',
    'school_admin',
    'active',
    now()
  ),
  (
    '17000000-0000-0000-0000-000000000005',
    '17100000-0000-0000-0000-000000000002',
    'school_admin',
    'active',
    now()
  ),
  (
    '17000000-0000-0000-0000-000000000006',
    '17100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  '17200000-0000-0000-0000-000000000001',
  '17100000-0000-0000-0000-000000000001',
  'Learn Iso Club A',
  'learn-iso-club-a',
  'Private Club A',
  'Build responsibly',
  'STEM',
  'private',
  '17000000-0000-0000-0000-000000000004'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  (
    '17300000-0000-0000-0000-000000000001',
    '17200000-0000-0000-0000-000000000001',
    '17000000-0000-0000-0000-000000000006',
    'president',
    'active',
    '2026-2027',
    now()
  ),
  (
    '17300000-0000-0000-0000-000000000002',
    '17200000-0000-0000-0000-000000000001',
    '17000000-0000-0000-0000-000000000002',
    'member',
    'active',
    '2026-2027',
    now()
  );

insert into public.stem_courses (
  id, slug, title, description, discipline, grade_bands, difficulty, format,
  estimated_minutes, provider_name, source_url, license_name, license_url,
  is_free, status, last_verified_at, created_by,
  course_kind, course_namespace, source_basis
)
values
  (
    '17400000-0000-0000-0000-000000000001',
    'learn-iso-published-ap',
    'Learn Iso Published AP',
    'Original published skeleton.',
    'computer_science',
    array['age_13_17'::public.age_band],
    'beginner',
    'reading',
    120,
    'BayAreaClubs',
    'https://bayareaclubs.example/learn-iso-published',
    'Original',
    'https://bayareaclubs.example/license',
    true,
    'draft',
    current_date,
    '17000000-0000-0000-0000-000000000001',
    'ap',
    'learn-iso-ap-csp',
    'ORIGINAL'
  ),
  (
    '17400000-0000-0000-0000-000000000002',
    'learn-iso-draft-ap',
    'Learn Iso Draft AP',
    'Draft course awaiting publish.',
    'computer_science',
    array['age_13_17'::public.age_band],
    'beginner',
    'reading',
    90,
    'BayAreaClubs',
    'https://bayareaclubs.example/learn-iso-draft',
    'Original',
    'https://bayareaclubs.example/license',
    true,
    'draft',
    current_date,
    '17000000-0000-0000-0000-000000000001',
    'ap',
    'learn-iso-ap-draft',
    'ORIGINAL'
  );

select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

update public.stem_courses
set status = 'review'
where id = '17400000-0000-0000-0000-000000000001';

update public.stem_courses
set status = 'approved'
where id = '17400000-0000-0000-0000-000000000001';

update public.stem_courses
set status = 'published'
where id = '17400000-0000-0000-0000-000000000001';

select set_config('request.jwt.claims', '{}', true);

insert into public.stem_course_modules (
  id, course_id, position, title, estimated_minutes, is_published
)
values
  (
    '17500000-0000-0000-0000-000000000001',
    '17400000-0000-0000-0000-000000000001',
    0,
    'Unit 1',
    60,
    true
  ),
  (
    '17500000-0000-0000-0000-000000000002',
    '17400000-0000-0000-0000-000000000002',
    0,
    'Draft unit',
    45,
    false
  );

insert into public.learning_lessons (
  id, course_id, module_id, namespace, slug, position, title, body_plain,
  estimated_minutes, status, created_by
)
values
  (
    '17600000-0000-0000-0000-000000000001',
    '17400000-0000-0000-0000-000000000001',
    '17500000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    'published-lesson',
    0,
    'Published lesson',
    'Original published lesson body.',
    15,
    'published',
    '17000000-0000-0000-0000-000000000001'
  ),
  (
    '17600000-0000-0000-0000-000000000002',
    '17400000-0000-0000-0000-000000000001',
    '17500000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    'draft-lesson',
    1,
    'Draft lesson',
    'Draft lesson body.',
    15,
    'draft',
    '17000000-0000-0000-0000-000000000001'
  ),
  (
    '17600000-0000-0000-0000-000000000003',
    '17400000-0000-0000-0000-000000000001',
    '17500000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    'review-lesson',
    2,
    'Review lesson',
    'Review lesson body.',
    15,
    'review',
    '17000000-0000-0000-0000-000000000001'
  ),
  (
    '17600000-0000-0000-0000-000000000004',
    '17400000-0000-0000-0000-000000000001',
    '17500000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    'approved-lesson',
    3,
    'Approved lesson',
    'Approved lesson body.',
    15,
    'approved',
    '17000000-0000-0000-0000-000000000001'
  );

insert into public.learning_questions (
  id, course_id, namespace, module_id, lesson_id, slug, prompt, choices,
  answer_key, explanation, question_type, objective_codes, difficulty,
  source_basis, status, version, created_by
)
values
  (
    '17700000-0000-0000-0000-000000000001',
    '17400000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    '17500000-0000-0000-0000-000000000001',
    '17600000-0000-0000-0000-000000000001',
    'published-question',
    'Which choice is original?',
    '[{"id":"a","text":"Alpha"},{"id":"b","text":"Beta"}]'::jsonb,
    '{"correct":"a"}'::jsonb,
    'Alpha is the original keyed answer.',
    'multiple_choice',
    array['CRD-1.A'],
    'beginner',
    'ORIGINAL',
    'published',
    1,
    '17000000-0000-0000-0000-000000000001'
  ),
  (
    '17700000-0000-0000-0000-000000000002',
    '17400000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    '17500000-0000-0000-0000-000000000001',
    '17600000-0000-0000-0000-000000000002',
    'draft-question',
    'Draft prompt?',
    '[{"id":"a","text":"One"},{"id":"b","text":"Two"}]'::jsonb,
    '{"correct":"b"}'::jsonb,
    'Draft explanation.',
    'multiple_choice',
    array['CRD-1.A'],
    'beginner',
    'ORIGINAL',
    'draft',
    1,
    '17000000-0000-0000-0000-000000000001'
  ),
  (
    '17700000-0000-0000-0000-000000000003',
    '17400000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    '17500000-0000-0000-0000-000000000001',
    '17600000-0000-0000-0000-000000000003',
    'review-question',
    'Review prompt?',
    '[{"id":"a","text":"One"},{"id":"b","text":"Two"}]'::jsonb,
    '{"correct":"a"}'::jsonb,
    'Review explanation.',
    'multiple_choice',
    array['CRD-1.A'],
    'beginner',
    'ORIGINAL',
    'review',
    1,
    '17000000-0000-0000-0000-000000000001'
  ),
  (
    '17700000-0000-0000-0000-000000000004',
    '17400000-0000-0000-0000-000000000001',
    'learn-iso-ap-csp',
    '17500000-0000-0000-0000-000000000001',
    '17600000-0000-0000-0000-000000000004',
    'approved-question',
    'Approved prompt?',
    '[{"id":"a","text":"One"},{"id":"b","text":"Two"}]'::jsonb,
    '{"correct":"a"}'::jsonb,
    'Approved explanation.',
    'multiple_choice',
    array['CRD-1.A'],
    'beginner',
    'ORIGINAL',
    'approved',
    1,
    '17000000-0000-0000-0000-000000000001'
  );

insert into public.learning_attempts (
  id, user_id, question_id, course_id, response, is_correct
)
values (
  '17800000-0000-0000-0000-000000000001',
  '17000000-0000-0000-0000-000000000002',
  '17700000-0000-0000-0000-000000000001',
  '17400000-0000-0000-0000-000000000001',
  '{"choice":"a"}'::jsonb,
  true
);

insert into public.school_course_features (
  id, school_id, course_id, created_by
)
values
  (
    '17900000-0000-0000-0000-000000000001',
    '17100000-0000-0000-0000-000000000001',
    '17400000-0000-0000-0000-000000000001',
    '17000000-0000-0000-0000-000000000004'
  ),
  (
    '17900000-0000-0000-0000-000000000002',
    '17100000-0000-0000-0000-000000000002',
    '17400000-0000-0000-0000-000000000001',
    '17000000-0000-0000-0000-000000000005'
  );

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.learning_lessons
    where id = '17600000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'ALLOW: student can SELECT published learning_lessons'
);
select results_eq(
  $$select count(*)::bigint from public.learning_lessons
    where id = '17600000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: student cannot SELECT draft learning_lessons'
);
select results_eq(
  $$select count(*)::bigint from public.learning_lessons
    where id = '17600000-0000-0000-0000-000000000003'$$,
  array[0::bigint],
  'DENY: student cannot SELECT review learning_lessons'
);
select results_eq(
  $$select count(*)::bigint from public.learning_lessons
    where id = '17600000-0000-0000-0000-000000000004'$$,
  array[0::bigint],
  'DENY: student cannot SELECT approved (unpublished) learning_lessons'
);
select results_eq(
  $$select count(*)::bigint from public.learning_questions_student
    where id = '17700000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'ALLOW: student can SELECT published questions via student view'
);
select results_eq(
  $$select count(*)::bigint from public.learning_questions_student
    where id in (
      '17700000-0000-0000-0000-000000000002',
      '17700000-0000-0000-0000-000000000003',
      '17700000-0000-0000-0000-000000000004'
    )$$,
  array[0::bigint],
  'DENY: student cannot SELECT unpublished questions via student view'
);
select results_eq(
  $$select count(*)::bigint from public.learning_questions
    where answer_key is not null$$,
  array[0::bigint],
  'DENY: student cannot SELECT answer_key from learning_questions'
);
select results_eq(
  $$select count(*)::bigint from public.learning_attempts
    where id = '17800000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'ALLOW: student A can SELECT own learning_attempts'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.learning_attempts
    where user_id = '17000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: student B cannot SELECT student A learning_attempts'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000006","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.learning_attempts
    where user_id = '17000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: club officer cannot SELECT another student learning_attempts'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000004","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.school_course_features
    where id = '17900000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'ALLOW: School A admin can read School A course features'
);
select results_eq(
  $$select count(*)::bigint from public.school_course_features
    where id = '17900000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'DENY: School A admin cannot read School B course features'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$update public.stem_courses
    set status = 'review'
    where id = '17400000-0000-0000-0000-000000000002';
    update public.stem_courses
    set status = 'approved'
    where id = '17400000-0000-0000-0000-000000000002';
    update public.stem_courses
    set status = 'published'
    where id = '17400000-0000-0000-0000-000000000002'$$,
  'ALLOW: platform admin can publish a course after review and approval'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"17000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select results_eq(
  $$with changed as (
      update public.stem_courses
      set status = 'published'
      where id = '17400000-0000-0000-0000-000000000001'
        and status = 'published'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'DENY: student cannot publish or rewrite course status'
);

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);

select results_eq(
  $$select count(*)::bigint from public.learning_lessons$$,
  array[0::bigint],
  'DENY: anonymous users cannot read learning_lessons'
);
select results_eq(
  $$select count(*)::bigint from public.learning_questions$$,
  array[0::bigint],
  'DENY: anonymous users cannot read learning_questions'
);
select results_eq(
  $$select count(*)::bigint from public.learning_attempts$$,
  array[0::bigint],
  'DENY: anonymous users cannot read learning_attempts'
);
select results_eq(
  $$select count(*)::bigint from public.school_course_features$$,
  array[0::bigint],
  'DENY: anonymous users cannot read school_course_features'
);
select results_eq(
  $$select count(*)::bigint from public.learning_question_versions$$,
  array[0::bigint],
  'DENY: anonymous users cannot read learning_question_versions'
);
select results_eq(
  $$select count(*)::bigint from public.learning_review_events$$,
  array[0::bigint],
  'DENY: anonymous users cannot read learning_review_events'
);

select * from finish();
rollback;
