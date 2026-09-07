# Dashboard Operating Center — Architecture Contract

**Status:** Binding for the 2026-09-06 dashboard / learning upgrade  
**Owner:** Constitution committee (Mittansh Bhatia)  
**Agents MUST follow this document.** Do not invent parallel auth, role, routing, or catalog systems.

This is an internal implementation contract. It is not a claim of COPPA/FERPA compliance, partnerships, or adoption metrics.

---

## 1. Audit conclusions (do not re-litigate)

### Reuse

| Existing | Keep / extend |
| --- | --- |
| `requireActiveUser`, `requireClubMember`, `requireClubOfficer`, `requireClubManager`, `requirePlatformAdmin`, `requireAdminConsoleAccess`, `requireCommitteeReviewer` | Extend; do not duplicate |
| `requireSchoolAccess` | **Too broad for school dashboard** (any school membership including `student`). Add `requireSchoolDashboardAccess` for `school_admin`, `school_advisor`, `staff`, and `platform_admin` only |
| `/dashboard` | Personal operating center (upgrade in place) |
| `/clubs/[clubSlug]` + `ClubCommandNav` | Club command center (already superior). Do **not** add `/dashboard/club/[slug]` |
| `/dashboard/clubs/[clubId]` | Keep redirects to `/clubs/[slug]` |
| `/dashboard/schools/[schoolId]` | School operating center (upgrade in place). Schools already have slugs; resolve `schoolId` **or** slug in this segment, then authorize server-side |
| `/admin` | Platform staff console. Add one section: Dashboard Configuration |
| `/dashboard/learning` + `/resources` | Existing STEM catalog / subscriptions. Do not break |
| `stem_courses`, `stem_course_modules`, `stem_resources`, `course_subscriptions`, `course_progress`, `club_learning_collections`, `club_resource_recommendations`, `stem_course_metrics` | Reuse for STEM and as AP course parent |
| `publication_status`: `draft`, `review`, `scheduled`, `published`, `archived` | Add value `approved` for learning lifecycle |
| Events, attendance, charters, renewals, notifications, insights, media, communications | Query via existing feature modules |
| Storage buckets `club-branding`, `club-media`, `club-documents`, `course-assets` | Reuse. No new buckets. Private + signed URLs |
| Cron: communications, renewal-reminders, refresh-analytics + `requireCronBearer` | No new cron unless a later agent proves a durable job is required. Do **not** generate course content in HTTP requests |
| Design tokens (Peninsula): primary green, accent teal | Learning tokens derive from these. Do not add purple fonts/buttons on dashboard |
| `sanitizePlainText` / `containsUnsafeContent` | Reuse for home content. No arbitrary HTML |

### Do not copy

- Unlimited Voices source, CSS, JS, images, course/SAT/quiz banks, or assets into this repo (map document is allowed).
- Stellar Learning UI pixels, HTML/CSS/JS, lesson text, questions, or recordings (principles document is allowed).
- Fake metrics, partnerships, or adoption numbers.

### Unlimited Voices

Authorized local clone exists at `/Users/I034762/UnlimitedVoices` (owner `mittanshbhatia`, MIT License, remote `https://github.com/mittanshbhatia/unlimitedvoices.git`). Agent 01 may inspect it and write `docs/dashboard-reference/unlimited-voices-map.md` only. No UV source/assets committed.

### Stellar Learning

Visual/UX reference only (`https://stellarlearning.app/app/courses`). Playwright artifacts **only** under `/tmp/bac-stellar-reference-<timestamp>/` and **deleted** before finish. Principles-only markdown may be committed.

### AI providers

`OPENAI_API_KEY` / `ANTHROPIC_*` are **not** configured for the app (only a commented Supabase config key). Do **not** add client or server OpenAI/Anthropic callers. Content is human-authored originals. If a provider-neutral stub is needed, it must no-op when keys are absent and never auto-publish.

---

## 2. Context model (server-side only)

Contexts: `personal` | `club` | `school` | `platform`.

Resolve in `src/features/dashboard/context.ts` (`resolveDashboardContext`):

1. Authenticate with `requireActiveUser`.
2. Load **persisted** `platform_role_assignments`, `user_school_memberships` (active), `club_memberships` (active). Never trust `school_id`, `club_id`, or `role` from the browser, query string, cookies, or hidden fields as authority.
3. A URL hint (`?context=club&club=slug`) may **select among authorized contexts** only. Unauthorized hints fall back to `personal`.
4. Return `{ actor, activeContext, availableContexts, permissions }`.

Permission derivation:

- `personal`: every active user.
- `club`: active `club_memberships` row. Officer/manager extras from existing role helpers / `can_manage_club`.
- `school` dashboard: `platform_admin` OR school role in (`school_admin`, `school_advisor`, `staff`). Students see the school name on the personal home, not the school command center.
- `platform`: `platform_admin` (committee reviewer keeps `/admin` via existing console access, not the platform operating context unless they are also platform admin).

Hiding a nav module **never** grants or revokes permission.

---

## 3. Route map (compatible with current app)

| Surface | Route | Notes |
| --- | --- | --- |
| Personal home | `/dashboard` | Greeting, My Day, clubs, learning, activity, role-aware actions |
| Notifications | `/dashboard/notifications` | Keep |
| Profile | `/dashboard/profile` | Keep |
| Insights (member) | `/dashboard/insights` | Keep |
| STEM my-learning | `/dashboard/learning` | Keep existing STEM subscriptions |
| AP / structured learn | `/dashboard/learn` | New. Catalog + progress |
| AP namespace | `/dashboard/learn/ap` | Index of AP courses |
| Course | `/dashboard/learn/ap/[namespace]` | e.g. `ap-csp` |
| Unit | `/dashboard/learn/ap/[namespace]/[unitSlug]` | |
| Lesson | `/dashboard/learn/ap/[namespace]/[unitSlug]/[lessonSlug]` | |
| Practice | `/dashboard/learn/ap/[namespace]/practice` | |
| Tests | `/dashboard/learn/ap/[namespace]/tests` | |
| Club command | `/clubs/[clubSlug]` | Existing; enhance overview |
| School command | `/dashboard/schools/[schoolId]` | Accept UUID or slug |
| Platform | `/dashboard/platform` | Existing; keep STEM admin links |
| Admin config | `/admin/dashboard-config` | New; platform admin only |
| Admin learn review | `/admin/learn` | Platform admin review queue |

Do not create conflicting `/dashboard/club/*` routes.

---

## 4. Module registry

Not a hardcoded sidebar copied on every page. Catalog lives in `dashboard_modules` (seeded) plus typed TS mirror `src/features/dashboard-config/registry.ts`.

### Metadata (required)

`id`, `slug`, `label`, `description`, `icon` (Lucide name), `route` (template), `context_types[]`, `required_permissions[]`, `default_enabled`, `display_order`, `section`, `mobile_visibility` (`always` \| `overflow` \| `hidden`), `feature_flag` (nullable), `status` (`active` \| `deprecated`), `mandatory` (cannot be disabled).

### Seeded modules

| id | contexts | mandatory | route |
| --- | --- | --- | --- |
| `home` | personal, club, school, platform | yes | context home |
| `my-day` | personal | no | `/dashboard#my-day` |
| `my-clubs` | personal | no | `/dashboard#clubs` |
| `learning` | personal, club | no | `/dashboard/learn` |
| `stem-resources` | personal, club | no | `/resources` |
| `ideas` | personal | no | `/start-a-club` |
| `notifications` | personal | no | `/dashboard/notifications` |
| `insights` | personal, club, school, platform | no | existing insights routes |
| `profile` | personal | yes | `/dashboard/profile` |
| `club-overview` | club | yes | `/clubs/:slug` |
| `club-members` | club | no | `/clubs/:slug/members` |
| `club-attendance` | club | no | `/clubs/:slug/attendance` |
| `club-events` | club | no | `/clubs/:slug/events` |
| `club-charter` | club | no | `/clubs/:slug/charter` |
| `club-media` | club | no | `/clubs/:slug/media` |
| `club-highlights` | club | no | `/clubs/:slug/highlights` |
| `club-comms` | club | no | `/clubs/:slug/communications` |
| `club-resources` | club | no | `/clubs/:slug/resources` |
| `school-clubs` | school | yes | school home |
| `school-applications` | school | no | ideas/admin scoped |
| `school-charters` | school | no | charters scoped |
| `school-events` | school | no | events scoped |
| `school-attendance` | school | no | aggregates |
| `school-learning` | school | no | aggregate learning usage |
| `platform-admin` | platform | yes | `/admin` |
| `platform-audit` | platform | yes | `/admin/audit` |
| `dashboard-config` | platform | no | `/admin/dashboard-config` |

Governance modules that **cannot** be disabled: `home`, `profile`, `club-overview`, `school-clubs`, `platform-admin`, `platform-audit`.

### Config hierarchy (later wins for enable/order, never for permission)

1. Global default (`scope_type=global`)
2. School override (`scope_type=school`)
3. Club override (`scope_type=club`)
4. Role/permission filter (computed; cannot enable a module the actor cannot access)
5. User preference (`scope_type=user`) — hide/reorder only

---

## 5. Schema (Agent 02 + Agent 09)

### Agent 02 migration `supabase/migrations/20260907020000_dashboard_operating_center.sql`

```
alter type publication_status add value if not exists 'approved';

dashboard_context_type enum: personal, club, school, platform
dashboard_module_status enum: active, deprecated
dashboard_mobile_visibility enum: always, overflow, hidden
dashboard_config_scope enum: global, school, club, user
dashboard_home_module_type enum: announcement, featured_courses, featured_resources, featured_events, deadline, school_message

dashboard_modules — catalog (seed rows listed above)
dashboard_module_configs — scope overrides (enabled, display_order). Unique per (module_id, scope_type, school_id, club_id, user_id)
dashboard_home_content — typed modules; body is plain text (no HTML); payload jsonb constrained by type
dashboard_home_content_revisions — append-only audit of content changes
dashboard_user_preferences — last_context_type, last_club_id, last_school_id, updated_at

RLS enabled on every table.
Helpers may be SECURITY DEFINER with empty search_path, matching existing style.

stem_courses additions (nullable, backward compatible):
  course_kind text not null default 'stem' check (course_kind in ('stem','ap'))
  course_namespace text unique  -- e.g. ap-csp; required when course_kind=ap
  source_basis text not null default 'ORIGINAL' check (source_basis in ('ORIGINAL','LICENSED_EXTERNAL'))
  framework_code text
  framework_year integer
  approved_at timestamptz
  approved_by uuid references profiles
```

Update `sync_stem_course_publish_flags` so `approved` is **not** public (`is_published=false`). Only `published` is public. Transition: `draft → review → approved → published → archived`. `scheduled` remains for STEM.

### Agent 09 migration `supabase/migrations/20260907021000_learning_platform.sql`

Reuse `stem_course_modules` as units. Add:

```
learning_lessons
  id, course_id, module_id, namespace (denormalized, must match course), slug, position,
  title, body_plain, estimated_minutes, status publication_status,
  unique (course_id, slug), unique (module_id, position)

learning_questions
  id, course_id, namespace, module_id, lesson_id nullable, slug,
  prompt, choices jsonb (array of {id, text}), answer_key jsonb (server-visible via RLS),
  explanation, question_type (multiple_choice|short_response),
  objective_codes text[], difficulty, source_basis default 'ORIGINAL',
  status, version int, created_by
  unique (namespace, slug)

learning_question_versions — append-only snapshots

learning_attempts — user_id, question_id, course_id, response jsonb, is_correct, created_at
  unique-enough for history; students see only own rows

learning_review_events — course_id, actor_id, from_status, to_status, notes, created_at
  append-only; AI cannot write publish/grade/permission changes

school_course_features / extend club_resource_recommendations for AP
  (prefer extending club_resource_recommendations; add school_course_features for schools)
```

Answer keys: students cannot SELECT `answer_key` on unpublished or unattempted keys. Prefer a view `learning_questions_student` that omits `answer_key` and a privileged select for graders/admins. Attempts remain private (own user only). Officers see **aggregates** (counts), not another student's answers.

No binaries in Postgres. Lesson media uses `course-assets` + `media_assets`.

---

## 6. Home content types (Zod, no HTML)

Reuse sanitize helpers. Payload schemas:

- `announcement`: `{ title, body }`
- `featured_courses`: `{ courseIds: uuid[] }` (must be published)
- `featured_resources`: `{ courseIds: uuid[] }`
- `featured_events`: `{ eventIds: uuid[] }` (visibility-checked)
- `deadline`: `{ title, dueAt, href? }`
- `school_message`: `{ title, body }` (school scope only)

Audit every insert/update/delete on `dashboard_home_content`.

---

## 7. UI / shell (Agent 04)

- Desktop (≥768px): persistent sidebar from **resolved** module registry. Do **not** squeeze the desktop sidebar into 375px.
- Mobile: top bar + sheet or bottom overflow. Mandatory modules remain reachable.
- Context switcher: only authorized contexts; accessible combobox/select (keyboard).
- Keep existing header utilities (command palette, notifications, profile, sign out) or fold them into the shell without dropping them.
- Admin `/admin/*` may keep `AdminCommandNav` plus a link to dashboard-config.
- Club `/clubs/[slug]` keeps horizontal section nav; shell context switcher still available.

## 8. Surfaces

### Student / personal (Agent 05)

Greeting + display name, context switcher, **My Day / Next** (next event RSVP, next attendance-related item if any, next learning lesson, idea status needing action). My Clubs. Learning (STEM + AP). Activity (notifications / recent). Role-aware quick actions only. **Not** a grid of fake stat cards.

### Club (Agent 06)

Enhance existing `/clubs/[slug]` overview: identity, scoped metrics already present, next event, attendance trend, membership activity, learning tracks (`club_learning_collections`), highlights, comms, action required (`buildRecommendedActions`). Do not expose other clubs.

### School (Agent 07)

Clubs, applications, charters, renewals, events, **aggregate** attendance/learning, action items, deadlines. No extra student PII. No public ranking.

### Customization (Agent 08 only)

Admin → Dashboard Configuration: enable/disable/reorder with **keyboard alternatives** to drag/drop, preview sidebar, permission-aware. Must not write AP course content.

### Learning UX (Agent 09)

Learning tokens in `globals.css` + `@theme`:

```
--learning-background, --learning-surface, --course-accent,
--progress-track, --progress-fill, --course-border, --course-muted, --course-success
```

Derive from existing Peninsula tokens (primary/accent/success). Lucide only. Original cards inspired by polish, not pixel copies. Paginate catalog. `prefers-reduced-motion`. Pause/avoid offscreen animation.

---

## 9. AP course isolation (Agents 10+)

Each course owns **only**:

- `src/features/learn/courses/<namespace>/manifest.ts`
- `src/features/learn/courses/<namespace>/content.ts` (lessons + original questions)
- optional `supabase/seeds` **not** used in production
- insert path via Agent 09 loader keyed by `course_namespace`

Namespaces (do not overwrite others): `ap-csp`, `ap-csa`. Remaining AP catalog is a **P1 registry** in `src/features/learn/courses/registry.ts` (`status: planned`), not fake-published courses.

`source_basis` must be `ORIGINAL`. Official public AP CED/framework objective **codes** may be referenced. No mechanical rewrite of third-party questions. Similarity check is against **our own bank** (same namespace + other BAC questions), not scraped sites.

Ship **1–2 published skeletons** with real original questions (minimum: 1 unit, 2 lessons, 8 original questions each course). Do not claim a complete AP course.

---

## 10. Security / hostile cases (all DENY)

- Cross-club private data
- Cross-school admin
- Student opening school command center
- Forged `school_id` / `club_id` / `role` query params
- Disabled nav module used to escalate
- Unpublished/draft/review/approved (not published) AP content to anonymous or other students
- Another student's attempts/answers
- Answer keys before/without authorization
- Cron without Bearer
- Storage path guessing / public course-assets
- AI (if stubbed) auto-publish, grade change, permission change, cross-student access
- Committee reviewer treating themselves as platform context

---

## 11. File ownership (do not write outside your set)

Leftover local files **untouched**: `supabase/seed.sql`, `docs/development/`.

| Agent | Owns |
| --- | --- |
| 01 | `docs/dashboard-reference/**` only |
| 02 | `20260907020000_dashboard_operating_center.sql`; `src/features/dashboard/**`; `src/lib/validation/dashboard.ts`; `src/lib/auth/authorization.ts` (add school dashboard helper only); `src/types/database.generated.ts` after types gen; unit tests `tests/unit/dashboard-*.test.ts` |
| 03 | `supabase/tests/016_*.sql`, `017_*.sql`, `018_*.sql`; optional `20260907020100_dashboard_rls_hardening.sql` if 02 gaps |
| 04 | `src/components/dashboard/**` (shell, sidebar, mobile-nav, context-switcher); `src/app/(dashboard)/layout.tsx` |
| 05 | `src/app/(dashboard)/dashboard/page.tsx`; `src/components/dashboard/personal-home*.tsx` |
| 06 | `src/app/(dashboard)/clubs/[clubSlug]/page.tsx`; small extras under `src/components/dashboard/club-*` |
| 07 | `src/app/(dashboard)/dashboard/schools/[schoolId]/page.tsx`; `src/features/dashboard/school.ts`; `src/components/dashboard/school-*` |
| 08 | `src/features/dashboard-config/**`; `src/app/(dashboard)/admin/dashboard-config/**`; `src/features/admin/sections.ts` (add one item); home-content actions |
| 09 | `20260907021000_learning_platform.sql`; `src/features/learn/**` except `courses/ap-*`; `src/app/(dashboard)/dashboard/learn/**`; `src/app/(dashboard)/admin/learn/**`; learning tokens in `globals.css` + `design-tokens.ts`; `src/lib/validation/learn.ts` |
| 10 | `src/features/learn/courses/ap-csp/**` only |
| 11 | `src/features/learn/courses/ap-csa/**` only |
| SECURITY | `tests/unit/dashboard-security*.test.ts`; extra pgTAP if needed `019_hostile_dashboard.test.sql` |
| QA | `tests/e2e/dashboard-*.spec.ts`; a11y checks |

---

## 12. Quality gates

`pnpm lint`, `typecheck`, `test`, `db:test` (linked if local Docker unavailable), `build`, `e2e`.

Sole committer: Mittansh Bhatia `<mittanshbhatia@users.noreply.github.com>`. Never Co-authored-by.

Production behavior only. Every visible control works or is disabled with an explanation.
