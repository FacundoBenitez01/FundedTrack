(function(){
'use strict';
const $=id=>document.getElementById(id),profile=$('ft59Profile'),row=$('ft67SyncRow'),head=$('ftPageHome')?.querySelector('.ft-page-head');
if(!profile||!row||!head)return;
const role=document.createElement('span');role.className='ft93-role';role.textContent='Trader';profile.querySelector('.ft59-profile-copy').append(role);
const label=document.createElement('span');label.className='ft93-sync-text';$('ft67SyncBadge').append(label);
const marker=document.createComment('desktop synchronization position');row.before(marker);
const mobile=matchMedia('(max-width:700px)');
function place(){if(mobile.matches)head.append(row);else marker.after(row);}
function status(){const mode=$('ft67SyncBadge').dataset.mode;label.textContent=({synced:'Sincronizado',loading:'Cargando…',checking:'Comprobando…',saving:'Guardando…',pending:'Pendiente',offline:'Sin conexión',conflict:'Revisar cambios','storage-error':'Error al guardar'})[mode]||'Comprobando…';}
mobile.addEventListener('change',place);window.addEventListener('ft67SyncStatus',status);
new MutationObserver(status).observe($('ft67SyncBadge'),{attributes:true,attributeFilter:['data-mode']});
place();status();
})();
