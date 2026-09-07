-- Verified school participation displayed on the public homepage.
-- Logo binaries live in the dedicated Supabase Storage bucket; PostgreSQL
-- stores only attribution, authorization, ordering, and object metadata.

create table public.homepage_school_participants (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null unique references public.schools(id) on delete cascade,
  logo_bucket text not null default 'school-branding'
    check (logo_bucket = 'school-branding'),
  logo_path text not null unique
    check (logo_path ~ '^participants/[a-z0-9-]+[.]png$'),
  logo_alt text not null check (length(trim(logo_alt)) between 2 and 180),
  logo_source_url text not null check (logo_source_url ~ '^https://'),
  participation_confirmed_at date not null,
  logo_use_authorized_at timestamptz not null,
  sort_order smallint not null unique check (sort_order between 1 and 100),
  is_published boolean not null default false,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create index homepage_school_participants_published_order_idx
  on public.homepage_school_participants (is_published, sort_order)
  where is_published;

create trigger homepage_school_participants_set_updated_at
  before update on public.homepage_school_participants
  for each row execute function public.set_updated_at();

create trigger audit_homepage_school_participants
  after insert or update or delete on public.homepage_school_participants
  for each row execute function public.audit_row_change('homepage_school_participant');

alter table public.homepage_school_participants enable row level security;

grant select on public.homepage_school_participants to anon, authenticated;
grant insert, update, delete on public.homepage_school_participants to authenticated;

create policy homepage_school_participants_public_select
  on public.homepage_school_participants
  for select to anon, authenticated
  using (
    is_published
    and participation_confirmed_at <= current_date
    and logo_use_authorized_at <= statement_timestamp()
  );

create policy homepage_school_participants_admin_insert
  on public.homepage_school_participants
  for insert to authenticated
  with check (public.is_platform_admin());

create policy homepage_school_participants_admin_update
  on public.homepage_school_participants
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy homepage_school_participants_admin_delete
  on public.homepage_school_participants
  for delete to authenticated
  using (public.is_platform_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'school-branding',
  'school-branding',
  true,
  2097152,
  array['image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy school_branding_admin_insert
  on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'school-branding'
    and name ~ '^participants/[a-z0-9-]+[.]png$'
    and public.is_platform_admin()
  );

create policy school_branding_admin_update
  on storage.objects
  for update to authenticated
  using (
    bucket_id = 'school-branding'
    and public.is_platform_admin()
  )
  with check (
    bucket_id = 'school-branding'
    and name ~ '^participants/[a-z0-9-]+[.]png$'
    and public.is_platform_admin()
  );

create policy school_branding_admin_delete
  on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'school-branding'
    and public.is_platform_admin()
  );

insert into public.schools (
  name,
  slug,
  level,
  city,
  website_url,
  is_active
)
values
  (
    'Bellarmine College Preparatory',
    'bellarmine-college-preparatory',
    'high',
    'San Jose',
    'https://www.bcp.org/',
    true
  ),
  (
    'BASIS Independent Silicon Valley',
    'basis-independent-silicon-valley',
    'other',
    'San Jose',
    'https://basisindependent.com/schools/ca/silicon-valley/',
    true
  ),
  (
    'The Harker School',
    'the-harker-school',
    'other',
    'San Jose',
    'https://www.harker.org/',
    true
  ),
  (
    'Homestead High School',
    'homestead-high-school',
    'high',
    'Cupertino',
    'https://hhs.fuhsd.org/',
    true
  ),
  (
    'Cupertino High School',
    'cupertino-high-school',
    'high',
    'Cupertino',
    'https://chs.fuhsd.org/',
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  level = excluded.level,
  city = excluded.city,
  website_url = excluded.website_url,
  is_active = true;

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
  school.id,
  participant.logo_path,
  participant.logo_alt,
  participant.logo_source_url,
  date '2026-09-06',
  timestamptz '2026-09-06 16:59:00-07',
  participant.sort_order,
  true
from (
  values
    (
      'bellarmine-college-preparatory',
      'participants/bellarmine-college-preparatory.png',
      'Bellarmine College Preparatory',
      'https://resources.finalsite.net/images/v1759258916/bcporg/kndadnvrfwaxaqrjulq8/SchoolShield-TM_Blue1.png',
      1::smallint
    ),
    (
      'basis-independent-silicon-valley',
      'participants/basis-independent-silicon-valley.png',
      'BASIS Independent Silicon Valley',
      'https://basisindependent.com/wp-content/uploads/2024/01/BISV_Logo-400x145_2.png',
      2::smallint
    ),
    (
      'the-harker-school',
      'participants/the-harker-school.png',
      'The Harker School',
      'https://eaglestore.harker.org/cdn/shop/files/logo-7_320x@2x.png?v=1614342405',
      3::smallint
    ),
    (
      'homestead-high-school',
      'participants/homestead-high-school.png',
      'Homestead High School',
      'https://hhs.fuhsd.org/uploaded/themes/default_17/images/homestead-logo.svg',
      4::smallint
    ),
    (
      'cupertino-high-school',
      'participants/cupertino-high-school.png',
      'Cupertino High School',
      'https://chs.fuhsd.org/uploaded/themes/default_17/images/cupertino-logo-2019.png',
      5::smallint
    )
) as participant(
  school_slug,
  logo_path,
  logo_alt,
  logo_source_url,
  sort_order
)
join public.schools school on school.slug = participant.school_slug
on conflict (school_id) do update
set
  logo_path = excluded.logo_path,
  logo_alt = excluded.logo_alt,
  logo_source_url = excluded.logo_source_url,
  participation_confirmed_at = excluded.participation_confirmed_at,
  logo_use_authorized_at = excluded.logo_use_authorized_at,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;
