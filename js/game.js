// game.js — Core Game Engine

const GameState = {
  lives: 3,
  score: 0,
  streak: 0,
  hintsLeft: 3,
  currentLevel: null,
  questionPool: [],
  currentQuestion: null,
  currentQuestionIndex: 0,
  answeredCorrect: 0,
  answeredTotal: 0,
  timerInterval: null,
  timerRemaining: 0,
  isPaused: false,
  eliminatedCodes: [], // codes removed by hint
};

function startLevel(levelId) {
  const config = LEVEL_CONFIG[levelId];
  const pool = getCountriesForLevel(config.countries);

  // Reset state
  GameState.lives = 3;
  GameState.score = 0;
  GameState.streak = 0;
  GameState.hintsLeft = 3;
  GameState.currentLevel = levelId;
  GameState.currentQuestionIndex = 0;
  GameState.answeredCorrect = 0;
  GameState.answeredTotal = 0;
  GameState.isPaused = false;

  // Shuffle and take QUESTIONS_PER_ROUND countries
  GameState.questionPool = pool.sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND);

  showScreen('screen-game');
  renderHUD();
  nextQuestion();
}

function nextQuestion() {
  if (GameState.lives <= 0 || GameState.currentQuestionIndex >= QUESTIONS_PER_ROUND) {
    endRound();
    return;
  }

  GameState.eliminatedCodes = [];
  const config = LEVEL_CONFIG[GameState.currentLevel];
  const country = GameState.questionPool[GameState.currentQuestionIndex];
  const pool = getCountriesForLevel(config.countries);
  const distractors = getRandomCountries(country, pool, config.choices - 1);
  const options = [country, ...distractors].sort(() => Math.random() - 0.5);

  GameState.currentQuestion = { country, options };

  renderQuestion(country, options);
  renderHUD();

  // Start timer if applicable
  clearTimer();
  if (config.timerSec > 0) {
    startTimer(config.timerSec);
  }
}

function submitAnswer(selectedCode) {
  if (!GameState.currentQuestion) return;

  clearTimer();

  const correct = GameState.currentQuestion.country.code;
  const isCorrect = selectedCode === correct;

  GameState.answeredTotal++;
  GameState.currentQuestionIndex++;

  if (isCorrect) {
    GameState.answeredCorrect++;
    GameState.streak++;
    const bonus = getStreakBonus(GameState.streak);
    const points = Math.round(10 * bonus);
    GameState.score += points;
    renderAnswerFeedback(selectedCode, correct, true, points);
  } else {
    GameState.streak = 0;
    GameState.lives--;
    renderAnswerFeedback(selectedCode, correct, false, 0);
  }

  renderHUD();

  setTimeout(() => {
    if (GameState.lives <= 0) {
      endRound();
    } else {
      nextQuestion();
    }
  }, 1200);
}

function getStreakBonus(streak) {
  if (streak >= 10) return 3.0;
  if (streak >= 5)  return 2.0;
  if (streak >= 3)  return 1.5;
  return 1.0;
}

function useHint() {
  if (GameState.hintsLeft <= 0 || !GameState.currentQuestion) return;

  const { country, options } = GameState.currentQuestion;
  const wrongs = options.filter(o =>
    o.code !== country.code && !GameState.eliminatedCodes.includes(o.code)
  );

  if (wrongs.length === 0) return;

  const toEliminate = wrongs[Math.floor(Math.random() * wrongs.length)];
  GameState.eliminatedCodes.push(toEliminate.code);
  GameState.hintsLeft--;

  eliminateFlagCard(toEliminate.code);
  renderHUD();
}

function startTimer(seconds) {
  GameState.timerRemaining = seconds;
  updateTimerBar(seconds, seconds);

  GameState.timerInterval = setInterval(() => {
    GameState.timerRemaining--;
    updateTimerBar(GameState.timerRemaining, seconds);

    if (GameState.timerRemaining <= 0) {
      clearTimer();
      // Time's up — treat as wrong answer (no life lost, just move on)
      GameState.streak = 0;
      GameState.lives--;
      GameState.currentQuestionIndex++;
      GameState.answeredTotal++;
      renderTimeUp();
      renderHUD();
      setTimeout(() => {
        if (GameState.lives <= 0) {
          endRound();
        } else {
          nextQuestion();
        }
      }, 1000);
    }
  }, 1000);
}

function clearTimer() {
  if (GameState.timerInterval) {
    clearInterval(GameState.timerInterval);
    GameState.timerInterval = null;
  }
}

function endRound() {
  clearTimer();

  const total = QUESTIONS_PER_ROUND;
  const correct = GameState.answeredCorrect;
  const pct = correct / total;

  let stars = 0;
  if (pct >= 0.9) stars = 3;
  else if (pct >= 0.75) stars = 2;
  else if (pct >= 0.5) stars = 1;

  const result = saveLevelResult(GameState.currentLevel, stars, GameState.score);

  renderResult({
    levelId: GameState.currentLevel,
    score: GameState.score,
    stars,
    correct,
    total,
    isNewHighScore: result.isNewHighScore,
    isNewStarRecord: result.isNewStarRecord,
  });

  showScreen('screen-result');
}

function pauseGame() {
  if (GameState.isPaused) return;
  GameState.isPaused = true;
  clearTimer();
}

function resumeGame() {
  if (!GameState.isPaused) return;
  GameState.isPaused = false;
  const config = LEVEL_CONFIG[GameState.currentLevel];
  if (config.timerSec > 0 && GameState.timerRemaining > 0) {
    startTimer(GameState.timerRemaining);
  }
}
