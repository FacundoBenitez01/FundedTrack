/* JourFund stable preview layer — cloud is intentionally disabled until Supabase is configured */
(function(){
  const recent=$('ftRecentBody');
  function installRecent(){
    const wrap=document.querySelector('.wrap'),section=$('recentSection');
    const ops=document.querySelector('#ftPageOps .ft-page-body');
    if(ops&&section){if(section.parentElement!==ops)ops.appendChild(section);return;}
    if(wrap&&section&&section.parentElement!==wrap){
      const sections=wrap.querySelectorAll('.section');
      const chart=sections[sections.length-1];
      if(chart) wrap.insertBefore(section,chart.nextSibling); else wrap.appendChild(section);
    }
  }
  function renderRecent(){
    if(!recent)return;
    const ts=trades().slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    if(!ts.length){recent.innerHTML='<div class="ft-empty">Todavía no hay operaciones. Registrá la primera y aparecerá acá.</div>';return}
    recent.innerHTML='<table class="ft-recent-table"><thead><tr><th>Fecha</th><th>Activo</th><th>Resultado</th><th>P&L</th><th>Riesgo</th><th>RR</th></tr></thead><tbody>'+ts.slice(0,8).map(t=>'<tr><td>'+t.date+'</td><td>'+ft66Escape(t.asset)+'</td><td class="ft-result '+String(t.result||'').toLowerCase()+'">'+(t.result==='Win'?'Win':t.result==='Loss'?'Loss':'BE')+'</td><td class="'+(Number(t.pnl)>=0?'green':'red')+'">'+(Number(t.pnl)>=0?'+':'')+money(Number(t.pnl))+'</td><td>'+Number(t.risk||0).toFixed(2)+'%</td><td>'+ft66Escape(t.rr)+'</td></tr>').join('')+'</tbody></table>';
  }
  function setupManifest(){
    const link=document.querySelector('link[rel="manifest"]');
    if(!link)return;
    const icon='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#6d55ff"/><path d="M25 91V67l18-18 15 14 28-34v25L59 83 43 68 25 86z" fill="white"/><circle cx="94" cy="30" r="10" fill="#36d79a"/></svg>');
    link.href='data:application/manifest+json,'+encodeURIComponent(JSON.stringify({name:'JourFund',short_name:'JourFund',start_url:'.',display:'standalone',background_color:'#080b12',theme_color:'#6d55ff',icons:[{src:icon,sizes:'128x128',type:'image/svg+xml'}]}));
  }
  const originalRender=render;
  window.render=function(){originalRender();installRecent();renderRecent()};
  // Use the external manifest with PNG icons.
  installRecent();
  renderRecent();
  const cloudBtn=$('ftCloudBtn');
  if(cloudBtn)cloudBtn.remove();
  if($('ftRecentAdd'))$('ftRecentAdd').onclick=()=>openModal();
  document.querySelectorAll('.side-btn').forEach((b,i)=>{
    if(i===4)b.onclick=()=>{window.ftCloudLogin?.()};
  });
})();
