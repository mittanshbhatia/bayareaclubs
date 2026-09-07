# Stellar Learning — UX Principles (visual reference only)

**Status:** Principles for BayAreaClubs dashboard / learning chrome  
**Target observed:** `https://stellarlearning.app/app/courses`  
**Also observed:** public marketing homepage at `https://stellarlearning.app/`  
**Playwright:** Attempted. Chromium headless was not installed in this environment, so this was **not** a complete clean-room Playwright session.  
**Access:** Limited. The course-list URL was reachable over HTTP (catalog chrome, section headings, filters, empty-subject fallback). Authenticated interiors (a personal “My Courses” desk, rooms, lesson players) were not instrumented. No lesson bodies, practice items, or question banks were captured or copied.

Temporary files, if any, lived only under `/tmp/bac-stellar-reference-*` and were deleted before handoff. **Zero** Stellar HTML, CSS, JS, screenshots, or recordings are in this repository.

Do not invent partnerships, adoption counts, or “we are like Stellar” claims. Do not add purple fonts or purple buttons to the BAC dashboard. Learning tokens derive from Peninsula primary green `#0f5c44` and accent teal `#086874`.

---

## Access note

| Attempt | Result |
| --- | --- |
| Playwright against `/app/courses` | Failed: browser binary missing (`npx playwright install` would be required). No screenshots retained. |
| HTTP fetch of `/app/courses` | Succeeded. Public catalog shell: browse heading, track chips, subject-group headings, “need more subjects” fallback. |
| HTTP fetch of marketing home | Succeeded. High-level loop and catalog-scan patterns only. Sample exam wording on that page was **not** transcribed into this repo. |

Principles below describe **layout, hierarchy, and restraint**. They are not a pixel spec and not a product endorsement.

---

## Peninsula mapping (required)

| Stellar-ish cue (do not copy) | BAC token / treatment |
| --- | --- |
| Accent on primary actions | `--primary` `#0f5c44`, hover `#0c4d39`, on-color `#ffffff` |
| Secondary / focus / links in-app | `--accent` `#086874`, muted `#d4f0f4`, focus/ring same teal |
| Page canvas | `--background` `#f4f6f4`, `--surface` `#ffffff`, `--border` `#d2d9d3` |
| Quiet supporting text | `--muted-foreground` `#3f4b44` |
| Progress fill | Derive `--progress-fill` from primary green; track from `--surface-muted` / `--border` |
| Success / complete | `--success` `#146338` and `--success-muted` `#d8f0e3` — not a third brand purple |
| Spacing | Existing 4px scale (`--space-1` … `--space-8`) |
| Radius | `--radius-md` / `--radius-lg` — not oversized “toy” pills on every card |
| Motion | `--duration-fast` 120ms / `--duration-base` 200ms; honor `prefers-reduced-motion` |
| Type | Existing display/body scale; no decorative purple headings |

`--chart-5` exists as a purple data series. That is for charts only. **Dashboard fonts, buttons, tabs, and progress bars stay green/teal/neutral.**

---

## Principles

### 1. Generous, even catalog rhythm

The course list reads as a **browse page**, not a packed admin table. A clear page title, a one-line purpose, then filters, then subject blocks. Cards and headings sit on a predictable vertical cadence.

**BAC:** Use `--space-6`–`--space-10` between home sections (My Day, clubs, learning). Inside a catalog grid, `--space-4` / `--space-5` gutters. Do not crush the learning catalog into the density of a charter table.

### 2. Title → filter → grouped inventory

Scan path is hierarchical: **Browse** first, then **track chips** (Recommended / exam-family style groupings), then **subject sections** with their own headings. People can skip whole families without reading every card.

**BAC:** Catalog filters are STEM vs AP (and later published namespaces), not UV contest categories. Section headings use `font-semibold` and primary or foreground — never purple. Paginate; do not dump an unbounded grid.

### 3. Card hierarchy: media, title, one status, one action

Course cards work when the eye hits **thumbnail or calm header → title → short descriptor → progress or status → open**. Extra badges stay scarce. The card is a single hit target.

**BAC:** Reuse existing bordered surface cards (`--surface`, `--border`, `--radius-lg`, `--shadow-sm` on hover only). Header wash may be `--primary-muted` `#d7ebe2` or `--accent-muted` `#d4f0f4`. No gradient rainbow headers. Primary CTA is green; secondary is outline/teal.

### 4. Progress is a quiet meter, not a trophy wall

Where progress appears in the public loop, it is a **single attached percent** on the thing you are studying (lesson or practice), not a dashboard of XP, coins, or streaks as identity.

**BAC:** Show lesson/module completion or a slim bar using `--progress-track` and `--progress-fill`. Prefer “Lesson 2 of 8” plus a bar over gamified levels. Club/school homes may show **aggregates** (counts), never another student’s answers. No wallet.

### 5. Catalog scanability over decoration

The list is scannable because **labels and grouping** do the work. Subject family names, course counts on a group, and filter chips beat illustrated chaos.

**BAC:** Each card: title, kind (`stem` / `ap`), published-only, estimated minutes if we have them, progress if subscribed. Use `--text-sm` for meta. Do not add cartoon covers or per-card neon.

### 6. Empty and incomplete families stay honest

The catalog admits gaps: subject headings with little or no inventory, a “need more subjects?” style fallback, and a marketing-track empty line when a filter has no courses. Alternatives (notes, flashcards, ask-a-tutor) are **Stellar’s product**, not BAC’s.

**BAC:** Empty catalog: “No published courses in this path yet” plus a working link to STEM `/resources` or `/dashboard/learning` if those have items. Planned AP namespaces stay `status: planned` — never fake-published. Loading / error / empty on every async list. No invented course counts.

### 7. Support tools stay beside the loop, not on top of it

The marketing loop presents a **short numbered path** (learn → try → prove) and keeps helper tools as a side cluster. The main column stays the course.

**BAC:** Lesson chrome: title, body, next/previous, practice entry. Club comms, Nova-like assistants, and flashcard products are out of scope. Do not add an AI tutor; providers are not configured and must not auto-publish.

### 8. Motion restraint

Public pages feel mostly **static**. Emphasis is spacing and type, not looping blobs or hover theaters.

**BAC:** Hover may lift shadow (`--shadow-md`) and move a chevron (`--duration-fast`). No autoplay Lottie, no offscreen animation. Honor `prefers-reduced-motion` (constitution). Pause or skip animation when offscreen.

### 9. Desktop: persistent structure; mobile: same hierarchy, fewer columns

Desktop catalog is a **wide browse** with room for chips + multi-column cards. Mobile should keep the same heading/filter/list order, not a different information architecture.

**BAC:** From 768px, dashboard sidebar is persistent (contract). At 375px, top bar + sheet/overflow; catalog becomes one column. Dense admin tables already use mobile summaries — do not force those summaries onto the learning catalog; just stack cards.

### 10. Neutral age, high contrast, few brand colors

The catalog reads as a **study tool**: light canvas, dark text, one accent for selection. It does not look like a toy store or a purple SaaS skin.

**BAC:** Foreground `#121a16` on `#f4f6f4`. Selected chip: primary green background or teal ring. Unselected chip: `--surface` + `--border`. Focus ring `#086874`. WCAG 2.2 AA. Do not introduce a purple brand for “learning mode.”

### 11. Filters are chips, not a second app

Track filters sit **above** the inventory as a single row (or wrapping row) of choices. They do not replace the page with a new shell.

**BAC:** Use existing Tabs/Toggle patterns from shadcn/Radix. Keyboardable. Filtered URL or state must not be treated as authorization. Unpublished/review/approved-not-published courses stay hidden from students (RLS).

### 12. One primary verb per card

Each course tile has a single obvious next step (open / continue). Secondary actions do not compete.

**BAC:** Published + not started → “Start”. In progress → “Continue”. Club/school featured lists deep-link only to published ids after visibility checks. Disabled controls explain why (constitution: no inert buttons).

---

## Explicit non-goals

- Do not recreate Stellar’s lesson player, question types, AI tutor, rooms, or exam calculator.
- Do not transcribe or rewrite Stellar (or UV) questions.
- Do not claim College Board, IB, or nonprofit partnerships.
- Do not put Stellar’s marketing metrics on BAC dashboards.
- Do not use purple as dashboard learning chrome, even if a reference UI does.

Implementation belongs to later agents using `docs/architecture/dashboard-operating-center.md` and existing Peninsula tokens in `src/app/globals.css`.
