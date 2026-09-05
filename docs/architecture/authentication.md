# Authentication and account governance

## Session architecture

Supabase Auth owns credentials, email verification, recovery tokens, OAuth, and
session rotation. `@supabase/ssr` reads and writes the Supabase cookies. The
Next.js `proxy.ts` only refreshes those cookies; it does not authorize requests.
Server Components, Server Actions, route handlers, and PostgreSQL RLS perform
authorization with a verified user from `auth.getUser()`.

Email/password signup requires verification. Passwords require at least 12
characters with letters and numbers. Password-reset responses do not reveal
whether an email address exists.

Google OAuth is displayed only when `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` and
the provider is configured in Supabase. A new OAuth identity must complete the
same governed profile before dashboard access.

## Account activation

The only age bands are `under_13`, `age_13_17`, and `adult`. Precise birth dates
are not collected. Standard signup can create only a normal user account; club,
school, committee, and platform authority comes from persisted assignments.

Users age 13 or older become active after email verification and profile
completion. Under-13 self-registration is rejected by both the application and
the Supabase before-user-created hook.

An under-13 account must be provisioned through a trusted administrative
operation that sets protected Auth app metadata:

- `managed_onboarding=true`;
- `activation_method=guardian_authorized` or `school_managed`; and
- the governed profile metadata, including `age_band=under_13` and `school_id`.

Guardian authorization requires a verified `user_guardian_relationships` row.
School activation requires an active administrator assignment for the requested
school. Guardian-authorized accounts require both recorded guardian consent and
school activation.

Deploying managed-minor onboarding requires institution-specific identity
verification, consent language, retention policy, staff procedures, SMTP, and
legal review. The software controls do not independently establish COPPA or
FERPA compliance.

## Profile privacy

Profiles contain a first name, last initial, display format, optional school,
grade band, and optional media-asset reference for an avatar. Emails remain only
in Supabase Auth and are never copied into public profiles. Visibility settings
control whether a school and avatar may be shown to members with a legitimate
club relationship. Club peers cannot query full profile rows; they use a
privacy-filtered member directory. No student profile is anonymously browsable.
