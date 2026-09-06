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

select plan(8);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    'c0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'comms-officer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Comms Officer","age_band":"adult"}',
    now(), now()
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'comms-member@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Comms Member","age_band":"age_13_17"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values (
  'c1000000-0000-0000-0000-000000000001',
  'Comms High',
  'comms-high',
  'high',
  'Fremont'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'c1000000-0000-0000-0000-000000000001'
where user_id in (
  'c0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002'
);

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  ('c0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'student', 'active', now()),
  ('c0000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'student', 'active', now());

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'c2000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Comms Club',
  'comms-club',
  'Comms',
  'Mission',
  'STEM',
  'private',
  'c0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  ('c3000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'president', 'active', '2026-2027', now()),
  ('c3000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'member', 'active', '2026-2027', now());

select is(
  public.count_email_audience(
    'c2000000-0000-0000-0000-000000000001',
    'all_members',
    '{}'::jsonb,
    'announcement'
  ),
  2,
  'all_members audience counts active memberships'
);

select is(
  public.count_email_audience(
    'c2000000-0000-0000-0000-000000000001',
    'officers',
    '{}'::jsonb,
    'announcement'
  ),
  1,
  'officers audience excludes plain members'
);

insert into public.user_email_preferences (user_id, category, opted_in, unsubscribed_at)
values (
  'c0000000-0000-0000-0000-000000000002',
  'announcement',
  false,
  statement_timestamp()
);

select is(
  public.count_email_audience(
    'c2000000-0000-0000-0000-000000000001',
    'all_members',
    '{}'::jsonb,
    'announcement'
  ),
  1,
  'opted-out members are excluded from announcement counts'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"c0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

insert into public.email_campaigns (
  id, school_id, club_id, created_by, name, subject, message_body,
  campaign_kind, audience_type, preference_category, status, idempotency_key
)
values (
  'c4000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Kickoff note',
  'Club kickoff',
  'Welcome to the season.',
  'announcement',
  'all_members',
  'announcement',
  'draft',
  'campaign-test-1'
);

select lives_ok(
  $$select public.officer_enqueue_campaign_send(
      'c4000000-0000-0000-0000-000000000001',
      true
    )$$,
  'officer can enqueue campaign send into the outbox'
);

select results_eq(
  $$select status::text from public.email_campaigns
    where id = 'c4000000-0000-0000-0000-000000000001'$$,
  array['sending'::text],
  'enqueue moves draft campaign to sending'
);

select results_eq(
  $$select count(*)::bigint from public.communication_jobs
    where campaign_id = 'c4000000-0000-0000-0000-000000000001'
      and job_type = 'prepare_campaign_recipients'$$,
  array[1::bigint],
  'prepare job is durable in the outbox'
);

-- Idempotent enqueue
select lives_ok(
  $$select public.officer_enqueue_campaign_send(
      'c4000000-0000-0000-0000-000000000001',
      true
    )$$,
  'second enqueue is accepted without creating duplicate prepare intent path'
);

select results_eq(
  $$select count(*)::bigint from public.communication_jobs
    where idempotency_key = 'prepare:c4000000-0000-0000-0000-000000000001:campaign-test-1'$$,
  array[1::bigint],
  'prepare job idempotency key is unique'
);

select * from finish();
rollback;
