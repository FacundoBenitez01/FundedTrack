(function(){
  const home=document.getElementById('ftPageHome');
  if(!home)return;
  // Nunca dejes restos del dashboard antiguo dentro de Inicio.
  home.querySelectorAll(':scope > .ft-page-body > .grid, :scope > .ft-page-body > .chart, :scope > .ft-page-body > .section').forEach(el=>el.remove());
  const refresh=window.ftRefreshHome;
  if(typeof refresh==='function')refresh();
  const oldRender=window.render;
  if(typeof oldRender==='function' && !oldRender.__ftHomeRepair){
    const wrapped=function(){oldRender();if(window.ftRefreshHome)window.ftRefreshHome()};
    wrapped.__ftHomeRepair=true;
    window.render=wrapped;
  }
  const cloudSettings=document.getElementById('ftCloudSettings');
  if(cloudSettings){
    cloudSettings.onclick=function(){
      if(window.ftCloudSession && window.ftCloudSignOut){window.ftCloudSignOut()}
      else if(window.ftCloudSetup){window.ftCloudSetup()}
      else document.getElementById('ftCloudGate')?.classList.add('show');
    };
  }
})();
