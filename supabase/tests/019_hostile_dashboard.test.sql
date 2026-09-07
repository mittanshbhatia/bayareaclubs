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

select plan(13);

-- Optional dashboard/learn tables (Agent 02/09). Missing = documented GAP.
-- Present without RLS or with USING (true) = FAIL.
create function pg_temp.table_rls_or_gap(reg text)
returns boolean
language plpgsql
as $$
declare
  enabled boolean;
begin
  if to_regclass(reg) is null then
    return true;
  end if;
  select c.relrowsecurity into enabled
  from pg_class c
  where c.oid = to_regclass(reg);
  return coalesce(enabled, false);
end;
$$;

create function pg_temp.no_wide_open_select_or_gap(reg text)
returns boolean
language plpgsql
as $$
declare
  wide integer;
begin
  if to_regclass(reg) is null then
    return true;
  end if;
  select count(*) into wide
  from pg_policy policy
  join pg_class rel on rel.oid = policy.polrelid
  where rel.oid = to_regclass(reg)
    and policy.polcmd in ('*', 'r')
    and pg_get_expr(policy.polqual, policy.polrelid) in ('true', '(true)');
  return wide = 0;
end;
$$;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '19000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'hostile-student-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Student A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '19000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'hostile-student-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Student B","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    '19000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'hostile-admin-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Admin A","age_band":"adult"}',
    now(), now()
  ),
  (
    '19000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'hostile-admin-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Admin B","age_band":"adult"}',
    now(), now()
  ),
  (
    '19000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'hostile-reviewer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Reviewer","age_band":"adult"}',
    now(), now()
  ),
  (
    '19000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'hostile-platform@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Hostile Platform","age_band":"adult"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values
  (
    '19100000-0000-0000-0000-000000000001',
    'Hostile High A',
    'hostile-high-a',
    'high',
    'Oakland'
  ),
  (
    '19100000-0000-0000-0000-000000000002',
    'Hostile High B',
    'hostile-high-b',
    'high',
    'San Jose'
  );

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '19100000-0000-0000-0000-000000000001'
where user_id in (
  '19000000-0000-0000-0000-000000000001',
  '19000000-0000-0000-0000-000000000002',
  '19000000-0000-0000-0000-000000000003',
  '19000000-0000-0000-0000-000000000005',
  '19000000-0000-0000-0000-000000000006'
);

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = '19100000-0000-0000-0000-000000000002'
where user_id = '19000000-0000-0000-0000-000000000004';

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  (
    '19000000-0000-0000-0000-000000000001',
    '19100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '19000000-0000-0000-0000-000000000002',
    '19100000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '19000000-0000-0000-0000-000000000003',
    '19100000-0000-0000-0000-000000000001',
    'school_admin',
    'active',
    now()
  ),
  (
    '19000000-0000-0000-0000-000000000004',
    '19100000-0000-0000-0000-000000000002',
    'school_admin',
    'active',
    now()
  );

insert into public.platform_role_assignments (user_id, role, assigned_by)
values
  (
    '19000000-0000-0000-0000-000000000005',
    'committee_reviewer',
    '19000000-0000-0000-0000-000000000006'
  ),
  (
    '19000000-0000-0000-0000-000000000006',
    'platform_admin',
    '19000000-0000-0000-0000-000000000006'
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values
  (
    '19200000-0000-0000-0000-000000000001',
    '19100000-0000-0000-0000-000000000001',
    'Hostile Club A',
    'hostile-club-a',
    'Private club A',
    'Mission A',
    'STEM',
    'private',
    '19000000-0000-0000-0000-000000000003'
  ),
  (
    '19200000-0000-0000-0000-000000000002',
    '19100000-0000-0000-0000-000000000002',
    'Hostile Club B',
    'hostile-club-b',
    'Private club B',
    'Mission B',
    'STEM',
    'private',
    '19000000-0000-0000-0000-000000000004'
  );

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  (
    '19300000-0000-0000-0000-000000000001',
    '19200000-0000-0000-0000-000000000001',
    '19000000-0000-0000-0000-000000000001',
    'member',
    'active',
    '2026-2027',
    now()
  ),
  (
    '19300000-0000-0000-0000-000000000002',
    '19200000-0000-0000-0000-000000000002',
    '19000000-0000-0000-0000-000000000004',
    'club_admin',
    'active',
    '2026-2027',
    now()
  );

insert into public.stem_courses (
  id, slug, title, description, discipline, grade_bands, difficulty, format,
  estimated_minutes, provider_name, source_url, license_name, license_url,
  is_free, status, last_verified_at, created_by
)
values
  (
    '19400000-0000-0000-0000-000000000001',
    'hostile-draft-track',
    'Hostile Draft Track',
    'Unpublished draft must stay private.',
    'computer_science',
    array['age_13_17'::public.age_band],
    'beginner',
    'reading',
    60,
    'BayAreaClubs',
    'https://example.test/draft',
    'MIT License',
    'https://example.test/license',
    true,
    'draft',
    current_date,
    '19000000-0000-0000-0000-000000000006'
  ),
  (
    '19400000-0000-0000-0000-000000000002',
    'hostile-published-track',
    'Hostile Published Track',
    'Published free course for progress isolation.',
    'computer_science',
    array['age_13_17'::public.age_band],
    'beginner',
    'reading',
    60,
    'BayAreaClubs',
    'https://example.test/published',
    'MIT License',
    'https://example.test/license',
    true,
    'published',
    current_date,
    '19000000-0000-0000-0000-000000000006'
  );

do $$
begin
  if exists (
    select 1
    from pg_enum enum_label
    join pg_type enum_type on enum_type.oid = enum_label.enumtypid
    join pg_namespace enum_ns on enum_ns.oid = enum_type.typnamespace
    where enum_ns.nspname = 'public'
      and enum_type.typname = 'publication_status'
      and enum_label.enumlabel = 'approved'
  ) then
    insert into public.stem_courses (
      id, slug, title, description, discipline, grade_bands, difficulty, format,
      estimated_minutes, provider_name, source_url, license_name, license_url,
      is_free, status, last_verified_at, created_by
    ) values (
      '19400000-0000-0000-0000-000000000003',
      'hostile-approved-track',
      'Hostile Approved Track',
      'Approved is not published.',
      'computer_science',
      array['age_13_17'::public.age_band],
      'beginner',
      'reading',
      60,
      'BayAreaClubs',
      'https://example.test/approved',
      'MIT License',
      'https://example.test/license',
      true,
      'approved',
      current_date,
      '19000000-0000-0000-0000-000000000006'
    );
  end if;
end;
$$;

insert into public.stem_course_modules (
  id, course_id, position, title, estimated_minutes, is_published
)
values (
  '19500000-0000-0000-0000-000000000001',
  '19400000-0000-0000-0000-000000000002',
  0,
  'Unit 1',
  30,
  true
);

insert into public.stem_resources (
  id, module_id, position, resource_type, title, external_url,
  estimated_minutes, is_published
)
values (
  '19600000-0000-0000-0000-000000000001',
  '19500000-0000-0000-0000-000000000001',
  0,
  'external_link',
  'Lesson',
  'https://example.test/lesson',
  15,
  true
);

insert into public.course_subscriptions (id, course_id, user_id, status)
values (
  '19800000-0000-0000-0000-000000000001',
  '19400000-0000-0000-0000-000000000002',
  '19000000-0000-0000-0000-000000000001',
  'active'
);

insert into public.course_progress (
  id, subscription_id, resource_id, completed, progress_percent, started_at
)
values (
  '19900000-0000-0000-0000-000000000001',
  '19800000-0000-0000-0000-000000000001',
  '19600000-0000-0000-0000-000000000001',
  false,
  25,
  now()
);

insert into public.media_assets (
  id, school_id, club_id, uploader_id, storage_bucket, storage_path,
  media_type, size_bytes, mime_type, title, visibility, consent_required,
  consent_state
)
values (
  '19700000-0000-0000-0000-000000000001',
  '19100000-0000-0000-0000-000000000001',
  null,
  '19000000-0000-0000-0000-000000000006',
  'course-assets',
  '19000000-0000-0000-0000-000000000006/guessed/secret-lesson.pdf',
  'document',
  2048,
  'application/pdf',
  'Unpublished course asset',
  'private',
  false,
  'not_required'
);

-- AM-03 student is denied school command-center roles
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"19000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select is(
  public.has_school_role(
    '19100000-0000-0000-0000-000000000001',
    array['school_admin', 'school_advisor', 'staff']::public.school_role[],
    '19000000-0000-0000-0000-000000000001'
  ),
  false,
  'AM-03 student denied school command-center roles'
);

-- AM-01 Club A member cannot read private Club B
select results_eq(
  $$select count(*)::bigint from public.clubs
    where id = '19200000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'AM-01 Club A member cannot read private Club B'
);

-- AM-06 student cannot select unpublished draft course
select results_eq(
  $$select count(*)::bigint from public.stem_courses
    where id = '19400000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'AM-06 student cannot select draft stem_courses'
);

-- AM-10 unpublished course-assets are not viewable by path/metadata guess
select ok(
  not public.can_view_media_asset(
    '19700000-0000-0000-0000-000000000001',
    '19000000-0000-0000-0000-000000000001'
  ),
  'AM-10 can_view_media_asset denies unpublished course-assets'
);

select results_eq(
  $$select count(*)::bigint from public.media_assets
    where storage_path = '19000000-0000-0000-0000-000000000006/guessed/secret-lesson.pdf'$$,
  array[0::bigint],
  'AM-10 student cannot select unpublished course-asset metadata by guessed path'
);

-- AM-04 forged JWT / app_metadata role is not authority
select set_config(
  'request.jwt.claims',
  '{"sub":"19000000-0000-0000-0000-000000000001","role":"authenticated","app_metadata":{"role":"school_admin","school_id":"19100000-0000-0000-0000-000000000001"},"user_metadata":{"role":"platform_admin"}}',
  true
);

select is(
  public.has_school_role(
    '19100000-0000-0000-0000-000000000001',
    array['school_admin']::public.school_role[],
    '19000000-0000-0000-0000-000000000001'
  ),
  false,
  'AM-04 forged JWT role claim does not grant school_admin'
);

-- AM-02 School A admin cannot administer School B
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"19000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select is(
  public.has_school_role(
    '19100000-0000-0000-0000-000000000002',
    array['school_admin', 'school_advisor', 'staff']::public.school_role[],
    '19000000-0000-0000-0000-000000000003'
  ),
  false,
  'AM-02 School A admin denied School B command roles'
);

-- AM-07 other student's progress
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"19000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.course_progress
    where id = '19900000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'AM-07 student B cannot read student A course_progress'
);

-- AM-12 committee reviewer is not platform context
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"19000000-0000-0000-0000-000000000005","role":"authenticated"}',
  true
);

select is(
  public.is_platform_admin(),
  false,
  'AM-12 committee reviewer is_platform_admin is false'
);

-- AM-06 anon cannot see draft (or approved) via published catalog
reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);

select results_eq(
  $$select count(*)::bigint from public.published_stem_courses
    where id = '19400000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'AM-06 anon cannot see draft via published_stem_courses'
);

select results_eq(
  $$select count(*)::bigint from public.published_stem_courses
    where id = '19400000-0000-0000-0000-000000000003'$$,
  array[0::bigint],
  'AM-06 approved (or missing row) is not learner-visible'
);

reset role;
set local role postgres;

select ok(
  pg_temp.table_rls_or_gap('public.learning_questions')
  and pg_temp.table_rls_or_gap('public.learning_attempts')
  and pg_temp.table_rls_or_gap('public.learning_lessons')
  and pg_temp.table_rls_or_gap('public.dashboard_module_configs')
  and pg_temp.table_rls_or_gap('public.dashboard_home_content')
  and pg_temp.no_wide_open_select_or_gap('public.learning_questions')
  and pg_temp.no_wide_open_select_or_gap('public.learning_attempts')
  and pg_temp.no_wide_open_select_or_gap('public.dashboard_module_configs'),
  'AM-05/07/08 optional dashboard/learn tables have RLS and no wide-open SELECT'
);

select ok(
  pg_temp.no_wide_open_select_or_gap('public.learning_questions')
  and pg_temp.table_rls_or_gap('public.learning_question_versions'),
  'AM-08 answer-key tables (if shipped) are RLS-protected'
);

select * from finish();
rollback;
