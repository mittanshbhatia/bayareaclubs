# BayAreaClubs Repository Guidance

BayAreaClubs is a production platform for Bay Area school and college clubs. The
ratified engineering policy is `.specify/memory/constitution.md`; it takes
precedence over other repository guidance. Its sole committee member is Mittansh
Bhatia.

Before changing code:

- read the constitution and applicable `.cursor/rules/*.mdc` files;
- inspect and preserve existing behavior, components, migrations, and tests;
- use pnpm and the constitution-approved Next.js, TypeScript, Supabase, and testing
  stack; and
- treat student privacy, tenant isolation, and database RLS as design inputs.

Never ship fake production data, inert controls, duplicate implementations,
hard-coded authorization, deprecated `middleware.ts`, arbitrary styling outside
design tokens, client-side privileged keys, RLS bypasses, or public student/private
club information.

Do not call work complete until applicable UI, backend, schema, RLS, validation,
states, accessibility, responsive behavior, tests, lint, types, and production
build checks pass. Use the constitution's required implementation handoff headings.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
