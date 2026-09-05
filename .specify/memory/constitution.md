# BayAreaClubs Engineering Constitution

**Repository:** `bayareaclubs`  
**Status:** Ratified  
**Version:** 1.0.0  
**Ratified:** 2026-09-05  
**Last amended:** 2026-09-05

## Mission

BayAreaClubs is a production-quality web platform for Bay Area elementary-school,
middle-school, high-school, and college clubs. It enables students and authorized
adults to submit and approve club ideas; create and govern clubs; manage officers,
members, annual charters, renewals, attendance, activities, events, logistics,
media, communications, highlights, newsletters, STEM-resource subscriptions, and
participation analytics.

BayAreaClubs is not a prototype or static demo. Every visible action MUST work or
be clearly marked unavailable. Fake functional controls are prohibited.

## I. Approved Technology

- Use current stable releases unless compatibility requires otherwise.
- Use Next.js 16.3+ App Router, React, strict TypeScript, and the Node runtime.
- Use Tailwind CSS, shadcn/ui and Radix primitives where appropriate, Motion for
  React, Lucide, React Hook Form, Zod, TanStack Table, Recharts/shadcn charts, and
  date-fns.
- Use Supabase PostgreSQL, Auth, RLS, Realtime where appropriate, Storage, and
  `@supabase/ssr`.
- Use Resend and React Email for email and Vercel for deployment.
- Use Vitest, Playwright, axe, ESLint, and Prettier.
- Use pnpm exclusively.
- Prefer Server Components. Client Components require an interaction need.
- Do not use deprecated `middleware.ts`. Add `proxy.ts` only when interception is
  genuinely required.
- Server secrets MUST never reach browser code.

## II. Database-First Development

Supabase/PostgreSQL is the source of truth. Core business objects MUST NOT exist
only in component state. Every schema change MUST have a version-controlled
Supabase migration, and generated TypeScript database types MUST remain current.

Every user-facing mutation MUST, in order:

1. validate with Zod;
2. authenticate the actor;
3. authorize the action;
4. perform the mutation;
5. append an audit event when relevant; and
6. return a typed result.

## III. Mandatory Row-Level Security

RLS MUST be enabled on every exposed Supabase table. Authorization MUST exist at
the database layer and MUST NOT rely solely on UI checks.

Each table MUST define explicit SELECT, INSERT, and UPDATE policies, plus a DELETE
policy wherever deletion is permitted. Tests MUST demonstrate both allowed and
denied cases.

Client configuration is limited to:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

A server-only privileged credential is permitted only for administration that
truly requires bypass access. It MUST never be exposed to clients.

## IV. Tenant Isolation

The platform is multi-school and multi-club. Data MUST be scoped to the applicable
platform, school, club, and user boundaries.

- A Club A officer MUST NOT obtain Club B private data.
- A school administrator may access only explicitly authorized schools unless the
  administrator is a platform administrator.
- Committee reviewers receive only the workflow data necessary for their work.
- Authorization boundaries MUST be enforced by RLS and verified by tests.

## V. Role and Assignment Model

Platform roles are:

- `platform_admin`
- `committee_reviewer`
- `school_admin`
- `school_advisor`
- `user`

Club roles are:

- `club_admin`
- `president`
- `vice_president`
- `secretary`
- `treasurer`
- `officer`
- `advisor`
- `member`

Authorization decisions MUST use memberships and assignments rather than encoding
all authority in `profiles.role`. A person may belong to multiple schools and
clubs with a distinct role in each.

## VI. Child and Student Privacy

Privacy by design is mandatory because the platform serves minors.

The platform MUST NOT:

- publicly expose student email addresses, attendance, private rosters, private
  club media, or publicly browseable student profiles;
- expose precise home addresses;
- request unnecessary dates of birth;
- permit arbitrary student-PII exports by officers;
- introduce open direct messaging between minors without a later explicit
  requirement; or
- claim that the implementation is automatically COPPA or FERPA compliant.

Use account-governance age bands (`under_13`, `age_13_17`, `adult`) instead of date
of birth unless legally required. Under-13 self-service registration MUST remain
disabled. Under-13 onboarding MUST be school-managed or guardian-authorized.
Consent records MUST support media and other relevant permissions.

Product and technical documentation MUST state that institutional and legal review
is required for compliance.

## VII. Append-Oriented Auditability

Important events MUST create append-oriented audit records, including club-idea
submission, reviewer assignment, approval, rejection, requested changes, club
creation, role changes, officer promotion, member removal, charter and renewal
actions, attendance edits, email sends, media visibility changes, and
administrative overrides.

Audit records SHOULD include:

- `actor_id`
- `action`
- `entity_type`
- `entity_id`
- `school_id` when applicable
- `club_id` when applicable
- timestamp
- structured metadata

Passwords, tokens, email bodies, and unnecessary PII MUST NOT appear in audit
metadata.

## VIII. Protected Media

File binaries MUST use Supabase Storage, not PostgreSQL. Logical buckets include:

- `club-branding` for approved public branding;
- `club-media`, private by default;
- `club-documents`, private; and
- `course-assets`, governed by course visibility.

Large files SHOULD upload directly to Storage with resumable upload, progress, and
pause/retry where practical. Uploads MUST validate MIME type and size and create
PostgreSQL metadata records. Vercel Functions MUST NOT proxy entire large
binaries. Private assets MUST use signed URLs. S3-compatible credentials may be
used server-side only and MUST never reach the browser.

## IX. Performance and Scalability

The product targets excellent Core Web Vitals and responsive dashboards under
normal network conditions.

- Avoid large initial JavaScript bundles and N+1 query patterns.
- Optimize images and lazy-load video.
- Server-render data-heavy screens where practical.
- Paginate large tables, preferring cursor pagination where appropriate.
- Add indexes for common filters and tenant-scoped access patterns.

## X. Accessibility and Responsive Design

Target WCAG 2.2 AA. All functionality MUST support keyboard operation, visible
focus, semantic headings, labels, sufficient contrast, accessible dialogs, and
table equivalents for chart data. Use ARIA only where necessary. Motion MUST honor
`prefers-reduced-motion`.

Interfaces MUST remain usable at 375px, tablet, laptop, 1440px desktop, and larger
desktop widths. Dense administration tables SHOULD use mobile summaries rather
than compressed desktop tables.

## XI. Product Design

BayAreaClubs MUST use a consistent design-token system and should feel comparable
to excellent modern SaaS products. It MUST remain understandable for younger
students without appearing childish to high-school and college users.

Avoid generic Bootstrap styling, excessive gradients, excessive rounded cards,
pervasive fake glassmorphism, cartoonish school imagery, and childish visual
language.

## XII. Honest, Complete Experiences

Placeholder architecture is prohibited. Do not ship TODO controls, fake analytics,
hard-coded production metrics, fake login, fake database responses, or fake event
submission. Seed data belongs only in explicit development seed scripts.

Every asynchronous experience MUST include loading, empty, success, and failure
states. Forms MUST preserve useful state after validation failures. Unexpected
server failures MUST display a traceable error ID without exposing stack traces.

## XIII. Observability

Implement structured server logs, meaningful error boundaries, Vercel Analytics,
and Vercel Speed Insights. Keep observability boundaries modular so Sentry or an
equivalent can be added without an architectural rewrite.

## XIV. Security Baseline

Implement secure headers and a compatible CSP, input validation, output escaping,
rate limiting for abuse-sensitive endpoints, CSRF-safe mutations, server-side
authorization, RLS, protected signed URLs, allow-listed upload MIME types,
file-size limits, and safe email-recipient selection.

Secrets MUST NOT be committed. Privileged keys MUST NOT be used client-side.
Officers MUST NOT supply arbitrary bulk-email recipient addresses.

## XV. Required Verification

Critical behavior MUST have unit, integration, RLS, and/or browser tests
proportional to risk. The minimum Playwright workflows are:

1. authenticated student submits a club idea;
2. reviewer reviews the idea;
3. reviewer requests changes;
4. student resubmits;
5. reviewer approves;
6. approved idea converts to a club;
7. officer invites or adds members;
8. attendance session is created;
9. attendance is recorded;
10. event is created;
11. RSVP is recorded;
12. charter is submitted;
13. renewal is approved;
14. newsletter is generated and sent;
15. STEM course is subscribed to;
16. unauthorized club access is denied;
17. unauthorized admin access is denied; and
18. private media is inaccessible without authorization.

## XVI. Change Discipline and Completion

Before major architectural changes, inspect the existing project, preserve working
features, update migrations and tests, and explain migration impact. Working
modules MUST NOT be rewritten solely for stylistic preference.

A feature is complete only when its UI, backend, schema, RLS, validation,
loading/error/empty states, responsive behavior, accessibility, and important
tests are complete, with no TypeScript or ESLint errors and a successful
production build.

Every implementation handoff MUST report:

- IMPLEMENTED
- FILES CHANGED
- DATABASE CHANGES
- SECURITY/RLS CHANGES
- TESTS ADDED
- TEST RESULTS
- BUILD RESULT
- KNOWN LIMITATIONS

## Governance

This constitution is the highest-priority repository engineering policy. Feature
specifications, plans, code, migrations, reviews, and releases MUST conform to it.
Where instructions conflict, this constitution controls unless its sole committee
member formally amends it.

### Constitution Committee

The constitution committee has exactly one member:

- **Mittansh Bhatia**

No other person, account, role, organization, or automated agent is a committee
member. Committee membership changes require a constitutional amendment approved
by Mittansh Bhatia.

### Amendment Procedure

An amendment MUST:

1. be approved by Mittansh Bhatia;
2. update this document in version control;
3. state its migration and compatibility impact;
4. update `Last amended`;
5. increment the semantic version:
   - MAJOR for incompatible governance or principle changes;
   - MINOR for a new principle or materially expanded obligation;
   - PATCH for clarifications that do not change obligations; and
6. update dependent templates, rules, tests, or documentation in the same change.

All implementation reviews MUST verify constitutional compliance. Exceptions MUST
be explicit, narrowly scoped, time-bounded, documented with risk and remediation,
and approved by Mittansh Bhatia.
