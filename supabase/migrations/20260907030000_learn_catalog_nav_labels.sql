-- Align dashboard module chrome with the Learn / Courses catalog layout.
-- Labels only; no permission, RLS, or route changes.

update public.dashboard_modules
set
  label = 'Courses',
  description = 'AP catalog',
  section = 'learn'
where id = 'learning';

update public.dashboard_modules
set section = 'learn'
where id in ('home', 'stem-resources');
