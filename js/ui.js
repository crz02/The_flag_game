// ui.js — DOM Rendering & Animations

// ── Screen Routing ─────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  const target = document.getElementById(id);
  target.classList.remove('hidden');
  requestAnimationFrame(() => target.classList.add('active'));
}

// ── Home Screen ────────────────────────────────────────────────────────────

function renderHome() {
  const progress = getProgress();
  const totalStars = progress.totalStars;

  // Update global star count
  document.getElementById('total-stars').textContent = totalStars;

  // Render each level card
  LEVEL_CONFIG.slice(1).forEach(config => {
    const unlocked = isLevelUnlocked(config.id);
    const levelData = progress.levels[config.id];
    const card = document.getElementById(`level-card-${config.id}`);
    if (!card) return;

    const starsEl = card.querySelector('.card-stars');
    const lockEl = card.querySelector('.lock-overlay');
    const scoreEl = card.querySelector('.card-score');
    const neededEl = card.querySelector('.stars-needed');

    // Stars display
    starsEl.innerHTML = [1, 2, 3].map(i =>
      `<span class="star ${i <= levelData.stars ? 'filled' : ''}" aria-label="${i <= levelData.stars ? 'filled star' : 'empty star'}">★</span>`
    ).join('');

    // High score
    scoreEl.textContent = levelData.highScore > 0 ? `Best: ${levelData.highScore}` : 'Not played';

    // Lock state
    if (unlocked) {
      card.classList.remove('locked');
      lockEl.style.display = 'none';
      neededEl.style.display = 'none';
    } else {
      card.classList.add('locked');
      lockEl.style.display = 'flex';
      neededEl.textContent = `Need ${config.starsNeeded} ⭐ to unlock`;
      neededEl.style.display = 'block';
    }
  });
}

// ── Game Screen ────────────────────────────────────────────────────────────

function renderQuestion(country, options) {
  const questionEl = document.getElementById('question-country');
  const choicesEl = document.getElementById('choices-grid');

  questionEl.textContent = country.name;
  questionEl.style.animation = 'none';
  requestAnimationFrame(() => { questionEl.style.animation = 'slideInDown 0.4s ease'; });

  const config = LEVEL_CONFIG[GameState.currentLevel];
  choicesEl.className = `choices-grid cols-${config.choices === 6 ? '3' : '2'}`;
  choicesEl.innerHTML = '';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'flag-card';
    btn.dataset.code = opt.code;
    btn.setAttribute('aria-label', `Flag of ${opt.name}`);
    btn.innerHTML = `<span class="flag-emoji">${opt.emoji}</span>`;
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      // Disable all cards on click
      choicesEl.querySelectorAll('.flag-card').forEach(c => c.disabled = true);
      submitAnswer(opt.code);
    });
    choicesEl.appendChild(btn);
  });

  // Progress indicator
  document.getElementById('question-progress').textContent =
    `${GameState.currentQuestionIndex + 1} / ${QUESTIONS_PER_ROUND}`;
  document.getElementById('progress-fill').style.width =
    `${((GameState.currentQuestionIndex) / QUESTIONS_PER_ROUND) * 100}%`;
}

function renderAnswerFeedback(selectedCode, correctCode, isCorrect, points) {
  const cards = document.querySelectorAll('.flag-card');

  cards.forEach(card => {
    const code = card.dataset.code;
    if (code === correctCode) {
      card.classList.add('correct');
    } else if (code === selectedCode && !isCorrect) {
      card.classList.add('wrong');
    }
  });

  // Points popup
  if (points > 0) {
    const pointsEl = document.getElementById('points-popup');
    const bonus = getStreakBonus(GameState.streak);
    pointsEl.textContent = bonus > 1 ? `+${points} 🔥 ×${bonus}` : `+${points}`;
    pointsEl.classList.add('show');
    setTimeout(() => pointsEl.classList.remove('show'), 1100);
  }
}

function renderHUD() {
  document.getElementById('hud-score').textContent = GameState.score;
  document.getElementById('hud-streak').textContent = `🔥 ${GameState.streak}`;

  // Render hint pips (filled/empty circles)
  const pipsEl = document.getElementById('hud-hint-pips');
  if (pipsEl) {
    pipsEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const pip = document.createElement('span');
      pip.className = `hint-pip ${i < GameState.hintsLeft ? 'available' : 'used'}`;
      pipsEl.appendChild(pip);
    }
  }

  const hintBtn = document.getElementById('btn-hint');
  if (hintBtn) {
    hintBtn.style.opacity = GameState.hintsLeft === 0 ? '0.35' : '1';
    hintBtn.disabled = GameState.hintsLeft === 0;
  }

  // Lives
  const livesEl = document.getElementById('hud-lives');
  livesEl.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('span');
    heart.className = `life ${i < GameState.lives ? 'alive' : 'lost'}`;
    heart.textContent = '❤️';
    livesEl.appendChild(heart);
  }

  // Streak glow
  const streakEl = document.getElementById('hud-streak');
  streakEl.className = 'hud-streak';
  if (GameState.streak >= 10) streakEl.classList.add('legendary');
  else if (GameState.streak >= 5) streakEl.classList.add('hot');
  else if (GameState.streak >= 3) streakEl.classList.add('warm');
}

function eliminateFlagCard(code) {
  const card = document.querySelector(`.flag-card[data-code="${code}"]`);
  if (card) {
    card.classList.add('eliminated');
    card.disabled = true;
  }
}

function updateTimerBar(remaining, total) {
  const bar = document.getElementById('timer-bar-fill');
  const label = document.getElementById('timer-label');
  if (!bar) return;

  const pct = (remaining / total) * 100;
  bar.style.width = `${pct}%`;
  bar.className = 'timer-bar-fill';
  if (remaining <= 5) bar.classList.add('danger');
  else if (remaining <= 10) bar.classList.add('warning');

  if (label) label.textContent = remaining > 0 ? `${remaining}s` : '';
}

function renderTimeUp() {
  const questionEl = document.getElementById('question-country');
  questionEl.textContent = '⏰ Time\'s Up!';
  document.querySelectorAll('.flag-card').forEach(c => c.disabled = true);
}

// ── Result Screen ──────────────────────────────────────────────────────────

function renderResult(data) {
  const { levelId, score, stars, correct, total, isNewHighScore } = data;
  const config = LEVEL_CONFIG[levelId];

  document.getElementById('result-level-name').textContent = `Level ${levelId}: ${config.name}`;
  document.getElementById('result-score').textContent = score;
  document.getElementById('result-correct').textContent = `${correct} / ${total} correct`;

  if (isNewHighScore) {
    document.getElementById('result-new-record').style.display = 'block';
  } else {
    document.getElementById('result-new-record').style.display = 'none';
  }

  // Animate stars
  const starsContainer = document.getElementById('result-stars');
  starsContainer.innerHTML = '';
  [1, 2, 3].forEach((i, idx) => {
    const s = document.createElement('span');
    s.className = `result-star ${i <= stars ? 'earned' : 'empty'}`;
    s.textContent = '★';
    s.style.animationDelay = `${idx * 0.25}s`;
    starsContainer.appendChild(s);
  });

  // Check if next level unlocked
  const nextLevelId = levelId + 1;
  const unlockNotice = document.getElementById('unlock-notice');
  if (nextLevelId <= 5 && isLevelUnlocked(nextLevelId)) {
    const wasLocked = !isLevelUnlocked(nextLevelId - 1) || data.isNewStarRecord;
    unlockNotice.textContent = `🎉 Level ${nextLevelId}: ${LEVEL_CONFIG[nextLevelId].name} unlocked!`;
    unlockNotice.style.display = 'block';
  } else {
    unlockNotice.style.display = 'none';
  }

  // Next level button
  const nextBtn = document.getElementById('btn-next-level');
  if (nextLevelId <= 5 && isLevelUnlocked(nextLevelId)) {
    nextBtn.style.display = 'inline-flex';
    nextBtn.dataset.level = nextLevelId;
  } else {
    nextBtn.style.display = 'none';
  }

  // Retry button
  document.getElementById('btn-retry').dataset.level = levelId;
}

// ── Leaderboard Screen ─────────────────────────────────────────────────────

function renderLeaderboard() {
  const progress = getProgress();
  const tbody = document.getElementById('leaderboard-tbody');
  tbody.innerHTML = '';

  LEVEL_CONFIG.slice(1).forEach(config => {
    const data = progress.levels[config.id];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${config.emoji} ${config.name}</td>
      <td>${data.highScore || '-'}</td>
      <td>${'★'.repeat(data.stars)}${'☆'.repeat(3 - data.stars)}</td>
      <td>${data.played || 0}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('lb-total-stars').textContent = progress.totalStars;
  document.getElementById('lb-total-games').textContent = progress.totalGamesPlayed || 0;
}
