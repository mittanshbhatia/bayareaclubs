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

select plan(18);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'student-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Student","last_initial":"A","age_band":"age_13_17","display_name":"Student A"}',
    now(), now()
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'reviewer-a@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Reviewer","last_initial":"A","age_band":"adult","display_name":"Reviewer A"}',
    now(), now()
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'outsider@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Outsider","last_initial":"Z","age_band":"adult","display_name":"Outsider"}',
    now(), now()
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'reviewer-b@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Reviewer","last_initial":"B","age_band":"adult","display_name":"Reviewer B"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values
  (
    'b0000000-0000-0000-0000-000000000001',
    'Idea School A',
    'idea-school-a',
    'high',
    'Palo Alto'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'Idea School B',
    'idea-school-b',
    'high',
    'Fremont'
  );

update public.account_onboarding
set
  status = 'active',
  activated_at = statement_timestamp(),
  requested_school_id = 'b0000000-0000-0000-0000-000000000001'
where user_id in (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004'
);

insert into public.user_school_memberships (
  user_id, school_id, role, status, joined_at
)
values (
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'student',
  'active',
  now()
);

insert into public.platform_role_assignments (user_id, role)
values
  ('a0000000-0000-0000-0000-000000000002', 'committee_reviewer'),
  ('a0000000-0000-0000-0000-000000000004', 'committee_reviewer');

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

insert into public.club_ideas (
  id, school_id, submitter_id, status, title, category, description, mission,
  problem_opportunity, expected_activities, expected_membership,
  proposed_meeting_cadence, grade_min, grade_max, draft_step
)
values (
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'draft',
  'Green Tech Club',
  'STEM',
  'A club dedicated to sustainable technology projects for campus.',
  'Empower students to solve environmental problems with technology.',
  'Campus lacks a student-led sustainability engineering pathway.',
  array['Solar demos', 'Waste audits'],
  20,
  'Fridays 3:00-4:00 PM',
  9,
  12,
  10
);

insert into public.club_idea_proposed_officers (idea_id, proposed_name, proposed_role)
values (
  'c0000000-0000-0000-0000-000000000001',
  'Student A',
  'president'
);

update public.club_ideas
set status = 'submitted'
where id = 'c0000000-0000-0000-0000-000000000001';

select is(
  (select status from public.club_ideas where id = 'c0000000-0000-0000-0000-000000000001'),
  'submitted'::public.club_idea_status,
  'draft -> submitted is allowed'
);

select ok(
  exists (
    select 1 from public.club_idea_versions
    where idea_id = 'c0000000-0000-0000-0000-000000000001'
      and status_at_freeze = 'submitted'
  ),
  'submission freezes an immutable version'
);

select ok(
  exists (
    select 1 from public.club_idea_status_history
    where idea_id = 'c0000000-0000-0000-0000-000000000001'
      and to_status = 'submitted'
  ),
  'submission writes status history'
);

reset role;
set local role postgres;

insert into public.club_ideas (
  id, school_id, submitter_id, status, title, category, description, mission,
  problem_opportunity, expected_activities, expected_membership,
  proposed_meeting_cadence, grade_min, grade_max
)
values (
  'c0000000-0000-0000-0000-000000000099',
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'rejected',
  'Rejected Idea',
  'STEM',
  'Rejected idea description for transition testing only here.',
  'Rejected idea mission for transition testing only here now.',
  'Rejected idea opportunity for transition testing only here.',
  array['None'],
  10,
  'None',
  9,
  12
);

select throws_ok(
  $$update public.club_ideas set status = 'approved' where id = 'c0000000-0000-0000-0000-000000000099'$$,
  '23514',
  'Invalid club idea transition: rejected -> approved',
  'rejected -> approved is prohibited'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select ok(
  (select count(*) > 0 from public.club_ideas where id = 'c0000000-0000-0000-0000-000000000001'),
  'committee reviewer can view submitted idea'
);

insert into public.club_idea_reviews (id, idea_id, reviewer_id, assigned_by)
values (
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002'
);

update public.club_ideas
set status = 'under_review'
where id = 'c0000000-0000-0000-0000-000000000001';

select is(
  (select status from public.club_ideas where id = 'c0000000-0000-0000-0000-000000000001'),
  'under_review'::public.club_idea_status,
  'submitted -> under_review is allowed'
);

select throws_ok(
  $$update public.club_idea_reviews
    set decision = 'changes_requested',
        applicant_feedback = 'short',
        reviewed_at = now()
    where id = 'd0000000-0000-0000-0000-000000000001'$$,
  '23514',
  'Meaningful applicant feedback is required for changes requested',
  'changes requested requires meaningful feedback'
);

update public.club_idea_reviews
set decision = 'approved',
    applicant_feedback = 'Strong plan and clear leadership.',
    reviewed_at = now()
where id = 'd0000000-0000-0000-0000-000000000001';

select is(
  (select status from public.club_ideas where id = 'c0000000-0000-0000-0000-000000000001'),
  'approved'::public.club_idea_status,
  'approval updates idea status'
);

select ok(
  exists (
    select 1 from public.club_idea_versions
    where idea_id = 'c0000000-0000-0000-0000-000000000001'
      and status_at_freeze = 'approved'
  ),
  'approval freezes an immutable approved version'
);

reset role;
set local role postgres;

select ok(
  exists (
    select 1 from public.audit_logs
    where entity_id = 'c0000000-0000-0000-0000-000000000001'
      and action = 'club_idea.approved'
  ),
  'approval writes an audit log'
);

select ok(
  exists (
    select 1 from public.notifications
    where user_id = 'a0000000-0000-0000-0000-000000000001'
      and notification_type = 'club_idea_approved'
  ),
  'approval notifies the applicant'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

insert into public.club_idea_reviews (id, idea_id, reviewer_id, assigned_by)
values (
  'd0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000002'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000004","role":"authenticated"}',
  true
);

select throws_ok(
  $$update public.club_idea_reviews
    set decision = 'rejected',
        applicant_feedback = 'Too late concurrent rejection attempt.',
        reviewed_at = now()
    where id = 'd0000000-0000-0000-0000-000000000002'$$,
  '23514',
  'Idea must be under review before a decision',
  'concurrent approval/decision after status change is rejected'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer from public.club_ideas where id = 'c0000000-0000-0000-0000-000000000001'),
  0,
  'unrelated authenticated user cannot select another school idea'
);

select throws_ok(
  $$select public.convert_approved_idea_to_club(
    'c0000000-0000-0000-0000-000000000001',
    'Green Tech Club',
    'green-tech-club'
  )$$,
  '42501',
  'Not authorized to convert this idea',
  'cross-school outsider cannot convert'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"a0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.convert_approved_idea_to_club(
    'c0000000-0000-0000-0000-000000000001',
    'Green Tech Club',
    'green-tech-club'
  )$$,
  'submitter can convert approved idea'
);

select is(
  (select status from public.club_ideas where id = 'c0000000-0000-0000-0000-000000000001'),
  'converted_to_club'::public.club_idea_status,
  'conversion marks idea as converted_to_club'
);

select is(
  public.convert_approved_idea_to_club(
    'c0000000-0000-0000-0000-000000000001',
    'Green Tech Club',
    'green-tech-club-again'
  ),
  (select id from public.clubs where originating_idea_id = 'c0000000-0000-0000-0000-000000000001'),
  'second conversion returns the same club id'
);

select is(
  (select count(*)::integer from public.clubs where originating_idea_id = 'c0000000-0000-0000-0000-000000000001'),
  1,
  'originating idea cannot create multiple clubs'
);

select * from finish();
rollback;
