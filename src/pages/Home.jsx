import { motion } from 'framer-motion';
import LevelCard from '../components/LevelCard';
import { LEVEL_CONFIG } from '../data/countries';

export default function Home({ player }) {
  const levels = LEVEL_CONFIG.slice(1);
  const totalStars = player.stats.totalStars;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="page-wrap"
    >
      <header className="home-hero">
        <motion.span 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="hero-globe"
        >
          🌍
        </motion.span>
        <h1 className="hero-title">FlagQuest</h1>
        <p className="hero-subtitle">How many flags of the world can you identify?</p>
        
        <div className="hero-stats">
          <span>⭐</span>
          <span>{totalStars}</span>
          <span style={{ color: '#94a3b8', fontWeight: 400 }}>&nbsp;total stars</span>
        </div>
      </header>

      <section>
        <p className="home-section-title">Choose your level</p>
        <div className="levels-grid">
          {levels.map((level, idx) => (
            <LevelCard 
              key={level.id}
              level={level}
              playerStats={player.stats.levelData[level.id]}
              isLocked={totalStars < level.starsNeeded}
            />
          ))}
        </div>
      </section>

      <div className="home-actions">
        <button className="btn-ghost">Daily Challenge (Coming Soon)</button>
      </div>

      <style jsx>{`
        .home-hero { text-align: center; padding: 40px 0; }
        .hero-title { font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; background: var(--gradient-hero); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; letter-spacing: -0.02em; }
        .hero-subtitle { margin-top: 12px; color: var(--text-secondary); font-size: 1.1rem; }
        .hero-stats { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; padding: 10px 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-full); backdrop-filter: blur(10px); font-size: 1.1rem; font-weight: 700; color: var(--accent-gold); }
        .home-section-title { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 24px; text-align: center; }
        .levels-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
        @media (max-width: 600px) { .levels-grid { grid-template-columns: 1fr; } }
        .home-actions { display: flex; justify-content: center; margin-top: 20px; opacity: 0.6; }
      `}</style>
    </motion.div>
  );
}
