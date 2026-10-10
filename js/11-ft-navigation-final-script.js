(function(){
  const pages=['ftPageHome','ftPageOps','ftPageAccounts','ftPageWithdrawals','ftPageObjectives','ftPageTools','ftPageSettings','ftPageMyAccount'];
  const labels=[
    ['ftPageHome','⌂','Inicio'],
    ['ftPageOps','▤','Operaciones'],
    ['ftPageAccounts','▣','Cuentas'],
    ['ftPageWithdrawals','↗','Retiros'],
    ['ftPageObjectives','◎','Objetivos'],
    ['ftPageTools','▦','Herramientas'],
    ['ftPageSettings','⚙','Configuración']
  ];
  const side=document.querySelector('.sidebar');
  const mobile=document.querySelector('.mobile-nav');
  function makeNav(cls){
    const nav=document.createElement('nav');
    nav.className=cls;
    if(cls==='sidebar'){
      nav.innerHTML='<div class="side-brand"><div class="side-brand-mark"><img src="./brand-icon.svg?v=92" alt="" width="38" height="38"></div><div class="side-brand-name">Jour<span>Fund</span></div></div><div class="side-nav"></div><div class="side-bottom"></div>';
      labels.forEach(x=>{const b=document.createElement('button');b.type='button';b.className='side-btn';b.dataset.page=x[0];b.innerHTML='<span class="side-icon">'+x[1]+'</span>'+x[2];nav.querySelector('.side-nav').appendChild(b)});
      return nav;
    }
    nav.innerHTML='';
    labels.forEach(x=>{const b=document.createElement('button');b.type='button';b.dataset.page=x[0];b.setAttribute('aria-label',x[2]);b.title=x[2];b.innerHTML='<span aria-hidden="true">'+x[1]+'</span>'+(x[0]==='ftPageSettings'?'Ajustes':x[2]);nav.appendChild(b)});
    return nav;
  }
  if(side)side.replaceWith(makeNav('sidebar'));
  if(mobile)mobile.replaceWith(makeNav('mobile-nav'));

  const wrap=document.querySelector('.wrap');
  const top=wrap&&wrap.querySelector('.top');
  const pagesBox=document.getElementById('ftPages');
  if(!pagesBox||!wrap)return;

  /* Solo la cabecera es global. Todo el contenido vive dentro de una vista. */
  [...wrap.children].forEach(el=>{
    if(el!==top&&el!==pagesBox)el.style.display='none';
  });
  pages.forEach(id=>{const p=document.getElementById(id);if(p)p.style.display='none'});

  function syncNav(id){
    document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('ft-nav-current',b.dataset.page===id));
  }
  function show(id,push=true){
    if(!pages.includes(id))id='ftPageHome';
    pages.forEach(pid=>{const p=document.getElementById(pid);if(p)p.classList.toggle('active',pid===id)});
    syncNav(id);
    if(push&&location.hash!=='#'+id.replace('ftPage','').toLowerCase())history.pushState({page:id},'', '#'+id.replace('ftPage','').toLowerCase());
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.ftGo=show;
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-page]');
    if(!b)return;
    e.preventDefault();
    e.stopPropagation();
    show(b.dataset.page);
  },true);
  window.addEventListener('popstate',()=>showFromHash(false));
  function showFromHash(push){
    const h=location.hash.replace('#','').toLowerCase();
    const id=pages.find(x=>x.replace('ftPage','').toLowerCase()===h)||'ftPageHome';
    show(id,push);
  }
  document.getElementById('addTop')?.addEventListener('click',()=>show('ftPageOps'));
  document.getElementById('ftRecentAdd')?.addEventListener('click',()=>show('ftPageOps'));
  document.getElementById('ftNewAccountPage')?.addEventListener('click',()=>show('ftPageAccounts'));
  document.getElementById('ftCloudSettings')?.addEventListener('click',()=>show('ftPageSettings'));
  document.getElementById('ftOpenPAInline')?.addEventListener('click',()=>show('ftPageWithdrawals'));

  /* El botón + Operación abre el formulario dentro de Operaciones, no otra página. */
  const addTop=document.getElementById('addTop');
  if(addTop){
    addTop.onclick=function(){show('ftPageOps');setTimeout(()=>window.openModal&&window.openModal(),80)};
  }
  /* Acciones internas: vuelven a su página correcta. */
  document.getElementById('ftNewAccountPage')?.addEventListener('click',function(){show('ftPageAccounts');setTimeout(()=>document.getElementById('newAccount')?.click(),80)});
  document.getElementById('ftResetPage')?.addEventListener('click',function(){show('ftPageAccounts')});
  showFromHash(false);
})();
