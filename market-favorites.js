(function(){'use strict';
const select=document.getElementById('ftMarketSelect'),tabs=document.querySelector('.ft-market-tabs');if(!select||!tabs)return;
const defaults=['OANDA:XAUUSD','OANDA:EURUSD','BITSTAMP:BTCUSD'],catalog=new Map(Array.from(select.options).map(o=>[o.value,o.textContent]));
let editing=false,last='',opener=null;
const controls=document.createElement('div');controls.className='ft90-market-controls';controls.innerHTML='<button type="button" id="ft90Add" class="btn">+ Agregar par</button><button type="button" id="ft90Edit" class="btn" aria-pressed="false">Eliminar</button><span id="ft90Status" role="status"></span>';tabs.before(controls);
const dialog=document.createElement('dialog');dialog.className='ft90-dialog';dialog.innerHTML='<form id="ft90Form"><div class="ft90-dialog-head"><h3>Agregar a tus mercados</h3><button type="button" id="ft90Close" class="btn" aria-label="Cerrar">×</button></div><label for="ft90Search">Buscar activo</label><input id="ft90Search" type="search" placeholder="EURUSD, Nasdaq, oro…" autocomplete="off"><label for="ft90Choice">Elegir activo</label><select id="ft90Choice" size="7" required></select><p id="ft90Message" role="status"></p><button class="btn primary" type="submit">Agregar favorito</button></form>';document.body.append(dialog);
const $=id=>document.getElementById(id);
function ready(){return !!window.ftCloudSession?.user?.id&&document.body.classList.contains('ft-ready');}
function favorites(){let raw=acc().preferences?.marketFavorites;if(!Array.isArray(raw))raw=accounts.find(a=>Array.isArray(a.preferences?.marketFavorites))?.preferences.marketFavorites;return Array.isArray(raw)?[...new Set(raw.filter(x=>catalog.has(x)))].slice(0,12):defaults.slice();}
function saveFavorites(next){if(!ready())return;accounts.forEach(a=>a.preferences={...(a.preferences||{}),marketFavorites:next.slice()});save();render();$('ft90Status').textContent='Preferencias guardadas.';}
function choose(symbol){select.value=symbol;select.dispatchEvent(new Event('change',{bubbles:true}));paint(true);}
function paint(force=false){if(!ready()){last='';return;}const list=favorites(),key=JSON.stringify([window.ftCloudSession.user.id,list,select.value,editing]);if(!force&&key===last)return;last=key;tabs.replaceChildren();for(const symbol of list){const name=catalog.get(symbol).split(' · '),group=document.createElement('div');group.className='ft90-favorite';const button=document.createElement('button');button.type='button';button.dataset.symbol=symbol;button.setAttribute('aria-pressed',String(symbol===select.value));button.append(document.createTextNode(name[0]));const small=document.createElement('small');small.textContent=name.slice(1).join(' · ');button.append(small);button.onclick=()=>choose(symbol);group.append(button);if(editing){const remove=document.createElement('button');remove.type='button';remove.className='ft90-remove';remove.setAttribute('aria-label','Eliminar '+name[0]+' de favoritos');remove.textContent='×';remove.onclick=()=>{saveFavorites(favorites().filter(x=>x!==symbol));$('ft90Edit').focus();};group.append(remove);}tabs.append(group);}
if(!list.length){const note=document.createElement('p');note.className='ft90-empty';note.textContent='Agregá tus pares favoritos con el botón +.';tabs.append(note);}
$('ft90Edit').textContent=editing?'Listo':'Eliminar';$('ft90Edit').setAttribute('aria-pressed',String(editing));$('ft90Edit').disabled=!list.length&&!editing;
}
function choices(){const query=$('ft90Search').value.trim().toLocaleLowerCase(),added=new Set(favorites());$('ft90Choice').replaceChildren();for(const [value,label] of catalog){if(added.has(value)||!label.toLocaleLowerCase().includes(query))continue;const option=new Option(label,value);$('ft90Choice').append(option);}
if($('ft90Choice').options.length)$('ft90Choice').selectedIndex=0;$('ft90Form').querySelector('[type=submit]').disabled=!$('ft90Choice').options.length||favorites().length>=12;$('ft90Message').textContent=favorites().length>=12?'Podés guardar hasta 12 favoritos. Eliminá uno para agregar otro.':!$('ft90Choice').options.length?'No hay activos disponibles para esta búsqueda.':'';}
$('ft90Add').onclick=()=>{if(!ready())return;opener=$('ft90Add');$('ft90Search').value='';choices();dialog.showModal();$('ft90Search').focus();};
function close(){dialog.close();opener?.focus();}
$('ft90Close').onclick=close;dialog.addEventListener('close',()=>opener?.focus());$('ft90Search').oninput=choices;
$('ft90Edit').onclick=()=>{editing=!editing;paint(true);};
$('ft90Form').onsubmit=e=>{e.preventDefault();if(!ready())return close();const symbol=$('ft90Choice').value,list=favorites();if(!catalog.has(symbol)||list.includes(symbol)||list.length>=12)return;saveFavorites([...list,symbol]);choose(symbol);close();};
select.addEventListener('change',()=>paint(true));
const prev=window.render;if(typeof prev==='function')window.render=function(){const out=prev.apply(this,arguments);paint();return out;};
new MutationObserver(()=>{if(!ready()){editing=false;if(dialog.open)close();}paint();}).observe(document.body,{attributes:true,attributeFilter:['class']});paint();
})();
