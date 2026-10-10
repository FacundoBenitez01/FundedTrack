import {db,checked} from './core.ts';
// Egress control: the payload only changes when fetched_at changes (at most every 15 min), so warm isolates keep it
// in memory and each run reads just fetched_at. Clients that already hold this fetched_at get no events back.
let cached:{fetchedAt:string,payload:any[]}|null=null;
async function cachedRow(){const head=checked(await db.from('ft_calendar_cache').select('fetched_at').eq('id','forexfactory').maybeSingle()).data;
if(!head?.fetched_at)return null;if(cached&&cached.fetchedAt===head.fetched_at)return cached;
const row=checked(await db.from('ft_calendar_cache').select('payload,fetched_at').eq('id','forexfactory').maybeSingle()).data;
cached=row?.fetched_at?{fetchedAt:row.fetched_at,payload:Array.isArray(row.payload)?row.payload:[]}:null;return cached;}
export async function calendarState(knownFetchedAt?:string){const row=await cachedRow();
const dates=(row?.payload||[]).map((e:any)=>Date.parse(e.date)).filter(Number.isFinite);const first=dates.length?new Date(Math.min(...dates)):null;let weekStart=0;if(first){first.setUTCHours(0,0,0,0);first.setUTCDate(first.getUTCDate()-first.getUTCDay());weekStart=first.getTime();}const covered=!!weekStart&&Date.now()>=weekStart&&Date.now()<weekStart+7*86400000;
const fresh=covered&&!!row?.fetchedAt&&Date.now()-Date.parse(row.fetchedAt)<30*60000;
const unchanged=fresh&&typeof knownFetchedAt==='string'&&knownFetchedAt===row?.fetchedAt;
return {source:'Forex Factory',fetchedAt:row?.fetchedAt||null,available:fresh,unchanged,events:fresh&&!unchanged?row!.payload:[]};}
export async function refreshCalendar(){const due=checked(await db.rpc('ft_claim_calendar_refresh')).data;if(!due)return calendarState();
try{const response=await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json',{signal:AbortSignal.timeout(10000),redirect:'error'});if(!response.ok)throw Error('Unavailable');if(Number(response.headers.get('content-length'))>2000000)throw Error('Too large');const reader=response.body!.getReader(),chunks:Uint8Array[]=[];let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2000000){await reader.cancel();throw Error('Too large')}chunks.push(value)}const raw=new Uint8Array(size);let pos=0;for(const c of chunks){raw.set(c,pos);pos+=c.length}const events=(globalThis as any).FTAlertPlanner.normalize(JSON.parse(new TextDecoder().decode(raw)));if(!events.length)throw Error('Empty feed');const fetchedAt=new Date().toISOString();const saved=checked(await db.from('ft_calendar_cache').update({payload:events,fetched_at:fetchedAt}).eq('id','forexfactory').select('fetched_at').maybeSingle()).data;if(saved?.fetched_at)cached={fetchedAt:saved.fetched_at,payload:events};
}catch{console.error('Calendar unavailable; stale events will not generate news alerts.');}return calendarState();}
