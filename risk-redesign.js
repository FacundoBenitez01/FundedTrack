(function(){
'use strict';
const $=id=>document.getElementById(id),R=window.FTRules,L=window.FTLedger,card=$('riskStatus')?.closest('.card');
if(!card||!R||!L)return;
card.id='jf106Risk';
const grid=document.createElement('div');grid.className='jf106-limits';card.querySelector('.stats').before(grid);
for(const id of ['dailyRiskText','maxRiskText'])$(id)?.closest('.stat')?.setAttribute('hidden','');
const words={
es:['Gestión de riesgo','Pérdida diaria','Pérdida máxima','Consumido','Disponible','Sin límite configurado','del límite','Piso de pérdida','Equity de referencia','Referencia personal alcanzada','Límite alcanzado en el registro','Pausa diaria','Cerca del límite','Dentro de los límites registrados','Sin límites configurados','Cuenta finalizada','Profit Factor','Drawdown histórico','Racha actual','Peor racha','Riesgo actual · independiente del mes seleccionado','Con referencias manuales.','Estimado con operaciones cerradas.','Confirmá siempre los límites y el estado de tu cuenta en la plataforma de la firma.'],
en:['Risk management','Daily loss','Maximum loss','Used','Available','No configured limit','of limit','Loss floor','Reference equity','Personal reference reached','Limit reached in journal','Daily pause','Near the limit','Within recorded limits','No configured limits','Account closed','Profit Factor','Historical drawdown','Current streak','Worst streak','Current risk · independent of selected month','Includes manual references.','Estimated from closed trades.','Always confirm your limits and account status on your firm’s platform.'],
'pt-BR':['Gestão de risco','Perda diária','Perda máxima','Consumido','Disponível','Sem limite configurado','do limite','Piso de perda','Equity de referência','Referência pessoal atingida','Limite atingido no diário','Pausa diária','Perto do limite','Dentro dos limites registrados','Sem limites configurados','Conta encerrada','Profit Factor','Drawdown histórico','Sequência atual','Pior sequência','Risco atual · independente do mês selecionado','Com referências manuais.','Estimado com operações encerradas.','Confirme sempre os limites e o estado da conta na plataforma da empresa.']
};
function limit(budget,remaining){
 const enabled=Number.isFinite(budget)&&budget>0&&Number.isFinite(remaining);
 const used=enabled?Math.max(0,budget-remaining):0,percent=enabled?used/budget*100:0;
 return {enabled,budget,remaining,used,percent,width:Math.min(100,Math.max(0,percent)),tone:enabled&&remaining<=0?'danger':percent>=70?'warning':'normal'};
}
function state(a,v,r){
 const personal=a.accountType==='personal';
 const daily=limit(v.dailyBudget,v.dailyRemaining),max=limit(personal?(a.maxPct==null?null:Number(a.capital)*Number(a.maxPct)/100):(r.maxPct==null?null:Number(a.capital)*Number(r.maxPct)/100),v.maxRemaining);
 let status=13,tone='normal';
 if(!daily.enabled&&!max.enabled){status=14;tone='neutral';}
 if(daily.percent>=70||max.percent>=70){status=12;tone='warning';}
 if(personal&&((daily.enabled&&daily.remaining<=0)||(max.enabled&&max.remaining<=0))){status=9;tone='warning';}
 else if(!personal){
  if(v.softDaily){status=11;tone='warning';}
  if(v.breached||(max.enabled&&max.remaining<=0)||(daily.enabled&&daily.remaining<=0&&!r.dailySoft)){status=10;tone='danger';}
  if(a.status==='Failed'){status=15;tone='danger';}
 }
 return {daily,max,status,tone};
}
function refresh(){
 const a=acc();if(!a)return;
 const lang=window.JourFundI18n?.language||'es',w=words[lang]||words.es;
 const fmt=n=>new Intl.NumberFormat(lang==='en'?'en-US':lang==='pt-BR'?'pt-BR':'es-PY',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
 const pct=n=>new Intl.NumberFormat(lang==='en'?'en-US':lang==='pt-BR'?'pt-BR':'es-PY',{maximumFractionDigits:1}).format(n);
 const v=R.risk(a,L.day(a)),r=R.effective(a),s=state(a,v,r);
 card.querySelector('h2').textContent=w[0];
 grid.innerHTML=[s.daily,s.max].map((m,i)=>'<article class="jf106-limit" data-tone="'+m.tone+'"><div class="jf106-limit-head"><span>'+w[i+1]+'</span><span class="jf106-percent">'+(m.enabled?pct(m.percent)+'%':'—')+'</span></div><div class="jf106-amount">'+(m.enabled?fmt(m.used):'—')+'<small>'+(m.enabled?' / '+fmt(m.budget):w[5])+'</small></div><div class="jf106-meter" role="progressbar" aria-label="'+w[i+1]+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+m.width+'" aria-valuetext="'+(m.enabled?pct(m.percent)+'% '+w[6]:w[5])+'"><span style="width:'+m.width+'%"></span></div><div class="jf106-available"><span>'+w[4]+'</span><strong>'+(m.enabled?fmt(m.remaining):'—')+'</strong></div>'+(i===1&&m.enabled&&Number.isFinite(v.floor)?'<div class="jf106-floor">'+w[7]+': '+fmt(v.floor)+' · '+w[8]+': '+fmt(v.equity)+'</div>':'')+'</article>').join('');
 const status=$('riskStatus');status.textContent=w[s.status];status.dataset.tone=s.tone;status.style.color='';
 for(const [i,id] of ['profitFactor','drawdown','streak','worstStreak'].entries())$(id).closest('.stat').querySelector('.label').textContent=w[16+i];
 let caption=$('jf106Caption');if(!caption){caption=document.createElement('p');caption.id='jf106Caption';caption.className='jf106-caption';grid.before(caption);}
 caption.textContent=w[20];
 $('riskMessage').textContent=(v.manual?w[21]:w[22])+' '+w[23];
}
window.JourFundRiskDisplay={limit,state,refresh};
const previous=window.render;window.render=function(){const result=previous.apply(this,arguments);refresh();return result;};
window.addEventListener('jfLanguageChanged',refresh);
const page=$('ftPageOps');if(page)new MutationObserver(()=>{if(page.classList.contains('active'))refresh();}).observe(page,{attributes:true,attributeFilter:['class']});
refresh();
})();