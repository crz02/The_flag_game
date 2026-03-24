// app.js — Entry point & event wiring

document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderHome();
  showScreen('screen-home');

  // ── Home Screen Events ──────────────────────────────────────────────────

  // Level card clicks
  document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
      const levelId = parseInt(card.dataset.level);
      if (!isLevelUnlocked(levelId)) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
        return;
      }
      startLevel(levelId);
    });
  });

  // Nav: Leaderboard
  document.getElementById('btn-leaderboard').addEventListener('click', () => {
    renderLeaderboard();
    showScreen('screen-leaderboard');
  });

  // ── Game Screen Events ──────────────────────────────────────────────────

  // Hint button
  document.getElementById('btn-hint').addEventListener('click', () => {
    useHint();
  });

  // Pause button
  document.getElementById('btn-pause').addEventListener('click', () => {
    pauseGame();
    document.getElementById('pause-overlay').style.display = 'flex';
  });

  // Resume from pause
  document.getElementById('btn-resume').addEventListener('click', () => {
    document.getElementById('pause-overlay').style.display = 'none';
    resumeGame();
  });

  // Quit game from pause
  document.getElementById('btn-quit-game').addEventListener('click', () => {
    clearTimer();
    document.getElementById('pause-overlay').style.display = 'none';
    renderHome();
    showScreen('screen-home');
  });

  // ── Result Screen Events ────────────────────────────────────────────────

  document.getElementById('btn-retry').addEventListener('click', (e) => {
    const levelId = parseInt(e.currentTarget.dataset.level);
    startLevel(levelId);
  });

  document.getElementById('btn-next-level').addEventListener('click', (e) => {
    const levelId = parseInt(e.currentTarget.dataset.level);
    startLevel(levelId);
  });

  document.getElementById('btn-back-home').addEventListener('click', () => {
    renderHome();
    showScreen('screen-home');
  });

  // ── Leaderboard Screen Events ───────────────────────────────────────────

  document.getElementById('btn-lb-back').addEventListener('click', () => {
    renderHome();
    showScreen('screen-home');
  });

  document.getElementById('btn-reset-progress').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      resetProgress();
      renderHome();
      renderLeaderboard();
      showScreen('screen-home');
    }
  });

  // ── Keyboard Shortcuts ──────────────────────────────────────────────────

  document.addEventListener('keydown', (e) => {
    const gameScreen = document.getElementById('screen-game');
    if (!gameScreen.classList.contains('active')) return;

    if (e.key === 'h' || e.key === 'H') useHint();
    if (e.key === 'Escape') {
      pauseGame();
      document.getElementById('pause-overlay').style.display = 'flex';
    }

    // Number keys 1-6 for quick answer selection
    const num = parseInt(e.key);
    if (num >= 1 && num <= 6) {
      const cards = document.querySelectorAll('.flag-card:not([disabled]):not(.eliminated)');
      if (cards[num - 1]) cards[num - 1].click();
    }
  });
});
