# Row-Level Security Matrix

## Policy principles

- `authenticated` means only that a valid user is present; it never grants broad
  data access.
- Platform, school, and club authority comes from active persisted assignments.
- Security-definer helper functions are narrowly scoped, use an empty search path,
  and exist to avoid recursive RLS evaluation.
- Every exposed table has explicit operation policies. Unsupported operations use
  default-deny or an explicit `false` policy.
- Service-role access is reserved for trusted server administration, provider
  webhooks, notifications, and analytics jobs. It is not a user authorization
  shortcut.

## Public visitor

May read:

- active clubs whose visibility is `public`;
- published public events, highlights, and newsletters;
- sections of published public newsletters;
- published free STEM courses, modules, and resources; and
- media explicitly approved for public use when all required consent is current;
  and
- confirmed, published school-participation records and their authorized
  institutional logos.

Cannot read profiles, memberships, attendance, ideas, review records, private
media, email data, notifications, audits, or analytics. Public visitors cannot
mutate application tables.

## Authenticated user

May read and update their own full profile. Guardians, authorized school staff,
platform administrators, and workflow reviewers receive direct profile access
only for their legitimate scope. Club peers use `club_member_directory`, which
projects only a display name and privacy-permitted school/avatar references.

May read their own school memberships, guardian relationships, course
subscriptions, course progress, notifications, RSVPs, email-delivery record, and
attendance. They cannot infer another student's attendance through club
membership.

They may read their own onboarding state, but not internal institutional notes.
They cannot directly insert or delete onboarding records, activate themselves,
change governance fields, or assign any privileged role.

May subscribe only to published free courses and may maintain only their own
progress.

## Managed minor onboarding

Under-13 users cannot self-register. A verified guardian may record authorization
only for a linked student account awaiting that authorization. Activation still
requires an authorized administrator for the requested school. School
administrators can read and review onboarding records and internal notes only for
their assigned schools. Internal notes are append-only. Platform administrators
retain explicit platform scope.

## Club-idea submitter

May create a draft only for a school in which they have an active membership.
They may read their own idea, proposed officers, links, status history, and the
applicant-safe feedback view.

They may edit draft or changes-requested ideas. PostgreSQL validates submission and
resubmission completeness and all status transitions. Submitters cannot read
reviewer internal notes or other applicants' private drafts.

## Committee reviewer

An active `committee_reviewer` assignment may read submitted, resubmitted, and
review-stage ideas and its own assigned review rows. It may not read unsubmitted
private drafts merely because the user is authenticated.

Reviewer decisions can move only ideas currently under review. Internal notes are
visible only through direct review access, never through applicant feedback views.
Committee assignment is data-driven; no person's name or role is hard-coded.

## School administrator and advisor

School administrators may manage school memberships and read/manage operational
data only for their assigned schools. They can review school-scoped workflows and
read school audit and analytics records.

School advisors receive review authority for their assigned schools but do not
automatically receive platform or unrelated-school authority.

Neither role can read memberships, clubs, ideas, attendance, media, campaigns, or
analytics from another school.

## Club officer and advisor

Active club administrators, presidents, vice presidents, secretaries, treasurers,
officers, and advisors may manage their club's memberships, officer terms,
charters, renewals, activities, events, logistics, attendance, media, campaigns,
highlights, and newsletters as allowed by the table policies.

Club authority never crosses into another club. Club officers cannot access
another club's roster, attendance, private media, campaigns, or operational
records, even when both clubs use the platform.

## Club member

An active member may read member-safe data for joined clubs, including the club
record, roster identities, officer history, charters, activities, events,
logistics, and authorized media.

Members may manage their own RSVP. Attendance remains private to the subject and
authorized club or school managers.

## Platform administrator

An active `platform_admin` assignment may administer platform data, role
assignments, schools, learning content, analytics, and cross-tenant workflows.
Only platform administrators may create, reorder, publish, update, or remove
homepage school-participation records and school-branding objects.
Audit history remains append-only even for application administrators; exceptional
database maintenance must occur through controlled operational procedures.

## Data-family operation summary

Identity and assignment tables:

- profiles: authorized SELECT, self/admin UPDATE, trigger/self INSERT, no user
  DELETE;
- platform assignments: self/admin SELECT, platform-admin mutations;
- school memberships and guardian relationships: subject/authorized-school SELECT,
  authorized-admin mutations.

Workflow tables:

- ideas and child records: submitter/reviewer/school-admin scoped;
- review tables: assigned reviewer or authorized administrator only;
- applicant feedback: restricted views omit internal notes;
- status history: authorized SELECT and trigger-only append.

Club operations:

- clubs: explicit public visibility or authorized tenant access;
- memberships, officers, charters, renewals, and activities: joined-club or
  authorized-manager scope;
- attendance: subject or manager only;
- events: published visibility for reads, club-manager mutations;
- event tasks/logistics: assignee/member reads and manager mutations;
- RSVPs: self or event manager.

Communications and publishing:

- campaigns and recipient lists: school/club managers;
- recipients: own delivery status or campaign manager;
- provider email events: recipient/manager reads and server-only append;
- highlights/newsletters: published visibility or tenant membership.

Media and learning:

- media metadata and Storage objects share the same authorization decision;
- consent records are subject, verified-guardian, or manager scoped;
- published STEM catalog content is public;
- subscriptions and progress are user-owned.

System records:

- notifications are user-owned and server/admin-created;
- audit logs are scoped to platform, school, or club administrators and immutable;
- analytics are readable only at the caller's authorized scope and written by
  platform-controlled aggregation.

## Required regression coverage

`supabase/tests/001_rls_isolation.test.sql` proves public restrictions, school
isolation, club isolation, roster isolation, attendance privacy, private-media
isolation, reviewer draft denial, invalid workflow rejection, cross-club attendance
rejection, and campaign-recipient scoping.
