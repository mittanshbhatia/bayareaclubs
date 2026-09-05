# Database Architecture

## Scope

Supabase PostgreSQL is the source of truth for BayAreaClubs. The schema is
multi-school, multi-club, migration-driven, and protected by database row-level
security. PostgreSQL stores media metadata only; binaries remain in private
Supabase Storage buckets.

The initial domain is defined by:

- `20260905224500_domain_model.sql`: types, tables, constraints, indexes,
  workflow/integrity triggers, audit triggers, and account-governance hook.
- `20260905224600_rls.sql`: authorization helpers, grants, RLS policies,
  applicant-safe feedback views, Storage buckets, and Storage policies.

## Identity and assignments

`profiles` extends `auth.users` with only application-safe identity fields and an
account-governance age band. Authority is never stored as a single profile role.

- `platform_role_assignments` stores active or revoked platform administrator and
  committee-reviewer assignments.
- `user_school_memberships` scopes school administrators, advisors, students, and
  staff to individual schools.
- `club_memberships` scopes club roles by club and academic year.
- `club_officer_terms` preserves historical officer appointments after a current
  membership role changes.
- `user_guardian_relationships` supports verified managed onboarding and consent
  decisions without collecting birth dates.

Under-13 self-service registration is rejected by the
`restrict_under_13_self_signup` Auth hook. A future managed flow must set protected
app metadata through an administrative server operation.

## Club lifecycle

Club ideas are editable drafts with normalized proposed officers and supporting
links. PostgreSQL validates allowed idea transitions and rejects incomplete
submissions. Every status transition is appended to
`club_idea_status_history`. Reviews separate applicant-visible feedback from
direct access to internal notes through restricted feedback views.

Only an approved idea can be converted into a club for the same school. Conversion
atomically advances the originating idea to `converted_to_club`.

Annual charters are versioned by club, school year, and version number. Structured
charter sections remain database-editable. At most one approved charter exists for
a club and school year. Renewals reference a charter and preserve submitted
officer and membership snapshots for historical review.

## Operations

- Activities belong to clubs.
- Events carry tenant scope, format, visibility, approval, capacity, waitlist, and
  RSVP settings. Tasks and typed logistics records remain separate.
- Attendance sessions belong to one club and optionally one event from that club.
  A composite integrity trigger rejects attendance for a membership from another
  club, and a unique constraint prevents duplicate member/session records.
- Email recipients must be persisted users with an active membership in the
  campaign's club or school. Arbitrary recipient addresses are not represented.
- Highlights and newsletters use publication state and visibility; newsletter
  sections are ordered relational records.

## Media and consent

`media_assets` records owner, bucket, object path, MIME type, size, visibility, and
public approval. All buckets are private. Storage reads resolve through the media
authorization function, and uploads must use an authenticated-user path prefix.

Public media requires explicit approval. Consent-gated media additionally requires
current granted consent and no denied, revoked, or expired consent. Consent can be
recorded by an eligible subject, verified guardian, or authorized club manager.

## STEM learning

Courses use controlled disciplines and difficulty levels, contain ordered modules,
and modules contain ordered typed resources. Only free published courses and their
published descendants are public. Subscriptions and per-resource progress belong
to one user, and a trigger rejects progress against resources outside the
subscribed course.

## Audit and analytics

Important mutations append minimal audit metadata without copying row contents,
email bodies, secrets, or student PII. Audit and workflow-history records reject
updates and deletes.

Daily club, school, and platform analytics tables contain real rollup counters and
date-oriented indexes. They are intended for idempotent scheduled aggregation from
transactional records; no chart seed data is stored.

## Integrity and indexing

Foreign keys define ownership and deletion behavior. Checks enforce school-year
format, date ordering, grade ranges, JSON shape, public-media approval, and
workflow completeness. Tenant/status/date indexes cover school administration,
club rosters, idea queues, attendance, events, campaigns, publications, learning
progress, audit queries, and analytics date ranges.

## Generated types

`src/types/database.generated.ts` is generated from the applied Supabase schema.
Regenerate it after every migration:

```bash
pnpm exec supabase gen types typescript --local \
  > src/types/database.generated.ts
```
