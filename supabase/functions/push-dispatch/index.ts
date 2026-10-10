import '../_shared/rules.js';import '../_shared/events.js';import '../_shared/planner.js';
import {refreshCalendar} from '../_shared/calendar.ts';
import {db,checked,send,lockPayload,json} from '../_shared/core.ts';
// Egress control: the full diary (accounts JSON) is only downloaded when it changed, once per hour as a safety
// re-check, or once inside the daily reminder window. Every other minute uses the cheap updated_at head and
// the evaluation state kept in ft_dispatch_state. Warm isolates also reuse diaries already downloaded.
const diaryCache=new Map<string,{version:string,accounts:any[]}>();
const RECHECK_MS=3600000;
async function diary(userId:string,version:string|null){const hit=diaryCache.get(userId);if(hit&&version&&hit.version===version)return hit.accounts;
const row=checked(await db.from('fundedtrack_workspaces').select('accounts,updated_at').eq('user_id',userId).maybeSingle()).data;
const accounts=Array.isArray(row?.accounts)?row.accounts:[];if(row)diaryCache.set(userId,{version:String(row.updated_at),accounts});else diaryCache.delete(userId);return accounts;}
Deno.serve(async req=>{if(req.method!=='POST')return json({error:'POST required'},405);const secret=Deno.env.get('FT_CRON_SECRET');const actual=req.headers.get('x-ft-cron')||'';if(!secret||actual.length!==secret.length)return json({error:'Unauthorized'},401);let diff=0;for(let i=0;i<secret.length;i++)diff|=secret.charCodeAt(i)^actual.charCodeAt(i);if(diff)return json({error:'Unauthorized'},401);
try{const now=new Date(),engine=(globalThis as any).FTNotifications;let evaluated=0,sent=0,downloaded=0;const planner=(globalThis as any).FTAlertPlanner,calendar=await refreshCalendar();const heads=new Map<string,string|null>();
for(let offset=0;;offset+=100){const users=checked(await db.from('ft_notification_preferences').select('*').order('user_id').range(offset,offset+99)).data||[];
const active=users.filter((u:any)=>({...engine.defaults,...planner.defaults,...u.settings}).enabled);const ids=active.map((u:any)=>u.user_id);
const headRows=ids.length?checked(await db.from('fundedtrack_workspaces').select('user_id,updated_at').in('user_id',ids)).data||[]:[];
const stateRows=ids.length?checked(await db.from('ft_dispatch_state').select('user_id,version,evaluated_at,reminder_day').in('user_id',ids)).data||[]:[];
for(const h of headRows)heads.set(h.user_id,String(h.updated_at));const states=new Map(stateRows.map((s:any)=>[s.user_id,s]));const stateUpdates:any[]=[];
for(const user of active){const settings={...engine.defaults,...planner.defaults,...user.settings};
const version=heads.get(user.user_id)??null,state:any=states.get(user.user_id)||null,local=engine.clock(now,settings.timezone);
const [rh,rm]=String(settings.time||'20:00').split(':').map(Number),due=rh*60+rm,inReminder=!!settings.reminder&&local.minute>=due&&local.minute<due+60;
const full=!state||state.version!==version||!(now.getTime()-Date.parse(state.evaluated_at)<RECHECK_MS)||(inReminder&&state.reminder_day!==local.date);
let accounts:any[]=[];if(full&&version){const before=diaryCache.get(user.user_id)?.version;accounts=await diary(user.user_id,version);if(before!==version)downloaded++;}
const loadAccounts=async()=>full?accounts:version?await diary(user.user_id,version):[];
let events=full?engine.events(accounts,settings,now,true).filter((e:any)=>e.kind==='reminder'||(version&&new Date(version)>=new Date(user.enabled_at))):[];
// Without a fresh diary, goal/loss custom alerts were already emitted (idempotent keys); schedule alerts need no diary.
events.push(...planner.events(accounts,settings,now,calendar.available?calendar.events:[]));
const actions=checked(await db.from('ft_notice_actions').select('*').eq('user_id',user.user_id)).data||[];
events=events.filter((e:any)=>!actions.some((a:any)=>a.event_key===e.event_key));
for(const action of actions){if(actions.some((a:any)=>a.event_key===action.event_key+':snooze:'+action.revision))continue;if(action.mode!=='snooze'||!action.until_at||now.getTime()<Date.parse(action.until_at)||now.getTime()-Date.parse(action.until_at)>10*60000)continue;const source=checked(await db.from('ft_notifications').select('*').eq('user_id',user.user_id).eq('event_key',action.event_key).maybeSingle()).data;if(source&&settings[source.kind]&&validNotice(source,settings,source.kind==='custom'?await loadAccounts():[]))events.push({event_key:action.event_key+':snooze:'+action.revision,kind:source.kind,title:source.title,body:source.body,page:source.page,account_id:source.account_id});}
if(events.length)checked(await db.from('ft_notifications').upsert(events.map((e:any)=>({...e,user_id:user.user_id})),{onConflict:'user_id,event_key',ignoreDuplicates:true}));
const subscriptions=checked(await db.from('ft_push_subscriptions').select('id,created_at').eq('user_id',user.user_id)).data||[];
const notifications=checked(await db.from('ft_notifications').select('id,created_at').eq('user_id',user.user_id).gte('created_at',new Date(now.getTime()-3600000).toISOString())).data||[];
const deliveries=notifications.flatMap((n:any)=>subscriptions.filter((s:any)=>s.created_at<=n.created_at).map((s:any)=>({notification_id:n.id,subscription_id:s.id})));
if(deliveries.length)checked(await db.from('ft_push_deliveries').upsert(deliveries,{onConflict:'notification_id,subscription_id',ignoreDuplicates:true}));
if(full)stateUpdates.push({user_id:user.user_id,version,evaluated_at:now.toISOString(),reminder_day:inReminder?local.date:(state?.reminder_day??null)});evaluated++;}
if(stateUpdates.length)checked(await db.from('ft_dispatch_state').upsert(stateUpdates,{onConflict:'user_id'}));
if(users.length<100)break;}
const jobs=checked(await db.rpc('ft_claim_push')).data||[];
for(const job of jobs){const n=checked(await db.from('ft_notifications').select('*').eq('id',job.notification_id).maybeSingle()).data;const s=checked(await db.from('ft_push_subscriptions').select('*').eq('id',job.subscription_id).maybeSingle()).data;
if(!n||!s||n.user_id!==s.user_id)continue;const preferences=checked(await db.from('ft_notification_preferences').select('settings').eq('user_id',n.user_id).maybeSingle()).data?.settings;
if(!preferences?.enabled||!preferences[n.kind]||now.getTime()-new Date(n.created_at).getTime()>(n.kind==='custom'?600000:n.kind==='sessions'?900000:n.kind==='news'?1800000:3600000)){checked(await db.from('ft_push_deliveries').delete().eq('id',job.id));continue;}
const settings={...engine.defaults,...planner.defaults,...preferences};const action=checked(await db.from('ft_notice_actions').select('mode').eq('user_id',n.user_id).eq('event_key',n.event_key).maybeSingle()).data;
// Only custom notices need the diary to be re-validated before delivery.
const accounts=n.kind==='custom'?await diary(n.user_id,heads.get(n.user_id)??null):[];
if(action||planner.isQuiet(settings,now)||!validNotice(n,settings,accounts)){checked(await db.from('ft_push_deliveries').delete().eq('id',job.id));continue;}
if(n.kind==='newsBefore'){const original=calendar.events?.find((e:any)=>n.event_key==='news:event:'+e.id);if(!calendar.available||!original||Date.parse(original.date)<=now.getTime()){checked(await db.from('ft_push_deliveries').delete().eq('id',job.id));continue;}}
try{const status=await send(s,lockPayload(n));if(status===404||status===410)checked(await db.from('ft_push_subscriptions').delete().eq('id',s.id));else if(status>=200&&status<300){checked(await db.from('ft_push_deliveries').update({delivered_at:new Date().toISOString()}).eq('id',job.id));sent++;}else checked(await db.from('ft_push_deliveries').update({next_at:new Date(Date.now()+Math.min(1800,60*2**job.attempts)*1000).toISOString()}).eq('id',job.id));}catch{ /* Claimed jobs retry after lease expiry; never expose endpoints in logs. */}}
checked(await db.from('ft_notifications').delete().lt('created_at',new Date(now.getTime()-90*86400000).toISOString()));
checked(await db.from('ft_notice_actions').delete().lt('created_at',new Date(now.getTime()-90*86400000).toISOString()));return json({ok:true,evaluated,sent,downloaded,calendarAvailable:calendar.available});
}catch{console.error('push-dispatch: worker failed; inspect database and secret configuration');return json({error:'Worker failed'},500);}});

function validNotice(n:any,p:any,accounts:any[]){if(n.kind!=='custom')return true;const alert=(p.alerts||[]).find((a:any)=>n.event_key.startsWith('custom:'+a.id+':'+a.rev+':'));if(!alert?.enabled)return false;if(alert.type==='schedule')return true;const planned=(globalThis as any).FTAlertPlanner.events(accounts,p,new Date(),[]);if(!planned.some((e:any)=>n.event_key===e.event_key||n.event_key.startsWith(e.event_key+':snooze:')))return false;const account=accounts.find((a:any)=>String(a.id)===alert.accountId);if(!account)return false;const stage=account.status==='Funded'?'funded':String(account.phase||1);return n.event_key.startsWith('custom:'+alert.id+':'+alert.rev+':'+account.id+':'+stage+':'+(account.phaseStartedOn||account.fundedOn||account.createdOn||'initial'));}
