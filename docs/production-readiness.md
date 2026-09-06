# BayAreaClubs production readiness

Date: 2026-09-06  
Scope: security, RLS, privacy, accessibility, performance, observability, tests.  
**This document does not claim legal certification, COPPA/FERPA compliance, or institutional approval.**

## Verdict

P0 blockers found during this pass were fixed in schema and application code and pushed to the linked Supabase project. Remaining items are P1/P2 or **institutional policy decisions** that engineering cannot close alone.

Verification run (this pass):

| Check | Result |
| --- | --- |
| `pnpm lint` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` (Vitest) | pass |
| `pnpm db:test` (pgTAP) | pass |
| `pnpm build` | pass |
| `pnpm e2e` (Playwright + axe) | pass |

---

## P0 — blocking (resolved)

| ID | Finding | Resolution |
| --- | --- | --- |
| P0-1 | `resolve_email_audience_user_ids` / `count_email_audience` were callable by any authenticated user who knew a `club_id` (SECURITY DEFINER without manager check). | Require `can_manage_club` for JWT callers; service_role/postgres workers remain allowed. Migration `20260906110000_production_readiness_hardening.sql`. |
| P0-2 | Cross-user probes via `is_platform_admin(uuid)`, `is_club_member(club, user)`, etc. | Soft-deny unless self or platform admin (`may_inspect_user`). |
| P0-3 | Helper rewrite briefly used named `user_id` parameters that **shadowed table columns**, making `has_club_role` / `has_school_role` match any member with a role (cross-tenant). | Positional `$1/$2/$3` + table aliases. Migration `20260906110100_fix_helper_param_shadowing.sql` (also corrected in `…110000`). |
| P0-4 | Club/school media visibility ignored consent when `consent_required`. | `can_view_media_asset` + select policy require granted consent (uploader / school admin / platform admin still covered). |
| P0-5 | Student officers could write media consents for under-13 subjects. | Under-13 consent writes limited to guardian / school admin / platform admin. |

---

## P1 — important (resolved or partially resolved)

| ID | Finding | Status |
| --- | --- | --- |
| P1-1 | `enqueue_renewal_reminders` executable by `authenticated`. | **Fixed** — `service_role` only. |
| P1-2 | Cron routes accepted `?secret=` (leaks via logs/Referer). | **Fixed** — Bearer-only (`src/lib/security/cron-auth.ts`). Ensure Vercel Cron uses `Authorization: Bearer $CRON_SECRET`. |
| P1-3 | Auth callback `next` open-redirect edge cases. | **Fixed** — reject `//`, `\`, `@`, control chars, scheme-like paths. |
| P1-4 | SVG allowed in branding uploads (scriptable). | **Fixed** — bucket + app allowlists reject `image/svg+xml`. |
| P1-5 | PostgREST `.or()` search strings unsanitized. | **Fixed** — `escapePostgrestFilterValue` / `postgrestIlikeOr`. |
| P1-6 | `user_allows_email_category` preference oracle for arbitrary users. | **Fixed** — managers only for members of clubs they manage; self / service_role / platform admin. |
| P1-7 | Command palette `rank` ambiguous / bigint vs integer. | **Fixed** — `match_score` + integer cast (`…110200` / `…110300`). |
| P1-8 | Rate limits on auth / email send / upload prepare. | **Open** — rely on Supabase Auth + provider limits today; add app-level throttles before high-traffic launch. |
| P1-9 | Observability: structured logs exist; no paging SLO alerts. | **Open** — wire alerts on cron 5xx, auth spikes, RLS denial rates. |
| P1-10 | Dashboard Core Web Vitals not measured in CI against production URL. | **Open** — Speed Insights is installed; capture baseline LCP/INP/CLS on staging before cutover. |

---

## P2 — improvements

| ID | Finding | Notes |
| --- | --- | --- |
| P2-1 | Chart bundles now lazy-loaded via `next/dynamic` (`ChartCard`). | Continue lazy-loading heavy media/uploader panels where profiles allow. |
| P2-2 | SEO: root metadata title/description only; limited Open Graph / per-route titles. | Add OG images and route-level metadata for public marketing pages. |
| P2-3 | Automated axe covers landing + sign-in; not every dialog/table. | Expand Playwright axe to club roster, attendance, admin tables. |
| P2-4 | Manual a11y: reduced-motion helpers exist (`src/lib/motion.ts`); drag/drop alternatives should be verified per feature when shipped. | Spot-check focus traps on command palette + dialogs each release. |
| P2-5 | N+1 risk in some list UIs mitigated by batched selects; keep reviewing new admin lists. | Prefer single RPC/view for dense dashboards. |
| P2-6 | `next/image` used in media library; audit other `<img>` usages over time. | |

---

## Security review summary

Searched for: `SUPABASE_SECRET` / service role usage, client secret exposure, `dangerouslySetInnerHTML`, unvalidated params, client-only auth, RLS gaps, public storage, unguarded admin routes, arbitrary email recipients.

**Findings**

- Privileged keys stay server-side (`createAdminClient` / cron). No `dangerouslySetInnerHTML` usage found.
- Admin console is role-gated; email campaigns use audience enums + club scope (not free-form recipient lists).
- Storage buckets remain private; metadata gates path access.
- Auth uses App Router proxy pattern (no deprecated `middleware.ts`).

**Do not regress:** positional parameters in SQL helpers; Bearer-only cron; consent-gated media visibility.

---

## Database review summary

- Indexes / FKs / uniques: covered by prior domain migrations; no new unconstrained PII tables in this pass.
- Cascades: club-scoped data generally cascades; schools restrict where required.
- Grants: renewal enqueue locked to `service_role`.
- Slow/N+1: admin club list batches membership/renewal/activity queries; continue profiling with `analytics_daily_*` rollups.

---

## Privacy review (engineering posture)

| Area | Engineering posture | Institutional decision still needed |
| --- | --- | --- |
| Under-13 | Self-signup blocked; guardian flows; consent write restrictions tightened | Which school staff roles may grant media consent; retention for under-13 records |
| Student emails | Not stored on `profiles`; Auth holds email | School directory sync / disclosure rules |
| Rosters | Membership RLS; soft-deny on cross-user helper probes | Export approvals; parent portal scope |
| Attendance | Club/session scoped; officers manage | How long attendance is retained; who may export |
| Media | Consent required for club/school visibility; private buckets | Public marketing use of student media; watermarking |
| Consent | Guardians / school admins / platform for under-13 | Written policy templates signed by schools |
| Analytics | Aggregates + platform-admin insights CSV | Whether schools may download student-level exports |
| Audit logs | Append-oriented admin visibility | Retention period and legal hold process |

**No compliance certification is asserted.**

---

## Accessibility

- Automated: Playwright + `@axe-core/playwright` on landing and sign-in (zero violations with `prefers-reduced-motion: reduce` in the landing axe run).
- Token tweaks this pass: darker `--muted-foreground`, `--accent`, `--success`, `--warning` for WCAG AA on light surfaces; hero workflow preview contrast hardened.
- Manual checklist for release: skip links / landmark nav, dialog focus return, form errors associated with inputs, table headers, chart text alternatives (`role="img"` + `sr-only` table), command palette keyboard, `prefers-reduced-motion`.

---

## Performance

**Targets:** LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1.

- Production measurement: Vercel Speed Insights (root layout).
- Bundle: Recharts loaded only when `ChartCard` mounts (`ssr: false` dynamic import).
- Images: prefer `next/image` with explicit sizes for club media.

Capture a staging Lighthouse/CWV report before production cutover and attach numbers here.

---

## Error handling & observability

- Cron and processors use structured `logger` events; fail closed without `CRON_SECRET`.
- Health: `/api/health`, `/api/health/ready`.
- Gap: alerting/on-call runbooks (P1-9).

---

## Responsiveness

- Dashboard and marketing layouts use existing design-system breakpoints; command palette has mobile full-screen sheet. Spot-check attendance and admin tables on ≤375px before launch.

---

## Test coverage

- Unit (Vitest), RLS/workflow (pgTAP including `014_production_readiness.test.sql`), e2e + axe.
- No ignored failures in the gates listed above.

---

## Deploy checklist

1. Confirm migrations through `20260906110300_*` applied on linked project.
2. Confirm `CRON_SECRET` set and Vercel Cron sends Bearer token only.
3. Confirm no `SUPABASE_SECRET_KEY` / service role in client bundles.
4. Staging CWV snapshot meets targets (or documented exceptions).
5. Institutional privacy decisions table reviewed by school partners (not engineering-only).
