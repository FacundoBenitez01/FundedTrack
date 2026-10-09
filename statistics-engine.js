/* Pure monthly journal statistics. Never mutates accounts or cash-flow records. */
(function(root){
'use strict';
const number=v=>Number.isFinite(Number(v))?Number(v):0;
function summarize(list,capital,month='all'){
 const rows=list.filter(t=>month==='all'||String(t.date||'').slice(0,7)===month);
 let wins=0,losses=0,bes=0,r=0,valid=true,best=null,worst=null;
 for(const t of rows){
  const pnl=number(t.pnl);
  if(t.result==='BE'||pnl===0)bes++;else if(pnl>0)wins++;else losses++;
  if(pnl>0)best=best===null?pnl:Math.max(best,pnl);
  if(pnl<0)worst=worst===null?pnl:Math.min(worst,pnl);
  const risk=Number(t.risk),base=Number(t.multiCapital??capital);
  if(!Number.isFinite(risk)||risk<=0||risk>100||!Number.isFinite(base)||base<=0)valid=false;
  else r+=pnl/(base*risk/100);
 }
 return {total:rows.length,wins,losses,bes,r:valid?r:null,best,worst,
  winrate:wins+losses?wins/(wins+losses)*100:null,pnl:rows.reduce((n,t)=>n+number(t.pnl),0)};
}
function monthSeries(series,month){
 if(!series.length)return [];
 if(month==='all')return series.map(p=>({...p}));
 const start=month+'-01';let opening=number(series[0].balance);
 for(const p of series){if(p.date&&p.date<start)opening=number(p.balance);}
 return [{date:start,balance:opening,type:'opening'},...series.filter(p=>p.date&&p.date.slice(0,7)===month).map(p=>({...p}))];
}
function plot(series){
 if(!series.length)return {path:'',area:'',min:0,max:0,start:0,end:0};
 let min=Infinity,max=-Infinity;for(const p of series){min=Math.min(min,number(p.balance));max=Math.max(max,number(p.balance));}
 const range=max-min||Math.max(1,Math.abs(max)*.01),points=[];
 if(series.length<=240){series.forEach((p,i)=>points.push({p,i}));}
 else{
  const size=Math.ceil(series.length/60);
  for(let from=0;from<series.length;from+=size){
   const end=Math.min(series.length-1,from+size-1);let lo=from,hi=from;
   for(let i=from;i<=end;i++){if(series[i].balance<series[lo].balance)lo=i;if(series[i].balance>series[hi].balance)hi=i;}
   [...new Set([from,lo,hi,end])].sort((a,b)=>a-b).forEach(i=>points.push({p:series[i],i}));
  }
 }
 const coords=points.map(({p,i})=>[series.length===1?0:i/(series.length-1)*540,140-(number(p.balance)-min)/range*120]);
 const path=coords.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)).join(' ');
 return {path,area:path+' L540 150 L0 150 Z',min,max,start:number(series[0].balance),end:number(series.at(-1).balance),points:points.length};
}
root.JourFundStatsEngine={summarize,monthSeries,plot};
})(globalThis);
