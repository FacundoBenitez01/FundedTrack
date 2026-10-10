-- Server-only evaluation state for push-dispatch (egress reduction). Applied to production 2026-10-10.
create table if not exists public.ft_dispatch_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 version text,
 evaluated_at timestamptz not null default now(),
 reminder_day text
);
alter table public.ft_dispatch_state enable row level security;
revoke all on table public.ft_dispatch_state from public, anon, authenticated;
grant select, insert, update, delete on table public.ft_dispatch_state to service_role;
comment on table public.ft_dispatch_state is 'Server-only: last diary version evaluated by push-dispatch, to avoid re-downloading unchanged diaries every minute.';
