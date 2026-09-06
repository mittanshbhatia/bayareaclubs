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

select plan(6);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values (
  'd0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'publish-officer@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Publish Officer","age_band":"adult"}',
  now(), now()
);

insert into public.schools (id, name, slug, level, city)
values (
  'd1000000-0000-0000-0000-000000000001',
  'Publish High',
  'publish-high',
  'high',
  'Berkeley'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'd1000000-0000-0000-0000-000000000001'
where user_id = 'd0000000-0000-0000-0000-000000000001';

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values (
  'd0000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'student',
  'active',
  now()
);

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'd2000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'Publish Club',
  'publish-club',
  'Publish',
  'Mission',
  'STEM',
  'private',
  'd0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values (
  'd3000000-0000-0000-0000-000000000001',
  'd2000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'president',
  'active',
  '2026-2027',
  date_trunc('month', now())
);

insert into public.events (
  id, school_id, club_id, event_type, status, title, description,
  starts_at, ends_at, format, location_name, organizer_id
)
values (
  'd4000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'd2000000-0000-0000-0000-000000000001',
  'club_meeting',
  'published',
  'September meeting',
  'Agenda',
  date_trunc('month', now()) + interval '2 days',
  date_trunc('month', now()) + interval '2 days 1 hour',
  'in_person',
  'Room 1',
  'd0000000-0000-0000-0000-000000000001'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"d0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select ok(
  (public.club_month_facts(
    'd2000000-0000-0000-0000-000000000001',
    date_trunc('month', now())::date,
    (date_trunc('month', now()) + interval '1 month - 1 day')::date
  ) ->> 'meetings_count')::integer >= 1,
  'month facts report recorded meetings only'
);

select lives_ok(
  $$insert into public.club_highlights (
      id, club_id, title, summary, body, source_type, occurred_on,
      visibility, status, created_by, published_at, related_event_id
    ) values (
      'd5000000-0000-0000-0000-000000000001',
      'd2000000-0000-0000-0000-000000000001',
      'Meeting highlight',
      'Great turnout',
      'Details',
      'event',
      current_date,
      'public',
      'published',
      'd0000000-0000-0000-0000-000000000001',
      now(),
      'd4000000-0000-0000-0000-000000000001'
    )$$,
  'officer can create a published highlight'
);

select lives_ok(
  $$insert into public.newsletters (
      id, school_id, club_id, title, status, visibility, created_by, published_at
    ) values (
      'd6000000-0000-0000-0000-000000000001',
      'd1000000-0000-0000-0000-000000000001',
      'd2000000-0000-0000-0000-000000000001',
      'September issue',
      'published',
      'public',
      'd0000000-0000-0000-0000-000000000001',
      now()
    )$$,
  'officer can publish a public newsletter'
);

select lives_ok(
  $$insert into public.newsletter_blocks (
      newsletter_id, position, block_type, content
    ) values (
      'd6000000-0000-0000-0000-000000000001',
      0,
      'hero',
      '{"title":"Hello September"}'::jsonb
    )$$,
  'structured newsletter blocks persist without HTML blobs'
);

reset role;
set local role anon;

select results_eq(
  $$select title from public.published_newsletters
    where id = 'd6000000-0000-0000-0000-000000000001'$$,
  array['September issue'::text],
  'anon can read published public newsletter metadata'
);

select results_eq(
  $$select block_type::text from public.published_newsletter_blocks
    where newsletter_id = 'd6000000-0000-0000-0000-000000000001'$$,
  array['hero'::text],
  'anon can read published public newsletter blocks'
);

select * from finish();
rollback;
