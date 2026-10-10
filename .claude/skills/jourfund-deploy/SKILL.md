---
name: jourfund-deploy
description: Ship a change to JourFund (jourfund.com on GitHub Pages + Supabase project ztkthcqjxptsxgtwfcfx) safely - cache versions, tests, PR, Edge Function deploys and live checks. Use for deploy, publish, release, ship, subir a producción.
---

# Ship a JourFund change

JourFund is a static site served by GitHub Pages from `main` (custom domain in `CNAME`) plus a Supabase backend. Everything merged to `main` is live within minutes, so every change goes through a branch and a pull request.

## 1. Branch

- `git checkout main && git pull`, then `git checkout -b <short-name>`. Never commit to `main` directly.

## 2. Cache versions (the step that is easiest to forget)

The app is cached by the service worker (`sw.js`) and by the browser.

- Every `.js`/`.css` you change: bump its `?v=` query where `index.html` loads it, and the same URL in the `SHELL` list in `sw.js`. Use the next release number (e.g. `?v=115`). Add `?v=` if the file had none.
- Bump `const CACHE='fundedtrack-vNNN'` in `sw.js` to the same number.
- Change only `index.html`? Still bump `CACHE`.

## 3. Rules that must stay in sync

- Prop-firm rules live twice: `supabase/functions/_shared/rules.js` (server, ends `globalThis.FTRules=`) and the inline `<script id="ft-rules-catalogue-v56">` in `index.html` (browser, ends `window.FTRules=`). Edit both identically. A test fails if they differ.
- Dates and numbers: use `window.jfLocale?.()||'es-ES'` (or the file's existing `es-*`) as the locale, never a fixed locale.
- Form fields: every `<label>` gets `for="<field id>"`; icon-only buttons get `aria-label`.

## 4. Check before the PR

- `node --test` from the repo root (rules and money calculations; must stay green).
- `node --check <file>` for each changed `.js`.
- Inline scripts in `index.html` have no syntax errors: extract each `<script>` without `src` and run `node --check` on it.
- Load the site locally (`python3 -m http.server`) and confirm no `pageerror` in the console, on phone (390px) and desktop widths.

## 5. Pull request

- Push the branch, open a PR describing what changed and how it was checked, squash-merge when it is green.
- GitHub Pages publishes in 1–2 minutes. Its CDN and fetch tools can show the old file for up to ~10 minutes; verify in a real browser with a cache-busting query (`https://jourfund.com/?v=check`) and confirm the new `?v=` URLs load.

## 6. Supabase Edge Functions (only if `supabase/functions/` changed)

- Functions: `push-api` (called by the app) and `push-dispatch` (pg_cron every minute, secret header). Both run with `verify_jwt = false` (see `supabase/config.toml`); they do their own auth. Keep it that way.
- Before deploying, compare the deployed files with `main`, so you never overwrite something deployed from elsewhere.
- Deploy both together, because they share `_shared/`: `supabase functions deploy push-api push-dispatch --project-ref ztkthcqjxptsxgtwfcfx --no-verify-jwt`.
- After deploying, check the logs: `push-dispatch` must keep returning 200 every minute.

## 7. Database changes

- Add a dated SQL file under `supabase/migrations/`. Keep RLS on every table; browser roles only touch `fundedtrack_workspaces` (own row) and the private image bucket (own folder).
- Run the Supabase security and performance advisors after the change.

## Limits to keep in mind

- Free plan: 5 GB egress per month. Never write code that downloads full diaries (`fundedtrack_workspaces.accounts`) on a timer; read `updated_at` first (see `ft_dispatch_state`).
- Never put secrets (service role key, VAPID private key, cron secret) in the repo or in `index.html`. Only the publishable key belongs in the client.
