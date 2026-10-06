(() => {
  'use strict';
  const folder = new URL('.', document.currentScript.src);
  const repository = 'https://github.com/letsfail69-sudo/Kraken89';
  let currentVersion = '1.3.4', currentTag = '1.3.4', entries = [], filter = 'all';
  let releasePage = 'https://www.heyfolk.eu/application.php', releaseNotes = '';
  const heyfolkFeed = 'https://www.heyfolk.eu/api/updates.php';
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
    if (releaseNotes && !entries.some(entry => entry.Version === currentVersion)) {
      entries.unshift({ Version: currentVersion, Status: 'released', Title: 'Publikované vydání z Heyfolk', Changes: [releaseNotes] });
      entries.sort((a, b) => compare(b.Version, a.Version));
    }
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
        const link = node('a', active ? 'Podrobnosti a stažení →' : 'Vydání na GitHubu →'); link.href = active ? releasePage : repository + '/releases/tag/' + (entry.Tag || entry.Version); article.append(link);
        if (active && releaseNotes) { const notes = node('p', releaseNotes); notes.style.whiteSpace = 'pre-line'; article.append(notes); }
      }
      fragment.append(article);
    }
    if (!visible) fragment.append(node('p', 'V této kategorii zatím není žádná verze.', 'app-empty'));
    host.replaceChildren(fragment);
  }
  function validateRelease(data, heyfolk) {
    if (!data || data.SchemaVersion !== 1 || !/^\d+\.\d+\.\d+(?:\.\d+)?$/.test(data.Version) || !/^[a-f\d]{64}$/i.test(data.InstallerSha256 || '') || !Number.isSafeInteger(data.InstallerBytes) || data.InstallerBytes <= 0) throw new Error('Invalid release');
    if (heyfolk) {
      const installer = new URL(data.InstallerUrl), page = new URL(data.PageUrl);
      if (installer.origin !== 'https://www.heyfolk.eu' || installer.pathname !== '/download.php' || installer.username || installer.password || installer.hash || !/^[1-9]\d*$/.test(installer.searchParams.get('release') || '') || installer.searchParams.get('asset') !== 'setup' || [...installer.searchParams.keys()].length !== 2 || page.origin !== installer.origin || page.pathname !== '/application.php' || page.search || page.hash || page.username || page.password) throw new Error('Unexpected Heyfolk URL');
    } else if (![data.Version, 'v' + data.Version].some(tag => data.InstallerUrl === repository + '/releases/download/' + tag + '/Prekladac_Her_Setup.exe')) throw new Error('Unexpected GitHub URL');
  }
  async function loadRelease() {
    try {
      let data, source;
      try { data = await readJson(heyfolkFeed); validateRelease(data, true); source = 'heyfolk'; }
      catch { data = await readJson(new URL('../prekladac-her/aktualizace.json', folder)); validateRelease(data, false); source = 'fallback'; }
      if (data.SchemaVersion !== 1 || !/^\d+\.\d+\.\d+(?:\.\d+)?$/.test(data.Version) || !/^[a-f\d]{64}$/i.test(data.InstallerSha256 || '') || !Number.isSafeInteger(data.InstallerBytes) || data.InstallerBytes <= 0) throw new Error('Invalid release');
      const files = { setup: 'Prekladac_Her_Setup.exe', zip: 'Prekladac_Her_Instalator.zip', portable: 'Prekladac_Her_Portable.zip' };
      let links;
      if (source === 'heyfolk') {
        const installer = new URL(data.InstallerUrl);
        links = Object.fromEntries(Object.keys(files).map(asset => {
          const download = new URL(installer); download.searchParams.set('asset', asset); return [asset, download.href];
        }));
        releasePage = data.PageUrl;
      } else {
        currentTag = data.InstallerUrl.split('/').slice(-2)[0];
        const base = repository + '/releases/download/' + currentTag + '/';
        links = Object.fromEntries(Object.entries(files).map(([asset, name]) => [asset, base + name]));
        releasePage = repository + '/releases/tag/' + currentTag;
      }
      releaseNotes = typeof data.Notes === 'string' ? data.Notes.split(/^##\s+(?:Instalace|Ověření)/m)[0].replace(/^#{1,6}\s+/gm, '').replace(/\*\*/g, '').replace(/`/g, '').trim() : '';
      currentVersion = data.Version;
      document.querySelectorAll('[data-current-version]').forEach(el => { el.textContent = data.Version; });
      document.querySelectorAll('[data-download]').forEach(el => { if (links[el.dataset.download]) el.href = links[el.dataset.download]; });
      document.querySelectorAll('[data-release-page]').forEach(el => { el.href = releasePage; el.textContent = source === 'heyfolk' ? 'Vydání na Heyfolk' : 'Vydání na GitHubu'; });
      document.querySelectorAll('[data-release-status]').forEach(el => { el.textContent = source === 'heyfolk' ? 'Aktuální publikované vydání z centra Heyfolk.' : 'Heyfolk se nepodařilo načíst. Zobrazuje se záložní vydání; nemusí být nejnovější.'; });
      document.querySelectorAll('[data-current-notes]').forEach(el => { el.textContent = releaseNotes ? (releaseNotes.split(/\n\s*\n/).find(part => part.trim() && !part.includes('co je nového')) || releaseNotes).slice(0, 600) : 'Podrobnosti o změnách najdeš v historii verzí.'; });
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
