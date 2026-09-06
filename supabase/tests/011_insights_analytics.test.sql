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

select plan(3);

select ok(
  (public.refresh_analytics_for_date(current_date) ? 'club_rows')::boolean,
  'refresh_analytics_for_date returns club_rows'
);

select ok(
  exists (
    select 1 from public.analytics_daily_platform
    where metric_date = current_date
  ),
  'platform daily rollup row exists after refresh'
);

select results_eq(
  $$select renewals_due >= 0 from public.analytics_daily_platform
    where metric_date = current_date$$,
  array[true],
  'platform rollup includes renewal engagement counters'
);

select * from finish();
rollback;
