/* CCivics in-page preview panel. */
CCivics.panel = (() => {
  let host;
  const defaults = { language: 'ca', theme: 'system' };
  const settings = async () => ({ ...defaults, ...(await chrome.storage.sync.get(CCivics.config.storageKey))[CCivics.config.storageKey] });
  const format = (event, kind) => {
    const date = kind === 'registration' ? event.registrationDate : event.eventDate;
    const start = kind === 'registration' ? event.registrationTime : event.startTime;
    const end = kind === 'event' ? event.endTime : null;
    return [date, start && (end ? `${start}–${end}` : start)].filter(Boolean).join(' · ');
  };
  const close = () => { host?.remove(); host = null; };
  const open = async () => {
    close(); const userSettings = await settings(); const t = (key, values) => CCivics.t(userSettings, key, values);
    host = document.createElement('div'); host.id = 'ccivics-host'; host.dataset.theme = userSettings.theme;
    const events = CCivics.extractor.detect(); const root = host.attachShadow({ mode: 'open' });
    const render = () => {
      const selected = [...root.querySelectorAll('input[type=checkbox]:checked')].length;
      root.querySelector('[data-selected]').textContent = t('selected', { count: selected });
    };
    const item = (event, index) => {
      const facts = [
        (event.registrationDate || event.registrationTime) && `<div><b>${t('registration')}:</b> ${escape(format(event, 'registration'))}</div>`,
        (event.eventDate || event.startTime) && `<div><b>${t('event')}:</b> ${escape(format(event, 'event'))}</div>`,
        event.venue && `<div><b>${t('venue')}:</b> ${escape(event.venue)}</div>`
      ].filter(Boolean).join('');
      return `<li class="event"><label><input type="checkbox" checked data-event="${index}"><span class="event-title">${escape(event.title)}</span></label><div class="facts">${facts}</div><details><summary>${t('details')}</summary><dl>${detail(t('address'), event.address)}${detail(t('price'), event.price)}${detail(t('sessions'), event.sessions)}<dt>${t('description')}</dt><dd>${escape(event.description)}</dd></dl></details></li>`;
    };
      root.innerHTML = `<link rel="stylesheet" href="${chrome.runtime.getURL('src/content.css')}"><section class="panel" role="dialog" aria-label="CCivics"><header><strong>${t('name')}</strong><button class="close" aria-label="Close">×</button></header><div class="summary">${events.length ? `${t('found', { count: events.length })} · <span data-selected>${t('selected', { count: events.length })}</span>` : t('noActivities')}</div>${events.length ? `<div class="actions"><button data-select="all">${t('selectAll')}</button><button data-select="none">${t('deselectAll')}</button></div><ol>${events.map(item).join('')}</ol>` : ''}</section>`;
      root.querySelector('.close').onclick = close;
      root.querySelectorAll('input').forEach(input => input.onchange = render);
      root.querySelector('[data-select="all"]')?.addEventListener('click', () => { root.querySelectorAll('input').forEach(input => input.checked = true); render(); });
      root.querySelector('[data-select="none"]')?.addEventListener('click', () => { root.querySelectorAll('input').forEach(input => input.checked = false); render(); });
    document.documentElement.append(host); if (events.length) render();
  };
  const escape = text => CCivics.normalize.clean(String(text || '')).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const detail = (label, value) => value ? `<dt>${label}</dt><dd>${escape(value)}</dd>` : '';
  return { open, close };
})();
