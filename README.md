# BayAreaClubs

Production web platform for school and college clubs across the Bay Area.

## Local development

Requirements: Node.js 24+ and pnpm 12.3.4.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Supabase-backed features require public project configuration in `.env.local`.
Server-only values must never use a `NEXT_PUBLIC_` prefix or be committed.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

The engineering constitution is `.specify/memory/constitution.md`. Architecture
and product guidance live under `docs/`.
