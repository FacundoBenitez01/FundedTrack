(function(){
'use strict';
const $=id=>document.getElementById(id),form=$('ft59ProfileForm'),cloud=$('ftCloudPanel');
if(!form||!cloud)return;
const page=document.createElement('section');page.id='ftPageMyAccount';page.className='ft-page';
page.innerHTML='<header class="ft-page-head"><div><button type="button" class="ft94-back" aria-label="Volver a Inicio">‹</button><h2>Mi cuenta</h2><p>Tu perfil y tus datos, en un solo lugar.</p></div></header><div class="ft94-grid"><section class="ft-quick-card ft94-profile"><div class="ft94-identity"><h3 id="ft94Name"></h3><span id="ft94Email"></span></div></section><section class="ft-quick-card ft94-data"><h3>Datos y respaldos</h3><div class="ft94-backup-actions"></div></section></div>';
$('ftPages').append(page);page.querySelector('.ft94-back').onclick=()=>window.ftGo('ftPageHome');
const grid=page.querySelector('.ft94-grid'),hero=page.querySelector('.ft94-profile'),identity=page.querySelector('.ft94-identity');
hero.prepend(form.querySelector('.ft61-profile-avatar'));
if($('ft81OwnerIdentity'))identity.append($('ft81OwnerIdentity'));
form.querySelector('h3').textContent='Nombre para mostrar';form.classList.add('ft94-name-form');grid.insertBefore(form,page.querySelector('.ft94-data'));
cloud.querySelector('.label').textContent='Cuenta y sincronización · JourFund v98';grid.insertBefore(cloud,page.querySelector('.ft94-data'));
const actions=cloud.querySelector('.ft-action-row'),data=page.querySelector('.ft94-data'),backupActions=data.querySelector('.ft94-backup-actions');
backupActions.append($('ftExportMine'));
const importer=[...actions.querySelectorAll('button')].find(b=>b.textContent==='Importar respaldo');if(importer)backupActions.append(importer);
const copies=cloud.querySelector('.ft66-backups');if(copies)data.append(copies);
const recovery=document.createElement('details');recovery.className='ft94-recovery';recovery.innerHTML='<summary>Opciones de recuperación</summary><p class="sub">Exportá un respaldo antes de descartar cambios de este dispositivo.</p>';if($('ft80ResetLocal'))recovery.append($('ft80ResetLocal'));data.append(recovery);
const logout=$('ftSignOut');logout.classList.add('ft94-signout');grid.append(logout);
$('ft59Profile').onclick=()=>window.ftGo('ftPageMyAccount');$('ft59Profile').setAttribute('aria-label','Abrir Mi cuenta');
$('ft67SyncBadge').onclick=()=>{window.ftGo('ftPageMyAccount');cloud.scrollIntoView({behavior:'smooth',block:'center'});};$('ft67SyncBadge').setAttribute('aria-label','Ver sincronización en Mi cuenta');
function identityUpdate(){ $('ft94Name').textContent=$('ft59ProfileName').textContent;$('ft94Email').textContent=window.ftCloudSession?.user?.email||'';}
new MutationObserver(identityUpdate).observe($('ft59ProfileName'),{childList:true,subtree:true,characterData:true});window.addEventListener('ft67SyncStatus',identityUpdate);identityUpdate();
const side=document.querySelector('.sidebar');if(side){const button=document.createElement('button');button.type='button';button.dataset.page=page.id;button.innerHTML='<span aria-hidden="true">'+userIcon()+'</span>Mi cuenta';button.onclick=()=>window.ftGo(page.id);side.append(button);}
function userIcon(){return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>';}
const item=document.querySelector('[data-ft82-page="ftPageMyAccount"] .ft82-menu-icon');if(item)item.innerHTML=userIcon();
if(location.hash.toLowerCase()==='#myaccount')window.ftGo(page.id,false);
})();
