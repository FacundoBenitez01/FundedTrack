begin;
create schema if not exists jourfund_private;
revoke all on schema jourfund_private from public, anon;
grant usage on schema jourfund_private to authenticated, service_role;
revoke truncate, references, trigger on public.fundedtrack_workspaces from authenticated, service_role;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

create or replace function jourfund_private.session_allowed()
returns boolean language plpgsql stable security definer set search_path = ''
as $$
declare u uuid := auth.uid(); sid text := auth.jwt()->>'session_id';
begin
 if u is null or sid is null or sid !~ '^[0-9a-fA-F-]{36}$' then return false; end if;
 if not exists(select 1 from auth.sessions s where s.id=sid::uuid and s.user_id=u and (s.not_after is null or s.not_after>now())) then return false; end if;
 return coalesce(auth.jwt()->>'aal','aal1')='aal2' or not exists(select 1 from auth.mfa_factors f where f.user_id=u and f.status='verified');
exception when invalid_text_representation then return false;
end $$;
revoke all on function jourfund_private.session_allowed() from public, anon;
grant execute on function jourfund_private.session_allowed() to authenticated, service_role;

create or replace function jourfund_private.security_status()
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
begin
 if not jourfund_private.session_allowed() then raise exception 'Revalidá tu sesión y la verificación en dos pasos.' using errcode='42501'; end if;
 return jsonb_build_object('sessions',coalesce((select jsonb_agg(jsonb_build_object('current',s.id::text=auth.jwt()->>'session_id','createdAt',s.created_at,'lastActiveAt',coalesce(s.refreshed_at,s.updated_at,s.created_at),'agent',left(coalesce(s.user_agent,'Dispositivo'),250)) order by coalesce(s.refreshed_at,s.updated_at,s.created_at) desc) from auth.sessions s where s.user_id=auth.uid() and (s.not_after is null or s.not_after>now())),'[]'::jsonb));
end $$;
revoke all on function jourfund_private.security_status() from public, anon;
grant execute on function jourfund_private.security_status() to authenticated;
create or replace function public.jourfund_security_status()
returns jsonb language sql stable security invoker set search_path = ''
as $$ select jourfund_private.security_status(); $$;

revoke all on function public.jourfund_security_status() from public, anon;
grant execute on function public.jourfund_security_status() to authenticated;

drop policy if exists jourfund_valid_session on public.fundedtrack_workspaces;
create policy jourfund_valid_session on public.fundedtrack_workspaces as restrictive for all to authenticated
using ((select jourfund_private.session_allowed())) with check ((select jourfund_private.session_allowed()));
drop policy if exists jourfund_images_valid_session on storage.objects;
create policy jourfund_images_valid_session on storage.objects as restrictive for all to authenticated
using (bucket_id <> 'fundedtrack-trade-images' or (select jourfund_private.session_allowed()))
with check (bucket_id <> 'fundedtrack-trade-images' or (select jourfund_private.session_allowed()));

create table if not exists jourfund_private.request_limits (
 user_id uuid not null references auth.users(id) on delete cascade,
 bucket text not null, window_at timestamptz not null, hits integer not null default 1,
 primary key(user_id,bucket)
);
alter table jourfund_private.request_limits enable row level security;
revoke all on jourfund_private.request_limits from public, anon, authenticated;
grant select, insert, update, delete on jourfund_private.request_limits to service_role;
create or replace function jourfund_private.authorize_request(uid uuid, sid uuid, assurance text, request_bucket text)
returns text language plpgsql security definer set search_path = ''
as $$
declare hits_now integer; limit_now integer;
begin
 if not exists(select 1 from auth.sessions s where s.user_id=uid and s.id=sid and (s.not_after is null or s.not_after>now())) then return 'session'; end if;
 if assurance <> 'aal2' and exists(select 1 from auth.mfa_factors f where f.user_id=uid and f.status='verified') then return 'mfa'; end if;
 if request_bucket not in ('push-read','push-write') then return 'invalid'; end if;
 limit_now:=case when request_bucket='push-read' then 30 else 20 end;
 insert into jourfund_private.request_limits(user_id,bucket,window_at,hits)
 values(uid,request_bucket,date_trunc('minute',now()),1)
 on conflict(user_id,bucket) do update set
 hits=case when request_limits.window_at=excluded.window_at then request_limits.hits+1 else 1 end,
 window_at=excluded.window_at returning hits into hits_now;
 return case when hits_now>limit_now then 'rate' else 'ok' end;
end $$;
revoke all on function jourfund_private.authorize_request(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function jourfund_private.authorize_request(uuid,uuid,text,text) to service_role;
create or replace function public.jourfund_authorize_request(uid uuid, sid uuid, assurance text, request_bucket text)
returns text language sql security invoker set search_path = ''
as $$ select jourfund_private.authorize_request(uid,sid,assurance,request_bucket); $$;
revoke all on function public.jourfund_authorize_request(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.jourfund_authorize_request(uuid,uuid,text,text) to service_role;

create or replace function jourfund_private.validate_workspace()
returns trigger language plpgsql security invoker set search_path = ''
as $$
declare a jsonb; t jsonb; p jsonb; v jsonb; n numeric; seen text[] := '{}'; total integer := 0;
begin
 if jsonb_typeof(new.accounts) is distinct from 'array' or jsonb_array_length(new.accounts)>200 or octet_length(new.accounts::text)>25000000 then raise exception 'Formato o tamaño del diario inválido.' using errcode='22023'; end if;
 for a in select value from jsonb_array_elements(new.accounts) loop
  if jsonb_typeof(a) is distinct from 'object' or coalesce(a->>'id','') !~ '^[-a-zA-Z0-9_]{1,200}$' or a->>'id'=any(seen) or jsonb_typeof(a->'capital') is distinct from 'number' or coalesce((a->>'capital')::numeric,0)<=0 or (a->>'capital')::numeric>1e12 then raise exception 'Cuenta o capital inválido.' using errcode='22023'; end if;
  seen:=array_append(seen,a->>'id');
  if coalesce(a->>'status','') not in ('Challenge','Funded','Failed','Completed') or jsonb_typeof(a->'phases') is distinct from 'array' or jsonb_array_length(a->'phases') not between 1 and 10 then raise exception 'Estado o fases inválidos.' using errcode='22023'; end if;
  for p in select value from jsonb_array_elements(a->'phases') union all select a->'pa' where jsonb_typeof(a->'pa')='object' loop
   if jsonb_typeof(p->'trades') is distinct from 'array' then raise exception 'Operaciones inválidas.' using errcode='22023'; end if;
   for t in select value from jsonb_array_elements(p->'trades') loop
    total:=total+1;
    if total>100000 or jsonb_typeof(t) is distinct from 'object' or jsonb_typeof(t->'pnl') is distinct from 'number' or abs((t->>'pnl')::numeric)>1e12 or coalesce(t->>'result','') not in ('Win','Loss','BE') or coalesce(t->>'date','') !~ '^\d{4}-\d{2}-\d{2}$' or length(coalesce(t->>'asset','')) not between 1 and 150 or length(coalesce(t->>'note',''))>20000 then raise exception 'Operación inválida.' using errcode='22023'; end if;
    perform (t->>'date')::date;
    if t ? 'images' then
     if jsonb_typeof(t->'images') is distinct from 'array' or jsonb_array_length(t->'images')>3 then raise exception 'Capturas inválidas.' using errcode='22023'; end if;
     for v in select value from jsonb_array_elements(t->'images') loop
      if coalesce(v->>'path','') !~ ('^'||new.user_id::text||'/[-a-zA-Z0-9_]+\.jpg$') or v->>'mime'<>'image/jpeg' or jsonb_typeof(v->'size') is distinct from 'number' or (v->>'size')::numeric not between 1 and 1000000 then raise exception 'Captura ajena o inválida.' using errcode='22023'; end if;
     end loop;
    end if;
   end loop;
  end loop;
  if a->'pa' ? 'withdrawals' then
   if jsonb_typeof(a->'pa'->'withdrawals') is distinct from 'array' then raise exception 'Retiros inválidos.' using errcode='22023'; end if;
   for v in select value from jsonb_array_elements(a->'pa'->'withdrawals') loop
    if jsonb_typeof(v->'amount') is distinct from 'number' or (v->>'amount')::numeric not between 0 and 1e12 or (v ? 'accountDebit' and (jsonb_typeof(v->'accountDebit') is distinct from 'number' or (v->>'accountDebit')::numeric not between 0 and 1e12)) then raise exception 'Importe de retiro inválido.' using errcode='22023'; end if;
   end loop;
  end if;
 end loop;
 new.updated_at:=clock_timestamp();
 return new;
end $$;
revoke all on function jourfund_private.validate_workspace() from public, anon, authenticated;
drop trigger if exists jourfund_validate_workspace on public.fundedtrack_workspaces;
create trigger jourfund_validate_workspace before insert or update on public.fundedtrack_workspaces for each row execute function jourfund_private.validate_workspace();
commit;
