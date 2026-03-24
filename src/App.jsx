import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { usePlayer } from './hooks/usePlayer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Game from './pages/Game';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './index.css';

function AnimatedRoutes({ player, updateLevelStats }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home player={player} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/game/:levelId" element={<Game player={player} onFinish={updateLevelStats} />} />
        <Route path="/result" element={<Result />} />
        <Route path="/leaderboard" element={<Leaderboard player={player} />} />
        <Route path="/profile" element={<Profile player={player} />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { player, updateLevelStats } = usePlayer();

  return (
    <Router basename="/The_flag_game/">
      <div className="app-container">
        <Navbar player={player} />
        <AnimatedRoutes player={player} updateLevelStats={updateLevelStats} />
      </div>
    </Router>
  );
}
