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
values
(
  'c0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'notify-admin@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Notify Admin","age_band":"adult"}',
  now(), now()
),
(
  'c0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'notify-member@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Notify Member","age_band":"age_13_17"}',
  now(), now()
),
(
  'c0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'notify-outsider@example.test',
  crypt('test-password', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Notify Outsider","age_band":"adult"}',
  now(), now()
);

insert into public.schools (id, name, slug, level, city)
values (
  'c1000000-0000-0000-0000-000000000001',
  'Notify High',
  'notify-high',
  'high',
  'San Jose'
);

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'c2000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Notify Robotics',
  'notify-robotics',
  'A robotics club',
  'Build robots',
  'STEM',
  'private',
  'c0000000-0000-0000-0000-000000000001'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'c1000000-0000-0000-0000-000000000001'
where user_id in (
  'c0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000003'
);

insert into public.platform_role_assignments (user_id, role, assigned_by)
values (
  'c0000000-0000-0000-0000-000000000001',
  'platform_admin',
  'c0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (club_id, user_id, role, status, school_year, joined_at)
values
(
  'c2000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'club_admin',
  'active',
  '2026-2027',
  now()
),
(
  'c2000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  'member',
  'active',
  '2026-2027',
  now()
);

select is(
  public.notification_category_for_type('upcoming_event')::text,
  'events',
  'maps upcoming_event to events category'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"c0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$select public.emit_in_app_notification(
    'c0000000-0000-0000-0000-000000000002',
    'club_invitation',
    'Club invitation',
    'You were invited.',
    '/clubs/notify-robotics/members',
    'c2000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'club_memberships',
    null,
    '{}'::jsonb
  )$$,
  'manager can notify a club member'
);

select throws_ok(
  $$select public.emit_in_app_notification(
    'c0000000-0000-0000-0000-000000000003',
    'club_invitation',
    'Club invitation',
    'Cross club leak attempt',
    '/dashboard',
    'c2000000-0000-0000-0000-000000000001',
    null,
    'club_memberships',
    null,
    '{}'::jsonb
  )$$,
  '42501',
  'Recipient is not a member of the target club',
  'blocks notifying non-members for club-scoped notifications'
);

select is(
  (
    select count(*)::integer
    from public.notifications
    where user_id = 'c0000000-0000-0000-0000-000000000002'
      and notification_type = 'club_invitation'
  ),
  1,
  'persists invitation notification'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"c0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select is(
  (
    select count(*)::integer
    from public.notifications
    where user_id = 'c0000000-0000-0000-0000-000000000001'
  ),
  0,
  'member cannot read another user notification via RLS'
);

select is(
  public.mark_all_notifications_read(),
  1,
  'recipient can mark all notifications read'
);

select * from finish();
rollback;
