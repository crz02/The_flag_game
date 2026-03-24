import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import HUD from '../components/HUD';
import FlagCard from '../components/FlagCard';

export default function Game({ player, onFinish }) {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const game = useGame(parseInt(levelId));
  const [selectedCode, setSelectedCode] = useState(null);
  const [showPoints, setShowPoints] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);

  useEffect(() => {
    game.startRound();
  }, [levelId]);

  useEffect(() => {
    if (game.status === 'finished') {
      onFinish(parseInt(levelId), game.result.score, game.result.stars);
      navigate('/result', { state: { result: game.result, levelId } });
    }
  }, [game.status, game.result, navigate, onFinish, levelId]);

  const handleChoice = (code) => {
    if (selectedCode || game.status !== 'playing') return;
    setSelectedCode(code);
    
    const isCorrect = code === game.currentQuestion.answer.code;
    
    setTimeout(() => {
      game.handleAnswer(code);
      setSelectedCode(null);
    }, 800);
  };

  if (!game.currentQuestion) return <div className="loading">Loading...</div>;

  const progress = ((game.currentQuestionIdx + 1) / 15) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="game-screen"
    >
      <HUD 
        score={game.score}
        streak={game.streak}
        hintsLeft={game.hintsLeft}
        lives={game.lives}
        onPause={game.pause}
        onHint={game.useHint}
      />

      <div className="timer-container">
        <motion.div 
          className="timer-bar-fill" 
          animate={{ width: `${(game.timeLeft / 20) * 100}%` }}
        />
      </div>

      <div className="page-wrap">
        <div className="question-area">
          <div className="question-progress">{game.currentQuestionIdx + 1} / 15</div>
          <div className="progress-track">
            <motion.div className="progress-fill" animate={{ width: `${progress}%` }} />
          </div>
          <p className="question-label">Which flag belongs to</p>
          <motion.h2 key={game.currentQuestion.answer.name} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="question-country">
            {game.currentQuestion.answer.name}
          </motion.h2>
        </div>

        <div className="choices-grid cols-2">
          {game.currentQuestion.choices.map((choice, idx) => {
            let status = 'normal';
            if (selectedCode === choice.code) {
              status = choice.code === game.currentQuestion.answer.code ? 'correct' : 'wrong';
            } else if (selectedCode && choice.code === game.currentQuestion.answer.code) {
              status = 'correct';
            } else if (game.currentQuestion.hintUsed && idx === (game.currentQuestion.choices.findIndex(c => c.code !== game.currentQuestion.answer.code))) {
               // Simple hint logic: eliminate the first distractor found
               status = 'eliminated';
            }

            return (
              <FlagCard 
                key={choice.code}
                country={choice}
                onClick={handleChoice}
                status={status}
                disabled={!!selectedCode || status === 'eliminated'}
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {game.status === 'paused' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pause-overlay">
            <h2>⏸ Paused</h2>
            <button className="btn-primary" onClick={game.resume}>▶ Resume</button>
            <button className="btn-ghost" onClick={() => navigate('/')}>🏠 Quit</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
