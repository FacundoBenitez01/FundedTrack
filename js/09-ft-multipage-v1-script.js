(function(){
  const wrap=document.querySelector('.wrap');
  if(!wrap||document.getElementById('ftPages')) return;
  const top=wrap.querySelector('.top');
  const strip=$('accountStrip');
  const grid=wrap.querySelector('.grid');
  const sections=[...wrap.querySelectorAll(':scope > .section')];
  const objective=sections.find(s=>s.querySelector('#targetLabel'));
  const calendar=sections.find(s=>s.querySelector('#daysGrid'));
  const stats=sections.find(s=>s.querySelector('#wins'));
  const risk=sections.find(s=>s.querySelector('#riskStatus'));
  const chart=sections.find(s=>s.querySelector('#chart'));
  const recent=$('recentSection');

  const pages=document.createElement('div');
  pages.id='ftPages'; pages.className='ft-pages';
  wrap.appendChild(pages);
  const mk=(id,title,sub,tag)=>{
    const p=document.createElement('section'); p.id=id; p.className='ft-page';
    p.innerHTML='<div class="ft-page-head"><div><div class="ft-page-tag">'+tag+'</div><h2>'+title+'</h2><p>'+sub+'</p></div></div><div class="ft-page-body"></div>';
    pages.appendChild(p); return p.querySelector('.ft-page-body');
  };
  const home=mk('ftPageHome','Inicio','Tu centro de control diario, mercados, noticias y progreso.','JourFund');
  const ops=mk('ftPageOps','Operaciones','Registra, revisa y analiza cada operación de tus cuentas.','Diario de trading');
  const accounts=mk('ftPageAccounts','Cuentas','Gestiona tus cuentas de fondeo, programas, fases y reglas.','Cuentas');
  const withdrawals=mk('ftPageWithdrawals','Retiros','Controla tu etapa PA, objetivos mensuales y retiros.','Payout center');
  const objectives=mk('ftPageObjectives','Objetivos','Seguimiento separado de objetivos de fase y progreso.','Objetivos');
  const settings=mk('ftPageSettings','Configuración','Preferencias de JourFund y conexión de tu cuenta.','Ajustes');

  // Los indicadores y el gráfico pertenecen a Operaciones; Inicio queda limpio y tipo TradingView.
  if(grid) ops.appendChild(grid);
  if(chart) ops.appendChild(chart);
  if(calendar) ops.appendChild(calendar);
  if(stats) ops.appendChild(stats);
  if(risk) ops.appendChild(risk);
  if(recent) ops.appendChild(recent);
  if(objective) objectives.appendChild(objective);
  if(strip) accounts.appendChild(strip);

  const market=document.createElement('div'); market.className='ft-home-grid';
  const marketCard=document.createElement('div'); marketCard.className='ft-market-card';
  marketCard.innerHTML='<div class="ft-market-head"><strong>Mercados</strong><span class="ft-nav-page-note">Vista de referencia</span></div><div class="ft-market-list">'+
    [['XAUUSD','Oro'],['EURUSD','Euro / Dólar'],['BTCUSD','Bitcoin']].map((x,n)=>'<div class="ft-market"><strong>'+x[0]+'</strong><small>'+x[1]+'</small><div class="ft-line">'+[35,52,43,65,58,76,68,82].map((h,i)=>'<i style="height:'+((h+n*4)%70+18)+'%"></i>').join('')+'</div></div>').join('')+'</div>';
  const news=document.createElement('div'); news.className='ft-news-card';
  news.innerHTML='<div class="ft-market-head"><strong>Flujo de noticias</strong><span class="ft-nav-page-note">TradingView style</span></div>'+
    '<div class="ft-news"><b>Sesión de Nueva York</b><span>Prepará tu plan antes de entrar al mercado.</span></div>'+
    '<div class="ft-news"><b>Gestión de riesgo</b><span>Tu límite y drawdown se calculan según la cuenta activa.</span></div>'+
    '<div class="ft-news"><b>Disciplina</b><span>No necesitás ganar hoy. Necesitás ejecutar bien.</span></div>';
  market.append(marketCard,news); home.prepend(market);

  // Resumen compacto del contexto activo: no duplica el panel de Operaciones.
  const homeOverview=document.createElement('div');
  homeOverview.className='ft-home-overview';
  homeOverview.innerHTML=`
    <div class="ft-home-overview-main">
      <div class="ft-home-overline"><span class="live-dot"></span> CUENTA ACTIVA</div>
      <div class="ft-home-title" id="ftHomeAccount">—</div>
      <div class="ft-home-sub" id="ftHomePhase">—</div>
    </div>
    <div class="ft-home-mini"><span>Balance</span><strong id="ftHomeBalance">—</strong></div>
    <div class="ft-home-mini"><span>P&L</span><strong id="ftHomePnl">—</strong></div>
    <div class="ft-home-mini"><span>Riesgo diario</span><strong id="ftHomeDaily">—</strong></div>
    <div class="ft-home-action"><button class="btn primary" id="ftHomeGoOps">Abrir operaciones</button></div>
  `;
  home.appendChild(homeOverview);
  document.getElementById('ftHomeGoOps').onclick=()=>window.ftGo&&window.ftGo('ftPageOps');

  function refreshHomeOverview(){
    try{
      const a=acc(), ts=trades(), ls=limits();
      const pnl=ts.reduce((s,t)=>s+Number(t.pnl||0),0);
      const phaseText=a.status==='Funded'?'PA / Funded':'Fase '+(Number(a.phase)||1);
      const statusText=a.firm+' · '+a.program;
      $('ftHomeAccount').textContent=statusText;
      $('ftHomePhase').textContent=phaseText+' · '+(a.status||'Challenge');
      $('ftHomeBalance').textContent=money(Number(a.capital||0)+pnl);
      $('ftHomePnl').textContent=(pnl>=0?'+':'')+money(pnl);
      $('ftHomePnl').className=pnl>=0?'green':'red';
      $('ftHomeDaily').textContent=money(ls.daily);
    }catch(e){}
  }
  window.ftRefreshHome=refreshHomeOverview;
  refreshHomeOverview();

  const accountTools=document.createElement('div'); accountTools.className='ft-settings-grid';
  accountTools.innerHTML='<div class="ft-quick-card"><div class="label">Cuenta activa</div><div class="ft-objective-big" id="ftAccountBig">—</div><div class="sub">Elegí la cuenta que querés usar en Mis cuentas.</div></div>'+
    '<div class="ft-quick-card"><div class="label">Gestión</div><div class="ft-action-row"><button class="btn primary" id="ftNewAccountPage">+ Nueva cuenta</button><button class="btn" id="ftResetPage">↻ Reiniciar progreso</button></div></div>';
  accounts.appendChild(accountTools);
  $('ftNewAccountPage').onclick=()=>$('newAccount').click();
  $('ftResetPage').onclick=()=>document.querySelector('[data-reset-account="1"]')?.click();

  const withdrawWrap=document.createElement('div'); withdrawWrap.className='ft-withdraw-grid';
  withdrawWrap.innerHTML='<div class="ft-withdraw-stat"><div class="label">Estado PA</div><div class="big" id="ftPAStatus">—</div><div class="sub" id="ftPASub">—</div><div class="ft-action-row"><button class="btn primary" id="ftOpenPAInline">Abrir centro de retiros</button></div></div>'+
    '<div class="ft-withdraw-stat"><div class="label">Objetivo mensual</div><div class="big" id="ftPAGoal">—</div><div class="sub" id="ftPAProfit">—</div></div>';
  withdrawals.appendChild(withdrawWrap);
  $('ftOpenPAInline').onclick=()=>openPA();

  const settingsGrid=document.createElement('div'); settingsGrid.className='ft-settings-grid';
  settingsGrid.innerHTML='<div class="ft-quick-card"><div class="label">Tema visual</div><div class="ft-action-row"><button class="theme-btn active" data-theme="violet">Violet</button><button class="theme-btn" data-theme="emerald">Emerald</button><button class="theme-btn" data-theme="navy">Navy</button></div></div>'+
    '<div class="ft-quick-card"><div class="label">Nube</div><div class="sub">Tus datos se guardan en tu cuenta personal. Revisá el estado de sincronización antes de cambiar de dispositivo.</div><div class="ft-action-row"><button class="btn" id="ftCloudSettings">Mi cuenta</button></div></div>';
  settings.appendChild(settingsGrid);
  $('ftCloudSettings').onclick=()=>{window.ftCloudLogin?.()};
  settingsGrid.querySelectorAll('.theme-btn').forEach(b=>b.onclick=()=>applyTheme(b.dataset.theme));

  // Hide the original top-level content; the same live DOM nodes now live inside their pages.
  if(top) top.style.display='flex';
  document.querySelectorAll('.wrap>.section').forEach(s=>s.style.display='none');
  if(grid) grid.style.display='grid';
  if(chart) chart.style.display='block';
  if(strip) strip.style.display='block';

  function refreshPageBits(){
    const a=acc(),pa=ensurePA(a),ts=pa.trades||[],month=new Date().toISOString().slice(0,7);
    const profit=ts.filter(t=>String(t.date||'').slice(0,7)===month).reduce((s,t)=>s+Number(t.pnl||0),0);
    const goal=a.capital*Number(pa.goalPct||10)/100;
    const ab=$('ftAccountBig'); if(ab)ab.textContent=a.firm+' · '+a.program;
    const st=$('ftPAStatus'); if(st)st.textContent=a.status==='Funded'?'💎 PA ACTIVA':'🔒 '+a.status;
    const ss=$('ftPASub'); if(ss)ss.textContent=a.status==='Funded'?'Cuenta financiada desde '+money(a.capital):'Completá las fases para activar PA';
    const pg=$('ftPAGoal'); if(pg)pg.textContent=money(goal);
    const pp=$('ftPAProfit'); if(pp)pp.textContent=(profit>=0?'+':'')+money(profit)+' este mes';
  }

  function go(page){
    document.querySelectorAll('.ft-page').forEach(p=>p.classList.toggle('active',p.id===page));
    document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    refreshPageBits();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.ftGo=go;
  const map={Resumen:'ftPageHome',Inicio:'ftPageHome',Operaciones:'ftPageOps',Cuentas:'ftPageAccounts',Retiros:'ftPageWithdrawals',Objetivos:'ftPageObjectives',Configuración:'ftPageSettings',Más:'ftPageSettings'};
  document.querySelectorAll('.side-btn').forEach(b=>{
    const label=b.textContent.trim(); const page=map[label]; if(page){b.dataset.page=page;b.onclick=()=>go(page)}
  });
  document.querySelectorAll('.mobile-nav button').forEach(b=>{
    const label=b.textContent.replace(/^[^A-Za-zÁÉÍÓÚáéíóú]+/,'').trim(); const page=map[label]; if(page){b.dataset.page=page;b.onclick=()=>go(page)}
  });
  // Add Objetivos as a first-class navigation item.
  const nav=document.querySelector('.side-nav');
  if(nav&&!nav.querySelector('[data-page="ftPageObjectives"]')){
    const b=document.createElement('button'); b.className='side-btn'; b.dataset.page='ftPageObjectives'; b.innerHTML='<span class="side-icon">◎</span>Objetivos'; b.onclick=()=>go('ftPageObjectives'); nav.insertBefore(b,nav.querySelector('[data-page="ftPageAccounts"]')||null);
  }
  const mobile=document.querySelector('.mobile-nav');
  if(mobile&&!mobile.querySelector('[data-page="ftPageObjectives"]')){
    const b=document.createElement('button'); b.dataset.page='ftPageObjectives'; b.innerHTML='<span>◎</span>Objetivos'; b.onclick=()=>go('ftPageObjectives'); mobile.insertBefore(b,mobile.lastElementChild);
  }
  go('ftPageHome');
})();
