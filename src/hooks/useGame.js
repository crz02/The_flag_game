import { useState, useEffect, useCallback, useRef } from 'react';
import { COUNTRIES, QUESTIONS_PER_ROUND, LEVEL_CONFIG } from '../data/countries';

export function useGame(levelId) {
  const [status, setStatus] = useState('idle'); // idle, playing, paused, finished
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);
  const config = LEVEL_CONFIG[levelId];

  // --- Helper Functions (Hoisted manually to avoid TDZ) ---
  
  const calculateStars = (score, completed) => {
    if (!completed) return 0;
    if (score >= 1800) return 5;
    if (score >= 1500) return 4;
    if (score >= 1200) return 3;
    if (score >= 800) return 2;
    return 1;
  };

  const finishRound = useCallback((completed) => {
    setStatus('finished');
    const stars = calculateStars(score, completed);
    setResult({ score, stars, completed });
  }, [score]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIdx + 1 >= QUESTIONS_PER_ROUND) {
      finishRound(true);
    } else {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      if (questions[nextIdx]) {
        setCurrentQuestion(questions[nextIdx]);
      }
      if (config.timerSec > 0) setTimeLeft(config.timerSec);
    }
  }, [currentQuestionIdx, questions, config, finishRound]);

  const handleAnswer = useCallback((choiceCode) => {
    if (status !== 'playing' || !currentQuestion) return;

    if (choiceCode === currentQuestion.answer.code) {
      const basePoints = 100;
      const multiplier = streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
      const points = Math.round(basePoints * multiplier);
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      nextQuestion();
    } else {
      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          finishRound(false);
          return 0;
        }
        return nextLives;
      });
      setStreak(0);
      nextQuestion();
    }
  }, [status, currentQuestion, streak, nextQuestion, finishRound]);

  const startRound = useCallback(() => {
    const levelCountries = COUNTRIES.filter(c => c.level <= levelId);
    const shuffled = [...levelCountries].sort(() => Math.random() - 0.5);
    const roundQuestions = shuffled.slice(0, QUESTIONS_PER_ROUND).map(q => {
      const distractors = [...levelCountries]
        .filter(c => c.code !== q.code)
        .sort(() => Math.random() - 0.5)
        .slice(0, config.choices - 1);
      
      return {
        answer: q,
        choices: [q, ...distractors].sort(() => Math.random() - 0.5),
        hintUsed: false
      };
    });

    setQuestions(roundQuestions);
    setScore(0);
    setStreak(0);
    setLives(3);
    setHintsLeft(3);
    setCurrentQuestionIdx(0);
    setCurrentQuestion(roundQuestions[0]);
    setStatus('playing');
    if (config.timerSec > 0) setTimeLeft(config.timerSec);
  }, [levelId, config]);

  const useHint = () => {
    if (hintsLeft > 0 && status === 'playing' && currentQuestion && !currentQuestion.hintUsed) {
      setHintsLeft(prev => prev - 1);
      setCurrentQuestion(prev => ({ ...prev, hintUsed: true }));
    }
  };

  // Timer effect
  useEffect(() => {
    if (status === 'playing' && config.timerSec > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            handleAnswer(null);
            return config.timerSec;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [status, config.timerSec, handleAnswer]);

  return {
    status,
    currentQuestion,
    currentQuestionIdx,
    score,
    streak,
    lives,
    hintsLeft,
    timeLeft,
    result,
    startRound,
    handleAnswer,
    useHint,
    pause: () => setStatus('paused'),
    resume: () => setStatus('playing')
  };
}
