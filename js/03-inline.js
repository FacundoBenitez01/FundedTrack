(function(){
'use strict';
function page(rows,requested){
 const total=rows.length,pages=Math.max(1,Math.ceil(total/5));
 const current=Math.min(pages,Math.max(1,Math.floor(Number(requested)||1)));
 const start=(current-1)*5;
 return {rows:rows.slice(start,start+5),total,pages,current,start:total?start+1:0,end:Math.min(total,start+5)};
}
function label(p){
 const lang=window.JourFundI18n?.language||'es';
 const words=lang==='en'?['of','Page']:lang==='pt-BR'?['de','Página']:['de','Página'];
 return p.start+'–'+p.end+' '+words[0]+' '+p.total+' · '+words[1]+' '+p.current+' / '+p.pages;
}
window.FT104History={page,label};
})();
