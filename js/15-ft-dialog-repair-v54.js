(function(){
 const dialogs=[...document.querySelectorAll('.modal')];
 for(const dialog of dialogs){
  const box=dialog.querySelector('.modalbox');if(!box)continue;
  dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
  const title=box.querySelector('h3');if(title){if(!title.id)title.id=dialog.id+'TitleV54';dialog.setAttribute('aria-labelledby',title.id);}
  box.tabIndex=-1;
  const form=box.querySelector(':scope > form');
  const host=form||box;
  const children=[...host.children].filter(c=>!c.classList.contains('modalhead')&&!c.classList.contains('actions'));
  const scroll=document.createElement('div');scroll.className='ft-dialog-scroll';
  if(form&&!children.some(c=>c.classList.contains('form')))scroll.classList.add('ft-dialog-fields');
  for(const child of children)scroll.appendChild(child);
  const actions=host.querySelector(':scope > .actions');host.insertBefore(scroll,actions||null);
  dialog.querySelectorAll('input[type="number"]').forEach(input=>{input.inputMode=input.step==='1'?'numeric':'decimal';});
  dialog.querySelectorAll('.close').forEach(button=>{button.type='button';button.setAttribute('aria-label','Cerrar ventana');});
 }
 let open=new Set(),locked=false,scrollY=0,order=1000,returnFocus=null;
 function updateViewport(){const v=window.visualViewport;document.documentElement.style.setProperty('--ft-vv-height',(v?v.height:window.innerHeight)+'px');document.documentElement.style.setProperty('--ft-vv-top',(v?v.offsetTop:0)+'px');}
 function update(){
  const visible=dialogs.filter(d=>d.classList.contains('show'));
  for(const d of visible){if(!open.has(d)){d.style.setProperty('z-index',String(++order),'important');d.querySelector('.ft-dialog-scroll').scrollTop=0;if(document.activeElement?.tagName!=='INPUT')d.querySelector('.modalbox').focus({preventScroll:true});}}
  const isOpen=visible.length>0;
  if(isOpen&&!locked){scrollY=window.scrollY;returnFocus=document.activeElement;document.body.style.position='fixed';document.body.style.top=-scrollY+'px';document.body.style.width='100%';locked=true;}
  if(!isOpen&&locked){document.body.style.position='';document.body.style.top='';document.body.style.width='';locked=false;window.scrollTo(0,scrollY);if(returnFocus?.isConnected&&returnFocus.tagName==='BUTTON')returnFocus.focus({preventScroll:true});}
  document.body.classList.toggle('ft-dialog-open',isOpen);
  document.querySelectorAll('.sidebar,.mobile-nav').forEach(n=>{n.inert=isOpen;});
  open=new Set(visible);updateViewport();
 }
 const observer=new MutationObserver(update);dialogs.forEach(d=>observer.observe(d,{attributes:true,attributeFilter:['class']}));
 window.addEventListener('resize',updateViewport);
 window.visualViewport?.addEventListener('resize',updateViewport);
 window.visualViewport?.addEventListener('scroll',updateViewport);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open.size){const d=[...open].sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex))[0];d.querySelector('.close')?.click();}});
 update();
})();
