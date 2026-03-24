import { motion } from 'framer-motion';

export default function Profile({ player }) {
  const { stars, totalStars, totalGamesPlayed, levelData } = player.stats;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="page-wrap profile-wrap"
    >
      <div className="profile-header">
        <div className="profile-avatar">{player.avatar}</div>
        <div className="profile-info">
          <h2>{player.displayName}</h2>
          <p className="profile-badge">Explorer Candidate</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{totalStars}</div>
          <div className="stat-label">Total Stars</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{totalGamesPlayed}</div>
          <div className="stat-label">Games Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">#{Math.ceil(totalStars / 5)}</div>
          <div className="stat-label">Mastery Rank</div>
        </div>
      </div>

      <div className="level-progress-section">
        <h3>Level Progression</h3>
        <div className="level-rows">
          {[1, 2, 3, 4, 5].map(lvl => {
            const data = levelData[lvl];
            const progress = (data.stars / 5) * 100;
            return (
              <div key={lvl} className="level-prog-row">
                <div className="row-meta">
                  <span className="row-name">Level {lvl}</span>
                  <span className="row-val">{data.stars}/5 ⭐</span>
                </div>
                <div className="prog-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="prog-fill"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-ghost" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--accent-red)' }}>Sign Out</button>
      </div>

      <style jsx>{`
        .profile-wrap { padding-top: 40px; max-width: 600px; }
        .profile-header { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
        .profile-avatar { width: 100px; height: 100px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; box-shadow: var(--shadow-glow-purple); }
        .profile-info h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 4px; }
        .profile-badge { display: inline-block; padding: 4px 12px; background: rgba(139, 92, 246, 0.2); color: var(--accent-purple); border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
        .stat-card { padding: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); text-align: center; }
        .stat-val { font-size: 1.8rem; font-weight: 900; color: var(--accent-gold); margin-bottom: 4px; }
        .stat-label { font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; }

        .level-progress-section h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 24px; }
        .level-rows { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
        .level-prog-row { display: flex; flex-direction: column; gap: 8px; }
        .row-meta { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; }
        .prog-bar { height: 10px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); overflow: hidden; }
        .prog-fill { height: 100%; background: var(--gradient-hero); border-radius: inherit; }

        .profile-actions { display: flex; justify-content: center; }
      `}</style>
    </motion.div>
  );
}
