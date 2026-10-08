(function () {
  'use strict';
  const nav = document.querySelector('.mobile-nav');
  if (!nav) return;
  const mobile = window.matchMedia('(max-width: 700px)');
  const overflow = [
    ['ftPageWithdrawals', 'Retiros'],
    ['ftPageObjectives', 'Objetivos'],
    ['ftPageSettings', 'Ajustes']
  ];
  const originalButtons = [...nav.querySelectorAll('button[data-page]')];
  nav.classList.add('ft82-navigation');
  nav.setAttribute('aria-label', 'Navegación principal');
  for (const [page] of overflow) nav.querySelector('[data-page="' + page + '"]')?.classList.add('ft82-overflow-item');
  const more = document.createElement('button');
  more.id = 'ft82More';
  more.type = 'button';
  more.setAttribute('aria-label', 'Más secciones');
  more.setAttribute('aria-expanded', 'false');
  more.setAttribute('aria-controls', 'ft82Sheet');
  more.innerHTML = '<span aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></span>Más';
  nav.append(more);
  const overlay = document.createElement('div');
  overlay.id = 'ft82Overlay';
  overlay.hidden = true;
  overlay.innerHTML = '<div class="ft82-backdrop" aria-hidden="true"></div><section id="ft82Sheet" role="dialog" aria-modal="true" aria-labelledby="ft82SheetTitle"><div class="ft82-handle" aria-hidden="true"></div><header><h3 id="ft82SheetTitle">Más opciones</h3><button type="button" class="ft82-close" aria-label="Cerrar menú">×</button></header><div class="ft82-items"></div></section>';
  document.body.append(overlay);
  const sheetButtons = [];
  for (const [page, label] of overflow) {
    const item = document.createElement('button');
    item.type = 'button';
    item.dataset.ft82Page = page;
    const icon = nav.querySelector('[data-page="' + page + '"] span')?.innerHTML || '';
    item.innerHTML = '<span class="ft82-menu-icon" aria-hidden="true">' + icon + '</span><span>' + label + '</span><span class="ft82-chevron" aria-hidden="true">›</span>';
    item.onclick = () => { close(false); window.ftGo(page); };
    overlay.querySelector('.ft82-items').append(item);
    sheetButtons.push(item);
  }
  let opened = false;
  const inertState = new Map();
  function close(returnFocus = true) {
    if (!opened) return;
    opened = false;
    overlay.hidden = true;
    document.body.classList.remove('ft82-menu-open');
    more.setAttribute('aria-expanded', 'false');
    for (const [node, value] of inertState) node.inert = value;
    inertState.clear();
    if (returnFocus && mobile.matches && document.body.classList.contains('ft-ready')) more.focus({ preventScroll: true });
    update();
  }
  function open() {
    if (!mobile.matches || !document.body.classList.contains('ft-ready') || nav.inert || document.querySelector('dialog[open], .modal.show')) return;
    opened = true;
    overlay.hidden = false;
    more.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ft82-menu-open');
    for (const node of document.querySelectorAll('#ftPages, .top')) {
      inertState.set(node, node.inert);
      node.inert = true;
    }
    update();
    overlay.querySelector('.ft82-close').focus({ preventScroll: true });
  }
  more.onclick = () => opened ? close() : open();
  overlay.querySelector('.ft82-close').onclick = () => close();
  overlay.querySelector('.ft82-backdrop').onclick = () => close();
  function update() {
    const page = document.querySelector('.ft-page.active')?.id;
    const isOverflow = overflow.some(([id]) => id === page);
    more.classList.toggle('ft-nav-current', isOverflow || opened);
    more.classList.toggle('active', isOverflow || opened);
    for (const button of originalButtons) {
      if (button.dataset.page === page) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
    for (const item of sheetButtons) {
      if (item.dataset.ft82Page === page) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    }
    if (!mobile.matches || !document.body.classList.contains('ft-ready') || document.body.classList.contains('ft-dialog-open')) close(false);
  }
  const previousGo = window.ftGo;
  window.ftGo = function () {
    close(false);
    const result = previousGo.apply(this, arguments);
    update();
    return result;
  };
  document.addEventListener('keydown', event => {
    if (!opened) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll('button'), ...nav.querySelectorAll('button')].filter(b => !b.disabled && getComputedStyle(b).display !== 'none');
    const index = focusable.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); focusable.at(-1)?.focus(); }
    else if (!event.shiftKey && (index < 0 || index === focusable.length - 1)) { event.preventDefault(); focusable[0]?.focus(); }
  });
  function viewport() {
    const field = document.activeElement;
    const textField = field?.tagName === 'TEXTAREA' || (field?.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit', 'file'].includes(field.type));
    const keyboard = mobile.matches && textField && window.visualViewport && innerHeight - window.visualViewport.height > 140;
    document.body.classList.toggle('ft82-keyboard', !!keyboard);
    if (keyboard) close(false);
    const height = nav.getBoundingClientRect().height;
    if (mobile.matches && height > 0) document.documentElement.style.setProperty('--ft82-nav-height', height + 'px');
    update();
  }
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const pages = document.getElementById('ftPages');
  if (pages) new MutationObserver(update).observe(pages, { subtree: true, attributes: true, attributeFilter: ['class'] });
  if (window.ResizeObserver) new ResizeObserver(viewport).observe(nav);
  window.addEventListener('resize', viewport);
  window.addEventListener('popstate', () => { close(false); requestAnimationFrame(update); });
  window.addEventListener('ft67SyncStatus', update);
  mobile.addEventListener('change', viewport);
  window.visualViewport?.addEventListener('resize', viewport);
  document.addEventListener('focusin', viewport);
  document.addEventListener('focusout', () => requestAnimationFrame(viewport));
  viewport();
})();
