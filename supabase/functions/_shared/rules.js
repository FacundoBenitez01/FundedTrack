
/* CFD rule catalogue: official references reviewed 2026-10-04. Snapshots are per account. */
(function(){
'use strict';
const reviewed='2026-10-04', copy=x=>JSON.parse(JSON.stringify(x));
const FN='FundedNext',FP='FundingPips';
const source={fn1:'https://help.fundednext.com/en/articles/17252927-stellar-1-step-account',fn2:'https://help.fundednext.com/en/articles/17255124-stellar-2-step-challenge',fnLite:'https://help.fundednext.com/en/articles/17253939-stellar-lite-account',fnInstant:'https://help.fundednext.com/en/articles/17253243-stellar-instant-account',fnGeneral:'https://fundednext.com/general-rules/cfds/trading-objectives',fnDemand:'https://help.fundednext.com/en/articles/15586820-does-fundednext-cfds-offer-on-demand-performance-rewards',fp1:'https://help.fundingpips.com/hc/en-us/articles/34501697434385-1-Step-Flex',fp2:'https://help.fundingpips.com/hc/en-us/articles/34501809112081-2-Step-Standard',fpPro:'https://help.fundingpips.com/hc/en-us/articles/34502027344017-2-Step-Pro-Model',fpFlex:'https://help.fundingpips.com/hc/en-us/articles/47835196271249-2-Step-Flex',fpZero:'https://help.fundingpips.com/hc/en-us/articles/34502157694865-FundingPips-Zero',fpLegacy:'https://help.fundingpips.com/hc/en-us/articles/51307058233361-FundingPips-Legacy-Rules',fpPrime:'https://help.fundingpips.com/hc/en-us/articles/34447308895889-Prime-Account',fpPolicy:'https://help.fundingpips.com/hc/en-us/articles/47328410434065-Responsible-Trading-Policy'};
const reward=(id,label,split,extra={})=>({id,label,split,minProfitPct:0,days:0,businessDays:false,profitableDays:0,dayProfitPct:0,consistencyPct:null,bufferPct:0,...extra});
const fnRewards=[reward('standard','Estándar · 21 días / luego 14 · 80%',80,{days:21,laterDays:14}),reward('three','3 días rentables ≥1% · 60%',60,{profitableDays:3,dayProfitPct:1}),reward('demand','On-demand · ≥2% + consistencia 40% · 90%',90,{minProfitPct:2,consistencyPct:40}),reward('biweekly','Complemento quincenal · 14 días · 80%',80,{days:14})];
const fpMonthly=()=>reward('monthly','Mensual · 30 días · 100%',100,{days:30,minProfitPct:1,profitableDays:7,dayProfitPct:.5,consistencyPct:35,strikePct:1});
const evalRules=(targets,daily,max,days,extra={})=>({targets,dailyPct:daily,maxPct:max,days,dayProfitPct:0,drawdown:'static',riskPct:null,dailyBasis:'initial',...extra});
const fundedRules=(daily,max,extra={})=>({dailyPct:daily,maxPct:max,drawdown:'static',riskPct:null,dailyBasis:'initial',days:0,...extra});
const defs=[
{id:'fn-stellar-1',firm:FN,name:'Stellar 1-Step',count:1,sizes:[6000,15000,25000,50000,100000,200000],evaluation:evalRules([10],3,6,2),funded:fundedRules(3,6,{riskPct:3}),rewards:[reward('weekly','Cada 5 días hábiles · 80%',80,{days:5,businessDays:true})],source:source.fn1},
{id:'fn-stellar-2',firm:FN,name:'Stellar 2-Step',count:2,sizes:[6000,15000,25000,50000,100000,200000],evaluation:evalRules([8,5],5,10,5),funded:fundedRules(5,10,{riskPct:3}),rewards:fnRewards,source:source.fn2},
{id:'fn-stellar-lite',firm:FN,name:'Stellar Lite',count:2,sizes:[5000,10000,25000,50000,100000,200000],evaluation:evalRules([8,4],4,8,5),funded:fundedRules(4,8,{riskPct:3}),rewards:fnRewards,source:source.fnLite},
{id:'fn-stellar-instant',firm:FN,name:'Stellar Instant',count:0,sizes:[2000,5000,10000,20000],evaluation:null,funded:fundedRules(null,6,{riskPct:3,drawdown:'trailing-balance'}),rewards:[reward('demand','On-demand · crecimiento ≥5% · 70%',70,{minProfitPct:5}),reward('biweekly','Quincenal · ≥1% · 70%',70,{days:14,minProfitPct:1})],source:source.fnInstant},
{id:'fp-1-flex',firm:FP,name:'1 Step Flex',count:1,sizes:[5000,10000,25000,50000,100000],evaluation:evalRules([12],3,12,0,{dailyBasis:'opening-high'}),funded:fundedRules(3,12,{dailyBasis:'opening-high'}),rewards:[reward('biweekly','Quincenal · 80%',80,{days:14,minProfitPct:1}),fpMonthly()],source:source.fp1},
{id:'fp-2-standard',firm:FP,name:'2 Step Standard',count:2,sizes:[5000,10000,25000,50000,100000],evaluation:evalRules([8,5],5,10,3,{dailyBasis:'opening-high'}),funded:fundedRules(5,10,{dailyBasis:'opening-high'}),rewards:[reward('weekly','Semanal · 60%',60,{days:7,minProfitPct:1}),reward('biweekly','Quincenal · 80%',80,{days:14,minProfitPct:1}),fpMonthly(),reward('demand','On-demand · ≥2% + consistencia 35% · 90%',90,{minProfitPct:2,consistencyPct:35})],source:source.fp2},
{id:'fp-2-pro',firm:FP,name:'2 Step Pro',count:2,sizes:[5000,10000,25000,50000,100000,200000],evaluation:evalRules([6,6],3,6,0,{dailyBasis:'opening-high'}),funded:fundedRules(3,6,{dailyBasis:'opening-high'}),rewards:[reward('weekly','Semanal · 80%',80,{days:7,minProfitPct:1}),fpMonthly()],source:source.fpPro},
{id:'fp-2-flex',firm:FP,name:'2 Step Flex',count:2,sizes:[5000,10000,25000,50000,100000],evaluation:evalRules([10,8],4,12,1,{dailyBasis:'opening-high'}),funded:fundedRules(4,12,{dailyBasis:'opening-high'}),rewards:[reward('biweekly','Quincenal · 80%',80,{days:14,minProfitPct:1}),reward('ninetyfive','Quincenal · 95% + 3 días rentables ≥0,5%',95,{days:14,minProfitPct:1,profitableDays:3,dayProfitPct:.5}),fpMonthly()],source:source.fpFlex},
{id:'fp-zero',firm:FP,name:'Zero',count:0,sizes:[5000,10000,25000,50000,100000,200000],evaluation:null,funded:fundedRules(3,5,{dailyBasis:'opening-high',drawdown:'trailing-equity',riskPct:1,riskKind:'floating-loss',rollingDays:30,rollingMin:7,dayProfitPct:.25}),rewards:[reward('biweekly','Quincenal · 95% · reglas Zero',95,{days:14,minProfitPct:1,profitableDays:7,dayProfitPct:.25,consistencyPct:15,bufferPct:3,biggestLossCheck:true,rollingDays:30})],source:source.fpZero},
{id:'fp-prime',firm:FP,name:'Prime · por invitación',count:0,sizes:[],evaluation:null,funded:fundedRules(3,8,{dailyBasis:'opening-high',dailySoft:true}),rewards:[reward('daily','Diario · 80% · mínimo 1%',80,{minProfitPct:1})],source:source.fpPrime}
];
function profile(id,options={}){
const found=defs.find(x=>x.id===id);if(!found)throw Error('Programa no encontrado');const d=copy(found);
const legacy=d.firm===FP&&options.edition==='legacy',v=options.variant||'base',cycle=options.rewardId||d.rewards[0].id;
d.edition=legacy?'legacy':'current';d.editionLabel=d.firm===FP?(legacy?'Compra anterior al 28/09/2026':'Compra/reset desde el 28/09/2026'):'Reglas consultadas 04/10/2026';d.reviewed=reviewed;d.schemaVersion=1;d.notes=[];d.warnings=[];d.options=copy(options);
if(legacy){d.source=source.fpLegacy;d.editionLabel+=' · confirmar contrato';}
if(d.id==='fp-1-flex'){
 if(v==='daily2'){d.evaluation.dailyPct=2;d.funded.dailyPct=2;}
 if(legacy)d.rewards[0].split=85,d.rewards[0].label='Quincenal · 85% (anterior)';
}
if(d.id==='fp-2-standard'){
 if(v==='daily3'){d.evaluation.dailyPct=3;d.funded.dailyPct=3;d.evaluation.days=0;}
 if(v==='old10'){d.evaluation.targets=[10,5];d.evaluation.days=3;d.edition='legacy';d.source=source.fpLegacy;d.editionLabel='2 Step Standard 10% · cuenta anterior';}
}
if(d.id==='fp-2-pro'){
 if(legacy)d.evaluation.days=v==='days1'?1:2;
 else {d.evaluation.days=v==='days2'?2:0;d.warnings.push('La página oficial Pro publica 0 días, pero conserva párrafos de 1/2 días. Elegí el mínimo que figure en tu dashboard.');}
}
if(d.id==='fp-2-flex'){
 if(legacy){d.evaluation.targets=[10,6];d.rewards[0].split=85;d.rewards[0].label='Quincenal · 85% (anterior)';d.evaluation.days=v==='days0'?0:1;}
 if(cycle==='ninetyfive'){d.evaluation.days=3;d.evaluation.dayProfitPct=.5;}
 if(!legacy)d.warnings.push('La ficha actual indica Fase 2: 8%; la comparativa/versión anterior dice 6%. Para 10%/6% seleccioná la edición anterior y verificá tu contrato.');
}
if(d.firm===FN){
 if(options.noDays&&d.count>0){d.evaluation.days=0;d.notes.push('Complemento sin días mínimos seleccionado: verificar elegibilidad de tu tamaño.');}
 if(options.max10&&d.id==='fn-stellar-lite'){d.evaluation.maxPct=10;d.funded.maxPct=10;d.notes.push('Complemento Maximum Loss 10% seleccionado.');}
 if(options.oldFN&&d.id==='fn-stellar-1'){d.rewards[0].split=90;d.editionLabel='Stellar 1-Step · compra/reset anterior a 12/01/2026';}
 if(d.count>0){d.notes.push('Quick Strike: ganancias de operaciones <30 s deben permanecer por debajo del 30%. No copiar desde/hacia cuentas financiadas.');d.notes.push('Financiada: riesgo agregado máximo 3%; noticias ±5 min: solo 40% de las ganancias afectadas cuentan; pérdidas completas.');d.notes.push('EA: restricciones desde $50K; comprobar complemento y términos. Mantener dispositivo/IP y políticas de estrategias.');}
 else d.notes.push('Instant: asignación activa máxima $20K; riesgo máximo 3%; sin mínimo diario ni consistencia. Revisar noticias, EA y el efecto del retiro en el trailing.');
 d.notes.push('Inactividad: 60 días. Sin plazo máximo de evaluación. Fines de semana permitidos. KYC y aprobación de la firma necesarios.');
}else{
 d.notes.push('Reinicio diario: 00:00 del servidor (UTC+3). Incluye balance/equity, comisiones y swaps; inactividad: 30 días.');
 if(d.id==='fp-zero'){d.notes.push('Zero: noticias ±10 min y fin de semana prohibidos. Floating loss agregado máximo 1%; ganancias abiertas no compensan pérdidas abiertas.');d.notes.push('Retiros: conservar colchón 3%; mayor pérdida individual ≤ mayor ganancia individual. 7 días ≥0,25% en ventana móvil de 30 días.');}
 else if(d.id==='fp-prime')d.notes.push('Prime solo por invitación: KYC/acuerdo propios. Noticias y fin de semana permitidos. Escalado +10%; objetivos 5%/10% según nivel.');
 else{d.notes.push('Evaluación: mantener posiciones permitido; evitar explotación deliberada de noticias. Master: noticias ±5 min; discursos ±10 min. Excepción de posiciones abiertas ≥5 h antes.');d.notes.push(legacy?'Master: consultar restricciones temporales de fin de semana de la edición anterior.':'Master: sin overnight/fin de semana salvo complemento Swing; cierre automático diario.');}
}
d.reward=copy(d.rewards.find(x=>x.id===cycle)||d.rewards[0]);
if(options.lifetime95&&d.firm===FN&&d.id!=='fn-stellar-instant')d.reward.split=95;
if(options.swing&&d.firm===FP&&d.count>0)d.notes.push('Complemento Swing seleccionado: permite overnight/fin de semana en Master.');
if(legacy&&d.id==='fp-zero')d.notes.push('Edición anterior Zero: pérdida por idea 3% bajo $50K y 2% desde $50K. Confirmar aplicación con la firma.');
if(legacy&&d.id==='fp-2-standard'&&v==='old10')d.notes.push('Standard 10% anterior: límite por idea 3% entre $25K y menos de $50K, 2% desde $50K; comprobar tu contrato.');
if(legacy&&d.count>0){d.notes.push('Edición anterior: concentración >60% del objetivo por idea puede exigir 4 días rentables ≥0,5% por retiro; validar fecha/tamaño con la firma.');d.reward.concentrationPossible=true;
 if(d.id==='fp-1-flex')d.reward.strikePct=1;
 if(d.id==='fp-2-standard'&&v!=='old10'&&Number(options.capital)>25000&&d.reward.id!=='monthly')d.reward.strikePct=1.2;
}
if(d.reward.strikePct)d.notes.push('Reglas de retiro publican Striking: confirmar aplicabilidad en contrato. 1ª advertencia; 2ª mitad del split; 3ª 20%; 4ª cierre. Se registran manualmente.');
if(d.id==='fp-prime')d.warnings.push('Prime no se compra como challenge. Registrá únicamente una cuenta que FundingPips ya te haya asignado.');
return d;
}
function groupDays(ts){const out={};for(const t of ts){if(!t.date)continue;out[t.date]=(out[t.date]||0)+Number(t.pnl||0);}return out;}
function dayStats(ts,capital,threshold=0){const grouped=groupDays(ts);return {grouped,tradingDays:Object.keys(grouped).length,profitableDays:Object.values(grouped).filter(n=>n>0&&n+1e-8>=capital*threshold/100).length,pnl:Object.values(grouped).reduce((s,n)=>s+n,0),bestDay:Math.max(0,...Object.values(grouped))};}
function progress(a){const r=a.ruleSnapshot?.evaluation||evalRules(a.targets,a.dailyPct,a.maxPct,a.days);const ts=a.phases?.[Math.max(0,(a.phase||1)-1)]?.trades||[],s=dayStats(ts,a.capital,r.dayProfitPct),target=Number(a.capital)*Number(r.targets[(a.phase||1)-1]||0)/100;const days=r.dayProfitPct>0?s.profitableDays:s.tradingDays;return {...s,target,days,requiredDays:Number(r.days||0),dayProfitPct:Number(r.dayProfitPct||0),eligible:s.pnl+1e-8>=target&&days>=Number(r.days||0)};}
function effective(a){const p=a.ruleSnapshot;if(!p)return {dailyPct:a.dailyPct,maxPct:a.maxPct,riskPct:a.riskPct,drawdown:'static',dailyBasis:'initial',days:a.days};return a.status==='Funded'||p.count===0?p.funded:p.evaluation;}
function withdrawalDebit(w){const value=w.accountDebit==null||w.accountDebit===''?w.amount:w.accountDebit;return Math.max(0,Math.round((Number(value)||0)*100)/100);}
function transactions(a){const ts=a.status==='Funded'?a.pa?.trades||[]:a.phases?.[(a.phase||1)-1]?.trades||[];const out=ts.map((t,i)=>({date:t.date,order:t.recordedAt||i,amount:Number(t.pnl||0),type:'trade'}));if(a.status==='Funded')for(const w of a.pa?.withdrawals||[])if(withdrawalDebit(w)>0)out.push({date:w.date,order:w.recordedAt||1e15,amount:-withdrawalDebit(w),type:'withdrawal'});return out.sort((x,y)=>String(x.date).localeCompare(String(y.date))||x.order-y.order);}
function personalRisk(a,date){const ts=(a.pa?.trades||[]).filter(t=>t.date<=date),pnl=ts.reduce((s,t)=>s+Number(t.pnl||0),0),dayPnl=ts.filter(t=>t.date===date).reduce((s,t)=>s+Number(t.pnl||0),0),deposits=(a.deposits||[]).filter(d=>d.date<=date).reduce((s,d)=>s+Number(d.amount||0),0),debits=(a.pa?.withdrawals||[]).filter(w=>w.date<=date).reduce((s,w)=>s+withdrawalDebit(w),0),capital=Number(a.capital),balance=capital+pnl+deposits-debits,dailyBudget=a.dailyPct==null?null:capital*a.dailyPct/100,maxBudget=a.maxPct==null?null:capital*a.maxPct/100;return {balance,equity:balance,floor:maxBudget==null?-Infinity:capital-maxBudget,peak:capital,dailyBudget,dailyFloor:dailyBudget==null?null:balance-dayPnl-dailyBudget,dailyRemaining:dailyBudget==null?null:dailyBudget+dayPnl,maxRemaining:maxBudget==null?Infinity:maxBudget+pnl,dayPnl,openingBalance:balance-dayPnl,openingEquity:balance-dayPnl,manual:false,drawdown:'static',breached:false,softDaily:dailyBudget!=null&&dailyBudget+dayPnl<=0};}
function risk(a,date){if(a.accountType==='personal')return personalRisk(a,date);const r=effective(a),capital=Number(a.capital),events=transactions(a).filter(e=>e.date<=date);let balance=capital,peak=capital,floor=capital*(1-Number(r.maxPct||0)/100),gap=capital*Number(r.maxPct||0)/100,minBalance=capital;
for(const e of events){balance+=e.amount;minBalance=Math.min(minBalance,balance);if(r.drawdown==='trailing-balance'&&e.type==='withdrawal'){gap=Math.max(0,balance-floor);peak=balance;}else {peak=Math.max(peak,balance);if(r.drawdown.startsWith('trailing'))floor=Math.min(capital,Math.max(floor,peak-gap));}}
const stage=a.status==='Funded'?'Funded':'Phase'+(a.phase||1),manual=a.ruleRuntime?.[stage]?.[date]||{};
const before=events.filter(e=>e.date<date).reduce((s,e)=>s+e.amount,capital);const dayPnl=events.filter(e=>e.date===date&&e.type==='trade').reduce((s,e)=>s+e.amount,0);
const openingBalance=Number.isFinite(manual.openingBalance)?manual.openingBalance:before,openingEquity=Number.isFinite(manual.openingEquity)?manual.openingEquity:openingBalance;
const baseline=r.dailyBasis==='opening-high'?Math.max(openingBalance,openingEquity):openingBalance;
const dailyBudget=r.dailyPct==null?null:(r.dailyBasis==='opening-high'?baseline:capital)*Number(r.dailyPct)/100;
const dailyWithdrawals=events.filter(e=>e.date===date&&e.type==='withdrawal').reduce((s,e)=>s-e.amount,0);
const dailyFloor=dailyBudget==null?null:baseline-dailyBudget-dailyWithdrawals;
const equity=Number.isFinite(manual.equity)?manual.equity:balance;
if(r.drawdown==='trailing-equity'&&Number.isFinite(manual.peakEquity))floor=Math.max(floor,Math.min(capital,manual.peakEquity-capital*Number(r.maxPct)/100));
if(Number.isFinite(manual.floor))floor=Math.max(floor,manual.floor);
return {balance,equity,floor,peak,dailyBudget,dailyFloor,dailyRemaining:dailyFloor==null?null:equity-dailyFloor,maxRemaining:equity-floor,dayPnl,openingBalance,openingEquity,manual:!!Object.keys(manual).length,drawdown:r.drawdown,breached:equity<=floor+1e-8||(dailyFloor!=null&&equity<=dailyFloor+1e-8&&!r.dailySoft),softDaily:dailyFloor!=null&&equity<=dailyFloor+1e-8&&!!r.dailySoft};}
function payout(a,today){if(a.accountType==='personal')return null;const p=a.ruleSnapshot;if(!p||a.status!=='Funded')return null;const r=p.reward,pa=a.pa||{},all=pa.trades||[],start=pa.cycleStart||all.map(t=>t.date).sort()[0]||today;const ts=all.filter(t=>t.date>=start&&t.date<=today);let dayTrades=ts;
if(r.rollingDays){const lo=new Date(today+'T12:00:00Z');lo.setUTCDate(lo.getUTCDate()-r.rollingDays+1);dayTrades=ts.filter(t=>t.date>=lo.toISOString().slice(0,10));}
const stats=dayStats(ts,a.capital,r.dayProfitPct),profit=stats.pnl,consistency=profit>0?stats.bestDay/profit*100:Infinity;
let elapsed=0;const startDate=new Date(start+'T12:00:00Z'),endDate=new Date(today+'T12:00:00Z');if(r.businessDays){for(let d=new Date(startDate);d<endDate;d.setUTCDate(d.getUTCDate()+1)){const wd=d.getUTCDay();if(wd!==0&&wd!==6)elapsed++;}}else elapsed=Math.max(0,Math.floor((endDate-startDate)/86400000));
const wait=pa.rewardCount>0?Number(r.laterDays??r.days):Number(r.days),neededDays=Math.max(Number(r.profitableDays||0),pa.concentrationApplied?4:0),threshold=pa.concentrationApplied?Math.max(.5,Number(r.dayProfitPct||0)):Number(r.dayProfitPct||0),pdays=dayStats(dayTrades,a.capital,threshold).profitableDays;
const paid=(pa.withdrawals||[]).filter(w=>w.date>=start&&w.date<=today).reduce((s,w)=>s+withdrawalDebit(w),0);
const available=r.bufferPct?Math.max(0,risk(a,today).balance-a.capital-a.capital*r.bufferPct/100):Math.max(0,Math.min(profit-paid,risk(a,today).balance-a.capital));
const checks=[{label:'Beneficio mínimo para solicitar',value:available,need:a.capital*Number(r.minProfitPct||0)/100,ok:available>0&&available+1e-8>=a.capital*Number(r.minProfitPct||0)/100}];
if(wait>0)checks.push({label:r.businessDays?'Días hábiles del ciclo':'Días del ciclo',value:elapsed,need:wait,ok:elapsed>=wait,unit:'days'});
if(neededDays)checks.push({label:'Días rentables ≥'+threshold+'%',value:pdays,need:neededDays,ok:pdays>=neededDays,unit:'days'});
if(r.consistencyPct!=null)checks.push({label:'Consistencia (mejor día / beneficio neto)',value:consistency,need:r.consistencyPct,ok:consistency<=r.consistencyPct+1e-8,unit:'percent-max'});
if(r.bufferPct)checks.push({label:'Colchón a conservar',value:risk(a,today).balance-a.capital,need:a.capital*r.bufferPct/100,ok:risk(a,today).balance-a.capital>=a.capital*r.bufferPct/100});
if(r.biggestLossCheck){const loss=Math.max(0,...ts.map(t=>-Number(t.pnl))),win=Math.max(0,...ts.map(t=>Number(t.pnl)));checks.push({label:'Mayor pérdida ≤ mayor ganancia',value:loss,need:win,ok:loss<=win,unit:'money-max'});}
const strikes=Number(pa.strikes||0),split=strikes>=3?20:strikes===2?r.split/2:r.split;
const eligibleProfit=Math.max(0,available);
return {checks,profit,consistency,start,elapsed,split,eligibleProfit,paid,available,estimatedReward:eligibleProfit*split/100,eligible:checks.every(x=>x.ok)&&strikes<4&&!risk(a,today).breached,strikes,dayStats:stats};}
globalThis.FTRules={defs,source,reviewed,profile,copy,groupDays,dayStats,progress,effective,risk,payout,withdrawalDebit,transactions};
})();

