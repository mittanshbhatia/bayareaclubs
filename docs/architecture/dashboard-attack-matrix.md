# Dashboard / learning attack matrix

Hostile cases from `docs/architecture/dashboard-operating-center.md` §10.
Every vector is **DENY**. Status is the unit/pgTAP result against current helpers.

| ID | Vector | Expected DENY | Tests | Status |
| --- | --- | --- | --- | --- |
| AM-01 | Cross-club private data | Club A cannot read Club B private rows; `requireClubMember` / `requireClubOfficer` / `requireClubManager` FORBIDDEN | `dashboard-security` AM-01; `019` AM-01; `016`/`018` club configs | DENY |
| AM-02 | Cross-school admin | School A admin cannot administer School B (`requireSchoolAccess`, `has_school_role`) | `dashboard-security` AM-02; `019` AM-02; `016` school configs | DENY |
| AM-03 | Student opens school command center | `requireSchoolDashboardAccess` DENY for `student`. `deriveDashboardContext` drops school context. Roles: `school_admin` / `school_advisor` / `staff` / `platform_admin` only | `dashboard-security` AM-03; `019` AM-03 | DENY |
| AM-04 | Forged `school_id` / `club_id` / `role` hints | `dashboardContextHintSchema` is `.strict()` and omits those fields. Unauthorized hint → `personal`. JWT claims are not `has_school_role` authority | `dashboard-security` AM-04; `019` AM-04; `018` forged writes | DENY |
| AM-05 | Disabled nav module used to escalate | `enabled=true` never grants a missing permission. `roleMayUseModule` / `resolveScopedModules` keep the module off | `dashboard-security` AM-05; `016` mandatory modules; `019` optional RLS | DENY |
| AM-06 | Unpublished AP content to anon/other students | Only `published` is learner-visible. `isStudentVisibleStatus` / `assertLearningTransition` DENY draft→publish and `approved` | `learn-security` AM-06; `019` AM-06; `017` lessons | DENY |
| AM-07 | Other student's attempts / answers | Students SELECT only own attempts (`getMyLearnProgress` uses session uid). RLS DENYs `listMyAttempts` with a foreign id | `learn-security` AM-07; `019` AM-07; `017`/`018` attempts | DENY |
| AM-08 | Answer keys leaked | Student reader uses `learning_questions_student` (no `answer_key`). `StudentQuestion` type omits the key. Client modules must not import authoring banks | `learn-security` AM-08; `017` answer_key; `019` AM-08 | DENY |
| AM-09 | Cron without Bearer | `requireCronBearer` → 401 (missing/wrong/query-string). Missing `CRON_SECRET` → 503 | `dashboard-security` AM-09 | DENY |
| AM-10 | Storage path guessing / public course-assets | Signed URLs require `media_assets` id + `can_view_media_asset`. Raw path is not an argument | `dashboard-security` AM-10; `019` AM-10 | DENY |
| AM-11 | AI stub auto-publish / grade / permission / cross-student | `requestLearningAssistance` always DENYs (`AI_UNAVAILABLE`). `isLearningAiEnabled()` is false. No OpenAI/Anthropic client in `src/` | `learn-security` AM-11 | DENY |
| AM-12 | Committee reviewer as platform context | Reviewer is **not** platform operating context. `requirePlatformAdmin` DENY. Hint `platform` → `personal`. `is_platform_admin()` false | `dashboard-security` AM-12; `019` AM-12; `018` publish | DENY |

## Residual notes (not silent allows)

| Note | Detail |
| --- | --- |
| `listMyAttempts(courseId, userId)` | Accepts a caller-supplied `userId`. Production callers must pass the session user. Cross-student SELECT is still DENY via RLS (`017`/`018`/`019`). Prefer binding to `requireActiveUser().id` when touching that helper. |
| Authoring banks | `src/features/learn/courses/ap-*/questions.ts` contain `answer_key` for seed/authoring. They are not imported by `"use client"` modules. Do not import them into client components. |
| `016`–`018` | Agent 03 owns primary dashboard/learning RLS. `019` adds cases those files do not: `has_school_role` command-center roles, forged JWT vs school helpers, unpublished STEM catalog, cross-student `course_progress`, unpublished `course-assets` path guessing. |
