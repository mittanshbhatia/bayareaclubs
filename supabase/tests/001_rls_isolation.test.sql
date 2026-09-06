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
select plan(25);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin-a@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"School A Admin","age_band":"adult"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'officer-a@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Club A Officer","age_band":"age_13_17"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'member-a@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Club A Member","age_band":"age_13_17"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'officer-b@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Club B Officer","age_band":"age_13_17"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'member-b@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Club B Member","age_band":"age_13_17"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'reviewer@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Committee Reviewer","age_band":"adult"}',
    now(),
    now()
  );

insert into public.schools (id, name, slug, level, city)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'School A',
    'school-a',
    'high',
    'San Jose'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'School B',
    'school-b',
    'high',
    'Oakland'
  );
update public.profiles
set
  primary_school_id = '10000000-0000-0000-0000-000000000001',
  show_school_to_club_members = false
where id = '00000000-0000-0000-0000-000000000002';

insert into public.user_school_memberships (
  user_id,
  school_id,
  role,
  status,
  joined_at
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'school_admin',
    'active',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'student',
    'active',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    'student',
    'active',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    'student',
    'active',
    now()
  );

insert into public.platform_role_assignments (user_id, role)
values (
  '00000000-0000-0000-0000-000000000006',
  'committee_reviewer'
);

insert into public.clubs (
  id,
  school_id,
  name,
  slug,
  description,
  mission,
  category,
  visibility,
  approved_by
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Club A',
    'club-a',
    'Private Club A',
    'Build responsibly',
    'STEM',
    'private',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Club B',
    'club-b',
    'Private Club B',
    'Learn together',
    'STEM',
    'private',
    '00000000-0000-0000-0000-000000000004'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Public Club',
    'public-club',
    'Public description',
    'Share learning',
    'STEM',
    'public',
    '00000000-0000-0000-0000-000000000001'
  );

insert into public.club_memberships (
  id,
  club_id,
  user_id,
  role,
  status,
  school_year,
  joined_at
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'president',
    'active',
    '2026-2027',
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'member',
    'active',
    '2026-2027',
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    'president',
    'active',
    '2026-2027',
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000005',
    'member',
    'active',
    '2026-2027',
    now()
  );

insert into public.attendance_sessions (
  id,
  club_id,
  starts_at,
  created_by
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    now(),
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    now(),
    '00000000-0000-0000-0000-000000000004'
  );

insert into public.attendance_records (
  session_id,
  membership_id,
  status,
  recorded_by
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'present',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000004',
    'present',
    '00000000-0000-0000-0000-000000000004'
  );

insert into public.club_ideas (
  id,
  school_id,
  submitter_id,
  status,
  title,
  category,
  description,
  mission,
  problem_opportunity,
  expected_activities,
  expected_membership,
  proposed_meeting_cadence,
  grade_min,
  grade_max
)
values
  (
    '50000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'submitted',
    'Submitted Idea',
    'STEM',
    'A complete submitted idea',
    'Learn',
    'Students need a place to learn',
    array['Weekly projects'],
    20,
    'Weekly',
    9,
    12
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000005',
    'draft',
    'Private Draft',
    '',
    '',
    '',
    '',
    '{}',
    null,
    '',
    null,
    null
  );

insert into public.media_assets (
  id,
  school_id,
  club_id,
  uploader_id,
  storage_bucket,
  storage_path,
  media_type,
  size_bytes,
  mime_type,
  title,
  visibility
)
values (
  '60000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'club-media',
  '00000000-0000-0000-0000-000000000002/private.jpg',
  'image',
  1000,
  'image/jpeg',
  'Club media',
  'club'
);

insert into public.email_campaigns (
  id,
  school_id,
  club_id,
  created_by,
  name,
  subject
)
values (
  '70000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Club A update',
  'Club A update'
);

set local role anon;
select set_config('request.jwt.claims', '{}', true);

select results_eq(
  $$select count(*)::bigint from public.published_clubs$$,
  array[1::bigint],
  'anonymous users see only active public clubs'
);
select results_eq(
  $$select count(*)::bigint from public.published_media_assets$$,
  array[0::bigint],
  'anonymous users cannot see private media'
);
select results_eq(
  $$select count(*)::bigint from public.profiles$$,
  array[0::bigint],
  'anonymous users cannot browse profiles'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.clubs where id = '20000000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'Club A officer can read Club A'
);
select results_eq(
  $$select count(*)::bigint from public.clubs where id = '20000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'Club A officer cannot read private Club B'
);
select results_eq(
  $$select count(*)::bigint from public.club_memberships where club_id = '20000000-0000-0000-0000-000000000001'$$,
  array[2::bigint],
  'Club A officer can read Club A roster'
);
select results_eq(
  $$select count(*)::bigint from public.club_memberships where club_id = '20000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'Club A officer cannot read Club B roster'
);
select results_eq(
  $$select count(*)::bigint from public.attendance_records where session_id = '40000000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'Club A officer can read Club A attendance'
);
select results_eq(
  $$select count(*)::bigint from public.attendance_records where session_id = '40000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'Club A officer cannot read Club B attendance'
);
select lives_ok(
  $$update public.attendance_records set status = 'late' where session_id = '40000000-0000-0000-0000-000000000001'$$,
  'Club A officer can update Club A attendance'
);
select results_eq(
  $$with changed as (
      update public.attendance_records
      set status = 'late'
      where session_id = '40000000-0000-0000-0000-000000000002'
      returning id
    )
    select count(*)::bigint from changed$$,
  array[0::bigint],
  'Club A officer cannot update Club B attendance'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.attendance_records where membership_id = '30000000-0000-0000-0000-000000000002'$$,
  array[1::bigint],
  'member can read their own attendance'
);
select results_eq(
  $$select count(*)::bigint from public.attendance_records where membership_id <> '30000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'member cannot read another student attendance'
);
select results_eq(
  $$select count(*)::bigint from public.media_assets where club_id = '20000000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'Club A member can read club-scoped Club A media metadata'
);
select results_eq(
  $$select count(*)::bigint from public.media_assets where club_id = '20000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'Club A member cannot read Club B media metadata'
);
select results_eq(
  $$select count(*)::bigint from public.profiles
    where id = '00000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'Club members cannot read another member full profile directly'
);
select results_eq(
  $$select count(*)::bigint from public.club_member_directory
    where club_id = '20000000-0000-0000-0000-000000000001'$$,
  array[2::bigint],
  'Club members can use the privacy-safe member directory'
);
select results_eq(
  $$select count(*)::bigint from public.club_member_directory
    where user_id = '00000000-0000-0000-0000-000000000002'
      and school_id is null$$,
  array[1::bigint],
  'Member directory hides school when profile privacy disables it'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.user_school_memberships where school_id = '10000000-0000-0000-0000-000000000001'$$,
  array[3::bigint],
  'School A admin can read School A memberships'
);
select results_eq(
  $$select count(*)::bigint from public.user_school_memberships where school_id = '10000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'School A admin cannot read School B memberships'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000006","role":"authenticated"}',
  true
);

select results_eq(
  $$select count(*)::bigint from public.club_ideas where id = '50000000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'committee reviewer can read submitted ideas'
);
select results_eq(
  $$select count(*)::bigint from public.club_ideas where id = '50000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'committee reviewer cannot read unassigned private drafts'
);

reset role;
set local role postgres;
select throws_ok(
  $$insert into public.attendance_records (
      session_id,
      membership_id,
      status,
      recorded_by
    ) values (
      '40000000-0000-0000-0000-000000000001',
      '30000000-0000-0000-0000-000000000004',
      'present',
      '00000000-0000-0000-0000-000000000002'
    )$$,
  '23514',
  'Attendance membership must belong to the session club',
  'database constraint rejects cross-club attendance'
);
select throws_ok(
  $$update public.club_ideas
    set status = 'approved'
    where id = '50000000-0000-0000-0000-000000000002'$$,
  '23514',
  'Invalid club idea transition: draft -> approved',
  'database rejects invalid idea workflow transition'
);
select throws_ok(
  $$insert into public.email_recipients (
      campaign_id,
      recipient_user_id
    ) values (
      '70000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000005'
    )$$,
  '23514',
  'Campaign recipient must be an authorized club or event audience member',
  'email campaign rejects a recipient outside its club'
);

select * from finish();
rollback;
