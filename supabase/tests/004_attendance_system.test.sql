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

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    'b0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'att-officer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Officer","last_initial":"A","age_band":"adult","display_name":"Officer A"}',
    now(), now()
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'att-member@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Member","last_initial":"B","age_band":"age_13_17","display_name":"Member B"}',
    now(), now()
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'att-outsider@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Outsider","last_initial":"C","age_band":"adult","display_name":"Outsider C"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values (
  'b1000000-0000-0000-0000-000000000001',
  'Attendance High',
  'attendance-high',
  'high',
  'San Jose'
);

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = 'b1000000-0000-0000-0000-000000000001'
where user_id in (
  'b0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000003'
);

insert into public.user_school_memberships (
  user_id, school_id, role, status, joined_at
)
values
  (
    'b0000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  );

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'b2000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'Attendance Club',
  'attendance-club',
  'Private attendance club',
  'Show up together',
  'STEM',
  'private',
  'b0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values
  (
    'b3000000-0000-0000-0000-000000000001',
    'b2000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'president',
    'active',
    '2026-2027',
    now()
  ),
  (
    'b3000000-0000-0000-0000-000000000002',
    'b2000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    'member',
    'active',
    '2026-2027',
    now()
  );

insert into public.attendance_sessions (
  id, club_id, title, starts_at, created_by, check_in_enabled
)
values (
  'b4000000-0000-0000-0000-000000000001',
  'b2000000-0000-0000-0000-000000000001',
  'Kickoff',
  now(),
  'b0000000-0000-0000-0000-000000000001',
  true
);

insert into public.attendance_records (
  id, session_id, membership_id, status, recorded_by
)
values (
  'b5000000-0000-0000-0000-000000000001',
  'b4000000-0000-0000-0000-000000000001',
  'b3000000-0000-0000-0000-000000000002',
  'absent',
  'b0000000-0000-0000-0000-000000000001'
);

select throws_ok(
  $$insert into public.attendance_records (
      session_id, membership_id, status, recorded_by
    ) values (
      'b4000000-0000-0000-0000-000000000001',
      'b3000000-0000-0000-0000-000000000002',
      'present',
      'b0000000-0000-0000-0000-000000000001'
    )$$,
  '23505',
  null,
  'duplicate session/membership attendance is rejected'
);

select lives_ok(
  $$insert into public.attendance_records (
      session_id, membership_id, status, recorded_by
    ) values (
      'b4000000-0000-0000-0000-000000000001',
      'b3000000-0000-0000-0000-000000000002',
      'present',
      'b0000000-0000-0000-0000-000000000001'
    )
    on conflict (session_id, membership_id) do update
      set status = excluded.status$$,
  'upsert updates the same attendance row instead of duplicating'
);

select results_eq(
  $$select count(*)::bigint from public.attendance_records
    where session_id = 'b4000000-0000-0000-0000-000000000001'
      and membership_id = 'b3000000-0000-0000-0000-000000000002'$$,
  array[1::bigint],
  'only one attendance record exists after upsert'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"b0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select results_eq(
  $$with changed as (
      update public.attendance_records
      set status = 'present'
      where id = 'b5000000-0000-0000-0000-000000000001'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'members cannot edit their attendance status'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"b0000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select results_eq(
  $$with changed as (
      update public.attendance_records
      set status = 'present'
      where id = 'b5000000-0000-0000-0000-000000000001'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'unrelated users cannot edit club attendance'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"b0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$update public.attendance_records
    set status = 'excused', correction_note = 'Family emergency'
    where id = 'b5000000-0000-0000-0000-000000000001'$$,
  'officer can correct attendance'
);

select results_eq(
  $$select previous_status::text, status::text
    from public.attendance_records
    where id = 'b5000000-0000-0000-0000-000000000001'$$,
  $$values ('present'::text, 'excused'::text)$$,
  'correction stores previous status and new status'
);

select results_eq(
  $$select count(*)::bigint from public.audit_logs
    where action = 'attendance_record.correct'
      and entity_id = 'b5000000-0000-0000-0000-000000000001'
      and metadata->>'to_status' = 'excused'$$,
  array[1::bigint],
  'correction writes an audit log entry'
);

select ok(
  (
    select length(
      public.issue_attendance_check_in_token(
        'b4000000-0000-0000-0000-000000000001',
        120
      )
    ) >= 32
  ),
  'officer can issue a short-lived check-in token'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"b0000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select throws_ok(
  $$select public.redeem_attendance_check_in(
      encode(extensions.gen_random_bytes(32), 'hex')
    )$$,
  'P0002',
  null,
  'redeeming an unknown token fails'
);

select * from finish();
rollback;
