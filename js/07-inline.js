/* PA controls: stable in-app forms, live goal calculation, and cleaner header */
const paHeaderStyle=document.createElement('style');
paHeaderStyle.textContent='.top{align-items:flex-start;gap:28px;margin-bottom:30px;padding:4px 2px 22px;border-bottom:1px solid var(--border)}.brand h1{font-size:30px;letter-spacing:-1px}.brand p{margin-top:7px}.phase{justify-content:flex-end;flex-wrap:wrap;max-width:780px}.phase .select{min-width:155px}.phase .btn{white-space:nowrap}.pa-live{font-size:11px}';
document.head.appendChild(paHeaderStyle);
const paGoalInput=$('paGoalInput'),paAddWithdrawal=$('paAddWithdrawal'),withdrawModal=document.createElement('div');
withdrawModal.className='modal';
withdrawModal.id='withdrawModal';
withdrawModal.innerHTML='<div class="modalbox"><div class="modalhead"><h3>💸 Registrar retiro</h3><button type="button" class="close" id="withdrawClose" aria-label="Cerrar">×</button></div><form id="withdrawForm"><div class="form"><div class="field"><label for="withdrawAmount">Monto del retiro (USD)</label><input id="withdrawAmount" type="number" min="0.01" step="0.01" required placeholder="500"></div><div class="field"><label for="withdrawDate">Fecha</label><input id="withdrawDate" type="date" required></div><div class="field full"><label for="withdrawNote">Nota opcional</label><input id="withdrawNote" placeholder="Ej. Primer payout"></div></div><div class="actions"><button type="button" class="btn" id="withdrawCancel">Cancelar</button><button class="btn primary" type="submit">Guardar retiro</button></div></form></div>';
document.body.appendChild(withdrawModal);
paGoalInput.oninput=()=>{const a=acc(),pa=ensurePA(a);pa.goalPct=Math.max(0,Number(paGoalInput.value)||0);save();render();renderPA()};
paAddWithdrawal.onclick=()=>{if(acc().status!=='Funded')return;$('withdrawAmount').value='';$('withdrawDate').value=new Date().toISOString().slice(0,10);$('withdrawNote').value='';withdrawModal.classList.add('show');if(window.matchMedia('(min-width:701px)').matches)setTimeout(()=>$('withdrawAmount').focus(),30)};
$('withdrawClose').onclick=() => withdrawModal.classList.remove('show');
$('withdrawCancel').onclick=() => withdrawModal.classList.remove('show');
$('withdrawForm').onsubmit=e=>{e.preventDefault();const a=acc(),pa=ensurePA(a),amount=Number($('withdrawAmount').value),date=$('withdrawDate').value,note=$('withdrawNote').value.trim();if(a.status!=='Funded'||amount<=0||!date)return;pa.withdrawals.push({id:'w_'+Date.now(),amount,date,note});save();withdrawModal.classList.remove('show');renderPA();achievement('💸','Retiro registrado','El retiro quedó guardado en '+a.firm+' · '+a.program+'.')};
const oldRenderPA=renderPA;
renderPA=()=>{oldRenderPA();if($('paGoalLive'))$('paGoalLive').textContent=Number(ensurePA(acc()).goalPct||0).toFixed(1)+'% · automático'};
