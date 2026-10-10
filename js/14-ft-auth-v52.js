(function(){
 'use strict';
 const URL='https://ztkthcqjxptsxgtwfcfx.supabase.co';
 const PUBLIC_KEY='sb_publishable_fqjPJfR-EiAlDwk83M4oPg_A8wnDaSR';
 const SITE=['jourfund.com','www.jourfund.com'].includes(location.hostname)&&location.protocol==='https:'?location.origin+'/':'https://facundobenitez01.github.io/FundedTrack/';
 const el=id=>document.getElementById(id), clone=v=>JSON.parse(JSON.stringify(v));
 let oauthBusy=false,accessTransition=false;
 try{const pending=JSON.parse(sessionStorage.getItem('ft87_access_pending')||'null');if(pending&&Date.now()-pending.at<600000){accessTransition=true;window.ft87InteractiveAccess=true;}sessionStorage.removeItem('ft87_access_pending');}catch{}
 const oauthParams=new URLSearchParams(location.hash.slice(1));
 const oauthQuery=new URLSearchParams(location.search);
 const oauthReturnError=oauthParams.get('error')||oauthQuery.get('error');
 if(oauthReturnError)history.replaceState(null,'',location.pathname);
 let client,user=null,epoch=0,ready=false,mode='login',revision=0,dirty=false,version=null,busy=false,timer=null,conflict=false,recovery=location.hash.includes('type=recovery');
 const template=clone(defaults);
 const fresh=()=>clone(template).map(a=>({...a,phases:[{trades:[]},{trades:[]}],phase:1,status:'Challenge',pa:{goalPct:10,withdrawals:[],trades:[]}}));
 const key=uid=>'fundedtrack_v52_user_'+uid;
 function accessStage(stage){const g=el('ftCloudGate');g.dataset.state=stage;el('ftLoadRetry').hidden=stage!=='error'||!user;el('ftGateSignOut').hidden=!user||(stage!=='error'&&!recovery);if(el('ft80GateResetLocal'))el('ft80GateResetLocal').hidden=true;const title=g.querySelector('.ft86-load-title'),sub=g.querySelector('.ft86-load-sub');if(title)title.textContent=stage==='error'?'No pudimos cargar tus datos':'Preparando tu espacio';if(sub)sub.textContent=stage==='error'?'Revisá tu conexión e intentá de nuevo.':'Sincronizando tus cuentas';}
 const msg=(s,bad=false)=>{el('ftAuthMsg').textContent=s;el('ftAuthMsg').className='ft-cloud-msg '+(bad?'err':'ok');if(bad){if(user&&!recovery)accessStage('error');else if(el('ftCloudGate').dataset.state==='checking')accessStage('login');}};
 let syncConfirmedAt=null,syncCheckedAt=null,syncVersion=null,syncUser=null,localStorageFailed=false;
 function status(s,bad=false){
  if(localStorageFailed){s='No se pudo guardar en este dispositivo. Exportá tus datos y revisá Ajustes.';bad=true;}
  const uid=user?.id||null,prior=window.ft67SyncState;
  if(uid!==syncUser){syncUser=uid;syncConfirmedAt=null;syncCheckedAt=null;syncVersion=null;}
  if(s==='Sincronizado'){syncCheckedAt=Date.now();syncConfirmedAt=syncCheckedAt;syncVersion=version;}
  const mode=!uid||!ready?'loading':conflict?'conflict':s.startsWith('No se pudo guardar en este dispositivo')?'storage-error':navigator.onLine===false?'offline':bad?'pending':dirty?'saving':s==='Sincronizado'?'synced':'checking';
  window.ft67SyncState={userId:uid,mode,dirty,revision,confirmedAt:syncConfirmedAt,checkedAt:syncCheckedAt,message:s};
  el('ftCloudBanner').textContent=s;el('ftCloudBanner').hidden=!user;el('ftCloudBanner').style.color=bad?'#ef737c':'#b9c1d0';if(el('ftCloudSyncMsg'))el('ftCloudSyncMsg').textContent=s;
  window.dispatchEvent(new CustomEvent('ft66SyncStatus',{detail:{conflict,dirty,userId:uid}}));window.dispatchEvent(new CustomEvent('ft67SyncStatus',{detail:window.ft67SyncState}));
 }

 function gate(){el('ftCloudGate').classList.remove('ft87-success');document.body.classList.remove('ft-ready');el('ftCloudGate').classList.add('show');ready=false;document.querySelectorAll('.modal.show').forEach(e=>e.classList.remove('show'));el('achievement')?.classList.add('hide');}
 function reveal(){accessStage('ready');ready=true;document.body.classList.add('ft-ready');el('ftCloudGate').classList.remove('show');el('app').style.display='block';el('app').classList.remove('hide');}
 // Profile photos are shared across accounts. Keep one copy on the wire, expand in memory.
 // Ambiguous legacy profiles (different photos in one workspace) are preserved unchanged.
 function workspaceAvatar(list){
  const values=list.map(a=>a?.preferences?.avatar).filter(v=>v!==undefined&&v!==null&&v!=='');
  return values.length&&values.every(v=>typeof v==='string'&&v===values[0])?values[0]:null;
 }
 function packWorkspace(list){
  const result=clone(list),avatar=workspaceAvatar(result);
  if(!avatar)return result;
  let kept=false;
  for(const a of result){if(a?.preferences?.avatar===avatar){if(kept)delete a.preferences.avatar;else kept=true;}}
  return result;
 }
 function unpackWorkspace(list){
  const result=clone(list),avatar=workspaceAvatar(result);
  if(avatar)for(const a of result){if(a&&typeof a==='object'&&!Array.isArray(a)){a.preferences={...(a.preferences||{}),avatar};}}
  return result;
 }
 function applyData(list,selected){
  if(!Array.isArray(list))throw Error('Formato de datos inválido.');
  accounts=list.length?unpackWorkspace(list):fresh();
  activeId=accounts.some(a=>a.id===selected)?selected:accounts[0].id;
  window.render();
 }
 function persist(){
  if(!user)return;
  try{localStorage.setItem(key(user.id),JSON.stringify({accounts:clone(accounts),activeId,dirty,version}));localStorageFailed=false;}catch(e){localStorageFailed=true;throw e;}
 }
 function download(name,data){const url=window.URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>window.URL.revokeObjectURL(url),1000);}
 function errorText(e){const s=e?.message||String(e);if(/Email address not authorized|email.*sending|sending.*email/i.test(s))return 'El proyecto necesita configurar el envío de correos (SMTP). '+s;return s;}
 function authUI(){
  el('ft68GoogleAccess').hidden=!!user||recovery;
  el('ft57GateTitle').textContent=recovery?'Restablecer contraseña':mode==='signup'?'Creá tu cuenta':'Bienvenido de nuevo';
  el('ftAuthEmail').parentElement.hidden=!!user&&!recovery;
  el('ftLoginTab').parentElement.hidden=!!user||recovery;
  el('ftForgot').hidden=!!user||recovery;
  el('ftLoadRetry').hidden=!user||recovery||el('ftCloudGate').dataset.state!=='error';
  if(el('ft80GateResetLocal'))el('ft80GateResetLocal').hidden=true;
  el('ftGateSignOut').hidden=!user||(!recovery&&el('ftCloudGate').dataset.state!=='error');
  if(el('ftCloudUser'))el('ftCloudUser').textContent=user?.email||'Sin sesión';
  el('ftAuthEmail').required=!recovery;
  el('ftAuthEmail').hidden=recovery;
  document.querySelector('label[for="ftAuthEmail"]').hidden=recovery;
  el('ftAuthPassword').autocomplete=recovery||mode==='signup'?'new-password':'current-password';
  el('ftAuthPassword').minLength=mode==='login'&&!recovery?1:8;
  el('ftAuthSubmit').textContent=recovery?'Guardar nueva contraseña':mode==='signup'?'Crear cuenta':'Entrar';
  el('ftGateIntro').textContent=recovery?'Elegí una nueva contraseña de al menos 8 caracteres.':'Iniciá sesión para acceder a tus cuentas y operaciones.';
 }
 async function loadWorkspace(){
  if(!user)return;
  const uid=user.id,token=epoch;
  gate();accessStage('loading');msg('Cargando tus datos…');
  try{
   const verifiedUser=await window.JFSecurity.authorize(client,uid);if(!verifiedUser||token!==epoch||user?.id!==uid)return;user=verifiedUser;
   const access=await client.rpc('jourfund_security_status');if(access.error)throw Error('La sesión no tiene acceso. Cerrá sesión y volvé a ingresar.');
   const {data,error}=await client.from('fundedtrack_workspaces').select('accounts,updated_at').eq('user_id',uid).maybeSingle();
   if(error)throw error;if(token!==epoch||user?.id!==uid)return;
   let pending=null;try{pending=JSON.parse(localStorage.getItem(key(uid))||'null')}catch(e){}
   version=data?.updated_at||null;revision=0;conflict=false;
   if(pending?.dirty){
    const remoteVersion=version;version=pending.version||null;
    applyData(pending.accounts,pending.activeId);dirty=true;
    if(pending.version!==remoteVersion){conflict=true;status('Hay cambios en otro dispositivo. Exportá los pendientes antes de cargar la nube.',true);}
   }else{applyData(data?.accounts||fresh(),pending?.activeId);dirty=!data;}
   persist();window.ftCloudSession={user};authUI();if(accessTransition){await new Promise(resolve=>{const run=()=>Promise.resolve(window.ft87AccessSuccess?.()).then(resolve);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();});if(token!==epoch||user?.id!==uid)return;accessTransition=false;}reveal();
   if(!conflict){status(dirty?'Guardando…':'Sincronizado');if(dirty)schedule();}
  }catch(e){if(token!==epoch)return;msg('No se pudieron cargar tus datos: '+errorText(e),true);authUI();}
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(flush,500);}
 async function flush(){
  if(busy||!user||!ready||conflict||(!dirty&&document.hidden))return;
  const uid=user.id,token=epoch,rev=revision;
  busy=true;
  try{
   if(dirty){
    status('Guardando…');
    const payload={accounts:packWorkspace(accounts),updated_at:new Date(Math.max(Date.now(),(Date.parse(version||'')||0)+1)).toISOString()};
    let response;
    if(version){response=await client.from('fundedtrack_workspaces').update(payload).eq('user_id',uid).eq('updated_at',version).select('updated_at').maybeSingle();}
    else{response=await client.from('fundedtrack_workspaces').insert({...payload,user_id:uid}).select('updated_at').single();}
    if(token!==epoch)return;
    if(response.error){if(response.error.code==='23505'){conflict=true;throw Error('Se creó una versión en otro dispositivo. Exportá tus cambios pendientes y cargá la nube.');}throw response.error;}
    if(!response.data){conflict=true;throw Error('Hay cambios en otro dispositivo. Exportá tus cambios pendientes y cargá la nube.');}
    version=response.data.updated_at;if(revision===rev)dirty=false;persist();status(dirty?'Guardando…':'Sincronizado');
   }else{
    // Check only the version: unchanged workspaces must not resend trade history or screenshots.
    const {data:head,error:headError}=await client.from('fundedtrack_workspaces').select('updated_at').eq('user_id',uid).maybeSingle();
    if(headError)throw headError;if(token!==epoch||dirty||revision!==rev)return;
    if(!head&&version){const access=await client.rpc('jourfund_security_status');if(access.error){gate();accessStage('error');msg('Tu sesión venció o necesita verificación. Volvé a ingresar.',true);throw Error('Revalidá tu sesión para sincronizar.');}}
    if(head&&head.updated_at!==version){
     const {data,error}=await client.from('fundedtrack_workspaces').select('accounts,updated_at').eq('user_id',uid).maybeSingle();
     if(error)throw error;if(token!==epoch||dirty||revision!==rev)return;
     if(!data)throw Error('La versión de nube cambió durante la consulta. Volvé a sincronizar.');
     applyData(data.accounts,activeId);version=data.updated_at;persist();
    }
    status('Sincronizado');
   }
  }catch(e){if(token===epoch)status('Sincronización pendiente: '+errorText(e),true);}
  finally{busy=false;if(token===epoch&&dirty&&!conflict&&revision!==rev)schedule();}
 }
 window.save=function(){
  if(!user||!ready)throw Error('Iniciá sesión y esperá a que se carguen tus datos.');
  revision++;dirty=true;
  try{persist();status('Guardando…');schedule();}catch(e){status('No se pudo guardar en este dispositivo. Exportá tus datos y no cierres esta página.',true);}
 };
 async function signOut(scope='local'){
  if(!['local','global'].includes(scope))scope='local';
  if(dirty&&!window.confirm('Tenés cambios pendientes. Quedarán guardados solo en este navegador para tu usuario. ¿Cerrar sesión?'))return;
  try{await window.ftPushBeforeSignOut?.();const {error}=await client.auth.signOut({scope});if(error)throw error;acceptSession(null);}catch(e){status('No se pudo cerrar sesión: '+errorText(e),true);}
 }
 function acceptSession(session){
  const next=session?.user||null;window.ftCloudSession=session;
  if(next?.id===user?.id){user=next;authUI();if(!next){accessStage('login');msg('Ingresá con tu correo y contraseña.');}return;}
  epoch++;clearTimeout(timer);localStorageFailed=false;user=next;syncConfirmedAt=null;syncCheckedAt=null;syncVersion=null;syncUser=next?.id||null;window.ft67SyncState={userId:next?.id||null,mode:'loading',dirty:false,revision:0,confirmedAt:null,checkedAt:null,message:'Cargando datos…'};window.dispatchEvent(new CustomEvent('ft67SyncStatus',{detail:window.ft67SyncState}));dirty=false;version=null;conflict=false;revision=0;
  gate();applyData(fresh());authUI();el('ftAuthPassword').value='';el('ftAuthPassword').type='password';el('ft57ShowPassword').setAttribute('aria-pressed','false');el('ft57ShowPassword').setAttribute('aria-label','Mostrar contraseña');
  if(!user){accessStage('login');el('ftCloudBanner').hidden=true;msg('Ingresá con tu correo y contraseña.');}
  else if(recovery){accessStage('recovery');msg('Ingresá tu nueva contraseña.');el('ftAuthForm').hidden=false;}
  else loadWorkspace();
 }
 window.ftCloudSignOut=signOut;
 window.ftCloudLogin=()=>{if(user){window.ftGo?.('ftPageMyAccount');}else{gate();authUI();}};
 window.ftCloudSetup=window.ftCloudLogin;
 window.ftCloudSync=flush;
 el('ftLoginTab').onclick=()=>{mode='login';el('ftLoginTab').classList.add('active');el('ftSignupTab').classList.remove('active');authUI();msg('Ingresá con tu correo y contraseña.');};
 el('ftSignupTab').onclick=()=>{mode='signup';el('ftSignupTab').classList.add('active');el('ftLoginTab').classList.remove('active');authUI();msg('Creá tu cuenta personal con una contraseña de al menos 8 caracteres.');};
 el('ft68Google').onclick=async()=>{
  if(oauthBusy||user||recovery)return;
  if(!client){msg('No se pudo cargar el servicio de acceso. Revisá tu conexión y recargá la página.',true);return;}
  if(navigator.onLine===false){msg('Conectate a Internet para continuar con Google.',true);return;}
  oauthBusy=true;try{sessionStorage.setItem('ft87_access_pending',JSON.stringify({at:Date.now()}));}catch{}el('ft68Google').disabled=true;el('ftAuthSubmit').disabled=true;msg('Abriendo Google…');
  try{
   const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:SITE,scopes:'openid email profile',queryParams:{prompt:'select_account'}}});
   if(error)throw error;
  }catch(e){try{sessionStorage.removeItem('ft87_access_pending');}catch{}const detail=e?.message||'';msg(/provider.*(disabled|enabled)|unsupported provider/i.test(detail)?'El acceso con Google todavía no está activado en Supabase. Podés entrar con correo y contraseña.':'No se pudo abrir Google. Revisá tu conexión o intentá entrar con correo y contraseña.',true);}
  finally{oauthBusy=false;el('ft68Google').disabled=false;el('ftAuthSubmit').disabled=false;}
 };
 el('ftAuthForm').onsubmit=async e=>{
  e.preventDefault();if(!client){msg('No se pudo cargar el servicio de acceso. Revisá tu conexión y recargá la página.',true);return;}
  const email=el('ftAuthEmail').value.trim(),password=el('ftAuthPassword').value;
  accessTransition=true;el('ftAuthSubmit').disabled=true;msg('Conectando…');
  try{
   if(recovery){if(!user)throw Error('Abrí el enlace de recuperación recibido por correo.');if(!await window.JFSecurity.authorize(client,user.id))return;const {error}=await client.auth.updateUser({password});if(error)throw error;recovery=false;history.replaceState(null,'',location.pathname);authUI();await loadWorkspace();}
   else{
    const r=mode==='signup'?await client.auth.signUp({email,password,options:{emailRedirectTo:SITE}}):await client.auth.signInWithPassword({email,password});
    if(r.error)throw r.error;
    el('ftAuthPassword').value='';
    if(!r.data.session){accessTransition=false;msg('Si el registro es válido, recibirás un correo para confirmar tu cuenta. Revisá también spam.');}
    else acceptSession(r.data.session);
   }
  }catch(e){accessTransition=false;msg(errorText(e),true);}finally{el('ftAuthSubmit').disabled=false;}
 };
 el('ftForgot').onclick=async()=>{
  if(!client)return;const email=el('ftAuthEmail').value.trim();
  if(!el('ftAuthEmail').checkValidity()||!email){msg('Escribí primero un correo válido.',true);el('ftAuthEmail').focus();return;}
  el('ftForgot').disabled=true;
  try{const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:SITE});if(error)throw error;msg('Si existe una cuenta para ese correo, recibirás un enlace para cambiar la contraseña.');}catch(e){msg(errorText(e),true);}finally{el('ftForgot').disabled=false;}
 };
 el('ftLoadRetry').onclick=loadWorkspace;el('ftGateSignOut').onclick=signOut;
 const legacy=localStorage.getItem('fundedtrack_v5');
 if(legacy){el('ftLegacyBackup').hidden=false;el('ftLegacyBackup').onclick=()=>{try{download('JourFund-respaldo-anterior.json',JSON.parse(legacy));}catch(e){msg('El respaldo anterior no tiene un formato válido.',true);}};}
 const panel=document.createElement('div');panel.id='ftCloudPanel';panel.className='ft-quick-card ft-cloud-panel';
 panel.innerHTML='<div class="label">Mi cuenta · JourFund v98</div><p id="ftCloudUser"></p><p id="ftCloudSyncMsg" role="status"></p><div class="ft-action-row"><button class="btn" id="ftSync">Sincronizar ahora</button><button class="btn" id="ftExportMine">Exportar respaldo</button><button class="btn" id="ftReload">Cargar versión de la nube</button><button class="btn" id="ftSignOut">Cerrar sesión</button></div><p class="sub">Los cambios pendientes se conservan para tu usuario en este navegador. Si hay un conflicto, exportá un respaldo antes de cargar la versión de la nube.</p>';
 el('ftPageSettings')?.appendChild(panel);
 
 const P=window.FTProtection;
 function backup(list,label){if(!user)throw Error('Iniciá sesión primero.');const k='ft66_backups_'+user.id;let old=[];try{old=JSON.parse(localStorage.getItem(k)||'[]');if(!Array.isArray(old))old=[];}catch{}const item={app:'JourFund',version:66,createdAt:new Date().toISOString(),label,accounts:clone(list)};localStorage.setItem(k,JSON.stringify([item,...old].slice(0,3)));return item;}
 function snapshot(){if(!user||!ready)throw Error('Esperá a que se carguen tus datos.');return {userId:user.id,revision,version,activeId,conflict,dirty,busy,accounts:clone(accounts)};}
 function assertOwner(state){if(!user||!ready||user.id!==state.userId||revision!==state.revision||version!==state.version)throw Error('Los datos cambiaron. Cerrá esta ventana y volvé a abrirla.');if(busy)throw Error('Esperá a que termine la sincronización.');}
 function storeCandidate(list,selected,nextVersion,nextDirty){list=unpackWorkspace(list);const id=list.some(a=>a.id===selected)?selected:list[0].id;localStorage.setItem(key(user.id),JSON.stringify({accounts:clone(list),activeId:id,dirty:nextDirty,version:nextVersion}));accounts=clone(list);activeId=id;version=nextVersion;dirty=nextDirty;revision++;window.render();}
 function selectAccount(id){
  if(!user||!ready||!accounts.some(a=>a.id===id))return false;
  const previous=activeId;activeId=id;
  try{persist();return true;}catch(e){activeId=previous;window.ft67Toast?.('No se pudo guardar la selección','No se pudo guardar en este dispositivo. Volvé a intentarlo.');return false;}
 }
 window.ftProtectionCloud={snapshot,backup,selectAccount,backupList(){if(!user)return [];try{return JSON.parse(localStorage.getItem('ft66_backups_'+user.id)||'[]');}catch{return [];}},
  commit(list,state){assertOwner(state);if(conflict)throw Error('Resolvé primero el conflicto de sincronización.');const valid=P.validate(list);storeCandidate(valid,state.activeId,version,true);status('Guardando…');schedule();},
  import(list,state){assertOwner(state);if(conflict)throw Error('Resolvé primero el conflicto de sincronización.');const valid=P.validate(list);backup(accounts,'Antes de importar');storeCandidate(valid,state.activeId,version,true);status('Guardando…');schedule();},
  async remote(){const state=snapshot();if(busy)throw Error('Esperá a que termine la sincronización.');const {data,error}=await client.from('fundedtrack_workspaces').select('accounts,updated_at').eq('user_id',state.userId).maybeSingle();if(error)throw error;assertOwner(state);if(!data||!Array.isArray(data.accounts)||!data.accounts.length)throw Error('No hay una versión de nube disponible.');return {state,accounts:unpackWorkspace(data.accounts),version:data.updated_at};},
  async resolve(choice,view){assertOwner(view.state);const validLocal=P.validate(accounts);const validRemote=P.validate(view.accounts);backup(validLocal,'Dispositivo antes de resolver');backup(validRemote,'Nube antes de resolver');const uid=user.id,token=epoch,rev=revision;busy=true;clearTimeout(timer);
   try{const {data:current,error:readError}=await client.from('fundedtrack_workspaces').select('accounts,updated_at').eq('user_id',uid).maybeSingle();if(readError)throw readError;if(token!==epoch)throw Error('La sesión cambió.');if(revision!==rev||current?.updated_at!==view.version)throw Error('La versión cambió. Cerrá y volvé a comparar las versiones.');
    if(choice==='cloud'){storeCandidate(validRemote,activeId,view.version,false);conflict=false;status('Sincronizado');}
    else if(choice==='local'){const payload={accounts:packWorkspace(validLocal),updated_at:new Date(Math.max(Date.now(),(Date.parse(view.version)||0)+1)).toISOString()};const {data,error}=await client.from('fundedtrack_workspaces').update(payload).eq('user_id',uid).eq('updated_at',view.version).select('updated_at').maybeSingle();if(token!==epoch)throw Error('La sesión cambió.');if(error)throw error;if(!data)throw Error('Otro dispositivo guardó nuevos cambios. Volvé a comparar.');version=data.updated_at;conflict=false;dirty=revision!==rev;persist();status(dirty?'Guardando…':'Sincronizado');}
    else throw Error('Opción inválida.');
   }finally{busy=false;if(token===epoch&&dirty&&!conflict)schedule();}
  }
 };


 // Explicit per-user recovery. Never remove authentication or another user's data.
 const recoveryButton=document.createElement('button');recoveryButton.id='ft80ResetLocal';recoveryButton.className='btn';recoveryButton.type='button';recoveryButton.textContent='Reiniciar copia local y cargar nube';
 const gateRecovery=recoveryButton.cloneNode(true);gateRecovery.id='ft80GateResetLocal';gateRecovery.hidden=true;el('ftLoadRetry').parentElement.append(gateRecovery);
 panel.querySelector('.ft-action-row').append(recoveryButton);
 async function resetLocal(){
  if(!user||busy)return;
  const uid=user.id;
  if(!window.confirm('Se eliminarán de ESTE dispositivo los cambios pendientes y las copias de protección de tu usuario. Se cargarán tus cuentas de la nube. La nube no se modifica con esta acción. Si tenés cambios que querés conservar, cancelá y descargá un respaldo. ¿Continuar?'))return;
  if(user?.id!==uid||busy)return;
  recoveryButton.disabled=gateRecovery.disabled=true;
  try{
   epoch++;clearTimeout(timer);
   localStorage.removeItem(key(uid));localStorage.removeItem('ft66_backups_'+uid);
   dirty=false;conflict=false;version=null;revision++;localStorageFailed=false;
   await loadWorkspace();
  }catch(e){msg('No se pudo reiniciar la copia local: '+errorText(e),true);}
  finally{recoveryButton.disabled=gateRecovery.disabled=false;}
 }
 recoveryButton.onclick=gateRecovery.onclick=resetLocal;
 window.ft80ResetLocal=resetLocal;
 el('ftSync').onclick=()=>conflict?window.ft66OpenConflict?.():flush();el('ftSignOut').onclick=signOut;
 el('ftExportMine').onclick=()=>download('JourFund-mis-datos.json',{app:'JourFund',version:66,createdAt:new Date().toISOString(),accounts:clone(accounts)});
 el('ftReload').onclick=()=>window.ft66OpenConflict?.();
 if(legacy){const b=document.createElement('button');b.className='btn';b.textContent='Descargar respaldo anterior';b.onclick=el('ftLegacyBackup').onclick;panel.appendChild(b);}
 if(el('ftCloudSettings'))el('ftCloudSettings').onclick=()=>window.ftGo?.('ftPageSettings');
 // UI mutations require a loaded workspace even when another script triggers save.
 authUI();gate();
 if(!window.supabase){msg('No se pudo cargar el servicio de acceso. Revisá Internet y recargá la página.',true);return;}
 client=window.supabase.createClient(URL,PUBLIC_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.ftCloud=client;
 client.auth.onAuthStateChange((event,session)=>{if(event==='PASSWORD_RECOVERY')recovery=true;setTimeout(()=>{acceptSession(session);if(event==='PASSWORD_RECOVERY'){accessStage('recovery');gate();authUI();el('ftAuthForm').hidden=false;}},0);});
 client.auth.getSession().then(({data,error})=>{if(error)msg(errorText(error),true);else{acceptSession(data.session);if(!data.session&&oauthReturnError)msg('No se completó el acceso con Google. Podés volver a intentarlo o entrar con correo y contraseña.',true);}}).catch(e=>msg(errorText(e),true));
 window.addEventListener('offline',()=>status('Sin conexión. Los cambios guardados en este dispositivo siguen pendientes.',true));
 window.addEventListener('online',()=>{status('Comprobando conexión…');flush();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)flush();});
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
 setInterval(()=>{if(!document.hidden)flush();},20000);
})();
