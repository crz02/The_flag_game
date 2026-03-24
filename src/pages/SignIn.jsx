import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="signin-page">
      <div className="signin-sidebar">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="brand-content"
        >
          <div className="brand-logo">🌍</div>
          <h1>FlagQuest</h1>
          <p>Master the flags of the world. Level up your geography skills with modern UI/UX.</p>
        </motion.div>
      </div>

      <div className="signin-main">
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="signin-card"
        >
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to sync your progress across devices</p>

          <button className="auth-provider-btn google">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
            Continue with Google
          </button>

          <div className="divider"><span>or email</span></div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="btn-primary auth-submit" onClick={() => navigate('/')}>
              Sign In
            </button>
          </form>

          <p className="footer-text">
            Don't have an account? <span className="link">Sign up</span>
          </p>
          
          <button className="btn-guest-link" onClick={() => navigate('/')}>
            Continue as Guest
          </button>
        </motion.div>
      </div>

      <style jsx>{`
        .signin-page { display: flex; min-height: 100vh; background: var(--bg-deep); }
        .signin-sidebar { 
          flex: 1; 
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 60px;
          border-right: 1px solid var(--border);
        }
        @media (max-width: 900px) { .signin-sidebar { display: none; } }
        
        .brand-content { max-width: 400px; text-align: center; }
        .brand-logo { font-size: 5rem; margin-bottom: 20px; filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.4)); }
        .brand-content h1 { font-size: 3rem; font-weight: 900; margin-bottom: 16px; background: var(--gradient-hero); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .brand-content p { color: var(--text-secondary); font-size: 1.1rem; line-height: 1.6; }

        .signin-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .signin-card { width: 100%; max-width: 420px; }
        .signin-card h2 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .subtitle { color: var(--text-secondary); margin-bottom: 32px; font-size: 1.05rem; }

        .auth-provider-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 12px; background: white; color: #374151; border-radius: var(--radius-md);
          font-weight: 600; font-size: 0.95rem; margin-bottom: 24px; transition: all 0.2s;
        }
        .auth-provider-btn:hover { background: #f9fafb; transform: translateY(-1px); }
        .auth-provider-btn img { width: 20px; height: 20px; }

        .divider { position: relative; text-align: center; margin-bottom: 24px; }
        .divider:before { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: var(--border); z-index: 1; }
        .divider span { position: relative; background: var(--bg-deep); padding: 0 12px; font-size: 0.85rem; color: var(--text-muted); z-index: 2; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }
        .input-group input { 
          padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); 
          color: white; outline: none; transition: border-color 0.2s;
        }
        .input-group input:focus { border-color: var(--accent-purple); }
        .auth-submit { width: 100%; justify-content: center; margin-top: 10px; }

        .footer-text { margin-top: 24px; text-align: center; font-size: 0.95rem; color: var(--text-secondary); }
        .link { color: var(--accent-purple); font-weight: 700; cursor: pointer; }
        .btn-guest-link { width: 100%; margin-top: 20px; padding: 10px; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
        .btn-guest-link:hover { color: var(--text-secondary); }
      `}</style>
    </div>
  );
}
