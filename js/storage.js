// storage.js — LocalStorage helpers

const STORAGE_KEY = 'flaggame_progress';

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw);
  } catch {
    return getDefaultProgress();
  }
}

function getDefaultProgress() {
  return {
    levels: {
      1: { stars: 0, highScore: 0, played: 0 },
      2: { stars: 0, highScore: 0, played: 0 },
      3: { stars: 0, highScore: 0, played: 0 },
      4: { stars: 0, highScore: 0, played: 0 },
      5: { stars: 0, highScore: 0, played: 0 },
    },
    totalStars: 0,
    totalGamesPlayed: 0,
  };
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getLevelData(levelId) {
  return getProgress().levels[levelId] || { stars: 0, highScore: 0, played: 0 };
}

function saveLevelResult(levelId, stars, score) {
  const progress = getProgress();
  const current = progress.levels[levelId];

  const isNewHighScore = score > current.highScore;
  const isNewStarRecord = stars > current.stars;

  progress.levels[levelId] = {
    stars: Math.max(current.stars, stars),
    highScore: Math.max(current.highScore, score),
    played: current.played + 1,
  };

  // Recalculate total stars
  progress.totalStars = Object.values(progress.levels).reduce((acc, l) => acc + l.stars, 0);
  progress.totalGamesPlayed = (progress.totalGamesPlayed || 0) + 1;

  saveProgress(progress);
  return { isNewHighScore, isNewStarRecord };
}

function getTotalStars() {
  return getProgress().totalStars;
}

function isLevelUnlocked(levelId) {
  if (levelId === 1) return true;
  const config = LEVEL_CONFIG[levelId];
  return getTotalStars() >= config.starsNeeded;
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
