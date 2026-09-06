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
    'f0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'media-officer@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Media Officer","age_band":"adult"}',
    now(), now()
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'media-outsider@example.test',
    crypt('test-password', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Outsider","age_band":"adult"}',
    now(), now()
  );

insert into public.schools (id, name, slug, level, city)
values (
  'f1000000-0000-0000-0000-000000000001',
  'Media High',
  'media-high',
  'high',
  'Oakland'
);

update public.account_onboarding
set status = 'active', activated_at = statement_timestamp(),
    requested_school_id = 'f1000000-0000-0000-0000-000000000001'
where user_id in (
  'f0000000-0000-0000-0000-000000000001',
  'f0000000-0000-0000-0000-000000000002'
);

insert into public.user_school_memberships (user_id, school_id, role, status, joined_at)
values
  ('f0000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'student', 'active', now());

insert into public.clubs (
  id, school_id, name, slug, description, mission, category, visibility, approved_by
)
values (
  'f2000000-0000-0000-0000-000000000001',
  'f1000000-0000-0000-0000-000000000001',
  'Media Club',
  'media-club',
  'Media',
  'Mission',
  'Arts',
  'private',
  'f0000000-0000-0000-0000-000000000001'
);

insert into public.club_memberships (
  id, club_id, user_id, role, status, school_year, joined_at
)
values (
  'f3000000-0000-0000-0000-000000000001',
  'f2000000-0000-0000-0000-000000000001',
  'f0000000-0000-0000-0000-000000000001',
  'president',
  'active',
  '2026-2027',
  now()
);

-- Officer prepares an upload session (metadata not created yet)
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"f0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$insert into public.media_upload_sessions (
      id, school_id, club_id, uploader_id, storage_bucket, storage_path,
      declared_mime_type, declared_size_bytes, media_type, title, visibility
    ) values (
      'f4000000-0000-0000-0000-000000000001',
      'f1000000-0000-0000-0000-000000000001',
      'f2000000-0000-0000-0000-000000000001',
      'f0000000-0000-0000-0000-000000000001',
      'club-media',
      'f0000000-0000-0000-0000-000000000001/f2000000-0000-0000-0000-000000000001/f4000000-0000-0000-0000-000000000001/photo.jpg',
      'image/jpeg',
      2048,
      'image',
      'Practice photo',
      'private'
    )$$,
  'officer can create an upload session without a media_assets row'
);

select is_empty(
  $$select 1 from public.media_assets
    where storage_path = 'f0000000-0000-0000-0000-000000000001/f2000000-0000-0000-0000-000000000001/f4000000-0000-0000-0000-000000000001/photo.jpg'$$,
  'media metadata does not exist before finalize'
);

-- Finalize-equivalent insert of metadata after "safe" upload
select lives_ok(
  $$insert into public.media_assets (
      id, school_id, club_id, uploader_id, storage_bucket, storage_path,
      media_type, size_bytes, mime_type, title, visibility, consent_required,
      consent_state, upload_session_id
    ) values (
      'f5000000-0000-0000-0000-000000000001',
      'f1000000-0000-0000-0000-000000000001',
      'f2000000-0000-0000-0000-000000000001',
      'f0000000-0000-0000-0000-000000000001',
      'club-media',
      'f0000000-0000-0000-0000-000000000001/f2000000-0000-0000-0000-000000000001/f4000000-0000-0000-0000-000000000001/photo.jpg',
      'image',
      2048,
      'image/jpeg',
      'Practice photo',
      'private',
      true,
      'pending',
      'f4000000-0000-0000-0000-000000000001'
    )$$,
  'metadata row can be created after upload session exists'
);

update public.media_upload_sessions
set status = 'finalized',
    media_asset_id = 'f5000000-0000-0000-0000-000000000001',
    finalized_at = statement_timestamp()
where id = 'f4000000-0000-0000-0000-000000000001';

-- Outsider cannot read private club media metadata
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"f0000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select is_empty(
  $$select 1 from public.media_assets
    where id = 'f5000000-0000-0000-0000-000000000001'$$,
  'non-member cannot read private club media metadata'
);

select ok(
  not public.can_view_media_asset(
    'f5000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000002'
  ),
  'can_view_media_asset denies outsider for private asset'
);

-- Soft delete requires reason and hides asset
reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"f0000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select throws_ok(
  $$select public.soft_delete_media_asset(
      'f5000000-0000-0000-0000-000000000001',
      'no'
    )$$,
  '23514',
  null,
  'soft delete rejects short reasons'
);

select lives_ok(
  $$select public.soft_delete_media_asset(
      'f5000000-0000-0000-0000-000000000001',
      'Removed after event'
    )$$,
  'officer can soft-delete with audited reason'
);

select is_empty(
  $$select 1 from public.media_assets
    where id = 'f5000000-0000-0000-0000-000000000001'$$,
  'soft-deleted media is hidden from normal selects'
);

select * from finish();
rollback;
