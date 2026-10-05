begin;
create table if not exists public.ft_notification_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 settings jsonb not null default '{}'::jsonb,
 enabled_at timestamptz not null default now(),
 last_test_at timestamptz
);
create table if not exists public.ft_push_subscriptions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 endpoint text unique not null,
 keys jsonb not null,
 created_at timestamptz not null default now()
);
create table if not exists public.ft_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 event_key text not null,
 kind text not null,
 title text not null,
 body text not null,
 page text not null,
 account_id text,
 read_at timestamptz,
 created_at timestamptz not null default now(),
 unique(user_id,event_key)
);
create index if not exists ft_notifications_user_date on public.ft_notifications(user_id,created_at desc);
create table if not exists public.ft_push_deliveries (
 id uuid primary key default gen_random_uuid(),
 notification_id uuid not null references public.ft_notifications(id) on delete cascade,
 subscription_id uuid not null references public.ft_push_subscriptions(id) on delete cascade,
 attempts int not null default 0,
 next_at timestamptz not null default now(),
 delivered_at timestamptz,
 unique(notification_id,subscription_id)
);
alter table public.ft_notification_preferences enable row level security;
alter table public.ft_push_subscriptions enable row level security;
alter table public.ft_notifications enable row level security;
alter table public.ft_push_deliveries enable row level security;
revoke all on public.ft_notification_preferences,public.ft_push_subscriptions,public.ft_notifications,public.ft_push_deliveries from anon,authenticated;
grant all on public.ft_notification_preferences,public.ft_push_subscriptions,public.ft_notifications,public.ft_push_deliveries to service_role;
-- API checks the JWT and scopes every operation to that user. Browser roles have no direct access.
create or replace function public.ft_claim_push() returns setof public.ft_push_deliveries language sql security definer set search_path='' as $$
 update public.ft_push_deliveries set attempts=attempts+1,next_at=now()+interval '5 minutes'
 where id in (select id from public.ft_push_deliveries where delivered_at is null and attempts<5 and next_at<=now() order by next_at limit 50 for update skip locked) returning *;
$$;
revoke all on function public.ft_claim_push() from public,anon,authenticated;
grant execute on function public.ft_claim_push() to service_role;
create or replace function public.ft_allow_push_test(uid uuid) returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.ft_notification_preferences set last_test_at=now() where user_id=uid and (last_test_at is null or last_test_at<now()-interval '60 seconds');
 return found;
end;$$;
revoke all on function public.ft_allow_push_test(uuid) from public,anon,authenticated;
grant execute on function public.ft_allow_push_test(uuid) to service_role;
commit;
