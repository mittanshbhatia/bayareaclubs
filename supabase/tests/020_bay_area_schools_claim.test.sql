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

select plan(10);

select ok(
  (
    select count(*) >= 200
    from public.schools
    where is_active
  ),
  'Bay Area school directory seeds at least 200 active schools'
);

select ok(
  exists (
    select 1
    from public.schools
    where slug = 'bayareaclubs-demo-high-school'
      and is_active
  ),
  'demo high school remains persisted'
);

select ok(
  exists (
    select 1
    from public.schools
    where slug = 'de-anza-college'
      and level = 'college'
  ),
  'community colleges are persisted'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '21000000-0000-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'claim-student@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Claim","last_initial":"S","age_band":"age_13_17","display_name":"Claim S"}',
    now(), now()
  );

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp()
where user_id = '21000000-0000-4000-8000-000000000001';

insert into public.schools (id, name, slug, level, city, is_active)
values (
  '21100000-0000-4000-8000-000000000001',
  'Claim Test High',
  'claim-test-high',
  'high',
  'Oakland',
  true
), (
  '21100000-0000-4000-8000-000000000002',
  'Inactive Claim High',
  'inactive-claim-high',
  'high',
  'Oakland',
  false
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"21000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.claim_student_school_membership('21100000-0000-4000-8000-000000000001')$$,
  'ALLOW: active student can claim an active school'
);

select is(
  (
    select role
    from public.user_school_memberships
    where user_id = '21000000-0000-4000-8000-000000000001'
      and school_id = '21100000-0000-4000-8000-000000000001'
  ),
  'student'::public.school_role,
  'claim persists a student membership, not a school admin role'
);

select lives_ok(
  $$select public.create_club_idea_draft(
    '21100000-0000-4000-8000-000000000001',
    'existing_club'
  )$$,
  'ALLOW: member can create an existing-club draft after claiming the school'
);

select is(
  (
    select application_kind
    from public.club_ideas
    where submitter_id = '21000000-0000-4000-8000-000000000001'
      and school_id = '21100000-0000-4000-8000-000000000001'
  ),
  'existing_club',
  'draft persists the selected application kind'
);

select throws_ok(
  $$select public.claim_student_school_membership('21100000-0000-4000-8000-000000000002')$$,
  'P0001',
  'School is not available',
  'DENY: inactive schools cannot be claimed'
);

reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);

select throws_ok(
  $$select public.claim_student_school_membership('21100000-0000-4000-8000-000000000001')$$,
  '42501',
  'permission denied for function claim_student_school_membership',
  'DENY: anonymous callers cannot execute school claim'
);

select * from finish();
rollback;
