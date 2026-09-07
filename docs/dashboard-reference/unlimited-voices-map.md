# Unlimited Voices — Information Architecture Map

**Status:** Authorized-repo reference only (Agent 01)  
**Inspected:** `/Users/I034762/UnlimitedVoices`  
**Remote named in contract:** `https://github.com/mittanshbhatia/unlimitedvoices.git`  
**License observed:** MIT, Copyright 2024 Unlimited Voices - mittansh  
**Authorized-repo:** YES  

This document is a paraphrase of product structure. It is **not** a license to copy Unlimited Voices (UV) source, CSS, HTML, images, APIs, SAT/quiz banks, or course text into BayAreaClubs (BAC).

UV is a youth STEM / contest / course platform. BAC is a multi-school club operating system with an attached original STEM/AP catalog. Shared owner and an MIT license do **not** make UV a template to paste.

---

## Authorization model (read this first)

UV authorizes with **NextAuth** plus a **single global `users.role`** column. Observed values:

- `user` — default signed-in learner
- `chapter_lead`
- `director`
- `administrator`
- `owner`

Role helpers look up that one column by email. Owner/administrator can change other users’ roles. A specific personal email is hard-coded as always-owner in UV. Admin APIs use a privileged Supabase service-role client. Hackathon staff is a role allow-list on the same column (`owner`, `administrator`, `director`, `chapter_lead`).

**BayAreaClubs MUST NOT adopt this model.**

BAC authorization is **assignment-based and RLS-enforced**:

- Platform authority comes from persisted `platform_role_assignments`.
- School authority comes from active `user_school_memberships` (school dashboard only for `school_admin`, `school_advisor`, `staff`, plus `platform_admin`).
- Club authority comes from active `club_memberships` and existing officer/manager helpers.
- A person may hold different roles in different schools and clubs.
- Browser query params, cookies, and hidden fields are hints only. They never grant permission.
- Hiding a nav module never grants or revokes permission.
- Do not hard-code emails as roles. Do not treat `profiles.role` as the full authority model. Do not expose a service-role key to the client.

UV’s role UI (a dashboard “Admin Panel” that rewrites a global role) is a **must-not-copy** pattern. BAC already has `/admin` and membership tables; extend those.

---

## Dashboard information architecture

UV’s signed-in home is a **single personal dashboard** at `/dashboard`. It is not a multi-context operating center.

### How “sections” work

The dashboard keeps one shell and swaps the main pane by **query string**: `?section=<id>`. Missing `section` means the home pane. An older `math-games` value is rewritten to `puzzles`. There is no club/school/platform context switcher. There is no server-resolved list of authorized contexts.

BAC already decided the opposite: contexts `personal | club | school | platform`, resolved server-side, with a URL hint that may **select among authorized contexts only**. Do not import UV’s `?section=` as BAC’s context model.

### Sidebar groups (signed-in)

Desktop uses a **persistent left sidebar**. Groups observed:

| Group | Entries (section ids) | What it opens |
| --- | --- | --- |
| Learnings | `dashboard`, `coding-challenge`, `programming`, `data-science-ai` | Home; daily coding challenge; programming course list; data-science course list |
| Competitive | `previous-contests`, `math-contests`, `physics-contests`, `biology-contests`, `chemistry-contests` | Programming contest archive; math contest UI; subject quiz UIs |
| Other | `puzzles`, `blockchain` | Games; proof-of-learning / wallet-adjacent surface |
| Admin (role-gated) | `admin`, `newsletter-management`, plus a link out | Global role table; newsletter tools; `/admin/hackathons` |

Sidebar also has a search field (local UI), a user footer, and a mobile close control. Color-coded icons per item are part of UV’s carnival palette; BAC must not copy that.

### Home tiles (default pane)

The home pane is a **greeting + stat strip + weekly activity + colored stat cards + course tile grid**:

1. Time-of-day greeting and display name.
2. Compact gamification strip: level, streak days, XP, plus a wallet/reward badge.
3. Seven-day activity chart (counts, time, XP).
4. Three pastel stat cards: today’s XP, next milestone/streak, active courses (empty state offers a start action).
5. “My Courses” grid of large tiles. Each tile has a thumbnail or gradient header, status/preview badge, short description, and a percent progress bar. Clicking a tile jumps to a course player or another dashboard section.

This is a **learning arcade**, not a club operating home. BAC’s personal home is specified as greeting, My Day / Next, clubs, learning, activity, and role-aware actions — **not** a grid of fake stat cards, XP wallets, or rainbow course tiles.

### Dedicated dashboard routes (not just `?section=`)

- `/dashboard/hackathons` and `/dashboard/hackathons/certificates`
- `/dashboard/newsletter-preferences`

These sit beside the sectioned shell rather than replacing it.

---

## Role surfaces

UV does **not** switch “operating centers.” One dashboard, extra sidebar items if the global role is privileged.

### Student / default `user`

- Public marketing and catalog routes.
- `/dashboard` home, courses, contests, puzzles, daily challenge, profile (`/profile`, `/profile/[userId]`).
- Contest leave-guard when a quiz is in progress.
- No school command center. No club membership graph. “Chapter” is a public location page, not a tenant they administer unless they also hold a staff role.

### Admin / `administrator` and `owner`

- Same learner dashboard **plus** an Admin sidebar group.
- In-dashboard **Admin Panel**: paginated user table, role dropdown, reason field, short audit trail of role changes.
- Newsletter management in the same shell.
- `/admin/hackathons/*` — event staff console (problems, teams, submissions, judging, announcements, certificates, clarifications, leaderboard).
- Role mutation is global, not scoped to a school or club.

### Chapter / `chapter_lead` (and `director` for chapter-adjacent power)

- Public chapter directory: `/chapters` (card grid) and `/chapters/[slug]`.
- On a chapter detail page, people who `canManageChapters` (`chapter_lead`, `administrator`, `director`) see extra leader-only controls (events/media style tools). Ordinary visitors see the public chapter story.
- Chapter lead is still a **global user role**, not a membership row on that chapter.
- Chapter lead also appears on the hackathon admin allow-list.

**BAC mapping (inspire the idea, not the implementation):**

| UV surface | BAC surface (existing contract) |
| --- | --- |
| One personal dashboard | `/dashboard` personal operating center |
| No club context | `/clubs/[clubSlug]` + `ClubCommandNav` |
| Chapter public page + leader extras | School operating center at `/dashboard/schools/[schoolId]` for authorized adults only; students see the school name on personal home, not the school command center |
| In-dashboard Admin Panel | `/admin` platform console; add Dashboard Configuration; do not embed a global role editor in `/dashboard` |
| Hackathon admin subtree | Keep BAC admin as `/admin/*`; do not invent `/dashboard/club/*` |

---

## Navigation patterns

### Public header

Sticky top bar (`HomeNavigationBar` + sitelink menu). Primary public destinations:

- Courses → `/start-learning` (also highlights `/courses`, `/python-course`, `/java-course`, `/data-science-course`, `/sat-course`)
- Hackathons → `/hackathons` (and practice siblings)
- Daily Challenge → `/daily-challenge`
- Math Contests → `/math-contests`
- STEM Arcade → `/stem-arcade`
- Sign up / Dashboard depending on session

This is a **marketing header**, visually heavy (gradient, blur). BAC already has header utilities (command palette, notifications, profile, sign out). Keep those; do not restyle them as UV’s blue-glass bar.

### Signed-in dashboard

**Sidebar-primary.** Header still appears on the dashboard page, but day-to-day movement is the left nav. Desktop sidebar stays put; below the large breakpoint it becomes a hamburger + overlay drawer. The home pane then uses **tiles** as a second way to jump into courses and sections.

### No context switcher

UV never asks “which chapter / school / club am I operating as?” BAC must add an **accessible combobox** of authorized contexts only. That is a BAC invention, not a UV clone.

### Club-like horizontal nav (UV hackathons only)

Hackathon student pages use a **horizontal sub-nav** (overview, register, problems, submissions, leaderboard, rules, clarifications). BAC’s club command already uses horizontal section nav; keep that pattern on `/clubs/[slug]` and do not replace it with UV’s sidebar.

---

## Learning / course entry points (routes only)

Public catalog and landings:

- `/start-learning` — filterable catalog of courses and platform experiences
- `/courses` — course hub listing
- `/python-course` — public landing
- `/java-course` — public landing
- `/data-science-course` — public landing
- `/sat-course` — SAT course landing
- `/digital-sat` — Digital SAT surface

Authenticated players (not public SEO landings):

- `/python-course/learn`
- `/java-course/learn`
- `/data-science-course/learn`

Dashboard mirrors:

- `/dashboard` (home tiles)
- `/dashboard?section=programming`
- `/dashboard?section=data-science-ai`
- `/dashboard?section=coding-challenge`
- `/dashboard?section=puzzles`
- `/dashboard?section=blockchain`

Practice / contest siblings (not BAC AP routes):

- `/daily-challenge`
- `/practice/hackathons`, `/practice/hackathons/[problemSlug]`
- `/math-contests`, `/physics-contests`, `/biology-contests`, `/chemistry-contests`, `/programming-contests`
- `/stem-arcade`
- `/hackathons`, `/hackathons/[slug]`, nested problem/register/submit routes

**BAC learning routes stay on the contract map.** Do not create UV-style `/{lang}-course/learn` trees. Use:

- `/dashboard/learning` and `/resources` (existing STEM)
- `/dashboard/learn`, `/dashboard/learn/ap`, `/dashboard/learn/ap/[namespace]`, unit/lesson/practice/tests as specified

UV course **bodies**, SAT generators, quiz banks, and lesson copy stay in the UV repo.

---

## What BayAreaClubs should INSPIRE

Structural ideas only. Rebuild with Peninsula tokens, existing BAC components, and assignment-based RLS.

1. **Grouped modules** — cluster nav into Learn / Operate / Admin-like sections instead of a flat dump of links. BAC’s module registry (`dashboard_modules` + typed mirror) is the place for this, not a copied sidebar array.
2. **Greeting then next work** — lead with the person’s name and the next useful action. In BAC that is My Day / Next (event RSVP, attendance item, next lesson, idea needing action), not XP.
3. **Catalog scanability** — subject or path filters before a long list. BAC: paginated STEM + AP catalog, published courses only.
4. **Progress on the card** — a quiet percent or lesson-complete cue so the catalog is scannable. Use `--progress-track` / `--progress-fill` derived from primary green / accent teal. No rainbow bars.
5. **Desktop sidebar vs mobile sheet** — persistent sidebar from 768px up; mobile top bar + sheet or overflow. Do not squeeze the desktop sidebar into 375px. Mandatory modules stay reachable.
6. **Two-step course entry** — public catalog card → authenticated player. BAC already has `/resources` and will add `/dashboard/learn/...`.
7. **Honest empty states** — “no active courses yet” plus a working Start action. Every async pane needs empty/loading/error.
8. **Leave confirmation when work is in progress** — conceptual only (unsaved attendance, in-progress attempt). Implement with BAC dialogs and `prefers-reduced-motion`; do not copy UV’s contest modal.
9. **Staff tools separated from learner home** — UV hides Admin until the role allows it. BAC should go further: school/platform consoles are different routes with server guards, not a red item on the student sidebar.
10. **Horizontal command nav for a single tenant** — UV does this for a hackathon; BAC already does it for a club. Keep `/clubs/[slug]` as the club command center.

---

## What BayAreaClubs MUST NOT copy

- Any UV source file, component, CSS class set, HTML, SVG, image, thumbnail, or asset.
- SAT / quiz / contest question banks, explanations, video scripts, or generators.
- Course lesson text, labs, or “foundations” curricula.
- NextAuth session-as-authority, a single `users.role`, hard-coded owner email, or client-visible service-role usage.
- XP, wallets, coins, blockchain credentials, or leaderboard-as-identity on a student dashboard.
- Purple / pink / rainbow fonts, buttons, progress bars, or tile headers. Dashboard learning chrome derives from Peninsula primary `#0f5c44` and accent `#086874` only.
- Fake glassmorphism, blob-animated headers, emoji-heavy milestone copy, or a carnival of pastel stat cards.
- UV’s `?section=` as BAC’s permission or context system.
- A new `/dashboard/club/[slug]` tree.
- UV partnership, volunteer, or adoption numbers stated as BAC facts.
- OpenAI/Anthropic callers. BAC content is human-authored originals; keys are not configured for the app.

---

## Alignment with the dashboard contract

| Topic | UV | BAC (binding) |
| --- | --- | --- |
| Auth | NextAuth + global role | Supabase Auth + RLS assignments |
| Home | Arcade + XP + tiles | Operating center: My Day, clubs, learning, activity |
| Club | None as context | `/clubs/[clubSlug]` |
| School / chapter | Public pages + global chapter_lead | School dashboard for authorized adults only |
| Learning | Separate `*-course/learn` apps | `/dashboard/learn` + existing STEM tables |
| Admin | In-dashboard role editor | `/admin` + `/admin/dashboard-config` |
| Tokens | Blue/purple/pink | Peninsula green/teal; no purple UI chrome |

Agents implementing the operating center should read this map for IA inspiration, then implement only against `docs/architecture/dashboard-operating-center.md` and the constitution.
