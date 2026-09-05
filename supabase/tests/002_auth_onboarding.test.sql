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
select plan(14);

select has_table(
  'public',
  'account_onboarding',
  'account onboarding state is persisted'
);
select hasnt_column(
  'public',
  'profiles',
  'email',
  'profiles never persist an email address'
);
select is(
  public.restrict_under_13_self_signup(
    '{"user":{"app_metadata":{"provider":"google"},"user_metadata":{}}}'::jsonb
  ),
  '{}'::jsonb,
  'OAuth identities may proceed to governed profile completion'
);
select throws_ok(
  $$select public.restrict_under_13_self_signup(
      '{"user":{"app_metadata":{"provider":"email"},"user_metadata":{}}}'::jsonb
    )$$,
  'P0001',
  'An age band is required for account governance',
  'email signup cannot omit account governance'
);

insert into public.schools (id, name, slug, level, city)
values (
  '81000000-0000-0000-0000-000000000001',
  'Onboarding School',
  'onboarding-school',
  'middle',
  'San Jose'
);

select throws_ok(
  $$insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      '80000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'minor-unmanaged@example.test',
      crypt('test-password', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}',
      '{"first_name":"Minor","last_initial":"U","age_band":"under_13","school_id":"81000000-0000-0000-0000-000000000001"}',
      now(), now()
    )$$,
  'P0001',
  'Under-13 accounts require managed onboarding',
  'unmanaged under-13 account creation is rejected'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values (
  '80000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'student@example.test',
  crypt('test-password', gen_salt('bf')),
  null,
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Student","last_initial":"S","age_band":"age_13_17","school_id":"81000000-0000-0000-0000-000000000001","grade_band":"grade_6_8"}',
  now(),
  now()
);
select results_eq(
  $$select status::text from public.account_onboarding
    where user_id = '80000000-0000-0000-0000-000000000002'$$,
  array['pending_email'],
  'new self-service accounts await email verification'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"80000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);
select throws_ok(
  $$select public.complete_verified_onboarding()$$,
  '42501',
  'Email verification required',
  'unverified users cannot activate themselves'
);

reset role;
set local role postgres;
update auth.users
set email_confirmed_at = now()
where id = '80000000-0000-0000-0000-000000000002';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"80000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);
select is(
  public.complete_verified_onboarding()::text,
  'active',
  'verified eligible users can complete onboarding'
);
select ok(
  (
    select onboarding_completed_at is not null
    from public.profiles
    where id = '80000000-0000-0000-0000-000000000002'
  ),
  'activation records profile completion'
);
select throws_ok(
  $$update public.profiles
    set age_band = 'adult'
    where id = '80000000-0000-0000-0000-000000000002'$$,
  '42501',
  'Age band requires an administrative governance change',
  'users cannot change their own age governance band'
);
select throws_ok(
  $$insert into public.account_onboarding (
      user_id, status, activation_method, activated_at
    ) values (
      '80000000-0000-0000-0000-000000000002',
      'active', 'self_service', now()
    )$$,
  '42501',
  null,
  'users cannot directly create onboarding state'
);

reset role;
set local role postgres;
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values (
  '80000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'minor-managed@example.test',
  crypt('test-password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"],"managed_onboarding":true,"activation_method":"school_managed"}',
  '{"first_name":"Minor","last_initial":"M","age_band":"under_13","school_id":"81000000-0000-0000-0000-000000000001","grade_band":"grade_6_8"}',
  now(),
  now()
);
insert into public.account_onboarding_internal_notes (
  onboarding_user_id,
  author_id,
  note
)
values (
  '80000000-0000-0000-0000-000000000003',
  '80000000-0000-0000-0000-000000000002',
  'Private institutional review note'
);

select results_eq(
  $$select status::text from public.account_onboarding
    where user_id = '80000000-0000-0000-0000-000000000003'$$,
  array['pending_school'],
  'managed under-13 accounts await school activation'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"80000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);
select is(
  public.complete_verified_onboarding()::text,
  'pending_school',
  'email verification cannot bypass managed-minor activation'
);
select results_eq(
  $$select count(*)::bigint
    from public.account_onboarding_internal_notes
    where onboarding_user_id = '80000000-0000-0000-0000-000000000003'$$,
  array[0::bigint],
  'applicants cannot read institutional onboarding notes'
);

select * from finish();
rollback;
