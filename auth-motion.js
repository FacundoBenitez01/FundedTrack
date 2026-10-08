(function(){
 'use strict';
 const gate=document.getElementById('ftCloudGate'),app=document.getElementById('app'),submit=document.getElementById('ftAuthSubmit');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function busy(){submit.setAttribute('aria-busy',String(submit.disabled));}
 new MutationObserver(busy).observe(submit,{attributes:true,attributeFilter:['disabled']});busy();
 const google=document.getElementById('ft68Google');const googleBusy=()=>google.setAttribute('aria-busy',String(google.disabled));new MutationObserver(googleBusy).observe(google,{attributes:true,attributeFilter:['disabled']});googleBusy();
 let wasReady=document.body.classList.contains('ft-ready');
 new MutationObserver(()=>{const ready=document.body.classList.contains('ft-ready');if(ready&&!wasReady&&!reduced){app.classList.remove('ft85-app-enter');void app.offsetWidth;app.classList.add('ft85-app-enter');}wasReady=ready;}).observe(document.body,{attributes:true,attributeFilter:['class']});
 app.addEventListener('animationend',e=>{if(e.animationName==='ft85App')app.classList.remove('ft85-app-enter');});
 async function entrance(){
  const splash=document.getElementById('ft57Splash');if(!splash)return;
  if(reduced||!Element.prototype.animate||window.ft87InteractiveAccess){splash.remove();return;}
  splash.dataset.managed='true';
  if(document.hidden)await new Promise(resolve=>{const visible=()=>{if(!document.hidden){document.removeEventListener('visibilitychange',visible);resolve();}};document.addEventListener('visibilitychange',visible);});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(!splash.isConnected)return;
  const animations=[];const visibility=()=>animations.forEach(a=>document.hidden?a.pause():a.play());document.addEventListener('visibilitychange',visibility);
  function part(selector,transform,delay,duration){const e=splash.querySelector(selector);if(!e)return;animations.push(e.animate([{opacity:0,transform},{opacity:1,transform:'none'}],{delay,duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));}
  part('.ft86-tile','scale(.82)',180,600);part('.ft86-stem','translateY(65px)',370,720);part('.ft86-top','translateX(-50px)',510,680);part('.ft86-middle','translateY(70px)',660,680);part('.ft86-trend','translateX(55px)',810,690);part('.ft86-wick-white','scaleY(0)',970,500);part('.ft86-candle-white','translateY(45px)',1060,600);part('.ft86-wick-purple','scaleY(0)',1090,580);part('.ft86-candle-purple','translateY(-45px)',1190,620);part('.ft86-word','translateY(12px)',1700,600);part('.ft86-tag','translateY(8px)',1900,600);
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  await new Promise(resolve=>setTimeout(resolve,450));
  document.removeEventListener('visibilitychange',visibility);
  {
   if(!splash.isConnected)return;
   const stage=gate.dataset.state;
   if(document.body.classList.contains('ft-ready')||!['login','recovery'].includes(stage)){
    splash.classList.add('ft57-done');setTimeout(()=>splash.remove(),350);return;
   }
   const mark=splash.querySelector('.ft86-intro-mark'),word=splash.querySelector('.ft86-word'),tag=splash.querySelector('.ft86-tag');
   const target=gate.querySelector('.ft57-brand img'),targetWord=gate.querySelector('.ft57-word'),targetTag=gate.querySelector('.ft85-auth-hero p');
   const a=mark.getBoundingClientRect(),b=target.getBoundingClientRect();
   gate.classList.add('ft86-reveal');splash.classList.add('ft86-out');
   mark.animate([{transform:'none'},{offset:.35,transform:`translate(${b.x-a.x}px,0) scale(${b.width/a.width})`},{transform:`translate(${b.x-a.x}px,${b.y-a.y}px) scale(${b.width/a.width})`,opacity:0}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
   mark.style.transformOrigin='top left';
   for(const [node,destination] of [[word,targetWord],[tag,targetTag]]){const x=node.getBoundingClientRect(),y=destination.getBoundingClientRect();node.animate([{transform:'none',opacity:1},{transform:`translate(${y.x+y.width/2-x.x-x.width/2}px,${y.y+y.height/2-x.y-x.height/2}px) scale(${Math.min(y.width/x.width,y.height/x.height)})`,opacity:0}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});}
   setTimeout(()=>{splash.remove();gate.classList.remove('ft86-reveal');},950);
  }
 }
 window.ft87AccessSuccess=async()=>{gate.classList.add('ft87-success');gate.querySelector('.ft86-load-title').textContent='Acceso confirmado';gate.querySelector('.ft86-load-sub').textContent='Entrando a tu espacio';await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));await new Promise(resolve=>setTimeout(resolve,reduced?100:750));};
 const start=()=>entrance().catch(()=>document.getElementById('ft57Splash')?.remove());if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

