(function () {
  'use strict';
  // Presentation only. Never use this allowlist to authorize server actions.
  const owners = new Set(['bfacundo393@gmail.com', 'kueblerisaias@gmail.com']);
  const $ = id => document.getElementById(id);
  function isOwner(user) {
    return !!user?.id && typeof user.email === 'string' && owners.has(user.email.trim().toLowerCase());
  }
  function role(user) {
    if (!user?.id || typeof user.email !== 'string') return '';
    if (isOwner(user)) return 'owner';
    return user.app_metadata?.jourfund_badge === 'beta_tester' ? 'beta' : '';
  }
  function badge(id) {
    const node = document.createElement('span');
    node.id = id;
    node.className = 'ft81-owner-badge';
    node.setAttribute('data-i18n-ignore', '');
    node.hidden = true;
    node.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 20 6v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg><span>Propietario</span>';
    return node;
  }
  const header = badge('ft81HeaderOwner');
  $('ft59ProfileName')?.after(header);
  const identity = document.createElement('div');
  identity.id = 'ft81OwnerIdentity';
  identity.className = 'ft81-owner-identity';
  identity.hidden = true;
  const name = document.createElement('strong');
  name.id = 'ft81OwnerName';
  const profileBadge = badge('ft81ProfileOwner');
  const description = document.createElement('small');
  description.setAttribute('data-i18n-ignore', '');
  identity.append(name, profileBadge, description);
  document.querySelector('#ft59ProfileForm .ft61-profile-avatar')?.after(identity);
  const accountBadge = badge('ft81AccountOwner');
  $('ftCloudUser')?.after(accountBadge);
  function update() {
    const currentRole = document.body.classList.contains('ft-ready') ? role(window.ftCloudSession?.user) : '';
    const lang = window.JourFundI18n?.language || 'es';
    const label = currentRole === 'beta' ? ({es:'Tester beta',en:'Beta tester','pt-BR':'Testador beta'}[lang] || 'Tester beta') : ({es:'Propietario',en:'Owner','pt-BR':'Proprietário'}[lang] || 'Propietario');
    for (const node of [header, identity, profileBadge, accountBadge]) node.hidden = !currentRole;
    for (const node of [header, profileBadge, accountBadge]) {
      node.dataset.role = currentRole;
      const text = node.querySelector('span'); if (text && text.textContent !== label) text.textContent = label;
    }
    description.textContent = label + ' · JourFund';
    name.textContent = currentRole ? ($('ft59ProfileName')?.textContent || label) : '';
  }
  const previousRender = window.render;
  if (typeof previousRender === 'function') window.render = function () {
    const result = previousRender.apply(this, arguments);
    update();
    return result;
  };
  window.addEventListener('ft67SyncStatus', update);
  window.addEventListener('jfLanguageChanged', update);
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  if ($('ft59ProfileName')) new MutationObserver(update).observe($('ft59ProfileName'), { childList: true, characterData: true, subtree: true });
  update();
})();
