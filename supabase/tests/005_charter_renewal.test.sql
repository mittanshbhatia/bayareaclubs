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
    'authenticated', 'authenticated', 'charter-officer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Officer","last_initial":"C","age_band":"adult","display_name":"Officer C"}',
    now(), now()
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'charter-reviewer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Reviewer","last_initial":"C","age_band":"adult","display_name":"Reviewer C"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values (
  'c1000000-0000-0000-0000-000000000001',
  'Charter High',
  'charter-high',
  'high',
  'San Jose'
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
  (
    'c0000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'student', 'active', now()
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'school_admin', 'active', now()
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'c2000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Charter Club',
  'charter-club',
  'A club for charter tests',
  'Mission',
  'STEM',
  'private',
  'c0000000-0000-0000-0000-000000000002'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values (
  'c3000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'president',
  'active',
  '2026-2027',
  now()
);

select results_eq(
  $$select count(*)::bigint from public.charter_section_definitions where is_active$$,
  array[12::bigint],
  'twelve charter section definitions are seeded'
);

insert into public.club_charters (
  id, club_id, school_year, created_by,
  purpose, mission, membership_requirements, officer_structure,
  officer_responsibilities, elections, meeting_cadence, conduct_expectations,
  advisor_information, planned_activities, amendment_process
)
values (
  'c4000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  '2026-2027',
  'c0000000-0000-0000-0000-000000000001',
  'Purpose text that is long enough for submission.',
  'Mission text that is long enough for submission.',
  'Membership requirements that are long enough here.',
  'Leadership structure that is long enough here.',
  'Officer responsibilities that are long enough here.',
  'Election process that is long enough for rules.',
  'Weekly meetings after school.',
  'Conduct expectations that are long enough here.',
  'Advisor oversees meetings.',
  'Planned activities that are long enough here.',
  'Amendments require majority vote.'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"c0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$update public.club_charters
    set status = 'submitted'
    where id = 'c4000000-0000-0000-0000-000000000001'$$,
  'complete charter can be submitted'
);

select results_eq(
  $$select count(*)::bigint from public.club_charter_versions
    where charter_id = 'c4000000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'submission freezes an immutable charter version'
);

select throws_ok(
  $$update public.club_charters
    set purpose = 'Attempted edit after submit'
    where id = 'c4000000-0000-0000-0000-000000000001'$$,
  '23514',
  null,
  'submitted charter content cannot be edited'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"c0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select lives_ok(
  $$insert into public.club_charter_reviews (
      charter_id, reviewer_id, decision, applicant_feedback
    ) values (
      'c4000000-0000-0000-0000-000000000001',
      'c0000000-0000-0000-0000-000000000002',
      'approved',
      'Looks solid for the year.'
    )$$,
  'school reviewer can approve a submitted charter'
);

select results_eq(
  $$select status::text from public.club_charters
    where id = 'c4000000-0000-0000-0000-000000000001'$$,
  array['approved'::text],
  'approval updates charter status'
);

reset role;
set local role postgres;

select ok(
  (
    select public.enqueue_renewal_reminders(statement_timestamp()) >= 0
  ),
  'enqueue_renewal_reminders runs for approved charters'
);

select results_eq(
  $$select count(*)::bigint from public.renewal_reminders
    where club_id = 'c2000000-0000-0000-0000-000000000001'$$,
  array[4::bigint],
  'four reminder kinds are queued for the approved charter year'
);

select * from finish();
rollback;
