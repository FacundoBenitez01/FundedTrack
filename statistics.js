(function(){
'use strict';
const $=id=>document.getElementById(id),E=window.JourFundStatsEngine,L=window.FTLedger;
const old=$('wins')?.closest('.section'),page=$('ftPageOps');if(!old||!page||!E||!L)return;
const locale=()=>window.JourFundI18n?.language==='en'?'en-US':window.JourFundI18n?.language==='pt-BR'?'pt-BR':'es-PY';
const words={
 es:['Estadísticas','Una visión clara de tu rendimiento.','Período','Todos los meses','Distribución de resultados','operaciones','operaciones','R acumuladas','Mejor trade','Peor trade','Evolución del balance','Inicio','Cierre','Sin operaciones en este período.','La distribución incluye BE; el win rate los excluye.','Estas estadísticas corresponden a la etapa activa. Los límites de riesgo conservan su estado actual.','BE','Wins','Losses','R no disponible: hay operaciones sin riesgo positivo válido.','Sin movimientos de balance en este período.'],
 en:['Statistics','A clear view of your performance.','Period','All months','Outcome distribution','trades','trades','Accumulated R','Best trade','Worst trade','Balance evolution','Opening','Closing','No trades in this period.','Distribution includes BE; win rate excludes them.','These statistics cover the active stage. Risk limits retain their current state.','BE','Wins','Losses','R unavailable: some trades lack valid positive risk.','No balance movements in this period.'],
 'pt-BR':['Estatísticas','Uma visão clara do seu desempenho.','Período','Todos os meses','Distribuição dos resultados','operações','operações','R acumulados','Melhor operação','Pior operação','Evolução do saldo','Inicial','Final','Nenhuma operação neste período.','A distribuição inclui BE; a taxa de acerto os exclui.','Estas estatísticas correspondem à etapa ativa. Os limites de risco mantêm seu estado atual.','BE','Wins','Losses','R indisponível: há operações sem risco positivo válido.','Nenhuma movimentação de saldo neste período.']
};
const labels=()=>words[window.JourFundI18n?.language]||words.es;
const format=n=>new Intl.NumberFormat(locale(),{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
const signed=n=>(n>0?'+':'')+format(n);
const icon=path=>'<span class="jf105-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg></span>';
const panel=document.createElement('section');panel.id='jf105Stats';panel.className='section';
panel.innerHTML='<div class="jf105-head"><div><h2 id="jf105Title"></h2><p id="jf105Subtitle"></p><p id="jf105Account"></p></div><div class="jf105-filter"><label for="jf105Month" id="jf105Period"></label><select id="jf105Month"></select></div></div><div class="jf105-summary"><div class="jf105-outcomes"><div class="jf105-outcome-head"><span id="jf105Distribution"></span><span class="jf105-total" id="jf105Total"></span></div><div class="jf105-distribution"><div class="jf105-ring" id="jf105Ring" role="img"><div class="jf105-ring-center"><strong id="jf105RingTotal">0</strong><small id="jf105RingLabel"></small></div></div><div class="jf105-legend">'+['win','loss','be'].map((kind,i)=>'<div class="jf105-legend-row"><span class="jf105-legend-name"><i class="jf105-dot '+(i===1?'loss':i===2?'be':'')+'"></i><span id="jf105CountSlot'+i+'"></span><span id="jf105Name'+i+'"></span></span><span class="jf105-percent" id="jf105Percent'+i+'"></span></div>').join('')+'</div></div><p class="jf105-note" id="jf105OutcomeNote"></p></div><div class="jf105-metrics">'+[icon('<path d="M3 18l6-6 4 3 8-10M15 5h6v6"/>'),icon('<path d="M8 3h8v5a4 4 0 0 1-8 0V3zM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 12v7m-4 2h8"/>'),icon('<path d="M12 3v17m-6-6 6 6 6-6"/>')].map((svg,i)=>'<div class="jf105-metric"><span class="jf105-metric-name">'+svg+'<span id="jf105MetricLabel'+i+'"></span></span><span id="jf105MetricSlot'+i+'"></span></div>').join('')+'</div></div><div class="jf105-chart"><div class="jf105-chart-head"><h3 id="jf105ChartTitle"></h3><strong id="jf105Balance"></strong></div><div id="jf105Chart"></div></div><div class="jf105-context" id="jf105Context"></div>';
old.before(panel);
['wins','losses','bes'].forEach((id,i)=>{const n=$(id);n.className='value jf105-count';$('jf105CountSlot'+i).append(n);});
['rTotal','best','worst'].forEach((id,i)=>{$('jf105MetricSlot'+i).append($(id));});
old.hidden=true;
const oldChart=$('chart')?.closest('.ft60-balance-detail')||$('chart')?.closest('.section');if(oldChart)oldChart.hidden=true;
let scope='',chosen='',currentKey='';
function monthTitle(month){return new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T12:00:00Z'));}
function refresh(){
 if(!accounts.length)return;const a=acc(),uid=window.ftCloudSession?.user?.id;
 const today=L.day(a),current=today.slice(0,7),nextScope=JSON.stringify([uid,a.id,a.status,a.phase]);
 if(scope!==nextScope){
  scope=nextScope;currentKey=uid?'jourfund_stats_month_'+uid+'_'+a.id+'_'+(a.status==='Funded'?'PA':a.phase):'';
  chosen=current;
  if(currentKey)try{const saved=localStorage.getItem(currentKey);if(saved==='all'||/^\d{4}-(0[1-9]|1[0-2])$/.test(saved||''))chosen=saved;}catch{}
 }
 const ts=trades(),w=labels(),months=new Set([current,...ts.map(t=>String(t.date||'').slice(0,7)).filter(m=>/^\d{4}-(0[1-9]|1[0-2])$/.test(m))]);
 for(let i=0;i<12;i++){const d=new Date(current+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()-i);months.add(d.toISOString().slice(0,7));}if(chosen!=='all')months.add(chosen);
 const select=$('jf105Month');select.replaceChildren();const all=document.createElement('option');all.value='all';all.textContent=w[3];select.append(all);
 [...months].sort().reverse().forEach(m=>{const option=document.createElement('option');option.value=m;option.textContent=monthTitle(m);select.append(option);});select.value=chosen;
 const stats=E.summarize(ts,a.capital,chosen),counts=[stats.wins,stats.losses,stats.bes];
 $('jf105Title').textContent=w[0];$('jf105Subtitle').textContent=w[1];$('jf105Account').textContent=(a.nickname||a.firm)+' · '+format(a.capital)+' · '+(chosen==='all'?w[3]:monthTitle(chosen));$('jf105Period').textContent=w[2];$('jf105Distribution').textContent=w[4];$('jf105Total').textContent=stats.total+' '+w[5];$('jf105RingTotal').textContent=stats.total;$('jf105RingLabel').textContent=w[6];
 counts.forEach((n,i)=>{$(['wins','losses','bes'][i]).textContent=n;$('jf105Name'+i).textContent=w[[17,18,16][i]];$('jf105Percent'+i).textContent=stats.total?new Intl.NumberFormat(locale(),{maximumFractionDigits:1}).format(n/stats.total*100)+'%':'—';});
 const win=stats.total?stats.wins/stats.total*100:0,loss=stats.total?stats.losses/stats.total*100:0;
 $('jf105Ring').style.background=stats.total?'conic-gradient(var(--green,#49dca1) 0% '+win+'%,var(--red,#f07888) '+win+'% '+(win+loss)+'%,var(--accent) '+(win+loss)+'% 100%)':'var(--border)';
 $('jf105Ring').setAttribute('aria-label',stats.total+' '+w[5]+': '+counts.map((n,i)=>n+' '+w[[17,18,16][i]]).join(', '));
 $('jf105OutcomeNote').textContent=stats.total?w[14]:w[13];
 [7,8,9].forEach((index,i)=>$('jf105MetricLabel'+i).textContent=w[index]);
 $('rTotal').textContent=stats.r===null?'—':(stats.r>0?'+':'')+new Intl.NumberFormat(locale(),{minimumFractionDigits:2,maximumFractionDigits:2}).format(stats.r)+'R';$('rTotal').className='value r';$('rTotal').title=stats.r===null?w[19]:'';
 $('best').textContent=stats.best===null?'—':signed(stats.best);$('best').className='value green';$('worst').textContent=stats.worst===null?'—':signed(stats.worst);$('worst').className='value red';
 $('jf105ChartTitle').textContent=w[10];$('jf105Context').textContent=w[15];
 const end=chosen==='all'?'9999-12-31':new Date(Date.UTC(Number(chosen.slice(0,4)),Number(chosen.slice(5,7)),0)).toISOString().slice(0,10);
 const ledger=L.snapshot(a,end),series=E.monthSeries(ledger.series,chosen),plot=E.plot(series);$('jf105Balance').textContent=format(plot.end);
 const chart=$('jf105Chart');chart.replaceChildren();
 if(series.length<=1){const empty=document.createElement('div');empty.className='jf105-empty';empty.textContent=w[20];chart.append(empty);return;}
 // SVG coordinates come only from finite numeric ledger balances, never journal strings.
 chart.innerHTML='<div class="jf105-chart-body"><div class="jf105-axis"><span></span><span></span><span></span></div><svg class="jf105-svg" viewBox="0 0 540 160" preserveAspectRatio="none" role="img"><defs><linearGradient id="jf105Fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path d="M0 20H540M0 80H540M0 140H540" stroke="var(--border)" stroke-dasharray="3 5" fill="none"/><path d="'+plot.area+'" fill="url(#jf105Fill)"/><path d="'+plot.path+'" fill="none" stroke="currentColor" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg></div><div class="jf105-chart-foot"><span></span><span></span></div>';
 chart.querySelectorAll('.jf105-axis span').forEach((n,i)=>n.textContent=format([plot.max,(plot.min+plot.max)/2,plot.min][i]));
 chart.querySelector('svg').setAttribute('aria-label',w[10]+': '+format(plot.start)+' → '+format(plot.end));
 const foot=chart.querySelectorAll('.jf105-chart-foot span');foot[0].textContent=w[11]+' '+format(plot.start);foot[1].textContent=w[12]+' '+format(plot.end);
}
$('jf105Month').onchange=e=>{chosen=e.target.value;if(currentKey)try{localStorage.setItem(currentKey,chosen);}catch{}refresh();};
const previous=window.render;window.render=function(){previous();refresh();};
window.JourFundStatistics={refresh};
window.addEventListener('jfLanguageChanged',refresh);
new MutationObserver(()=>{if(page.classList.contains('active'))refresh();}).observe(page,{attributes:true,attributeFilter:['class']});
refresh();
})();