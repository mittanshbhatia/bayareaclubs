# Architecture

BayAreaClubs uses Next.js App Router with Server Components by default, Supabase as
the source of truth, and database-enforced tenant isolation.

## Boundaries

- `src/app`: routes, layouts, loading/error boundaries, and API handlers.
- `src/components`: reusable presentation and interaction primitives.
- `src/features`: domain workflows grouped by business capability.
- `src/lib`: infrastructure adapters for auth, Supabase, permissions, validation,
  email, storage, analytics, and structured logging.
- `supabase/migrations`: immutable schema and RLS changes.
- `supabase/tests`: pgTAP authorization and integrity tests.
- `emails`: React Email templates and shared email components.
- `tests/unit` and `tests/e2e`: application verification.

Mutations must validate, authenticate, authorize, persist, audit when relevant,
and return typed results. Browser clients use only the Supabase publishable key.
Privileged credentials remain in narrowly scoped server-only modules.

## Health

- `GET /api/health` is a liveness probe and does not inspect dependencies.
- `GET /api/health/ready` reports whether required public Supabase configuration
  is present without returning credential values.
