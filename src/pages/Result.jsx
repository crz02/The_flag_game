import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LEVEL_CONFIG } from '../data/countries';

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  if (!state || !state.result) {
    return <div className="loading">No result found...</div>;
  }

  const { score, stars, completed } = state.result;
  const levelId = state.levelId;
  const config = LEVEL_CONFIG[levelId];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="page-wrap result-wrap"
    >
      <p className="result-level-name">{config.name} Complete!</p>
      <h2 className="result-title">{completed ? 'Round Complete!' : 'Game Over!'}</h2>

      <div className="result-stars">
        {[1, 2, 3, 4, 5].map(s => (
          <motion.span 
            key={s}
            initial={{ scale: 0, opacity: 0 }}
            animate={s <= stars ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 0.2 }}
            transition={{ delay: 0.2 + s * 0.1, type: 'spring' }}
            className={`result-star ${s <= stars ? 'earned' : 'empty'}`}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="result-score-big"
      >
        {score}
      </motion.div>
      <p className="result-correct">Final Score</p>

      <div className="result-actions">
        <button className="btn-primary" onClick={() => navigate(`/game/${levelId}`)}>🔄 Try Again</button>
        <Link to="/" className="btn-ghost">🏠 Home</Link>
      </div>

      <style jsx>{`
        .result-wrap { text-align: center; padding-top: 60px; }
        .result-level-name { font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 8px; }
        .result-title { font-size: 2.5rem; font-weight: 900; background: var(--gradient-hero); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 32px; }
        .result-stars { display: flex; justify-content: center; gap: 12px; margin-bottom: 24px; }
        .result-star { font-size: 3rem; }
        .result-star.earned { filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.6)); }
        .result-score-big { font-size: 4.5rem; font-weight: 900; margin-bottom: 4px; }
        .result-correct { color: var(--text-secondary); margin-bottom: 40px; }
        .result-actions { display: flex; justify-content: center; gap: 16px; }
      `}</style>
    </motion.div>
  );
}
