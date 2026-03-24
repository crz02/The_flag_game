import { motion } from 'framer-motion';

export default function HUD({ score, streak, hintsLeft, lives, onPause, onHint }) {
  const streakClass = streak >= 10 ? 'legendary' : streak >= 5 ? 'hot' : streak >= 3 ? 'warm' : '';

  return (
    <div className="game-topbar">
      <div className="hud-left">
        <div className="hud-badge hud-score">
          🎯 <span>{score}</span>
        </div>
        <motion.div 
          key={streak}
          initial={{ scale: 1.2 }} animate={{ scale: 1 }}
          className={`hud-badge hud-streak ${streakClass}`}
        >
          🔥 {streak}
        </motion.div>
      </div>

      <div className="hud-right">
        <div className="hud-lives">
          {[1, 2, 3].map(i => (
            <span key={i} className={`life ${i > lives ? 'lost' : ''}`}>❤️</span>
          ))}
        </div>
        
        <button className="hud-hint-btn" onClick={onHint} disabled={hintsLeft === 0}>
          <span className="hint-icon">💡</span>
          <span className="hint-pips">
            {[0, 1, 2].map(i => (
              <span key={i} className={`hint-pip ${i < hintsLeft ? 'available' : 'used'}`}></span>
            ))}
          </span>
        </button>

        <button className="btn-icon" onClick={onPause}>⏸</button>
      </div>
    </div>
  );
}
