// Replaces inline onclick attributes so the CSP can forbid inline scripts.
document.addEventListener('click',e=>{const el=e.target.closest('[data-jf-action]');if(!el)return;
const a=el.dataset.jfAction,smooth={behavior:'smooth',block:'start'};
if(a==='top')window.scrollTo({top:0,behavior:'smooth'});
else if(a==='focus-account')document.getElementById('account')?.focus();
else if(a==='open-pa')window.openPA?.();
else if(a==='reload')location.reload();
else if(a==='skip'){e.preventDefault();const app=document.getElementById('app');if(app){if(!app.hasAttribute('tabindex'))app.setAttribute('tabindex','-1');app.focus();app.scrollIntoView();}}
else if(a==='scroll-calendar')document.querySelector('.calendar-card')?.scrollIntoView(smooth);
else if(a==='scroll-section4')document.querySelector('.section:nth-of-type(4)')?.scrollIntoView(smooth);});
