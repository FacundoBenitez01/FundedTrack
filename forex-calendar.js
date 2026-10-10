(function(){'use strict';
const host=document.getElementById('ftCalendarHost');if(!host)return;
const ranks={High:3,Medium:2,Low:1},labels={High:'Alto',Medium:'Medio',Low:'Bajo'};
let feed={available:false,events:[]},zone='America/Asuncion',user=null,started=false;
host.innerHTML='<div class="ft89-filters"><label>Día<select id="ft89Day"><option value="today">Hoy</option><option value="tomorrow">Mañana</option><option value="week" selected>Semana</option></select></label><label>Moneda<select id="ft89Currency"><option value="all">Todas</option>'+['USD','EUR','GBP','JPY','CAD','AUD','NZD','CHF','CNY'].map(c=>'<option>'+c+'</option>').join('')+'</select></label><label>Impacto<select id="ft89Impact"><option value="all">Todos</option><option value="High">Alto</option><option value="Medium">Medio o alto</option></select></label></div><p id="ft89Updated" class="ft89-updated" role="status">Cargando eventos de Forex Factory…</p><div id="ft89Events" class="ft89-events"></div>';
const $=id=>document.getElementById(id),retry=$('ftCalendarRetry');
function day(d){return new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);}
function tomorrow(){const today=day(new Date()),d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);}
function text(tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;}
function paint(){if($('ftLocalClock'))$('ftLocalClock').textContent=zone+' · '+new Intl.DateTimeFormat((window.jfLocale?.()||'es-PY'),{timeZone:zone,hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}).format(new Date());const output=$('ft89Events');output.replaceChildren();const age=Date.now()-Date.parse(feed.fetchedAt),usable=feed.source==='Forex Factory'&&feed.available===true&&Number.isFinite(age)&&age>=-60000&&age<30*60000&&Array.isArray(feed.events);
if(!usable){$('ft89Updated').textContent=navigator.onLine?'Calendario no disponible o desactualizado. Tocá Actualizar o abrí Forex Factory.':'Sin conexión. El calendario requiere Internet.';return;}
$('ft89Updated').textContent='Actualizado '+new Intl.DateTimeFormat((window.jfLocale?.()||'es-PY'),{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(new Date(feed.fetchedAt))+' · '+zone+' · Horarios aproximados';
const chosen=$('ft89Day').value,currency=$('ft89Currency').value,impact=$('ft89Impact').value,today=day(new Date()),next=tomorrow();
const events=feed.events.filter(n=>n&&typeof n.title==='string'&&typeof n.currency==='string'&&Number.isFinite(Date.parse(n.date))&&ranks[n.impact]).filter(n=>(currency==='all'||n.currency===currency||n.currency==='All')&&(impact==='all'||ranks[n.impact]>=ranks[impact])&&(chosen==='week'||day(new Date(n.date))===(chosen==='today'?today:next))).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
let last='';for(const n of events){const d=new Date(n.date),key=day(d);if(last!==key){output.append(text('h3',new Intl.DateTimeFormat((window.jfLocale?.()||'es-PY'),{timeZone:zone,weekday:'long',day:'numeric',month:'long'}).format(d),'ft89-day'));last=key;}
const row=document.createElement('article');row.className='ft89-event';const time=text('time',new Intl.DateTimeFormat((window.jfLocale?.()||'es-PY'),{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d));time.dateTime=d.toISOString();const copy=document.createElement('div');copy.append(text('strong',n.title));const meta=document.createElement('div');meta.className='ft89-meta';meta.append(text('span',n.currency,'ft89-currency'));const badge=text('span','Impacto '+labels[n.impact],'ft89-impact');badge.dataset.impact=n.impact;meta.append(badge);copy.append(meta);row.append(time,copy);output.append(row);}
if(!events.length)output.append(text('p','No hay eventos en la exportación semanal para estos filtros.','ft89-empty'));
}
window.addEventListener('ft89Calendar',e=>{if(!document.body.classList.contains('ft-ready'))return;feed=e.detail.calendar||{available:false,events:[]};try{new Intl.DateTimeFormat('es',{timeZone:e.detail.timezone});zone=e.detail.timezone;}catch{}paint();});
for(const id of ['ft89Day','ft89Currency','ft89Impact'])$(id).onchange=paint;
async function refresh(){if(retry.disabled)return;retry.disabled=true;retry.textContent='Actualizando…';try{await window.ft89RefreshCalendar?.();paint();}finally{retry.disabled=false;retry.textContent='Actualizar';}}
retry.onclick=refresh;
function init(){const uid=window.ftCloudSession?.user?.id;if(uid!==user){user=uid;feed={available:false,events:[]};started=false;paint();}if(uid&&document.body.classList.contains('ft-ready')&&!started){started=true;refresh();}}
new MutationObserver(init).observe(document.body,{attributes:true,attributeFilter:['class']});window.addEventListener('ft67SyncStatus',init);window.addEventListener('online',refresh);window.addEventListener('offline',paint);setInterval(paint,60000);init();
})();
