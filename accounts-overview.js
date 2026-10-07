(function(){'use strict';
const $=id=>document.getElementById(id),E=window.FTProtection.escape,L=window.FTLedger,M=window.FTMultiAccounts,R=window.FTRules;
const cash=n=>new Intl.NumberFormat('es-PY',{style:'currency',currency:'USD',currencyDisplay:'narrowSymbol',maximumFractionDigits:2}).format(n),signed=n=>(n>0?'+':'')+cash(n),stage=a=>a.status==='Funded'?'PA':a.status==='Failed'?'Fallida':a.status==='Completed'?'Completada':'Fase '+a.phase;
const normalize=s=>String(s||'').trim().toLowerCase(),firm=a=>/^founded?next$/i.test(a.firm)?'FundedNext':a.firm;
function signature(a){const p=a.ruleSnapshot;return JSON.stringify([normalize(firm(a)),a.modelId&&a.modelId!=='custom'?a.modelId:normalize(a.program),Number(a.capital),p?{edition:p.edition,options:{swing:!!p.options?.swing,oldFN:!!p.options?.oldFN},evaluation:p.evaluation,funded:p.funded,reward:p.reward}: {targets:a.targets,daily:a.dailyPct,max:a.maxPct,risk:a.riskPct,days:a.days}]);}
function buckets(list=accounts){const map=new Map();for(const a of list){const key=signature(a);if(!map.has(key))map.set(key,{key,reference:a,accounts:[]});map.get(key).accounts.push(a);}return [...map.values()];}
let dialogOwner=null,dialogKey=null,user=null;
const dialog=document.createElement('dialog');dialog.id='ft78AccountsDialog';dialog.innerHTML='<header><h3>Cuentas de este challenge</h3><button type="button" class="btn" id="ft78Close">Cerrar</button></header><p class="sub">Elegí una cuenta para consultar sus datos individuales. Las cuentas se conservan por separado.</p><div id="ft78AccountChoices"></div>';dialog.setAttribute('aria-label','Elegir cuenta individual');document.body.append(dialog);
$('ft78Close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{dialogOwner=null;dialogKey=null;$('ft78AccountChoices').replaceChildren();});
function openChoices(bucket){dialogOwner=window.ftCloudSession?.user?.id;dialogKey=bucket.key;$('ft78AccountChoices').innerHTML=bucket.accounts.map(a=>{const g=M.groups().find(g=>g.accounts.some(x=>x.id===a.id));return '<button type="button" class="ft-account-choice" data-ft78-individual="'+E(a.id)+'"><strong>'+E(a.nickname||a.program)+' · '+E(a.id.slice(-4))+'</strong><span>'+E(stage(a))+' · Balance '+cash(L.snapshot(a).balance)+'</span><small>'+E(g?'Grupo · '+g.name:'Sin grupo')+'</small></button>';}).join('');dialog.showModal();}
$('ft78AccountChoices').onclick=e=>{const b=e.target.closest('[data-ft78-individual]');if(!b||dialogOwner!==window.ftCloudSession?.user?.id)return;const a=accounts.find(a=>a.id===b.dataset.ft78Individual);if(!a||signature(a)!==dialogKey){dialog.close();return;}dialog.close();M.openIndividual(a.id,'ftPageAccounts');$('ft61RuleStrip')?.scrollIntoView({behavior:'smooth',block:'start'});};
function paint(){const next=document.body.classList.contains('ft-ready')?window.ftCloudSession?.user?.id:null;if(next!==user){user=next;dialog.close();dialogOwner=null;dialogKey=null;$('ft78AccountChoices').replaceChildren();}
const host=$('ftMyAccounts'),grid=host?.querySelector('.ft-account-list');if(!grid)return;
const list=buckets(),activeBucket=list.find(b=>b.accounts.some(a=>a.id===activeId));
// A challenge card represents a program/size/configuration, never a sum of accounts.
grid.replaceChildren();host.querySelector('h3').textContent='Cuentas por challenge';
for(const bucket of list){const a=bucket.reference,v=L.snapshot(a),name=R.defs.find(d=>d.id===a.modelId)?.name||a.ruleSnapshot?.name||a.program,article=document.createElement('article');article.className='ft-account-choice ft78-challenge'+(bucket===activeBucket?' active':'');article.dataset.ft78Challenge=a.id;
article.innerHTML='<h4>'+E(name)+' · '+cash(a.capital)+'</h4><span>'+E(firm(a))+'</span><small>Referencia · '+E(a.nickname||a.program)+' · '+E(stage(a))+'</small><span>Balance de referencia <strong>'+cash(v.balance)+'</strong></span><span>P&L de referencia <strong class="'+(v.pnl<0?'red':v.pnl>0?'green':'')+'">'+signed(v.pnl)+'</strong></span><div class="ft78-actions"><button type="button" class="btn" data-ft78-reference>Ver referencia</button><button type="button" class="btn" data-ft78-choices>Elegir cuenta</button></div>';
article.querySelector('[data-ft78-reference]').onclick=()=>{if(!accounts.some(x=>x.id===a.id))return;M.openIndividual(a.id,'ftPageAccounts');$('ft61RuleStrip')?.scrollIntoView({behavior:'smooth',block:'start'});};article.querySelector('[data-ft78-choices]').onclick=()=>openChoices(bucket);grid.append(article);
}
let note=host.querySelector('.ft77-overview-note');if(!note){note=document.createElement('p');note.className='ft77-overview-note';host.append(note);}note.textContent='Una ficha por challenge, monto y configuración. Las cantidades y los balances conjuntos se consultan en Grupos. Ver referencia abre la primera cuenta; Elegir cuenta permite consultar otra.';
const tab=$('ftPageAccounts').querySelector('[data-scope="individual"]');if(tab)tab.textContent='Cuentas';
// Keep the full original catalogue close to the challenge overview, ahead of individual rule details.
const catalog=$('ftProgramCatalogue');if(catalog&&host.parentElement===catalog.parentElement&&host.nextElementSibling!==catalog)host.after(catalog);
let link=host.querySelector('#ft78CatalogueLink');if(!link){link=document.createElement('button');link.type='button';link.id='ft78CatalogueLink';link.className='btn';link.textContent='Ver catálogo completo';link.onclick=()=>catalog?.scrollIntoView({behavior:'smooth',block:'start'});host.querySelector('.ft-rule-heading').insertBefore(link,$('ftAddPresetAccount'));}
if(dialog.open){const current=buckets().find(b=>b.key===dialogKey);if(!current||current.accounts.length!==$('ft78AccountChoices').children.length)dialog.close();}
}
const render=window.render;window.render=function(){const result=render.apply(this,arguments);paint();return result;};
window.addEventListener('ft67SyncStatus',paint);new MutationObserver(paint).observe(document.body,{attributes:true,attributeFilter:['class']});
window.FTAccountOverview={paint,buckets};paint();
})();
