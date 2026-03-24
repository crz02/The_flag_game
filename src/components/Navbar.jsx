import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Navbar({ player }) {
  const location = useLocation();
  const isGame = location.pathname.startsWith('/game');

  if (isGame) return null;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <span className="logo-emoji">🌍</span>
          <span className="logo-text">FlagQuest</span>
        </Link>
        
        <div className="nav-right">
          <Link to="/leaderboard" className="nav-link">📊</Link>
          <Link to="/profile" className="nav-profile">
            <div className="avatar-small">{player.avatar}</div>
            <div className="nav-stars">⭐ {player.stats.totalStars}</div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: rgba(8, 8, 30, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
        }
        .logo-emoji { font-size: 1.5rem; }
        .logo-text { font-weight: 800; font-size: 1.2rem; background: var(--gradient-hero); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-link { text-decoration: none; font-size: 1.2rem; }
        .nav-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: inherit;
          padding: 4px 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
        }
        .avatar-small { font-size: 1rem; }
        .nav-stars { font-weight: 700; font-size: 0.9rem; color: var(--accent-gold); }
      `}</style>
    </nav>
  );
}
