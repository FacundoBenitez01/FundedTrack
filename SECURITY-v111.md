# JourFund security v111

## Changes

- Optional TOTP verification in My account. Verified factors require AAL2 before workspace and private image access. Password recovery also checks MFA.
- Active session validation in database policies and push API. Closing other sessions preserves the current session; closing all sessions revokes all devices.
- Server-managed owner display roles use trusted app metadata rather than email matching or client-editable metadata.
- Removed unnecessary TRUNCATE, REFERENCES and TRIGGER grants and public execution of an internal event-trigger function.
- Validate workspace writes, image ownership, account identifiers, amounts and payload sizes. Workspace timestamps are assigned by the server.
- Push API verifies user identity, active session, MFA assurance, origin, request size and per-user request limits. Server authorization helpers are private with service-only invoker wrappers.
- Pinned local Supabase SDK with integrity checking; CSP restricts sources, objects and form submission. Inline scripts/styles remain permitted because the current application uses them.

## Verification

Real Supabase tests with isolated temporary accounts passed: cross-user isolation, invalid data/image rejection, server timestamps, session revocation, actual TOTP enrollment/verification and MFA enforcement. Live push API tests passed for authorized requests and rejection of anonymous, revoked, oversized and disallowed-origin requests. Temporary accounts were removed; existing workspaces were retained.

Frontend checks passed at 1440px, 390px and 320px: enrollment, invalid code feedback, login challenge before workspace reads, disable verification, close other sessions, no page errors and no horizontal overflow. Browser backend mocks were used for responsive UI testing. Existing FTMO trailing-EOD snapshots pass compatibility validation.

## Operational notes

This migration has already been applied to production; it does not migrate or delete existing account data. Keep authenticator setup keys private and retain a private recovery copy. Enabling MFA closes other sessions.

Supabase leaked-password screening is not enabled: it requires Pro or higher. Existing server-only tables intentionally have RLS without client policies. The platform pg_net extension remains in public because it is non-relocatable; scheduled notifications were preserved. Paid point-in-time recovery is not provisioned. Existing local/export backups remain available.

This update is a security improvement, not a guarantee against every vulnerability. Google OAuth uses the same post-login authorization gate; a real Google-provider flow was not separately exercised during these tests.
