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

select plan(7);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'stem-admin@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Stem Admin","age_band":"adult"}',
  now(), now()
),
(
  'a0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'stem-member@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Stem Member","age_band":"age_13_17"}',
  now(), now()
);

insert into public.schools (id, name, slug, level, city)
values (
  'a1000000-0000-0000-0000-000000000001',
  'Stem High',
  'stem-high',
  'high',
  'Oakland'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'a1000000-0000-0000-0000-000000000001'
where user_id in (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002'
);

insert into public.platform_role_assignments (user_id, role, assigned_by)
values (
  'a0000000-0000-0000-0000-000000000001',
  'platform_admin',
  'a0000000-0000-0000-0000-000000000001'
);

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'a2000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Robotics Club',
  'robotics-club',
  'Build robots',
  'Mission',
  'STEM',
  'private',
  'a0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
(
  'a3000000-0000-0000-0000-000000000001',
  'a2000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'president',
  'active',
  '2026-2027',
  now()
),
(
  'a3000000-0000-0000-0000-000000000002',
  'a2000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'member',
  'active',
  '2026-2027',
  now()
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$insert into public.stem_courses (
      id, slug, title, description, discipline, grade_bands, difficulty, format,
      estimated_minutes, provider_name, source_url, license_name, license_url,
      is_free, status, last_verified_at, created_by
    ) values (
      'a4000000-0000-0000-0000-000000000001',
      'usaco-bronze-track',
      'USACO Bronze Track',
      'Free competitive programming guide.',
      'competitive_programming',
      array['age_13_17'::public.age_band],
      'intermediate',
      'reading',
      1200,
      'USACO Guide',
      'https://usaco.guide/bronze/',
      'MIT License',
      'https://github.com/cpinitiative/usaco-guide/blob/master/LICENSE',
      true,
      'published',
      current_date,
      'a0000000-0000-0000-0000-000000000001'
    )$$,
  'admin can publish a free STEM course'
);

select lives_ok(
  $$insert into public.stem_course_modules (
      id, course_id, position, title, estimated_minutes, is_published
    ) values (
      'a5000000-0000-0000-0000-000000000001',
      'a4000000-0000-0000-0000-000000000001',
      0,
      'Getting started',
      60,
      true
    )$$,
  'admin can add a published module'
);

select lives_ok(
  $$insert into public.stem_resources (
      id, module_id, position, resource_type, title, external_url,
      estimated_minutes, is_published
    ) values (
      'a6000000-0000-0000-0000-000000000001',
      'a5000000-0000-0000-0000-000000000001',
      0,
      'external_link',
      'Open guide',
      'https://usaco.guide/bronze/',
      30,
      true
    )$$,
  'admin can add an external lesson link'
);

select lives_ok(
  $$insert into public.club_resource_recommendations (
      club_id, course_id, recommended_by, note
    ) values (
      'a2000000-0000-0000-0000-000000000001',
      'a4000000-0000-0000-0000-000000000001',
      'a0000000-0000-0000-0000-000000000001',
      'Great for Fall Learning Track'
    )$$,
  'officer can recommend without forcing enrollment'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select lives_ok(
  $$insert into public.course_subscriptions (course_id, user_id, status)
    values (
      'a4000000-0000-0000-0000-000000000001',
      'a0000000-0000-0000-0000-000000000002',
      'active'
    )$$,
  'member can subscribe to a published free course'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select results_eq(
  $$select subscription_count from public.stem_course_metrics
    where course_id = 'a4000000-0000-0000-0000-000000000001'$$,
  array[1::integer],
  'subscription engagement increments without academic scoring'
);

reset role;
set local role anon;

select results_eq(
  $$select title from public.published_stem_courses
    where id = 'a4000000-0000-0000-0000-000000000001'$$,
  array['USACO Bronze Track'::text],
  'anon can browse published free STEM catalog metadata'
);

select * from finish();
rollback;
