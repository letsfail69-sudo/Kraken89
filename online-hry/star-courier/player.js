/* Never handle tokens, saves or SDK messages in the Kraken89 wrapper. */
(() => {
  'use strict';
  const player = document.getElementById('player');
  const frame = document.getElementById('gameFrame');
  const launchScreen = document.getElementById('launchScreen');
  const startButton = document.getElementById('start');
  const fullscreenButton = document.getElementById('fullscreen');
  const status = document.getElementById('playerStatus');
  let started = false, expanded = false;
  function start() {
    if (started) return;
    started = true;
    frame.src = frame.dataset.src;
    frame.hidden = false;
    launchScreen.hidden = true;
    fullscreenButton.disabled = false;
    status.textContent = 'Hra je otevřená v tomto okně. Přihlášení najdeš přímo ve hře. Pokud se nezobrazí, použij „Otevřít samostatně“.';
    frame.focus({preventScroll: true});
  }
  function updateFullscreen() {
    fullscreenButton.textContent = document.fullscreenElement === player || expanded ? '↙ Zmenšit okno' : '⛶ Celá obrazovka';
    fullscreenButton.setAttribute('aria-pressed', String(document.fullscreenElement === player || expanded));
  }
  function expand(value) {
    expanded = value;
    player.classList.toggle('is-expanded', value);
    document.body.classList.toggle('player-expanded', value);
    updateFullscreen();
  }
  fullscreenButton.addEventListener('click', async () => {
    if (!started) return;
    if (expanded) { expand(false); return; }
    if (document.fullscreenElement === player) {
      try { await document.exitFullscreen(); } catch { status.textContent = 'Celou obrazovku ukonči klávesou Esc.'; }
      return;
    }
    if (player.requestFullscreen) {
      try { await player.requestFullscreen(); updateFullscreen(); return; } catch {}
    }
    // Use the same iframe, preserving its account and running game on unsupported browsers.
    expand(true);
  });
  document.addEventListener('fullscreenchange', updateFullscreen);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && expanded) expand(false); });
  startButton.addEventListener('click', start);
  updateFullscreen();
})();
