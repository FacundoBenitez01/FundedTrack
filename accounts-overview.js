(function(){'use strict';
const E=window.FTProtection.escape,L=window.FTLedger,M=window.FTMultiAccounts;
const cash=n=>new Intl.NumberFormat('es-PY',{style:'currency',currency:'USD',currencyDisplay:'narrowSymbol',maximumFractionDigits:2}).format(n),signed=n=>(n>0?'+':'')+cash(n),stage=a=>a.status==='Funded'?'PA':a.status==='Failed'?'Fallida':a.status==='Completed'?'Completada':'Fase '+a.phase;
function paint(){const host=document.getElementById('ftMyAccounts'),grid=host?.querySelector('.ft-account-list');if(!grid)return;
const groups=M.groups(),memberIds=new Set(groups.flatMap(g=>g.accounts.map(a=>String(a.id))));
// Hide only members of an actual named group; all account records stay intact.
for(const button of grid.querySelectorAll('[data-account-id]'))if(memberIds.has(button.dataset.accountId))button.remove();
grid.querySelectorAll('[data-ft77-group]').forEach(n=>n.remove());
for(const group of groups){const reference=group.accounts[0];if(!reference)continue;const ref=L.snapshot(reference),snapshots=group.accounts.map(a=>L.snapshot(a)),balance=snapshots.reduce((s,x)=>s+Math.round(x.balance*100),0)/100,pnl=snapshots.reduce((s,x)=>s+Math.round(x.pnl*100),0)/100,homogeneous=group.accounts.every(a=>a.firm===reference.firm&&a.capital===reference.capital&&a.program===reference.program),states=new Map();for(const a of group.accounts)states.set(stage(a),(states.get(stage(a))||0)+1);
const button=document.createElement('button');button.type='button';button.className='ft-account-choice ft77-group-card'+(group.accounts.some(a=>a.id===activeId)?' active':'');button.dataset.ft77Group=group.id;button.setAttribute('aria-label','Abrir grupo '+group.name+' de '+group.accounts.length+' cuentas');
button.innerHTML='<div class="ft77-group-title"><strong>'+E(group.name)+'</strong><span class="ft77-group-badge">'+group.accounts.length+' cuentas</span></div><span>'+E(homogeneous?reference.firm+' · '+cash(reference.capital)+' por cuenta':'Grupo de cuentas · tamaños o programas diferentes')+'</span><small>'+E([...states].map(([label,count])=>count+' en '+label).join(' · '))+'</small><div class="ft77-reference"><span>Referencia · '+E(reference.nickname||reference.program)+'</span><strong>'+cash(ref.balance)+'</strong><small>'+E(reference.program)+' · '+E(stage(reference))+'</small></div><span class="ft77-total">Balance conjunto <strong>'+cash(balance)+'</strong></span><span class="ft77-total">P&L de etapas actuales <strong class="'+(pnl<0?'red':pnl>0?'green':'')+'">'+signed(pnl)+'</strong></span><span class="ft77-group-link">Ver grupo y cuentas individuales <span aria-hidden="true">›</span></span>';
button.onclick=()=>{const current=M.groups().find(g=>g.id===group.id);if(!current?.accounts.length)return;M.openIndividual(current.accounts[0].id,'ftPageAccounts');M.select(current.id);window.ftGo('ftPageAccounts');};grid.append(button);
}
let note=host.querySelector('.ft77-overview-note');if(groups.length){if(!note){note=document.createElement('p');note.className='ft77-overview-note';host.append(note);}note.textContent='Cada grupo aparece una sola vez. Su primera cuenta es la referencia; abrilo para consultar todas las cuentas y sus reglas.';}else note?.remove();
}
const render=window.render;window.render=function(){const result=render.apply(this,arguments);paint();return result;};
window.FTAccountOverview={paint};paint();
})();
