(() => {
  'use strict';
  const folder = new URL('.', document.currentScript.src);
  const repository = 'https://github.com/letsfail69-sudo/Kraken89';
  let currentVersion = '1.3.3', currentTag = '1.3.3', entries = [], filter = 'all';
  async function readJson(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(url, { cache: 'no-store', credentials: 'omit', signal: controller.signal });
      if (!response.ok) throw new Error('Data unavailable');
      return await response.json();
    } finally { clearTimeout(timeout); }
  }
  function compare(a, b) {
    const x = a.split('.').map(Number), y = b.split('.').map(Number);
    for (let n = 0; n < Math.max(x.length, y.length); n++) if ((x[n] || 0) !== (y[n] || 0)) return (x[n] || 0) - (y[n] || 0);
    return 0;
  }
  function node(tag, text, className) {
    const value = document.createElement(tag);
    if (text) value.textContent = text;
    if (className) value.className = className;
    return value;
  }
  function renderHistory() {
    const host = document.querySelector('[data-version-history]');
    if (!host || !entries.length) return;
    const fragment = document.createDocumentFragment();
    let visible = 0;
    for (const entry of entries) {
      const released = entry.Status !== 'prepared' || entry.Version === currentVersion;
      const active = entry.Version === currentVersion;
      const article = node('article', '', 'app-version' + (active ? ' current' : ''));
      article.id = 'verze-' + entry.Version.replaceAll('.', '-');
      article.hidden = filter === 'released' ? !released : filter === 'prepared' ? released : false;
      if (!article.hidden) visible++;
      const header = node('header');
      const label = active ? 'Aktuální vydání' : !released ? 'Připraveno' : entry.Status === 'archive' ? 'Starší verze' : 'Vydáno';
      header.append(node('h2', 'Verze ' + entry.Version), node('span', label, 'app-chip' + (active || !released ? ' accent' : '')));
      if (entry.Date) {
        const date = node('time', new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(entry.Date + 'T12:00:00Z')));
        date.dateTime = entry.Date; header.append(date);
      }
      article.append(header, node('h3', entry.Title));
      const list = node('ul'); entry.Changes.forEach(text => list.append(node('li', text))); article.append(list);
      if (!released) article.append(node('p', 'Vydání je připravené k testování. Stažení se zpřístupní po zveřejnění.', 'app-small'));
      else if (active || entry.Status !== 'archive') {
        const link = node('a', 'Vydání na GitHubu →'); link.href = repository + '/releases/tag/' + (active ? currentTag : entry.Tag || entry.Version); article.append(link);
      }
      fragment.append(article);
    }
    if (!visible) fragment.append(node('p', 'V této kategorii zatím není žádná verze.', 'app-empty'));
    host.replaceChildren(fragment);
  }
  async function loadRelease() {
    try {
      const data = await readJson(new URL('../prekladac-her/aktualizace.json', folder));
      if (data.SchemaVersion !== 1 || !/^\d+\.\d+\.\d+(?:\.\d+)?$/.test(data.Version) || !/^[a-f\d]{64}$/i.test(data.InstallerSha256 || '') || !Number.isSafeInteger(data.InstallerBytes) || data.InstallerBytes <= 0) throw new Error('Invalid release');
      const candidates = [data.Version, 'v' + data.Version];
      const tag = candidates.find(value => data.InstallerUrl === repository + '/releases/download/' + value + '/Prekladac_Her_Setup.exe');
      if (!tag) throw new Error('Unexpected download URL');
      const base = repository + '/releases/download/' + tag + '/';
      currentTag = tag;
      currentVersion = data.Version;
      document.querySelectorAll('[data-current-version]').forEach(el => { el.textContent = data.Version; });
      const files = { setup: 'Prekladac_Her_Setup.exe', zip: 'Prekladac_Her_Instalator.zip', portable: 'Prekladac_Her_Portable.zip' };
      document.querySelectorAll('[data-download]').forEach(el => { if (files[el.dataset.download]) el.href = base + files[el.dataset.download]; });
      document.querySelectorAll('[data-release-page]').forEach(el => { el.href = repository + '/releases/tag/' + currentTag; });
      document.querySelectorAll('[data-current-notes]').forEach(el => { el.textContent = typeof data.Notes === 'string' && data.Notes.trim() ? data.Notes.slice(0, 600) : 'Podrobnosti o změnách najdeš v historii verzí.'; });
      document.querySelectorAll('[data-setup-sha256]').forEach(el => { el.textContent = data.InstallerSha256.toLowerCase(); });
      document.querySelectorAll('[data-setup-size]').forEach(el => { el.textContent = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 1 }).format(data.InstallerBytes / 1048576) + ' MB'; });
      if (compare(data.Version, '1.3.2') >= 0) document.querySelectorAll('[data-compatibility-note]').forEach(el => { el.textContent = 'Od verze 1.3.2 se navíc zobrazují údaje o verzi a funkčnosti češtiny, pokud je zdrojový web uvádí. Shodu s nainstalovanou verzí hry aplikace automaticky nezaručuje.'; });
      const ready134 = compare(data.Version, '1.3.4') >= 0;
      document.querySelectorAll('[data-version-134-heading]').forEach(el => { el.textContent = ready134 ? 'Novinky ve verzi 1.3.4' : 'Připraveno ve verzi 1.3.4'; });
      document.querySelectorAll('[data-pending-134]').forEach(el => { el.hidden = ready134; });
      renderHistory();
    } catch { document.querySelectorAll('[data-release-status]').forEach(el => { el.textContent = 'Nejnovější vydání se nepodařilo ověřit. Dostupné verze najdeš na GitHubu.'; }); }
  }
  async function loadHistory() {
    if (!document.querySelector('[data-version-history]')) return;
    try {
      const data = await readJson(new URL('prekladac-her/historie.json', folder));
      if (data.SchemaVersion !== 1 || !Array.isArray(data.Versions) || !data.Versions.length) throw new Error('Invalid history');
      const versions = data.Versions.slice(0, 100).filter(entry => /^\d+\.\d+\.\d+(?:\.\d+)?$/.test(entry.Version) && ['prepared', 'released', 'archive'].includes(entry.Status) && typeof entry.Title === 'string' && Array.isArray(entry.Changes) && entry.Changes.every(text => typeof text === 'string') && (!entry.Date || /^\d{4}-\d{2}-\d{2}$/.test(entry.Date) && !Number.isNaN(Date.parse(entry.Date + 'T12:00:00Z'))));
      if (!versions.length || new Set(versions.map(entry => entry.Version)).size !== versions.length) throw new Error('Invalid history entries');
      entries = versions.sort((a, b) => compare(b.Version, a.Version)); renderHistory();
      const controls = document.querySelector('[data-history-filters]');
      if (controls) {
        controls.hidden = false;
        controls.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
          filter = button.dataset.historyFilter;
          controls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button))); renderHistory();
        }));
      }
    } catch { /* Keep the readable static HTML history. */ }
  }
  document.addEventListener('DOMContentLoaded', () => { loadRelease(); loadHistory(); });
})();
