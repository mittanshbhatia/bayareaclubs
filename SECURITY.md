# Security Policy

## Supported versions

Security fixes are applied to the `main` branch of
[bayareaclubs](https://github.com/mittanshbhatia/bayareaclubs), which tracks the
production deployment.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report privately to the repository maintainer / constitution committee:

- **Mittansh Bhatia** — via GitHub security advisories for this repository
  (preferred), or a private channel already established with the maintainer.

Include:

- a description of the issue and impact;
- steps to reproduce or a proof of concept if available;
- affected routes, RPCs, or tables when known.

We will acknowledge receipt as soon as practical and coordinate disclosure after
a fix is available.

## Security expectations for this project

- Browser clients use only the Supabase **publishable** key.
- `SUPABASE_SECRET_KEY`, `CRON_SECRET`, Resend keys, and Storage S3 credentials
  are server-only and never committed.
- Cron endpoints require `Authorization: Bearer <CRON_SECRET>` and fail closed
  when the secret is missing.
- Tenant isolation is enforced with PostgreSQL RLS; app checks are defense in
  depth, not a substitute for RLS.
- Email campaigns target membership audiences—not arbitrary free-form recipient
  lists from clients.
- Storage buckets are private; media visibility respects consent rules where
  required.
- Under-13 self-registration is blocked; consent and activation follow governed
  flows.

## Out of scope for public discussion

Do not post production credentials, student PII, or exploit details that would
enable unauthorized access to live school data.

This document does not claim legal certification (e.g. COPPA/FERPA). Institutional
policy decisions remain with partner schools; see
`docs/production-readiness.md`.
