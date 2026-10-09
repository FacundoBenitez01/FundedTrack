# JourFund v98 — mobile settings and floating More menu

Below 700px, Settings shows a compact profile entry and grouped Appearance, Language, Notifications and Data/sync actions. Appearance and notifications reveal their existing controls with a back action; Language opens the v97 selector; Data/sync opens My account's Access tab. The daily goal remains in Home and is hidden in Settings.

My account uses the existing photo controls and name form, with a read-only email from the current authenticated user. Information and Access tabs separate profile editing from synchronization, backups and recovery. The header avatar opens Information; the sync badge opens Access. The display-name cooldown and existing sign-out/data protection flows are unchanged. Profile email is displayed, not editable. Owner badges remain presentation-only.

More stays inside the five-item mobile navigation bar. Tapping it opens a rounded, detached popover with My account, Withdrawals, Goals and Settings; its navigation, backdrop dismissal, keyboard focus loop, Escape, viewport checks and background inert state are retained from the existing navigation module. It fits above the bar and scrolls on short screens. Reduced motion is respected.

Desktop keeps the existing settings controls and exposes all My account sections together. Responsive photo controls return to their original container above 700px. No database migration, credentials or financial calculations changed.

Checks: browser tests at 320×568, 390×844, 700×900, 844×390 and 1440×900 using mocked auth/workspace storage. Settings navigation, palettes, notifications controls, floating menu geometry/dismissal, avatar/profile shortcuts, tab keys, display-name save, read-only email, access to backups, horizontal overflow, unchanged account financial records and JavaScript errors were checked. A second 390px run verifies the language selector integration and file-picker forwarding. These are frontend checks, not a live Supabase audit.
