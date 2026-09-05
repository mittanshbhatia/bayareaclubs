begin;

create extension if not exists pgcrypto with schema extensions;

create type public.age_band as enum ('under_13', 'age_13_17', 'adult');
create type public.school_level as enum (
  'elementary',
  'middle',
  'high',
  'college',
  'other'
);
create type public.platform_role as enum ('platform_admin', 'committee_reviewer');
create type public.school_role as enum (
  'school_admin',
  'school_advisor',
  'student',
  'staff'
);
create type public.membership_status as enum (
  'invited',
  'active',
  'declined',
  'suspended',
  'exited'
);
create type public.club_role as enum (
  'club_admin',
  'president',
  'vice_president',
  'secretary',
  'treasurer',
  'officer',
  'advisor',
  'member'
);
create type public.club_idea_status as enum (
  'draft',
  'submitted',
  'under_review',
  'changes_requested',
  'resubmitted',
  'approved',
  'rejected',
  'withdrawn',
  'converted_to_club'
);
create type public.review_decision as enum (
  'changes_requested',
  'approved',
  'rejected'
);
create type public.club_status as enum ('active', 'inactive', 'archived');
create type public.visibility_level as enum (
  'public',
  'school',
  'club',
  'private'
);
create type public.charter_status as enum (
  'draft',
  'submitted',
  'changes_requested',
  'approved',
  'expired',
  'superseded'
);
create type public.renewal_status as enum (
  'draft',
  'submitted',
  'under_review',
  'changes_requested',
  'approved',
  'rejected',
  'withdrawn'
);
create type public.attendance_status as enum (
  'present',
  'late',
  'excused',
  'absent'
);
create type public.event_type as enum (
  'club_meeting',
  'workshop',
  'speaker',
  'competition',
  'hackathon',
  'community_service',
  'fundraiser',
  'field_trip',
  'social',
  'showcase',
  'tournament',
  'conference',
  'other'
);
create type public.event_format as enum ('in_person', 'online', 'hybrid');
create type public.event_status as enum (
  'draft',
  'pending_approval',
  'published',
  'cancelled',
  'completed'
);
create type public.event_task_status as enum (
  'open',
  'in_progress',
  'completed',
  'cancelled'
);
create type public.rsvp_status as enum (
  'going',
  'maybe',
  'not_going',
  'waitlisted',
  'cancelled'
);
create type public.logistics_type as enum (
  'venue',
  'equipment',
  'food',
  'transportation',
  'volunteers',
  'accessibility',
  'permissions',
  'budget_notes',
  'setup',
  'cleanup',
  'other'
);
create type public.media_type as enum (
  'image',
  'video',
  'document',
  'audio',
  'other'
);
create type public.consent_status as enum (
  'pending',
  'granted',
  'denied',
  'revoked',
  'expired'
);
create type public.email_campaign_status as enum (
  'draft',
  'scheduled',
  'sending',
  'sent',
  'failed',
  'cancelled'
);
create type public.email_recipient_status as enum (
  'pending',
  'sent',
  'delivered',
  'bounced',
  'complained',
  'failed',
  'unsubscribed',
  'cancelled'
);
create type public.email_event_type as enum (
  'sent',
  'delivered',
  'delivery_delayed',
  'bounced',
  'complained',
  'opened',
  'clicked',
  'failed'
);
create type public.publication_status as enum (
  'draft',
  'review',
  'scheduled',
  'published',
  'archived'
);
create type public.stem_discipline as enum (
  'computer_science',
  'ai_ml',
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'engineering',
  'robotics',
  'astronomy',
  'earth_science',
  'cybersecurity',
  'data_science',
  'other'
);
create type public.course_difficulty as enum (
  'beginner',
  'intermediate',
  'advanced'
);
create type public.resource_type as enum (
  'article',
  'video',
  'document',
  'exercise',
  'external_link',
  'project',
  'dataset'
);
create type public.subscription_status as enum (
  'active',
  'completed',
  'paused',
  'cancelled'
);

create function public.is_valid_school_year(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value ~ '^[0-9]{4}-[0-9]{4}$'
    and substring(value from 6 for 4)::integer =
      substring(value from 1 for 4)::integer + 1;
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = statement_timestamp();
  return new;
end;
$$;

create function public.prevent_update_or_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% is append-only', tg_table_name
    using errcode = '55000';
end;
$$;

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  level public.school_level not null,
  city text not null check (length(trim(city)) between 2 and 120),
  state_code text not null default 'CA' check (state_code ~ '^[A-Z]{2}$'),
  timezone text not null default 'America/Los_Angeles',
  website_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 1 and 100),
  age_band public.age_band not null,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.platform_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.platform_role not null,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default statement_timestamp(),
  revoked_at timestamptz,
  check (revoked_at is null or revoked_at >= assigned_at)
);
create unique index platform_role_assignments_active_unique
  on public.platform_role_assignments (user_id, role)
  where revoked_at is null;

create table public.user_school_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  role public.school_role not null,
  status public.membership_status not null default 'active',
  invited_by uuid references public.profiles(id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz,
  exited_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (user_id, school_id, role),
  check (joined_at is null or invited_at is null or joined_at >= invited_at),
  check (exited_at is null or joined_at is null or exited_at >= joined_at)
);

create table public.user_guardian_relationships (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  guardian_user_id uuid not null references public.profiles(id) on delete cascade,
  relationship text not null check (length(trim(relationship)) between 1 and 80),
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (student_user_id, guardian_user_id),
  check (student_user_id <> guardian_user_id),
  check (revoked_at is null or verified_at is null or revoked_at >= verified_at)
);

create table public.club_ideas (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  submitter_id uuid not null references public.profiles(id) on delete restrict,
  status public.club_idea_status not null default 'draft',
  title text not null default '' check (length(title) <= 160),
  category text not null default '' check (length(category) <= 80),
  description text not null default '',
  mission text not null default '',
  problem_opportunity text not null default '',
  expected_activities text[] not null default '{}',
  expected_membership integer check (expected_membership between 1 and 100000),
  proposed_meeting_cadence text not null default '',
  proposed_advisor_id uuid references public.profiles(id) on delete set null,
  grade_min smallint check (grade_min between 0 and 20),
  grade_max smallint check (grade_max between 0 and 20),
  submitted_at timestamptz,
  decided_at timestamptz,
  withdrawn_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (grade_min is null or grade_max is null or grade_min <= grade_max)
);

create table public.club_idea_proposed_officers (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.club_ideas(id) on delete cascade,
  proposed_user_id uuid references public.profiles(id) on delete set null,
  proposed_name text,
  proposed_role public.club_role not null,
  created_at timestamptz not null default statement_timestamp(),
  check (proposed_user_id is not null or length(trim(proposed_name)) > 0)
);

create table public.club_idea_links (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.club_ideas(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  url text not null check (url ~ '^https://'),
  created_at timestamptz not null default statement_timestamp()
);

create table public.club_idea_reviews (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.club_ideas(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  assigned_by uuid references public.profiles(id) on delete set null,
  decision public.review_decision,
  internal_notes text,
  applicant_feedback text,
  assigned_at timestamptz not null default statement_timestamp(),
  reviewed_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (
    (decision is null and reviewed_at is null)
    or (decision is not null and reviewed_at is not null)
  )
);
create unique index club_idea_reviews_active_assignment_unique
  on public.club_idea_reviews (idea_id, reviewer_id)
  where reviewed_at is null;

create table public.club_idea_status_history (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.club_ideas(id) on delete cascade,
  from_status public.club_idea_status,
  to_status public.club_idea_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  reason text,
  created_at timestamptz not null default statement_timestamp()
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  originating_idea_id uuid unique references public.club_ideas(id) on delete restrict,
  name text not null check (length(trim(name)) between 2 and 160),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null,
  mission text not null,
  category text not null check (length(trim(category)) between 1 and 80),
  founded_on date,
  status public.club_status not null default 'active',
  grade_min smallint check (grade_min between 0 and 20),
  grade_max smallint check (grade_max between 0 and 20),
  visibility public.visibility_level not null default 'school',
  approved_by uuid not null references public.profiles(id) on delete restrict,
  approved_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (school_id, slug),
  check (grade_min is null or grade_max is null or grade_min <= grade_max)
);

create table public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.club_role not null default 'member',
  status public.membership_status not null default 'invited',
  school_year text not null check (public.is_valid_school_year(school_year)),
  invited_by uuid references public.profiles(id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz,
  exited_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (club_id, user_id, school_year),
  unique (id, club_id),
  check (joined_at is null or invited_at is null or joined_at >= invited_at),
  check (exited_at is null or joined_at is null or exited_at >= joined_at)
);

create table public.club_officer_terms (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  membership_id uuid not null,
  role public.club_role not null check (role <> 'member'),
  school_year text not null check (public.is_valid_school_year(school_year)),
  starts_on date not null,
  ends_on date,
  appointed_by uuid references public.profiles(id) on delete set null,
  ended_reason text,
  created_at timestamptz not null default statement_timestamp(),
  foreign key (membership_id, club_id)
    references public.club_memberships(id, club_id) on delete cascade,
  check (ends_on is null or ends_on >= starts_on)
);

create table public.club_charters (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  school_year text not null check (public.is_valid_school_year(school_year)),
  version_number integer not null default 1 check (version_number > 0),
  status public.charter_status not null default 'draft',
  purpose text not null default '',
  mission text not null default '',
  membership_requirements text not null default '',
  officer_structure text not null default '',
  elections text not null default '',
  meeting_cadence text not null default '',
  conduct_expectations text not null default '',
  advisor_information text not null default '',
  planned_activities text not null default '',
  financial_policy text not null default '',
  amendment_process text not null default '',
  created_by uuid not null references public.profiles(id) on delete restrict,
  submitted_at timestamptz,
  approved_at timestamptz,
  expires_at timestamptz,
  supersedes_id uuid references public.club_charters(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (club_id, school_year, version_number)
);
create unique index club_charters_one_approved_per_year
  on public.club_charters (club_id, school_year)
  where status = 'approved';

create table public.club_charter_reviews (
  id uuid primary key default gen_random_uuid(),
  charter_id uuid not null references public.club_charters(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  decision public.review_decision not null,
  internal_notes text,
  applicant_feedback text,
  reviewed_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp()
);

create table public.club_renewals (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  school_year text not null check (public.is_valid_school_year(school_year)),
  charter_id uuid not null references public.club_charters(id) on delete restrict,
  status public.renewal_status not null default 'draft',
  submitted_by uuid not null references public.profiles(id) on delete restrict,
  current_officers_snapshot jsonb not null default '[]'::jsonb
    check (jsonb_typeof(current_officers_snapshot) = 'array'),
  advisor_confirmed_by uuid references public.profiles(id) on delete restrict,
  advisor_confirmed_at timestamptz,
  activity_summary text not null default '',
  membership_summary jsonb not null default '{}'::jsonb
    check (jsonb_typeof(membership_summary) = 'object'),
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (club_id, school_year),
  check (
    (advisor_confirmed_by is null and advisor_confirmed_at is null)
    or (advisor_confirmed_by is not null and advisor_confirmed_at is not null)
  )
);

create table public.club_renewal_reviews (
  id uuid primary key default gen_random_uuid(),
  renewal_id uuid not null references public.club_renewals(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  decision public.review_decision not null,
  internal_notes text,
  applicant_feedback text,
  reviewed_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp()
);

create table public.club_activities (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  description text not null,
  activity_date date not null,
  category text not null check (length(trim(category)) between 1 and 80),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  club_id uuid not null references public.clubs(id) on delete cascade,
  event_type public.event_type not null,
  status public.event_status not null default 'draft',
  title text not null check (length(trim(title)) between 1 and 200),
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/Los_Angeles',
  format public.event_format not null default 'in_person',
  location_name text,
  online_url text,
  capacity integer check (capacity > 0),
  rsvp_deadline timestamptz,
  waitlist_enabled boolean not null default false,
  visibility public.visibility_level not null default 'club',
  approval_required boolean not null default false,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  organizer_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (ends_at > starts_at),
  check (rsvp_deadline is null or rsvp_deadline <= starts_at),
  check (
    (format = 'in_person' and location_name is not null)
    or (format = 'online' and online_url is not null)
    or (format = 'hybrid' and location_name is not null and online_url is not null)
  ),
  check (
    (approved_by is null and approved_at is null)
    or (approved_by is not null and approved_at is not null)
  )
);

create table public.event_tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  status public.event_task_status not null default 'open',
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  )
);

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.rsvp_status not null,
  responded_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (event_id, user_id)
);

create table public.event_logistics (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  logistics_type public.logistics_type not null,
  title text not null check (length(trim(title)) between 1 and 160),
  details text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'America/Los_Angeles',
  location_name text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (ends_at is null or ends_at > starts_at)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  membership_id uuid not null references public.club_memberships(id) on delete cascade,
  status public.attendance_status not null,
  recorded_by uuid not null references public.profiles(id) on delete restrict,
  recorded_at timestamptz not null default statement_timestamp(),
  note text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (session_id, membership_id)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  club_id uuid references public.clubs(id) on delete cascade,
  idea_id uuid references public.club_ideas(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete restrict,
  storage_bucket text not null check (
    storage_bucket in ('club-branding', 'club-media', 'club-documents', 'course-assets')
  ),
  storage_path text not null check (
    storage_path <> ''
    and storage_path !~ '(^|/)\.\.?(/|$)'
  ),
  media_type public.media_type not null,
  size_bytes bigint not null check (size_bytes > 0),
  mime_type text not null check (length(trim(mime_type)) between 3 and 127),
  title text not null check (length(trim(title)) between 1 and 160),
  description text,
  visibility public.visibility_level not null default 'private',
  consent_required boolean not null default false,
  approved_for_public_at timestamptz,
  approved_for_public_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (storage_bucket, storage_path),
  check (club_id is not null or idea_id is not null or storage_bucket = 'course-assets'),
  check (
    visibility <> 'public'
    or (
      approved_for_public_at is not null
      and approved_for_public_by is not null
    )
  )
);

alter table public.clubs
  add column logo_asset_id uuid references public.media_assets(id) on delete set null;

create table public.media_consents (
  id uuid primary key default gen_random_uuid(),
  subject_user_id uuid not null references public.profiles(id) on delete cascade,
  media_asset_id uuid references public.media_assets(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete cascade,
  status public.consent_status not null default 'pending',
  granted_by uuid references public.profiles(id) on delete restrict,
  relationship_to_subject text,
  scope text not null check (length(trim(scope)) between 1 and 200),
  granted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (media_asset_id is not null or club_id is not null),
  check (expires_at is null or granted_at is null or expires_at > granted_at),
  check (revoked_at is null or granted_at is null or revoked_at >= granted_at)
);

create table public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  club_id uuid references public.clubs(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  status public.email_campaign_status not null default 'draft',
  name text not null check (length(trim(name)) between 1 and 160),
  subject text not null check (length(trim(subject)) between 1 and 200),
  preview_text text,
  content_json jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content_json) = 'object'),
  scheduled_for timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.email_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.email_campaigns(id) on delete cascade,
  recipient_user_id uuid not null references public.profiles(id) on delete restrict,
  status public.email_recipient_status not null default 'pending',
  provider_message_id text,
  sent_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (campaign_id, recipient_user_id)
);

create table public.email_events (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.email_recipients(id) on delete cascade,
  event_type public.email_event_type not null,
  provider_event_id text unique,
  occurred_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default statement_timestamp()
);

create table public.club_highlights (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  summary text not null,
  body text not null,
  cover_asset_id uuid references public.media_assets(id) on delete set null,
  status public.publication_status not null default 'draft',
  visibility public.visibility_level not null default 'club',
  created_by uuid not null references public.profiles(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.newsletters (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  club_id uuid references public.clubs(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 200),
  issue_label text,
  status public.publication_status not null default 'draft',
  visibility public.visibility_level not null default 'club',
  created_by uuid not null references public.profiles(id) on delete restrict,
  scheduled_for timestamptz,
  published_at timestamptz,
  email_campaign_id uuid references public.email_campaigns(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create table public.newsletter_sections (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid not null references public.newsletters(id) on delete cascade,
  position integer not null check (position >= 0),
  heading text not null check (length(trim(heading)) between 1 and 200),
  body text not null,
  media_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (newsletter_id, position)
);

create table public.stem_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) between 1 and 200),
  description text not null,
  discipline public.stem_discipline not null,
  grade_bands public.age_band[] not null,
  difficulty public.course_difficulty not null,
  thumbnail_asset_id uuid references public.media_assets(id) on delete set null,
  provider_name text not null check (length(trim(provider_name)) between 1 and 160),
  source_url text not null check (source_url ~ '^https://'),
  license_name text not null check (length(trim(license_name)) between 1 and 120),
  license_url text check (license_url is null or license_url ~ '^https://'),
  is_free boolean not null default true check (is_free),
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  check (
    (is_published and published_at is not null)
    or (not is_published and published_at is null)
  )
);

create table public.stem_course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  position integer not null check (position >= 0),
  title text not null check (length(trim(title)) between 1 and 200),
  description text,
  estimated_minutes integer check (estimated_minutes > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (course_id, position)
);

create table public.stem_resources (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.stem_course_modules(id) on delete cascade,
  position integer not null check (position >= 0),
  resource_type public.resource_type not null,
  title text not null check (length(trim(title)) between 1 and 200),
  description text,
  external_url text check (external_url is null or external_url ~ '^https://'),
  media_asset_id uuid references public.media_assets(id) on delete set null,
  estimated_minutes integer check (estimated_minutes > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (module_id, position),
  check (external_url is not null or media_asset_id is not null)
);

create table public.course_subscriptions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.stem_courses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.subscription_status not null default 'active',
  subscribed_at timestamptz not null default statement_timestamp(),
  completed_at timestamptz,
  updated_at timestamptz not null default statement_timestamp(),
  unique (course_id, user_id)
);

create table public.course_progress (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.course_subscriptions(id) on delete cascade,
  resource_id uuid not null references public.stem_resources(id) on delete cascade,
  completed boolean not null default false,
  progress_percent numeric(5,2) not null default 0
    check (progress_percent between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default statement_timestamp(),
  unique (subscription_id, resource_id),
  check (
    (completed and progress_percent = 100 and completed_at is not null)
    or not completed
  )
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null check (length(trim(notification_type)) between 1 and 80),
  title text not null check (length(trim(title)) between 1 and 160),
  body text not null,
  action_url text check (action_url is null or action_url ~ '^/'),
  read_at timestamptz,
  created_at timestamptz not null default statement_timestamp()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (length(trim(action)) between 1 and 120),
  entity_type text not null check (length(trim(entity_type)) between 1 and 120),
  entity_id uuid,
  school_id uuid references public.schools(id) on delete set null,
  club_id uuid references public.clubs(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default statement_timestamp()
);

create table public.analytics_daily_club (
  club_id uuid not null references public.clubs(id) on delete cascade,
  metric_date date not null,
  active_members integer not null default 0 check (active_members >= 0),
  new_members integer not null default 0 check (new_members >= 0),
  attendance_sessions integer not null default 0 check (attendance_sessions >= 0),
  attendance_recorded integer not null default 0 check (attendance_recorded >= 0),
  attendance_present integer not null default 0 check (attendance_present >= 0),
  events integer not null default 0 check (events >= 0),
  rsvps integer not null default 0 check (rsvps >= 0),
  activities integer not null default 0 check (activities >= 0),
  calculated_at timestamptz not null default statement_timestamp(),
  primary key (club_id, metric_date)
);

create table public.analytics_daily_school (
  school_id uuid not null references public.schools(id) on delete cascade,
  metric_date date not null,
  active_clubs integer not null default 0 check (active_clubs >= 0),
  active_members integer not null default 0 check (active_members >= 0),
  ideas_submitted integer not null default 0 check (ideas_submitted >= 0),
  ideas_approved integer not null default 0 check (ideas_approved >= 0),
  events integer not null default 0 check (events >= 0),
  attendance_recorded integer not null default 0 check (attendance_recorded >= 0),
  calculated_at timestamptz not null default statement_timestamp(),
  primary key (school_id, metric_date)
);

create table public.analytics_daily_platform (
  metric_date date primary key,
  active_schools integer not null default 0 check (active_schools >= 0),
  active_clubs integer not null default 0 check (active_clubs >= 0),
  active_members integer not null default 0 check (active_members >= 0),
  ideas_submitted integer not null default 0 check (ideas_submitted >= 0),
  ideas_approved integer not null default 0 check (ideas_approved >= 0),
  events integer not null default 0 check (events >= 0),
  attendance_recorded integer not null default 0 check (attendance_recorded >= 0),
  calculated_at timestamptz not null default statement_timestamp()
);

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_age_band text := new.raw_user_meta_data ->> 'age_band';
  is_managed boolean := coalesce(
    (new.raw_app_meta_data ->> 'managed_onboarding')::boolean,
    false
  );
begin
  if requested_age_band is null then
    raise exception 'An age band is required for account governance';
  end if;
  if requested_age_band = 'under_13' and not is_managed then
    raise exception 'Under-13 accounts require managed onboarding';
  end if;
  insert into public.profiles (id, display_name, age_band)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      'New member'
    ),
    requested_age_band::public.age_band
  )
  on conflict (id) do nothing;
  return new;
exception
  when invalid_text_representation then
    raise exception 'Invalid age_band supplied during account creation';
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create function public.restrict_under_13_self_signup(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_age_band text := event -> 'user' -> 'user_metadata' ->> 'age_band';
  is_managed boolean := coalesce(
    (event -> 'user' -> 'app_metadata' ->> 'managed_onboarding')::boolean,
    false
  );
begin
  if requested_age_band is null then
    raise exception 'An age band is required for account governance';
  end if;
  if requested_age_band = 'under_13' and not is_managed then
    raise exception 'Under-13 accounts require managed onboarding';
  end if;
  if requested_age_band not in ('under_13', 'age_13_17', 'adult') then
    raise exception 'Invalid account age band';
  end if;
  return '{}'::jsonb;
end;
$$;

revoke all on function public.restrict_under_13_self_signup(jsonb) from public;
grant execute on function public.restrict_under_13_self_signup(jsonb)
  to supabase_auth_admin;

create function public.validate_club_idea_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed boolean := false;
begin
  if tg_op = 'INSERT' or new.status = old.status then
    return new;
  end if;

  allowed := case old.status
    when 'draft' then new.status in ('submitted', 'withdrawn')
    when 'submitted' then new.status in ('under_review', 'withdrawn')
    when 'under_review' then new.status in (
      'changes_requested', 'approved', 'rejected', 'withdrawn'
    )
    when 'changes_requested' then new.status in ('resubmitted', 'withdrawn')
    when 'resubmitted' then new.status in ('under_review', 'withdrawn')
    when 'approved' then new.status = 'converted_to_club'
    else false
  end;

  if not allowed then
    raise exception 'Invalid club idea transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;

  if new.status in ('submitted', 'resubmitted') then
    if length(trim(new.title)) = 0
      or length(trim(new.category)) = 0
      or length(trim(new.description)) = 0
      or length(trim(new.mission)) = 0
      or length(trim(new.problem_opportunity)) = 0
      or length(trim(new.proposed_meeting_cadence)) = 0
      or cardinality(new.expected_activities) = 0
      or new.expected_membership is null
      or new.grade_min is null
      or new.grade_max is null then
      raise exception 'Club idea is incomplete and cannot be submitted'
        using errcode = '23514';
    end if;
    new.submitted_at = statement_timestamp();
  elsif new.status in ('approved', 'rejected') then
    new.decided_at = statement_timestamp();
  elsif new.status = 'withdrawn' then
    new.withdrawn_at = statement_timestamp();
  elsif new.status = 'converted_to_club' then
    new.converted_at = statement_timestamp();
  end if;

  return new;
end;
$$;

create trigger club_ideas_validate_transition
  before insert or update of status on public.club_ideas
  for each row execute function public.validate_club_idea_transition();

create function public.record_club_idea_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.club_idea_status_history (
      idea_id,
      from_status,
      to_status,
      changed_by
    )
    values (
      new.id,
      case when tg_op = 'INSERT' then null else old.status end,
      new.status,
      auth.uid()
    );
  end if;
  return new;
end;
$$;

create trigger club_ideas_record_status
  after insert or update of status on public.club_ideas
  for each row execute function public.record_club_idea_status();

create function public.apply_club_idea_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.decision is not null
    and new.decision is distinct from old.decision then
    update public.club_ideas
    set status = new.decision::text::public.club_idea_status
    where id = new.idea_id
      and status = 'under_review';
    if not found then
      raise exception 'Idea must be under review before a decision'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

create trigger club_idea_reviews_apply_decision
  after update of decision on public.club_idea_reviews
  for each row execute function public.apply_club_idea_review();

create function public.convert_approved_idea()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  idea_school_id uuid;
  idea_status public.club_idea_status;
begin
  if new.originating_idea_id is null then
    return new;
  end if;

  select school_id, status
    into idea_school_id, idea_status
  from public.club_ideas
  where id = new.originating_idea_id
  for update;

  if idea_status <> 'approved' or idea_school_id <> new.school_id then
    raise exception 'Club can only convert an approved idea for the same school'
      using errcode = '23514';
  end if;

  update public.club_ideas
  set status = 'converted_to_club'
  where id = new.originating_idea_id;
  return new;
end;
$$;

create trigger clubs_convert_approved_idea
  after insert on public.clubs
  for each row execute function public.convert_approved_idea();

create function public.apply_charter_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.club_charters
  set
    status = case
      when new.decision = 'approved' then 'approved'::public.charter_status
      when new.decision = 'changes_requested'
        then 'changes_requested'::public.charter_status
      else 'changes_requested'::public.charter_status
    end,
    approved_at = case
      when new.decision = 'approved' then statement_timestamp()
      else null
    end
  where id = new.charter_id
    and status = 'submitted';
  if not found then
    raise exception 'Charter must be submitted before review'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger club_charter_reviews_apply_decision
  after insert on public.club_charter_reviews
  for each row execute function public.apply_charter_review();

create function public.apply_renewal_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.club_renewals
  set
    status = case
      when new.decision = 'approved' then 'approved'::public.renewal_status
      when new.decision = 'rejected' then 'rejected'::public.renewal_status
      else 'changes_requested'::public.renewal_status
    end,
    approved_at = case
      when new.decision = 'approved' then statement_timestamp()
      else null
    end
  where id = new.renewal_id
    and status in ('submitted', 'under_review');
  if not found then
    raise exception 'Renewal must be submitted before review'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger club_renewal_reviews_apply_decision
  after insert on public.club_renewal_reviews
  for each row execute function public.apply_renewal_review();

create function public.validate_attendance_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  session_club_id uuid;
  membership_club_id uuid;
begin
  select club_id into session_club_id
  from public.attendance_sessions where id = new.session_id;
  select club_id into membership_club_id
  from public.club_memberships where id = new.membership_id;
  if session_club_id is distinct from membership_club_id then
    raise exception 'Attendance membership must belong to the session club'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger attendance_records_validate_membership
  before insert or update of session_id, membership_id on public.attendance_records
  for each row execute function public.validate_attendance_membership();

create function public.validate_club_membership_school()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  membership_school_id uuid;
begin
  select school_id into membership_school_id
  from public.clubs where id = new.club_id;
  if not exists (
    select 1
    from public.user_school_memberships
    where user_id = new.user_id
      and school_id = membership_school_id
      and status = 'active'
  ) then
    raise exception 'Club member must have an active school membership'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger club_memberships_validate_school
  before insert or update of club_id, user_id on public.club_memberships
  for each row execute function public.validate_club_membership_school();

create function public.validate_event_school()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.clubs
    where id = new.club_id and school_id = new.school_id
  ) then
    raise exception 'Event school must match its club school'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger events_validate_school
  before insert or update of school_id, club_id on public.events
  for each row execute function public.validate_event_school();

create function public.validate_attendance_event()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.event_id is not null and not exists (
    select 1 from public.events
    where id = new.event_id and club_id = new.club_id
  ) then
    raise exception 'Attendance event must belong to the session club'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger attendance_sessions_validate_event
  before insert or update of club_id, event_id on public.attendance_sessions
  for each row execute function public.validate_attendance_event();

create function public.validate_charter_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed boolean;
begin
  if new.status = old.status then
    return new;
  end if;
  allowed := case old.status
    when 'draft' then new.status = 'submitted'
    when 'submitted' then new.status in ('changes_requested', 'approved')
    when 'changes_requested' then new.status = 'submitted'
    when 'approved' then new.status in ('expired', 'superseded')
    else false
  end;
  if not allowed then
    raise exception 'Invalid charter transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;
  if new.status = 'submitted' then
    if length(trim(new.purpose)) = 0
      or length(trim(new.mission)) = 0
      or length(trim(new.membership_requirements)) = 0
      or length(trim(new.officer_structure)) = 0
      or length(trim(new.elections)) = 0
      or length(trim(new.meeting_cadence)) = 0
      or length(trim(new.conduct_expectations)) = 0
      or length(trim(new.advisor_information)) = 0
      or length(trim(new.planned_activities)) = 0
      or length(trim(new.amendment_process)) = 0 then
      raise exception 'Charter is incomplete and cannot be submitted'
        using errcode = '23514';
    end if;
    new.submitted_at = statement_timestamp();
  end if;
  return new;
end;
$$;

create trigger club_charters_validate_transition
  before update of status on public.club_charters
  for each row execute function public.validate_charter_transition();

create function public.validate_renewal_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed boolean;
begin
  if new.status = old.status then
    return new;
  end if;
  allowed := case old.status
    when 'draft' then new.status in ('submitted', 'withdrawn')
    when 'submitted' then new.status in (
      'under_review', 'changes_requested', 'approved', 'rejected', 'withdrawn'
    )
    when 'under_review' then new.status in (
      'changes_requested', 'approved', 'rejected', 'withdrawn'
    )
    when 'changes_requested' then new.status in ('submitted', 'withdrawn')
    else false
  end;
  if not allowed then
    raise exception 'Invalid renewal transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;
  if new.status = 'submitted' then
    if new.advisor_confirmed_at is null
      or length(trim(new.activity_summary)) = 0
      or new.current_officers_snapshot = '[]'::jsonb then
      raise exception 'Renewal is incomplete and cannot be submitted'
        using errcode = '23514';
    end if;
    new.submitted_at = statement_timestamp();
  elsif new.status = 'approved' then
    new.approved_at = statement_timestamp();
  end if;
  return new;
end;
$$;

create trigger club_renewals_validate_transition
  before update of status on public.club_renewals
  for each row execute function public.validate_renewal_transition();

create function public.validate_course_progress_resource()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.course_subscriptions subscription
    join public.stem_course_modules module
      on module.course_id = subscription.course_id
    join public.stem_resources resource
      on resource.module_id = module.id
    where subscription.id = new.subscription_id
      and resource.id = new.resource_id
  ) then
    raise exception 'Progress resource must belong to the subscribed course'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger course_progress_validate_resource
  before insert or update of subscription_id, resource_id on public.course_progress
  for each row execute function public.validate_course_progress_resource();

create function public.validate_email_recipient_scope()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  campaign_club_id uuid;
  campaign_school_id uuid;
begin
  select club_id, school_id
    into campaign_club_id, campaign_school_id
  from public.email_campaigns
  where id = new.campaign_id;

  if campaign_club_id is not null then
    if not exists (
      select 1
      from public.club_memberships
      where club_id = campaign_club_id
        and user_id = new.recipient_user_id
        and status = 'active'
    ) then
      raise exception 'Campaign recipient must be an active club member'
        using errcode = '23514';
    end if;
  elsif not exists (
    select 1
    from public.user_school_memberships
    where school_id = campaign_school_id
      and user_id = new.recipient_user_id
      and status = 'active'
  ) then
    raise exception 'Campaign recipient must be an active school member'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger email_recipients_validate_scope
  before insert or update of campaign_id, recipient_user_id on public.email_recipients
  for each row execute function public.validate_email_recipient_scope();

create function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb;
  entity_uuid uuid;
  school_uuid uuid;
  club_uuid uuid;
  status_value text;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  entity_uuid := nullif(row_data ->> 'id', '')::uuid;
  school_uuid := nullif(row_data ->> 'school_id', '')::uuid;
  club_uuid := nullif(row_data ->> 'club_id', '')::uuid;
  status_value := row_data ->> 'status';

  if school_uuid is null and club_uuid is not null then
    select school_id into school_uuid from public.clubs where id = club_uuid;
  end if;
  if tg_table_name = 'club_idea_reviews' then
    select school_id into school_uuid
    from public.club_ideas
    where id = (row_data ->> 'idea_id')::uuid;
  elsif tg_table_name = 'club_charter_reviews' then
    select club.id, club.school_id into club_uuid, school_uuid
    from public.club_charters charter
    join public.clubs club on club.id = charter.club_id
    where charter.id = (row_data ->> 'charter_id')::uuid;
  elsif tg_table_name = 'club_renewal_reviews' then
    select club.id, club.school_id into club_uuid, school_uuid
    from public.club_renewals renewal
    join public.clubs club on club.id = renewal.club_id
    where renewal.id = (row_data ->> 'renewal_id')::uuid;
  end if;

  insert into public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    school_id,
    club_id,
    metadata
  )
  values (
    auth.uid(),
    tg_argv[0] || '.' || lower(tg_op),
    tg_table_name,
    entity_uuid,
    school_uuid,
    club_uuid,
    jsonb_strip_nulls(jsonb_build_object('status', status_value))
  );
  return coalesce(new, old);
end;
$$;

create trigger audit_logs_immutable
  before update or delete on public.audit_logs
  for each row execute function public.prevent_update_or_delete();
create trigger club_idea_status_history_immutable
  before update or delete on public.club_idea_status_history
  for each row execute function public.prevent_update_or_delete();
create trigger email_events_immutable
  before update or delete on public.email_events
  for each row execute function public.prevent_update_or_delete();

create trigger audit_club_ideas
  after insert or update or delete on public.club_ideas
  for each row execute function public.audit_row_change('club_idea');
create trigger audit_platform_role_assignments
  after insert or update or delete on public.platform_role_assignments
  for each row execute function public.audit_row_change('platform_role_assignment');
create trigger audit_user_school_memberships
  after insert or update or delete on public.user_school_memberships
  for each row execute function public.audit_row_change('school_membership');
create trigger audit_club_idea_reviews
  after insert or update or delete on public.club_idea_reviews
  for each row execute function public.audit_row_change('club_idea_review');
create trigger audit_clubs
  after insert or update or delete on public.clubs
  for each row execute function public.audit_row_change('club');
create trigger audit_club_memberships
  after insert or update or delete on public.club_memberships
  for each row execute function public.audit_row_change('club_membership');
create trigger audit_club_officer_terms
  after insert or update or delete on public.club_officer_terms
  for each row execute function public.audit_row_change('club_officer_term');
create trigger audit_club_charters
  after insert or update or delete on public.club_charters
  for each row execute function public.audit_row_change('club_charter');
create trigger audit_club_charter_reviews
  after insert or delete on public.club_charter_reviews
  for each row execute function public.audit_row_change('club_charter_review');
create trigger audit_club_renewals
  after insert or update or delete on public.club_renewals
  for each row execute function public.audit_row_change('club_renewal');
create trigger audit_club_renewal_reviews
  after insert or delete on public.club_renewal_reviews
  for each row execute function public.audit_row_change('club_renewal_review');
create trigger audit_attendance_records
  after insert or update or delete on public.attendance_records
  for each row execute function public.audit_row_change('attendance_record');
create trigger audit_events
  after insert or update or delete on public.events
  for each row execute function public.audit_row_change('event');
create trigger audit_email_campaigns
  after insert or update or delete on public.email_campaigns
  for each row execute function public.audit_row_change('email_campaign');
create trigger audit_media_assets
  after insert or update or delete on public.media_assets
  for each row execute function public.audit_row_change('media_asset');
create trigger audit_media_consents
  after insert or update or delete on public.media_consents
  for each row execute function public.audit_row_change('media_consent');

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'schools',
    'profiles',
    'user_school_memberships',
    'user_guardian_relationships',
    'club_ideas',
    'club_idea_reviews',
    'clubs',
    'club_memberships',
    'club_charters',
    'club_renewals',
    'club_activities',
    'events',
    'event_tasks',
    'event_rsvps',
    'event_logistics',
    'attendance_sessions',
    'attendance_records',
    'media_assets',
    'media_consents',
    'email_campaigns',
    'email_recipients',
    'club_highlights',
    'newsletters',
    'newsletter_sections',
    'stem_courses',
    'stem_course_modules',
    'stem_resources',
    'course_subscriptions',
    'course_progress'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

create index user_school_memberships_school_status_idx
  on public.user_school_memberships (school_id, status, role);
create index user_school_memberships_user_status_idx
  on public.user_school_memberships (user_id, status);
create index user_guardian_relationships_student_idx
  on public.user_guardian_relationships (student_user_id, revoked_at);
create index user_guardian_relationships_guardian_idx
  on public.user_guardian_relationships (guardian_user_id, revoked_at);
create index club_ideas_school_status_created_idx
  on public.club_ideas (school_id, status, created_at desc);
create index club_ideas_submitter_status_idx
  on public.club_ideas (submitter_id, status);
create index club_idea_reviews_reviewer_assigned_idx
  on public.club_idea_reviews (reviewer_id, reviewed_at, assigned_at);
create index club_idea_status_history_idea_created_idx
  on public.club_idea_status_history (idea_id, created_at);
create index clubs_school_status_idx
  on public.clubs (school_id, status);
create index clubs_visibility_status_idx
  on public.clubs (visibility, status);
create index club_memberships_club_status_role_idx
  on public.club_memberships (club_id, status, role);
create index club_memberships_user_status_idx
  on public.club_memberships (user_id, status);
create index club_officer_terms_club_year_idx
  on public.club_officer_terms (club_id, school_year, starts_on);
create index club_charters_club_year_status_idx
  on public.club_charters (club_id, school_year, status);
create index club_renewals_club_year_status_idx
  on public.club_renewals (club_id, school_year, status);
create index club_activities_club_date_idx
  on public.club_activities (club_id, activity_date desc);
create index events_school_start_idx
  on public.events (school_id, starts_at);
create index events_club_status_start_idx
  on public.events (club_id, status, starts_at);
create index event_tasks_event_status_idx
  on public.event_tasks (event_id, status, due_at);
create index event_rsvps_event_status_idx
  on public.event_rsvps (event_id, status);
create index event_rsvps_user_idx
  on public.event_rsvps (user_id, responded_at desc);
create index attendance_sessions_club_start_idx
  on public.attendance_sessions (club_id, starts_at desc);
create index attendance_records_session_status_idx
  on public.attendance_records (session_id, status);
create index attendance_records_membership_idx
  on public.attendance_records (membership_id, recorded_at desc);
create index media_assets_club_created_idx
  on public.media_assets (club_id, created_at desc);
create index media_assets_school_visibility_idx
  on public.media_assets (school_id, visibility);
create index media_consents_subject_status_idx
  on public.media_consents (subject_user_id, status);
create index email_campaigns_school_status_idx
  on public.email_campaigns (school_id, status, created_at desc);
create index email_campaigns_club_status_idx
  on public.email_campaigns (club_id, status, created_at desc);
create index email_recipients_campaign_status_idx
  on public.email_recipients (campaign_id, status);
create index email_events_recipient_occurred_idx
  on public.email_events (recipient_id, occurred_at);
create index club_highlights_club_status_idx
  on public.club_highlights (club_id, status, published_at desc);
create index newsletters_school_status_idx
  on public.newsletters (school_id, status, published_at desc);
create index newsletters_club_status_idx
  on public.newsletters (club_id, status, published_at desc);
create index stem_courses_published_discipline_idx
  on public.stem_courses (is_published, discipline);
create index course_subscriptions_user_status_idx
  on public.course_subscriptions (user_id, status);
create index course_progress_subscription_idx
  on public.course_progress (subscription_id, completed);
create index notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;
create index audit_logs_school_created_idx
  on public.audit_logs (school_id, created_at desc);
create index audit_logs_club_created_idx
  on public.audit_logs (club_id, created_at desc);
create index audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id, created_at desc);
create index analytics_daily_club_date_idx
  on public.analytics_daily_club (metric_date desc, club_id);
create index analytics_daily_school_date_idx
  on public.analytics_daily_school (metric_date desc, school_id);

commit;
