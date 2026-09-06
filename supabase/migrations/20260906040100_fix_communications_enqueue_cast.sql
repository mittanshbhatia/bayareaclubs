-- Fix status enum cast in officer_enqueue_campaign_send.
create or replace function public.officer_enqueue_campaign_send(
  target_campaign_id uuid,
  send_immediately boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  campaign_row public.email_campaigns%rowtype;
  job_id uuid;
  run_at timestamptz;
  key text;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into campaign_row
  from public.email_campaigns
  where id = target_campaign_id
  for update;

  if not found then
    raise exception 'Campaign not found' using errcode = 'P0002';
  end if;
  if campaign_row.club_id is null or not public.can_manage_club(campaign_row.club_id, actor) then
    raise exception 'Not authorized to send this campaign' using errcode = '42501';
  end if;
  if campaign_row.status not in ('draft', 'scheduled') then
    key := 'prepare:' || target_campaign_id::text || ':' || coalesce(campaign_row.idempotency_key, target_campaign_id::text);
    select id into job_id
    from public.communication_jobs
    where idempotency_key = key;
    if job_id is not null then
      return job_id;
    end if;
    raise exception 'Campaign cannot be queued from status %', campaign_row.status
      using errcode = '23514';
  end if;

  run_at := case
    when send_immediately then statement_timestamp()
    else coalesce(campaign_row.scheduled_for, statement_timestamp())
  end;

  update public.email_campaigns
  set
    status = case
      when run_at > statement_timestamp() then 'scheduled'::public.email_campaign_status
      else 'sending'::public.email_campaign_status
    end,
    scheduled_for = run_at,
    preference_category = public.preference_category_for_campaign_kind(campaign_row.campaign_kind),
    updated_at = statement_timestamp()
  where id = target_campaign_id;

  key := 'prepare:' || target_campaign_id::text || ':' || coalesce(campaign_row.idempotency_key, target_campaign_id::text);

  job_id := public.enqueue_communication_job(
    'prepare_campaign_recipients',
    key,
    target_campaign_id,
    jsonb_build_object('requested_by', actor),
    run_at
  );

  insert into public.audit_logs (
    actor_id, action, entity_type, entity_id, school_id, club_id, metadata
  )
  values (
    actor,
    'email_campaign.enqueue_send',
    'email_campaigns',
    target_campaign_id,
    campaign_row.school_id,
    campaign_row.club_id,
    jsonb_build_object(
      'audience_type', campaign_row.audience_type::text,
      'campaign_kind', campaign_row.campaign_kind::text,
      'run_at', run_at,
      'job_id', job_id
    )
  );

  return job_id;
end;
$$;
