# v99 · Compact accounts and personal capital

Accounts are a compact list, with each funding challenge/configuration represented once, standalone personal accounts shown individually, and each multi-account group represented once. Click a repeated standalone challenge to choose its individual account; group members remain accessible in the existing Group view. The full catalogue is folded below the list. Account details open in a native floating dialog.

Add account offers funding or personal capital. Personal accounts retain the existing Funded storage slot internally for trading and withdrawal compatibility; the UI shows Capital propio. Users enter name, broker, initial USD capital and optional monthly target, daily and total loss percentages. Limits are advisory, based on initial capital and registered trading P&L, excluding deposits/withdrawals. They do not fail or lock a personal account. No automatic broker connection is introduced.

Deposits have a distinct validated array with stable IDs, date, amount and note. They appear in the balance ledger and can be removed. Balance = initial capital + deposits + trading P&L − withdrawal debits. Trade P&L, win rate, daily/monthly targets and notification thresholds exclude cashflows. Existing withdrawal edits retain their original debit semantics. Personal accounts have no evaluation promotion or firm payout eligibility.

Uses the existing per-user workspace commit path, revision checks and conflict protection. No SQL schema changes. Shared personal risk logic is also patched in the deployed push-dispatch bundle, preserving its current authentication and dependencies.

Validation: client/server funded profile parity, personal cashflow/decimals/future dates, advisory limits, central backup validation, browser UI at 320/390/1440 pixels, group deduplication, no JS errors. Tests use isolated mocked workspace/auth data, not the user's trading data. Live deployment checks confirm release assets and Edge Function bundle; real cross-device sync and push delivery are not simulated as production guarantees.
