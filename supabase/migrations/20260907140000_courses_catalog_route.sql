-- Point the Courses module at the authenticated /courses catalog.
-- Course lessons remain under /dashboard/learn/ap.

update public.dashboard_modules
set
  route = '/courses',
  description = 'AP catalog'
where id = 'learning';
