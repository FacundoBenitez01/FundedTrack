(function(){
  const w=document.querySelector('.wrap');
  if(w){
    w.style.display='block';
    w.style.gridTemplateColumns='none';
    w.style.columnGap='0';
  }
  if(window.ftGo) window.ftGo('ftPageHome');
})();
