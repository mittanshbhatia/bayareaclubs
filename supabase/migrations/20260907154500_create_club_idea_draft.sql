-- Authenticated students can persist a draft for a school they belong to.
-- application_kind was added after the original table GRANT; recreate the
-- insert path through a membership-checked definer function so both kinds work.

grant select, insert, update, delete on public.club_ideas to authenticated;
grant select, insert, update, delete on public.club_idea_proposed_officers to authenticated;
grant select, insert, update, delete on public.club_idea_links to authenticated;

create or replace function public.create_club_idea_draft(
  target_school_id uuid,
  target_application_kind text default 'new_idea'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  idea_id uuid;
begin
  if actor is null then
    raise exception 'Authentication required';
  end if;

  if target_application_kind not in ('new_idea', 'existing_club') then
    raise exception 'Invalid application kind';
  end if;

  perform public.claim_student_school_membership(target_school_id);

  if not public.is_school_member(target_school_id, actor) then
    raise exception 'School membership is required';
  end if;

  insert into public.club_ideas (
    school_id,
    submitter_id,
    status,
    application_kind
  )
  values (
    target_school_id,
    actor,
    'draft',
    target_application_kind
  )
  returning id into idea_id;

  return idea_id;
end;
$$;

comment on function public.create_club_idea_draft(uuid, text) is
  'Creates a draft club idea for the authenticated submitter after persisting a student membership at the selected school.';

revoke all on function public.create_club_idea_draft(uuid, text) from public;
revoke all on function public.create_club_idea_draft(uuid, text) from anon;
grant execute on function public.create_club_idea_draft(uuid, text) to authenticated;

notify pgrst, 'reload schema';
