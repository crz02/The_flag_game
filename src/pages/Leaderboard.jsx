import { motion } from 'framer-motion';
import { LEVEL_CONFIG } from '../data/countries';

export default function Leaderboard({ player }) {
  const levels = LEVEL_CONFIG.slice(1);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="page-wrap lb-wrap"
    >
      <h2 className="lb-title">📊 Leaderboard</h2>
      
      <div className="lb-summary">
        <div className="lb-stat">
          <div className="lb-stat-val">{player.stats.totalStars}</div>
          <div className="lb-stat-label">Total Stars</div>
        </div>
        <div className="lb-stat">
          <div className="lb-stat-val">{player.stats.totalGamesPlayed}</div>
          <div className="lb-stat-label">Games Played</div>
        </div>
      </div>

      <div className="lb-table-container">
        <table className="lb-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Best Score</th>
              <th>Stars</th>
              <th>Played</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level, idx) => {
              const data = player.stats.levelData[level.id];
              return (
                <motion.tr 
                  key={level.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td>
                    <span className="lb-level-emoji">{level.emoji}</span>
                    {level.name}
                  </td>
                  <td className="lb-score">{data.highScore || '-'}</td>
                  <td>
                    <div className="lb-stars">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={s <= data.stars ? 'filled' : ''}>⭐</span>
                      ))}
                    </div>
                  </td>
                  <td>{data.played}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .lb-wrap { padding-top: 40px; }
        .lb-title { font-size: 2.2rem; font-weight: 900; text-align: center; margin-bottom: 24px; }
        .lb-summary { display: flex; justify-content: center; gap: 24px; margin-bottom: 40px; }
        .lb-stat { padding: 16px 32px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); text-align: center; }
        .lb-stat-val { font-size: 2rem; font-weight: 900; color: var(--accent-gold); }
        .lb-stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
        .lb-table-container { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
        .lb-table { width: 100%; border-collapse: collapse; }
        .lb-table th { padding: 16px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        .lb-table td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.03); font-weight: 600; }
        .lb-level-emoji { margin-right: 10px; font-size: 1.2rem; }
        .lb-score { color: var(--accent-purple); }
        .lb-stars { display: flex; gap: 2px; }
        .lb-stars span { opacity: 0.15; font-size: 0.9rem; }
        .lb-stars span.filled { opacity: 1; filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5)); }
      `}</style>
    </motion.div>
  );
}
