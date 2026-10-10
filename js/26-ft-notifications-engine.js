/* Same deterministic event calculations run in the browser and scheduled worker. */
(function(){'use strict';
const defaults={daily:true,maximum:true,progress:true,payout:false,reminder:false,time:'20:00',timezone:'America/Asuncion',enabled:false};
function clock(now,tz){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));return {date:p.year+'-'+p.month+'-'+p.day,minute:Number(p.hour)*60+Number(p.minute)};}
function events(accounts,prefs={},now=new Date(),reminders=true){const p={...defaults,...prefs},out=[],R=globalThis.FTRules;if(!R)return out;
 const local=clock(now,p.timezone);const add=(a,key,kind,title,body,page)=>out.push({event_key:key,kind,title,body,page,account_id:a?.id||null});
 for(const a of accounts||[]){if(!a?.id||!(Number(a.capital)>0))continue;try{
 const day=R.accountDay(a,now),stage=a.status==='Funded'?'funded':String(a.phase||1),base=a.id+':'+stage+':'+(a.phaseStartedOn||a.fundedOn||a.createdOn||'initial'),risk=R.risk(a,day),effective=R.effective(a);
 const alert=(kind,remaining,budget,key,page)=>{if(!(budget>0)||!Number.isFinite(remaining))return;const used=1-remaining/budget;const level=used>=1-1e-8?100:used>=.9-1e-8?90:used>=.7-1e-8?70:0;if(!level)return;add(a,key+':'+level,kind,level===100?'Revisá el límite de pérdida':level+'% del límite utilizado',kind==='daily'?'Tu registro alcanza un umbral del límite diario. Revisá el riesgo antes de operar.':'Tu registro alcanza un umbral de la pérdida máxima. Revisá las reglas de la cuenta.',page);};
 if(p.daily)alert('daily',risk.dailyRemaining,risk.dailyBudget,base+':daily:'+day,'ftPageOps');
 if(p.maximum)alert('maximum',risk.maxRemaining,Number(a.capital)*Number(effective.maxPct||0)/100,base+':maximum','ftPageAccounts');
 if(p.progress&&a.status!=='Funded'){const prog=R.progress({...a,phases:(a.phases||[]).map(phase=>({...phase,trades:(phase.trades||[]).filter(t=>t.date<=day)}))});if(prog.target>0&&prog.pnl>=prog.target&&!prog.eligible) add(a,base+':goal','progress','Objetivo de ganancia alcanzado',prog.eligible?'Tus registros cumplen el objetivo y los días mínimos. Confirmá la aprobación con la firma.':'Alcanzaste la ganancia objetivo. Revisá los días mínimos y demás condiciones.','ftPageObjectives');if(prog.target>0&&prog.eligible)add(a,base+':eligible','progress','Evaluación lista para revisar','Tus registros cumplen las condiciones calculadas. La firma debe aprobar la siguiente fase.','ftPageObjectives');}
 if(p.payout){const reward=R.payout(a,day);if(reward?.eligible)add(a,base+':payout:'+reward.start+':'+(a.pa?.rewardCount||0),'payout','Revisá tu próximo retiro','Tus registros cumplen las condiciones calculadas del ciclo. Verificá el contrato y la aprobación de la firma.','ftPageWithdrawals');}
 }catch(_){/* A legacy/incomplete account must not stop other alerts. */}}
 if(p.reminder&&reminders){const [hour,minute]=p.time.split(':').map(Number),due=hour*60+minute;const hasDiary=(accounts||[]).some(a=>[...(a.phases||[]).flatMap(x=>x.trades||[]),...(a.pa?.trades||[])].some(t=>t.date===local.date));if(local.minute>=due&&local.minute<due+60&&!hasDiary)add(null,'reminder:'+local.date,'reminder','Tu diario te espera','Revisá tu plan y completá el diario de hoy.','ftPageOps');}
 return out;}
 globalThis.FTNotifications={defaults,clock,events};
})();
