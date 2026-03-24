import { useState, useEffect } from 'react';

const STORAGE_KEY = 'flagquest_player';

const INITIAL_PLAYER = {
  id: 'guest',
  displayName: 'Guest Player',
  email: '',
  avatar: '👤',
  createdAt: Date.now(),
  stats: {
    totalStars: 0,
    totalGamesPlayed: 0,
    levelData: {
      1: { stars: 0, highScore: 0, played: 0 },
      2: { stars: 0, highScore: 0, played: 0 },
      3: { stars: 0, highScore: 0, played: 0 },
      4: { stars: 0, highScore: 0, played: 0 },
      5: { stars: 0, highScore: 0, played: 0 },
    }
  }
};

export function usePlayer() {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PLAYER;
      }
    }
    return INITIAL_PLAYER;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  const updateLevelStats = (levelId, score, stars) => {
    setPlayer(prev => {
      const currentLevelData = prev.stats.levelData[levelId] || { stars: 0, highScore: 0, played: 0 };
      
      const newLevelData = {
        ...currentLevelData,
        highScore: Math.max(currentLevelData.highScore, score),
        stars: Math.max(currentLevelData.stars, stars),
        played: currentLevelData.played + 1,
        lastPlayed: Date.now()
      };

      const allLevelData = { ...prev.stats.levelData, [levelId]: newLevelData };
      const totalStars = Object.values(allLevelData).reduce((sum, d) => sum + d.stars, 0);

      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalStars,
          totalGamesPlayed: prev.stats.totalGamesPlayed + 1,
          levelData: allLevelData
        }
      };
    });
  };

  const resetProgress = () => {
    setPlayer(INITIAL_PLAYER);
  };

  return {
    player,
    updateLevelStats,
    resetProgress,
    totalStars: player.stats.totalStars
  };
}
