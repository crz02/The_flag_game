import { motion } from 'framer-motion';

export default function FlagCard({ country, onClick, status, disabled }) {
  // status: 'normal', 'correct', 'wrong', 'eliminated'
  
  const variants = {
    normal: { scale: 1, opacity: 1 },
    correct: { scale: 1.05, borderColor: 'var(--accent-green)', backgroundColor: 'rgba(16, 185, 129, 0.15)' },
    wrong: { x: [-5, 5, -5, 5, 0], borderColor: 'var(--accent-red)', backgroundColor: 'rgba(239, 68, 68, 0.15)' },
    eliminated: { opacity: 0.2, scale: 0.95 }
  };

  return (
    <motion.button
      whileHover={!disabled && status === 'normal' ? { y: -4, scale: 1.02 } : {}}
      whileTap={!disabled && status === 'normal' ? { scale: 0.98 } : {}}
      initial="normal"
      animate={status}
      variants={variants}
      onClick={() => !disabled && onClick(country.code)}
      className={`flag-card ${status}`}
      disabled={disabled || status === 'eliminated'}
    >
      <span className="flag-emoji">{country.emoji}</span>
      {/* Name is only shown after an answer is given or if we want to add it back */}
    </motion.button>
  );
}
