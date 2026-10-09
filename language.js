/* JourFund language controls. Never translates stored journal data or input values. */
(function(){
'use strict';
const supported=['es','en','pt-BR'], names={es:'Español',en:'English','pt-BR':'Português (Brasil)'}, dictionary=new Map();
const rows=`Inicio|Home|Início
Operaciones|Trades|Operações
Cuentas|Accounts|Contas
Retiros|Withdrawals|Saques
Objetivos|Goals|Objetivos
Herramientas|Tools|Ferramentas
Ajustes|Settings|Configurações
Configuración|Settings|Configurações
Mi cuenta|My account|Minha conta
Más|More|Mais
Propietario|Owner|Proprietário
Trader|Trader|Trader
Notificaciones|Notifications|Notificações
Mercados|Markets|Mercados
Calendario económico|Economic calendar|Calendário econômico
Tu agenda de hoy|Today's agenda|Sua agenda de hoje
Personalizar avisos|Customize alerts|Personalizar alertas
Elegir mercado|Choose market|Escolher mercado
Agregar|Add|Adicionar
Eliminar|Delete|Excluir
Editar|Edit|Editar
Cancelar|Cancel|Cancelar
Cerrar|Close|Fechar
Guardar|Save|Salvar
Guardar cambios|Save changes|Salvar alterações
Confirmar|Confirm|Confirmar
Continuar|Continue|Continuar
Volver|Back|Voltar
Recargar|Reload|Recarregar
Ver detalle|View details|Ver detalhes
Ver datos individuales|View individual data|Ver dados individuais
Nueva operación|New trade|Nova operação
+ Nueva operación|+ New trade|+ Nova operação
Abrir operaciones|Open trades|Abrir operações
Historial de operaciones|Trade history|Histórico de operações
Resultado neto|Net result|Resultado líquido
Win rate|Win rate|Taxa de acerto
Cuenta activa|Active account|Conta ativa
CUENTA ACTIVA|ACTIVE ACCOUNT|CONTA ATIVA
Balance|Balance|Saldo
BALANCE|BALANCE|SALDO
Pérdida diaria disponible|Daily loss allowance|Limite de perda diária disponível
PÉRDIDA DIARIA DISPONIBLE|DAILY LOSS ALLOWANCE|LIMITE DE PERDA DIÁRIA DISPONÍVEL
Riesgo|Risk|Risco
Riesgo (%)|Risk (%)|Risco (%)
Fecha|Date|Data
Activo|Asset|Ativo
Resultado|Result|Resultado
Ganancia / Pérdida ($)|Profit / Loss ($)|Lucro / Prejuízo ($)
Lotaje (opcional)|Lot size (optional)|Lotes (opcional)
Lotaje|Lot size|Lotes
Estado|Status|Estado
Nota|Note|Nota
Notas|Notes|Notas
Ganancia|Profit|Lucro
Pérdida|Loss|Prejuízo
Win · Ganancia|Win · Profit|Win · Lucro
Loss · Pérdida|Loss · Loss|Loss · Prejuízo
Bien|Good|Bem
Ansioso|Anxious|Ansioso
MOLESTO|UPSET|IRRITADO
Capturas de la operación|Trade screenshots|Capturas da operação
Subir imágenes|Upload images|Enviar imagens
Adjuntar imágenes|Attach images|Anexar imagens
Qué pasó en la operación...|What happened in this trade...|O que aconteceu nesta operação...
Mis cuentas|My accounts|Minhas contas
Agregar cuenta|Add account|Adicionar conta
Crear cuenta|Create account|Criar conta
Catálogo de programas CFD|CFD program catalog|Catálogo de programas CFD
Todos|All|Todos
1 fase|1 phase|1 fase
2 fases|2 phases|2 fases
Instantánea|Instant funding|Financiamento instantâneo
Reglas de la cuenta|Account rules|Regras da conta
Objetivo|Target|Meta
Pérdida diaria|Daily loss|Perda diária
Pérdida máxima|Maximum loss|Perda máxima
Días mínimos|Minimum days|Dias mínimos
Tamaño de cuenta|Account size|Tamanho da conta
Financiada|Funded|Financiada
Evaluación|Evaluation|Avaliação
Fase 1|Phase 1|Fase 1
Fase 2|Phase 2|Fase 2
Grupos|Groups|Grupos
Multicuentas|Multi-account|Multicontas
Crear grupo|Create group|Criar grupo
Editar grupo|Edit group|Editar grupo
Nombre del grupo|Group name|Nome do grupo
Nombre de cuenta|Account name|Nome da conta
Capital|Capital|Capital
Progreso|Progress|Progresso
Etapa|Stage|Etapa
Datos individuales|Individual data|Dados individuais
Registrar retiro|Record withdrawal|Registrar saque
Recibido|Received|Recebido
Retiros registrados|Recorded withdrawals|Saques registrados
Historial de retiros|Withdrawal history|Histórico de saques
Importe|Amount|Valor
Detalles|Details|Detalhes
Cuenta financiada|Funded account|Conta financiada
Requisitos del ciclo|Cycle requirements|Requisitos do ciclo
Importes registrados|Recorded amounts|Valores registrados
Próxima revisión|Next review|Próxima revisão
Ver condiciones|View conditions|Ver condições
Meta diaria personal|Personal daily goal|Meta diária pessoal
Meta diaria|Daily goal|Meta diária
Objetivo de fase|Phase target|Meta da fase
Días registrados|Recorded days|Dias registrados
Tu camino|Your journey|Sua jornada
En curso|In progress|Em andamento
Próxima|Next|Próxima
Moneda|Currency|Moeda
Disciplina de hoy|Today's discipline|Disciplina de hoje
Tu proceso, tu mejor ventaja.|Your process, your greatest edge.|Seu processo, sua maior vantagem.
Plan definido|Plan defined|Plano definido
Riesgo revisado|Risk reviewed|Risco revisado
Diario actualizado|Journal updated|Diário atualizado
Diario pendiente|Journal pending|Diário pendente
Registrá lo que pasó.|Record what happened.|Registre o que aconteceu.
Listo|Done|Pronto
Editar meta diaria|Edit daily goal|Editar meta diária
Un plan claro. Un paso a la vez.|A clear plan. One step at a time.|Um plano claro. Um passo de cada vez.
Tus metas personales no reemplazan las reglas de la firma.|Personal goals do not replace the firm's rules.|Suas metas pessoais não substituem as regras da empresa.
Resumen semanal|Weekly summary|Resumo semanal
Esta semana|This week|Esta semana
Semana anterior|Previous week|Semana anterior
Operaciones ganadoras|Winning trades|Operações vencedoras
Operaciones perdedoras|Losing trades|Operações perdedoras
Calculadora de lotaje|Lot size calculator|Calculadora de lotes
Calculadora de riesgo|Risk calculator|Calculadora de risco
Valor de pips|Pip value|Valor dos pips
Tamaño de posición|Position size|Tamanho da posição
Tamaño de la posición|Position size|Tamanho da posição
Calcular|Calculate|Calcular
Instrumento|Instrument|Instrumento
Entrada|Entry|Entrada
Precio de entrada|Entry price|Preço de entrada
Stop loss|Stop loss|Stop loss
Take profit|Take profit|Take profit
Distancia del stop|Stop distance|Distância do stop
Riesgo monetario|Cash risk|Risco monetário
Margen|Margin|Margem
Apalancamiento|Leverage|Alavancagem
Aplicar a operación|Apply to trade|Aplicar à operação
Usar en operación|Use in trade|Usar na operação
Apariencia|Appearance|Aparência
Violeta|Violet|Violeta
Esmeralda|Emerald|Esmeralda
Azul|Blue|Azul
Creatividad y enfoque|Creativity and focus|Criatividade e foco
Calma y claridad|Calm and clarity|Calma e clareza
Precisión y orden|Precision and order|Precisão e organização
Elegí la paleta de tu espacio de trabajo.|Choose your workspace palette.|Escolha a paleta do seu espaço de trabalho.
Preferencias del diario|Journal preferences|Preferências do diário
Idioma de la aplicación|App language|Idioma do aplicativo
Cambiar idioma|Change language|Mudar idioma
Aplicar idioma|Apply language|Aplicar idioma
Podés cambiarlo cuando quieras.|You can change it anytime.|Você pode mudar quando quiser.
Nombre para mostrar|Display name|Nome de exibição
Guardar nombre|Save name|Salvar nome
Tu perfil|Your profile|Seu perfil
Tu perfil y tus datos, en un solo lugar.|Your profile and data, all in one place.|Seu perfil e seus dados, em um só lugar.
Datos y respaldos|Data and backups|Dados e backups
Opciones de recuperación|Recovery options|Opções de recuperação
Exportá un respaldo antes de descartar cambios de este dispositivo.|Export a backup before discarding changes on this device.|Exporte um backup antes de descartar alterações neste dispositivo.
Podés cambiar tu nombre una vez cada 30 días.|You can change your name once every 30 days.|Você pode mudar seu nome uma vez a cada 30 dias.
Sincronizar ahora|Sync now|Sincronizar agora
Exportar respaldo|Export backup|Exportar backup
Importar respaldo|Import backup|Importar backup
Cargar versión de la nube|Load cloud version|Carregar versão da nuvem
Reiniciar copia local y cargar nube|Reset local copy and load cloud|Redefinir cópia local e carregar nuvem
Cerrar sesión|Sign out|Sair
Sincronizado|Synced|Sincronizado
Guardando…|Saving…|Salvando…
Cargando datos…|Loading data…|Carregando dados…
Cargando tus datos…|Loading your data…|Carregando seus dados…
Pendiente|Pending|Pendente
Sin sesión|Signed out|Sem sessão
Configurar cuenta activa|Configure active account|Configurar conta ativa
Bienvenido de nuevo|Welcome back|Bem-vindo de volta
Creá tu cuenta|Create your account|Crie sua conta
Entrar|Sign in|Entrar
Iniciar sesión|Sign in|Entrar
Registrarse|Sign up|Cadastrar-se
Correo electrónico|Email address|E-mail
Contraseña|Password|Senha
Continuar con Google|Continue with Google|Continuar com Google
Restablecer contraseña|Reset password|Redefinir senha
Guardar nueva contraseña|Save new password|Salvar nova senha
Tu trading. Tu progreso.|Your trading. Your progress.|Seu trading. Seu progresso.
Preparando tu espacio|Preparing your workspace|Preparando seu espaço
Sincronizando tus cuentas|Syncing your accounts|Sincronizando suas contas
Reintentar carga|Retry loading|Tentar carregar novamente
Comparar y recuperar|Compare and recover|Comparar e recuperar
Resolver sincronización|Resolve sync|Resolver sincronização
No se pudo abrir|Unable to open|Não foi possível abrir
Resolvé primero el conflicto de sincronización en Ajustes.|Resolve the sync conflict in Settings first.|Resolva primeiro o conflito de sincronização nas Configurações.
Esperá a que termine la sincronización.|Wait for synchronization to finish.|Aguarde a sincronização terminar.
Esperá a que se carguen tus datos.|Wait for your data to load.|Aguarde seus dados carregarem.
Iniciá sesión primero.|Sign in first.|Entre primeiro.
No hay notificaciones|No notifications|Nenhuma notificação
Marcar todas como leídas|Mark all as read|Marcar todas como lidas
Activar en este dispositivo|Enable on this device|Ativar neste dispositivo
Enviar prueba|Send test|Enviar teste
Recordatorio del diario|Journal reminder|Lembrete do diário
Impacto alto|High impact|Alto impacto
Impacto medio|Medium impact|Médio impacto
Impacto bajo|Low impact|Baixo impacto
Sesiones de mercado|Market sessions|Sessões de mercado
Abierto|Open|Aberto
Cerrado|Closed|Fechado
Londres|London|Londres
Nueva York|New York|Nova York
Tokio|Tokyo|Tóquio
Sídney|Sydney|Sydney
Tu centro de control diario, mercados, noticias y progreso.|Your daily hub for markets, news and progress.|Seu centro de controle diário, mercados, notícias e progresso.
Tu ejecución, tu historia.|Your execution, your story.|Sua execução, sua história.
Elegí tu cuenta. Conocé tus reglas.|Choose your account. Know your rules.|Escolha sua conta. Conheça suas regras.
Tu progreso convertido en resultados.|Your progress turned into results.|Seu progresso convertido em resultados.
Tu espacio. A tu manera.|Your space. Your way.|Seu espaço. Do seu jeito.
Personaliza tu identidad en JourFund.|Personalize your identity in JourFund.|Personalize sua identidade no JourFund.
Importes: USD|Amounts: USD|Valores: USD
La hora del servidor se configura en cada cuenta. Tus metas personales se ajustan desde Objetivos.|Set the server time in each account. Adjust personal goals in Goals.|Configure o horário do servidor em cada conta. Ajuste suas metas pessoais em Objetivos.
Eventos según tus monedas e impacto seleccionados.|Events based on your selected currencies and impact levels.|Eventos de acordo com suas moedas e níveis de impacto selecionados.
Abrir TradingView ↗|Open TradingView ↗|Abrir TradingView ↗
Pérdida diaria disponible|Daily loss allowance|Limite de perda diária disponível
Nombre guardado. Podrás cambiarlo de nuevo dentro de 30 días.|Name saved. You can change it again in 30 days.|Nome salvo. Você poderá alterá-lo novamente em 30 dias.
La sesión cambió.|Your session changed.|Sua sessão mudou.
Meta guardada para la cuenta activa.|Goal saved for the active account.|Meta salva para a conta ativa.
Operación guardada|Trade saved|Operação salva
Grupo guardado|Group saved|Grupo salvo
Metas guardadas|Goals saved|Metas salvas
Registros eliminados|Records deleted|Registros excluídos
Retiros guardados|Withdrawals saved|Saques salvos
Operación multicuentas guardada|Multi-account trade saved|Operação multicontas salva
Cargando…|Loading…|Carregando…
Sincronizando…|Syncing…|Sincronizando…
Comprobando conexión…|Checking connection…|Verificando conexão…
Guardado en este dispositivo. Sincronizando…|Saved on this device. Syncing…|Salvo neste dispositivo. Sincronizando…
Sincronizado.|Synced.|Sincronizado.
Fallida|Failed|Reprovada
Completada|Completed|Concluída
Límite diario|Daily limit|Limite diário
Objetivo alcanzado|Target reached|Meta alcançada
Cuenta quemada|Account breached|Conta violada
Cuenta y sincronización · JourFund v97|Account and sync · JourFund v97|Conta e sincronização · JourFund v97`;
const uppercase=new Map();
for(const row of rows.split('\n')){const [es,en,pt]=row.split('|');dictionary.set(es,{es,en,'pt-BR':pt});uppercase.set(es.toUpperCase(),es);}
let language='es',selected='es',editorUser=null,lastButton=null;
const sources=new WeakMap(), attributes=new WeakMap();
// These nodes contain user content, not application copy. Values and third-party embeds are never modified.
const protectedSelector='script,style,textarea,iframe,code,pre,[contenteditable],#ft59ProfileName,#ft59GreetingName,#ft94Name,#ft94Email,#ftCloudUser,#ft59DisplayName,#ft70Note,.ft70-nickname,.ft94-identity,.ft-account-choice strong,.day-trade-meta,.withdraw-date,.ft62-item strong,.ft62-item p,#ft64AlertList strong,[data-i18n-ignore]';
function translate(text){
 if(language==='es')return text;
 if(dictionary.has(text))return dictionary.get(text)[language];
 const sync=/^Sincronizado hace (\d+) (min|h|días?)$/.exec(text);
 if(sync)return language==='en'?'Synced '+sync[1]+' '+({min:'min',h:'h',día:'day',días:'days'}[sync[2]])+' ago':'Sincronizado há '+sync[1]+' '+sync[2];
 const count=/^(\d+) (operación|operaciones|cuenta|cuentas|día|días)( registrada| registradas)?$/.exec(text);
 if(count){const noun=language==='en'?{operación:'trade',operaciones:'trades',cuenta:'account',cuentas:'accounts',día:'day',días:'days'}:{operación:'operação',operaciones:'operações',cuenta:'conta',cuentas:'contas',día:'dia',días:'dias'};return count[1]+' '+noun[count[2]]+(count[3]?(language==='en'?' recorded':Number(count[1])===1?' registrada':' registradas'):'');}
 const upper=uppercase.get(text);if(upper)return dictionary.get(upper)[language].toUpperCase();
 return text;
}
function textNode(node){const p=node.parentElement;if(!p||p.closest(protectedSelector)||p.closest('td')&&!p.closest('button'))return;let item=sources.get(node);if(!item||node.nodeValue!==item.output)item={source:node.nodeValue};const trimmed=item.source.trim(),translated=translate(trimmed);item.output=item.source.replace(trimmed,translated);if(node.nodeValue!==item.output)node.nodeValue=item.output;sources.set(node,item);}
function scan(root){if(root.nodeType===3){textNode(root);return;}if(root.nodeType!==1||root.matches(protectedSelector)||root.closest(protectedSelector))return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode())textNode(n);for(const element of [root,...root.querySelectorAll('[placeholder],[aria-label],[title]')]){if(element.closest(protectedSelector))continue;let cache=attributes.get(element)||{};for(const attr of ['placeholder','aria-label','title']){if(!element.hasAttribute(attr))continue;const current=element.getAttribute(attr);let state=cache[attr];if(!state||current!==state.output)state={source:current};state.output=translate(state.source);if(current!==state.output)element.setAttribute(attr,state.output);cache[attr]=state;}attributes.set(element,cache);}}
const observer=new MutationObserver(records=>{observer.disconnect();for(const record of records){if(record.type==='characterData')scan(record.target);else if(record.type==='attributes')scan(record.target);else record.addedNodes.forEach(scan);}observe();});
function observe(){if(typeof document==='undefined'||!document.body)return;observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});}
function apply(code){language=supported.includes(code)?code:'es';document.documentElement.lang=language;observer.disconnect();scan(document.body);document.getElementById('jfLanguageCurrent').textContent=names[language];observe();window.dispatchEvent(new CustomEvent('jfLanguageChanged',{detail:{language}}));}
const preferences=document.getElementById('ft61ConfigureAccount')?.closest('section');if(!preferences)return;
const old=preferences.querySelector('p');if(old?.textContent.includes('Idioma:'))old.remove();
const button=document.createElement('button');button.type='button';button.id='jfLanguageButton';button.className='jf-language-row';button.innerHTML='<span aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/></svg></span><span><strong>Idioma de la aplicación</strong><small id="jfLanguageCurrent">Español</small></span><span aria-hidden="true">›</span>';preferences.querySelector('h3').after(button);
const dialog=document.createElement('dialog');dialog.id='jfLanguageDialog';dialog.className='jf-language-dialog';dialog.innerHTML='<form method="dialog"><header><h2>Cambiar idioma</h2><button type="button" class="jf-language-close" aria-label="Cerrar">×</button></header><p class="sub">Podés cambiarlo cuando quieras.</p><fieldset><legend class="jf-language-sr">Idioma de la aplicación</legend>'+supported.map(code=>'<label class="jf-language-option" data-code="'+code+'"><span data-i18n-ignore><strong>'+names[code]+'</strong><small>'+({es:'Spanish',en:'Inglés','pt-BR':'Portugués de Brasil'}[code])+'</small></span><input type="radio" name="language" value="'+code+'"></label>').join('')+'</fieldset><p class="sub" id="jfLanguageError" role="alert"></p><button type="submit" class="btn jf-language-apply">Aplicar idioma</button></form>';document.body.append(dialog);
function close(){dialog.close();lastButton?.focus();}
button.onclick=()=>{lastButton=button;editorUser=window.ftCloudSession?.user?.id||null;selected=language;dialog.querySelector('[value="'+selected+'"]').checked=true;dialog.querySelector('#jfLanguageError').textContent='';dialog.showModal();};dialog.querySelector('.jf-language-close').onclick=close;
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
dialog.addEventListener('change',e=>{if(e.target.name==='language')selected=e.target.value;});
dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const error=dialog.querySelector('#jfLanguageError');try{const user=window.ftCloudSession?.user?.id||null;if(user!==editorUser)throw Error('La sesión cambió.');if(user){const cloud=window.ftProtectionCloud,state=cloud.snapshot();const timestamp=new Date().toISOString();const candidate=state.accounts.map(a=>({...a,preferences:{...a.preferences,language:selected,languageChangedAt:timestamp}}));cloud.commit(candidate,state);}else{localStorage.setItem('jourfund_login_language',selected);}apply(selected);close();}catch(ex){error.textContent=translate(ex.message);}};
function refresh(){const user=window.ftCloudSession?.user?.id||null;if(dialog.open&&user!==editorUser)close();if(user){try{const state=window.ftProtectionCloud.snapshot();const preference=state.accounts.map(a=>a.preferences).filter(p=>supported.includes(p?.language)).sort((a,b)=>(Date.parse(b.languageChangedAt)||0)-(Date.parse(a.languageChangedAt)||0))[0];const next=preference?.language||'es';if(next!==language)apply(next);}catch{/* Data not ready: do not write or replace a pending preference. */}}else{let next='es';try{next=localStorage.getItem('jourfund_login_language')||'es';}catch{}if(next!==language)apply(next);}}
window.addEventListener('pagehide',()=>observer.disconnect());window.addEventListener('pageshow',observe);
window.JourFundI18n={t:translate,get language(){return language;},refresh};window.addEventListener('ft67SyncStatus',refresh);apply('es');refresh();
})();
