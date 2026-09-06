# Contributing to BayAreaClubs

Thanks for helping improve BayAreaClubs. Please follow the engineering
constitution in [`.specify/memory/constitution.md`](.specify/memory/constitution.md);
it outranks other guidance when they conflict.

## Principles (short)

- Ship production behavior only—no inert buttons, no fake production data outside
  explicit seeds/tests.
- Prefer extending existing modules over duplicate implementations.
- Derive authorization from persisted memberships/assignments; never hard-code a
  user's role in app code as the sole authority.
- Keep student and private-club information non-public by default.
- Never bypass RLS or expose `SUPABASE_SECRET_KEY` / service credentials to the
  client (`NEXT_PUBLIC_*` is for publishable values only).

## Prerequisites

- Node.js ≥ 24 and pnpm `12.3.4` (see `packageManager` in `package.json`)
- Docker/Colima for local Supabase when changing schema or RLS

## Setup

```bash
git clone https://github.com/mittanshbhatia/bayareaclubs.git
cd bayareaclubs
cp .env.example .env.local
pnpm install
pnpm dev
```

For database work:

```bash
colima start   # if needed
pnpm db:start
pnpm db:reset  # local only — applies migrations + seed
```

## Branching and commits

- Branch from `main` for features and fixes.
- Keep commits focused; message should explain **why**.
- Sole git author for this repository is **Mittansh Bhatia**
  (`mittanshbhatia@users.noreply.github.com`). Do not add `Co-authored-by`
  trailers for agents or other accounts.
- Never commit `.env.local`, access tokens, or service keys.

## Before opening a pull request

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

When you touch schema or RLS, also run:

```bash
pnpm db:test
pnpm db:push:dry   # if targeting the linked remote
```

For UI that users can see, include responsive and accessibility checks. Prefer
Playwright + axe for marketing/auth surfaces (`pnpm e2e`).

## Pull requests

Use `gh pr create` (or the GitHub UI) with:

- a short summary of the change and why;
- a test plan checklist;
- notes on migrations, RLS, or env var additions;
- screenshots for visual changes when useful.

Do not merge with failing lint, types, unit tests, or build.

## Schema and RLS changes

- Add a new timestamped file under `supabase/migrations/`.
- Prefer `create or replace` / explicit `drop policy if exists` patterns already
  used in the repo.
- Add or extend pgTAP coverage under `supabase/tests/`.
- Apply to the linked remote only via `pnpm db:push` after dry-run review.
  **Never** seed production.

## Security-sensitive work

See [SECURITY.md](SECURITY.md). Prefer fixing authorization in Postgres RLS and
server actions together. Cron and admin paths must remain fail-closed.

## Questions

Architecture notes live under `docs/architecture/`. Product notes under
`docs/product/`. Production readiness findings are in
`docs/production-readiness.md`.
