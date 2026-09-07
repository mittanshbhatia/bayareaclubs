update public.homepage_school_participants
set logo_path = 'participants/homestead-high-school-v2.png'
where school_id = (
  select id
  from public.schools
  where slug = 'homestead-high-school'
);
