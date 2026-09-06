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

select plan(9);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    'e0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'event-officer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Event Officer","age_band":"adult"}',
    now(), now()
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'event-member-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Member A","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'event-member-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Member B","age_band":"age_13_17"}',
    now(), now()
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'event-member-c@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Member C","age_band":"age_13_17"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values (
  'e1000000-0000-0000-0000-000000000001',
  'Event High',
  'event-high',
  'high',
  'San Jose'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'e1000000-0000-0000-0000-000000000001'
where user_id in (
  'e0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000003',
  'e0000000-0000-0000-0000-000000000004'
);

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  ('e0000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'student', 'active', now()),
  ('e0000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'student', 'active', now()),
  ('e0000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'student', 'active', now()),
  ('e0000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001', 'student', 'active', now());

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'e2000000-0000-0000-0000-000000000001',
  'e1000000-0000-0000-0000-000000000001',
  'Event Club',
  'event-club',
  'Events club',
  'Mission',
  'STEM',
  'private',
  'e0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  ('e3000000-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'president', 'active', '2026-2027', now()),
  ('e3000000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'member', 'active', '2026-2027', now()),
  ('e3000000-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'member', 'active', '2026-2027', now()),
  ('e3000000-0000-0000-0000-000000000004', 'e2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'member', 'active', '2026-2027', now());

insert into public.events (
  id, school_id, club_id, event_type, status, title, description,
  starts_at, ends_at, format, location_name, capacity, waitlist_enabled,
  organizer_id
)
values (
  'e4000000-0000-0000-0000-000000000001',
  'e1000000-0000-0000-0000-000000000001',
  'e2000000-0000-0000-0000-000000000001',
  'workshop',
  'published',
  'Capacity Workshop',
  'A small workshop',
  now() + interval '2 days',
  now() + interval '2 days 2 hours',
  'in_person',
  'Room 12',
  1,
  true,
  'e0000000-0000-0000-0000-000000000001'
);

-- Member A takes the only going seat
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.upsert_event_rsvp(
      'e4000000-0000-0000-0000-000000000001',
      'going'
    )$$,
  'first member can RSVP going within capacity'
);

select results_eq(
  $$select status::text from public.event_rsvps
    where event_id = 'e4000000-0000-0000-0000-000000000001'
      and user_id = 'e0000000-0000-0000-0000-000000000002'$$,
  array['going'::text],
  'first RSVP is going'
);

-- Member B is waitlisted (capacity full)
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.upsert_event_rsvp(
      'e4000000-0000-0000-0000-000000000001',
      'going'
    )$$,
  'second member requesting going is accepted onto waitlist'
);

select results_eq(
  $$select status::text from public.event_rsvps
    where event_id = 'e4000000-0000-0000-0000-000000000001'
      and user_id = 'e0000000-0000-0000-0000-000000000003'$$,
  array['waitlisted'::text],
  'overflow RSVP becomes waitlisted'
);

-- Member C also waitlisted after B (FIFO order)
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000004","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.upsert_event_rsvp(
      'e4000000-0000-0000-0000-000000000001',
      'going'
    )$$,
  'third member also waitlists'
);

-- Member A declines -> promote B (first waitlisted), not C
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.upsert_event_rsvp(
      'e4000000-0000-0000-0000-000000000001',
      'not_going'
    )$$,
  'going member can decline and free a seat'
);

-- Assert as postgres: RLS only lets members see their own RSVP rows
reset role;
set local role postgres;

select results_eq(
  $$select user_id::text, status::text
    from public.event_rsvps
    where event_id = 'e4000000-0000-0000-0000-000000000001'
      and status = 'going'$$,
  $$values (
    'e0000000-0000-0000-0000-000000000003'::text,
    'going'::text
  )$$,
  'waitlist promotion is FIFO: member B is promoted before member C'
);

select results_eq(
  $$select count(*)::bigint from public.event_rsvps
    where event_id = 'e4000000-0000-0000-0000-000000000001'
      and status = 'going'$$,
  array[1::bigint],
  'capacity remains one going after promotion'
);

-- Concurrent overbooking prevention: with capacity 1 and B going, C cannot become going via override without note fails; officer override to going for C should fail at capacity
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select throws_ok(
  $$select public.admin_override_event_rsvp(
      (select id from public.event_rsvps
        where event_id = 'e4000000-0000-0000-0000-000000000001'
          and user_id = 'e0000000-0000-0000-0000-000000000004'),
      'going',
      'Force seat'
    )$$,
  '23514',
  null,
  'admin override cannot overbook capacity'
);

select * from finish();
rollback;
