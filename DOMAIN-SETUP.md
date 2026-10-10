# jourfund.com connection

Application v112 keeps the current GitHub Pages address working and chooses the authentication return URL for the current approved host. The push API accepts exact origins for jourfund.com, www.jourfund.com and the existing GitHub Pages site. No DNS, Supabase Auth dashboard settings or GitHub Pages custom-domain setting have been changed by this update.

## Before activation

1. Export a backup from the existing app and synchronize local changes. Browser sessions, caches, unsynced changes and push subscriptions do not transfer between origins. Cloud workspaces remain in the same Supabase project.
2. Supabase project ztkthcqjxptsxgtwfcfx → Authentication → URL Configuration: add exact Redirect URLs https://jourfund.com/ and https://www.jourfund.com/, retaining https://facundobenitez01.github.io/FundedTrack/. Change Site URL to https://jourfund.com/ once HTTPS is working.
3. GitHub repository FacundoBenitez01/FundedTrack → Settings → Pages → Custom domain: jourfund.com, Save. Verify domain ownership in account Pages settings using the specific TXT record GitHub supplies. The connected GitHub tool cannot edit Pages administration settings.
4. Nominalia DNS management: replace conflicting A/AAAA/ALIAS records for the apex and conflicting www records only. Preserve mail MX/TXT records. Add A @ → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 and CNAME www → facundobenitez01.github.io. Do not include /FundedTrack/ in DNS values or add wildcard records.
5. Wait for GitHub's DNS check and HTTPS certificate, then enable Enforce HTTPS. DNS propagation/certificate issuance can take up to 24 hours.

## Authentication and notifications

Google OAuth's Supabase callback remains https://ztkthcqjxptsxgtwfcfx.supabase.co/auth/v1/callback. Do not replace it with the app domain. If Google consent-screen branding needs the app domain, verify/configure it separately in Google Cloud. Existing OAuth credentials and Supabase database project stay unchanged.

After HTTPS is working, log in at https://jourfund.com/ and confirm existing operations/accounts appear. Reinstall the home-screen app from the new domain and re-enable notifications there. Keep the previous local backup until cloud synchronization is verified. Existing subscriptions on the old origin are not deleted by this update.

Test Google login, email login, password reset, authenticator challenges, workspace synchronization and push subscription/test at the new domain before considering activation complete.
