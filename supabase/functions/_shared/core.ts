import {createClient} from 'npm:@supabase/supabase-js@2.57.4';
import webpush from 'npm:web-push@3.6.7';
export const site=Deno.env.get('FT_SITE_URL')||'https://facundobenitez01.github.io/FundedTrack/';
export const cors={'Access-Control-Allow-Origin':new URL(site).origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'};
export const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
export function json(value:unknown,status=200){return new Response(JSON.stringify(value),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export function checked<T extends {error:unknown}>(result:T):T{if(result.error)throw Error('Database operation failed');return result;}
export function validSubscription(s:any){let u:URL;try{u=new URL(s.endpoint);}catch{throw Error('Suscripción inválida');}
const h=u.hostname;if(u.protocol!=='https:'||u.username||u.password||u.port||u.hash||s.endpoint.length>4096||!(h==='fcm.googleapis.com'||h==='updates.push.services.mozilla.com'||h.endsWith('.push.services.mozilla.com')||h==='web.push.apple.com'||h.endsWith('.push.apple.com')))throw Error('Servicio push no permitido');
const decode=(v:string)=>{if(typeof v!=='string'||! /^[A-Za-z0-9_-]+={0,2}$/.test(v))throw Error('Clave inválida');return Uint8Array.from(atob(v.replace(/-/g,'+').replace(/_/g,'/')),x=>x.charCodeAt(0));};
const pub=decode(s.keys?.p256dh),auth=decode(s.keys?.auth);if(pub.length!==65||pub[0]!==4||auth.length!==16)throw Error('Clave inválida');return {endpoint:u.href,keys:{p256dh:s.keys.p256dh,auth:s.keys.auth}};}
export function prefs(input:any){return (globalThis as any).FTAlertPlanner.validate(input||{});}
export async function send(subscription:any,payload:any){validSubscription(subscription);const details=webpush.generateRequestDetails(subscription,JSON.stringify(payload),{TTL:3600,urgency:'normal',contentEncoding:'aes128gcm',vapidDetails:{subject:Deno.env.get('VAPID_SUBJECT')!,publicKey:Deno.env.get('VAPID_PUBLIC_KEY')!,privateKey:Deno.env.get('VAPID_PRIVATE_KEY')!}});
const response=await fetch(details.endpoint,{method:details.method,headers:details.headers,body:new Uint8Array(details.body),redirect:'error',signal:AbortSignal.timeout(12000)});await response.body?.cancel();return response.status;}
export function lockPayload(event:any){return {title:'FundedTrack · '+event.title,body:event.body,tag:event.event_key,page:event.page,accountId:event.account_id};}

