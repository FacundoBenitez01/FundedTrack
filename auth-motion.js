(function(){
 'use strict';
 const gate=document.getElementById('ftCloudGate'),app=document.getElementById('app');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const submit=document.getElementById('ftAuthSubmit');
 function busy(){submit.setAttribute('aria-busy',String(submit.disabled));}
 new MutationObserver(busy).observe(submit,{attributes:true,attributeFilter:['disabled']});busy();
 let wasReady=document.body.classList.contains('ft-ready');
 new MutationObserver(()=>{
  const ready=document.body.classList.contains('ft-ready');
  if(ready&&!wasReady&&!reduced){app.classList.remove('ft85-app-enter');void app.offsetWidth;app.classList.add('ft85-app-enter');}
  wasReady=ready;
 }).observe(document.body,{attributes:true,attributeFilter:['class']});
 app.addEventListener('animationend',e=>{if(e.animationName==='ft85App')app.classList.remove('ft85-app-enter');});
 function entrance(){
  const splash=document.getElementById('ft57Splash');if(!splash)return;
  if(reduced){splash.remove();return;}
  setTimeout(()=>{
   if(!splash.isConnected)return;
   if(document.body.classList.contains('ft-ready')){splash.classList.add('ft57-done');setTimeout(()=>splash.remove(),350);return;}
   const logo=splash.querySelector('.ft57-brand'),target=gate.querySelector('.ft57-brand');
   const a=logo.getBoundingClientRect(),b=target.getBoundingClientRect();
   gate.classList.add('ft85-intro');splash.classList.add('ft85-splash-exit');
   if(logo.animate){
    const animation=logo.animate([{transform:'none',opacity:1},{transform:`translate(${b.x+b.width/2-a.x-a.width/2}px,${b.y+b.height/2-a.y-a.height/2}px) scale(${Math.min(b.height/a.height,b.width/a.width)})`,opacity:0}],{duration:750,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
    animation.finished.catch(()=>{}).finally(()=>splash.remove());
   }else{splash.remove();}
   setTimeout(()=>{gate.classList.remove('ft85-intro');splash.remove();},1100);
  },450);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',entrance,{once:true});else entrance();
})();
