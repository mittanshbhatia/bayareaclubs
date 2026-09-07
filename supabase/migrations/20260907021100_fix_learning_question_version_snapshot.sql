-- Snapshot after the question row exists. BEFORE INSERT cannot satisfy
-- learning_question_versions.question_id FK.

create or replace function public.snapshot_learning_question_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.learning_question_versions (
      question_id, version, prompt, choices, answer_key, explanation,
      question_type, source_basis, status, created_by
    ) values (
      new.id, new.version, new.prompt, new.choices, new.answer_key, new.explanation,
      new.question_type, new.source_basis, new.status, new.created_by
    );
    return new;
  end if;

  if new.prompt is distinct from old.prompt
    or new.choices is distinct from old.choices
    or new.answer_key is distinct from old.answer_key
    or new.explanation is distinct from old.explanation
    or new.question_type is distinct from old.question_type
    or new.source_basis is distinct from old.source_basis
    or new.status is distinct from old.status
  then
    new.version := old.version + 1;
    insert into public.learning_question_versions (
      question_id, version, prompt, choices, answer_key, explanation,
      question_type, source_basis, status, created_by
    ) values (
      new.id, new.version, new.prompt, new.choices, new.answer_key, new.explanation,
      new.question_type, new.source_basis, new.status, auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists snapshot_learning_question_version on public.learning_questions;

create trigger snapshot_learning_question_version_insert
  after insert on public.learning_questions
  for each row execute function public.snapshot_learning_question_version();

create trigger snapshot_learning_question_version_update
  before update on public.learning_questions
  for each row execute function public.snapshot_learning_question_version();
