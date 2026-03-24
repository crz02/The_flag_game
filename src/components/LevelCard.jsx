import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LevelCard({ level, playerStats, isLocked }) {
  const stars = playerStats?.stars || 0;
  const highScore = playerStats?.highScore || 0;

  return (
    <motion.div
      whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={`level-card ${isLocked ? 'locked' : ''} ${level.id === 5 ? 'level-card-last' : ''}`}
    >
      {isLocked ? (
        <div className="lock-overlay">
          <span>🔒</span>
          <p className="stars-needed">Need {level.starsNeeded} stars</p>
        </div>
      ) : (
        <Link to={`/game/${level.id}`} className="card-link">
          <div className="card-header">
            <span className="card-emoji">{level.emoji}</span>
            <span className="card-level-badge">Level {level.id}</span>
          </div>
          <h3 className="card-name">{level.name}</h3>
          <p className="card-desc">{level.countries} flags &bull; {level.choices} choices &bull; {level.timerSec > 0 ? `${level.timerSec}s timer` : 'No timer'}</p>
          
          <div className="card-stars">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={`star ${s <= stars ? 'filled' : ''}`}>⭐</span>
            ))}
          </div>
          
          {highScore > 0 && <div className="card-score">Best: {highScore}</div>}
        </Link>
      )}

      <style jsx>{`
        .level-card {
          position: relative;
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(16px);
          overflow: hidden;
          transition: border-color 0.25s ease;
        }
        .level-card:hover:not(.locked) { border-color: var(--border-hover); box-shadow: var(--shadow-glow-purple); }
        .card-link { display: block; padding: 24px; text-decoration: none; color: inherit; }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .card-emoji { font-size: 2rem; }
        .card-level-badge { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; background: rgba(139, 92, 246, 0.2); color: var(--accent-purple); border-radius: var(--radius-full); border: 1px solid rgba(139, 92, 246, 0.3); }
        .card-name { font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
        .card-desc { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px; }
        .card-stars { display: flex; gap: 4px; margin-bottom: 8px; }
        .star { font-size: 1.2rem; opacity: 0.2; grayscale(1); }
        .star.filled { opacity: 1; grayscale(0); filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.5)); }
        .card-score { font-size: 0.82rem; color: var(--text-muted); font-weight: 600; }
        .lock-overlay { position: absolute; inset: 0; background: rgba(6, 6, 20, 0.7); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; padding: 20px; text-align: center; }
        .lock-overlay span { font-size: 2.5rem; margin-bottom: 8px; }
        .stars-needed { font-size: 0.8rem; font-weight: 700; color: var(--accent-gold); }
        .level-card-last { grid-column: 1 / -1; max-width: 400px; margin: 0 auto; width: 100%; }
      `}</style>
    </motion.div>
  );
}
