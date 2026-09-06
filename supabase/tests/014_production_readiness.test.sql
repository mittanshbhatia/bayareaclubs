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
    'e0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'pr-officer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"PR Officer","age_band":"adult"}',
    now(), now()
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'pr-member@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"PR Member","age_band":"adult"}',
    now(), now()
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'pr-outsider@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"PR Outsider","age_band":"adult"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values (
  'e1000000-0000-0000-0000-000000000001',
  'PR High',
  'pr-high',
  'high',
  'San Jose'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'e1000000-0000-0000-0000-000000000001'
where user_id in (
  'e0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000003'
);

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  ('e0000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'student', 'active', now()),
  ('e0000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'student', 'active', now());

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'e2000000-0000-0000-0000-000000000001',
  'e1000000-0000-0000-0000-000000000001',
  'PR Club',
  'pr-club',
  'PR',
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
  ('e3000000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'member', 'active', '2026-2027', now());

-- Member cannot resolve email audience
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select throws_ok(
  $$select * from public.resolve_email_audience_user_ids(
      'e2000000-0000-0000-0000-000000000001',
      'all_members',
      '{}'::jsonb
    )$$,
  '42501',
  'Club manager role required',
  'plain members cannot enumerate email audience'
);

-- Outsider cannot probe officer platform admin status for another user
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select is(
  public.is_platform_admin('e0000000-0000-0000-0000-000000000001'),
  false,
  'cross-user is_platform_admin probe soft-denies'
);

select is(
  public.is_club_member(
    'e2000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001'
  ),
  false,
  'cross-user is_club_member probe soft-denies'
);

-- Officer can count audience
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select is(
  public.count_email_audience(
    'e2000000-0000-0000-0000-000000000001',
    'all_members',
    '{}'::jsonb,
    'announcement'
  ),
  2,
  'club managers can count email audience'
);

-- Consent-gated club media: member cannot view until granted
reset role;
set local role postgres;

insert into public.media_assets (
  id, school_id, club_id, uploader_id, title, media_type, mime_type,
  size_bytes, storage_bucket, storage_path, visibility, consent_required,
  consent_state
)
values (
  'e4000000-0000-0000-0000-000000000001',
  'e1000000-0000-0000-0000-000000000001',
  'e2000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  'Pending consent photo',
  'image',
  'image/jpeg',
  1024,
  'club-media',
  'pr-club/pending.jpg',
  'club',
  true,
  'pending'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select is(
  public.can_view_media_asset('e4000000-0000-0000-0000-000000000001'),
  false,
  'club members cannot view consent-pending club media'
);

-- Uploader can still view their pending asset
select set_config(
  'request.jwt.claims',
  '{"sub":"e0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select is(
  public.can_view_media_asset('e4000000-0000-0000-0000-000000000001'),
  true,
  'uploader can view their consent-pending asset'
);

select * from finish();
rollback;
