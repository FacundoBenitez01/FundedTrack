import '../_shared/rules.js';import '../_shared/events.js';
import {db,checked,send,lockPayload,json} from '../_shared/core.ts';
Deno.serve(async req=>{if(req.method!=='POST')return json({error:'POST required'},405);const secret=Deno.env.get('FT_CRON_SECRET');const actual=req.headers.get('x-ft-cron')||'';if(!secret||actual.length!==secret.length)return json({error:'Unauthorized'},401);let diff=0;for(let i=0;i<secret.length;i++)diff|=secret.charCodeAt(i)^actual.charCodeAt(i);if(diff)return json({error:'Unauthorized'},401);
try{const now=new Date(),engine=(globalThis as any).FTNotifications;let evaluated=0,sent=0;
for(let offset=0;;offset+=100){const users=checked(await db.from('ft_notification_preferences').select('*').order('user_id').range(offset,offset+99)).data||[];
for(const user of users){const settings={...engine.defaults,...user.settings};if(!settings.enabled)continue;
const workspace=checked(await db.from('fundedtrack_workspaces').select('accounts,updated_at').eq('user_id',user.user_id).maybeSingle()).data;
const accounts=workspace?.accounts||[];
const events=engine.events(accounts,settings,now,true).filter((e:any)=>e.kind==='reminder'||(workspace&&new Date(workspace.updated_at)>=new Date(user.enabled_at)));
if(events.length)checked(await db.from('ft_notifications').upsert(events.map((e:any)=>({...e,user_id:user.user_id})),{onConflict:'user_id,event_key',ignoreDuplicates:true}));
const subscriptions=checked(await db.from('ft_push_subscriptions').select('id,created_at').eq('user_id',user.user_id)).data||[];
const notifications=checked(await db.from('ft_notifications').select('id,created_at').eq('user_id',user.user_id).gte('created_at',new Date(now.getTime()-3600000).toISOString())).data||[];
const deliveries=notifications.flatMap((n:any)=>subscriptions.filter((s:any)=>s.created_at<=n.created_at).map((s:any)=>({notification_id:n.id,subscription_id:s.id})));
if(deliveries.length)checked(await db.from('ft_push_deliveries').upsert(deliveries,{onConflict:'notification_id,subscription_id',ignoreDuplicates:true}));evaluated++;}
if(users.length<100)break;}
const jobs=checked(await db.rpc('ft_claim_push')).data||[];
for(const job of jobs){const n=checked(await db.from('ft_notifications').select('*').eq('id',job.notification_id).maybeSingle()).data;const s=checked(await db.from('ft_push_subscriptions').select('*').eq('id',job.subscription_id).maybeSingle()).data;
if(!n||!s||n.user_id!==s.user_id)continue;const preferences=checked(await db.from('ft_notification_preferences').select('settings').eq('user_id',n.user_id).maybeSingle()).data?.settings;
if(!preferences?.enabled||!preferences[n.kind]||now.getTime()-new Date(n.created_at).getTime()>3600000){checked(await db.from('ft_push_deliveries').delete().eq('id',job.id));continue;}
try{const status=await send(s,lockPayload(n));if(status===404||status===410)checked(await db.from('ft_push_subscriptions').delete().eq('id',s.id));else if(status>=200&&status<300){checked(await db.from('ft_push_deliveries').update({delivered_at:new Date().toISOString()}).eq('id',job.id));sent++;}else checked(await db.from('ft_push_deliveries').update({next_at:new Date(Date.now()+Math.min(1800,60*2**job.attempts)*1000).toISOString()}).eq('id',job.id));}catch{ /* Claimed jobs retry after lease expiry; never expose endpoints in logs. */}}
checked(await db.from('ft_notifications').delete().lt('created_at',new Date(now.getTime()-90*86400000).toISOString()));
return json({ok:true,evaluated,sent});
}catch{console.error('push-dispatch: worker failed; inspect database and secret configuration');return json({error:'Worker failed'},500);}});
