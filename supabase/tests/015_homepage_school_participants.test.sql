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

select plan(7);

select has_table(
  'public',
  'homepage_school_participants',
  'homepage school participation is persisted'
);

select is(
  (
    select count(*)::integer
    from public.homepage_school_participants
    where is_published
  ),
  5,
  'five confirmed schools are published'
);

select is(
  (
    select count(*)::integer
    from public.homepage_school_participants
    where logo_bucket = 'school-branding'
      and logo_path ~ '^participants/[a-z0-9-]+[.]png$'
  ),
  5,
  'every participant references a constrained branding object'
);

select ok(
  (
    select bool_and(
      participation_confirmed_at is not null
      and logo_use_authorized_at is not null
      and logo_source_url ~ '^https://'
    )
    from public.homepage_school_participants
  ),
  'every public claim has confirmation and official source metadata'
);

select is(
  (
    select public
    from storage.buckets
    where id = 'school-branding'
  ),
  true,
  'authorized school branding bucket is public'
);

reset role;
set local role anon;

select is(
  (select count(*)::integer from public.homepage_school_participants),
  5,
  'anonymous homepage visitors can read confirmed published participants'
);

select throws_ok(
  $$
    insert into public.homepage_school_participants (
      school_id,
      logo_path,
      logo_alt,
      logo_source_url,
      participation_confirmed_at,
      logo_use_authorized_at,
      sort_order,
      is_published
    )
    select
      id,
      'participants/unauthorized.png',
      'Unauthorized',
      'https://example.test/unauthorized.png',
      current_date,
      statement_timestamp(),
      99,
      true
    from public.schools
    limit 1
  $$,
  '42501',
  null,
  'anonymous visitors cannot publish school participation'
);

select * from finish();
rollback;
