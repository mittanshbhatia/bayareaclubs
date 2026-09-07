-- Distinguish a new club proposal from onboarding an existing school club.
-- Both paths retain the same governed review and approval workflow.

alter table public.club_ideas
  add column if not exists application_kind text not null default 'new_idea'
  check (application_kind in ('new_idea', 'existing_club'));

create index if not exists club_ideas_submitter_kind_status_idx
  on public.club_ideas (submitter_id, application_kind, status);

comment on column public.club_ideas.application_kind is
  'Whether the applicant is proposing a new club or bringing an existing club into the platform.';
