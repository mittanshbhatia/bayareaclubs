-- Published catalog views must run as owner (security_invoker=false) so anon
-- can read public newsletter metadata without needing direct clubs table access.
-- Joining clubs under anon RLS returns empty rows for private clubs.

drop view if exists public.published_newsletter_blocks;
drop view if exists public.published_newsletters;
drop view if exists public.published_club_highlights;

create view public.published_club_highlights
with (security_barrier = true, security_invoker = false)
as
select
  highlight.id,
  highlight.club_id,
  highlight.title,
  highlight.summary,
  highlight.body,
  highlight.cover_asset_id,
  highlight.source_type,
  highlight.occurred_on,
  highlight.related_activity_id,
  highlight.related_event_id,
  highlight.published_at
from public.club_highlights highlight
where highlight.status = 'published'
  and highlight.visibility = 'public'
  and highlight.published_at is not null
  and highlight.published_at <= now();

create view public.published_newsletters
with (security_barrier = true, security_invoker = false)
as
select
  newsletter.id,
  newsletter.school_id,
  newsletter.club_id,
  club.name as club_name,
  club.slug as club_slug,
  newsletter.title,
  newsletter.issue_label,
  newsletter.preview_text,
  newsletter.period_start,
  newsletter.period_end,
  newsletter.published_at
from public.newsletters newsletter
join public.clubs club on club.id = newsletter.club_id
where newsletter.status = 'published'
  and newsletter.visibility = 'public'
  and newsletter.published_at is not null
  and newsletter.published_at <= now()
  and newsletter.archived_at is null;

create view public.published_newsletter_blocks
with (security_barrier = true, security_invoker = false)
as
select
  block.id,
  block.newsletter_id,
  block.position,
  block.block_type,
  block.content
from public.newsletter_blocks block
join public.newsletters newsletter on newsletter.id = block.newsletter_id
where newsletter.status = 'published'
  and newsletter.visibility = 'public'
  and newsletter.published_at is not null
  and newsletter.published_at <= now()
  and newsletter.archived_at is null;

revoke all on public.published_club_highlights from public;
revoke all on public.published_newsletters from public;
revoke all on public.published_newsletter_blocks from public;
grant select on public.published_club_highlights to anon, authenticated;
grant select on public.published_newsletters to anon, authenticated;
grant select on public.published_newsletter_blocks to anon, authenticated;
