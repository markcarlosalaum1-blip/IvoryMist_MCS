import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(username, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        * { margin: 0; padding: 0; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(79,70,229,0.3), 0 20px 60px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 50px rgba(79,70,229,0.5), 0 20px 80px rgba(0,0,0,0.4); }
        }

        .brule-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: 
            radial-gradient(ellipse 1000px 800px at 20% 30%, rgba(139,92,246,0.2), transparent 50%),
            radial-gradient(ellipse 900px 900px at 80% 70%, rgba(99,102,241,0.15), transparent 50%),
            linear-gradient(135deg, #0d1f4d 0%, #1a0a3d 50%, #0a1628 100%);
          font-family: 'Poppins', sans-serif;
          padding: 24px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .brule-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 20%, rgba(59,130,246,0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(168,85,247,0.1) 0%, transparent 40%);
          pointer-events: none;
        }

        .brule-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 420px;
          background: 
            linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,27,75,0.9) 100%);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.5),
            0 0 80px rgba(79,70,229,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(79,70,229,0.3);
          padding: 60px 48px;
          position: relative;
          z-index: 1;
          animation: glowPulse 3s ease-in-out infinite;
        }

        /* ── Brand Section ── */
        .brule-brand {
          text-align: center;
          margin-bottom: 48px;
          animation: fadeIn 0.8s ease-out;
        }

        .brule-icon {
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.1) 100%);
          border-radius: 16px;
          border: 1px solid rgba(139,92,246,0.3);
          animation: floatUp 3s ease-in-out infinite;
        }

        .brule-name {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.03em;
          margin: 0 0 8px;
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.3));
        }

        .brule-subtitle {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        /* ── Form Section ── */
        .brule-left,
        .brule-right {
          all: unset;
        }

        .brule-form-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a78bfa;
          margin: 0 0 12px;
          text-shadow: 0 2px 8px rgba(167,139,250,0.2);
          text-align: center;
        }

        .brule-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          margin: 0 0 32px;
          line-height: 1.4;
          letter-spacing: 0.01em;
          text-align: center;
        }

        .brule-form-title em {
          color: #a78bfa;
          font-style: italic;
          font-weight: 600;
          filter: drop-shadow(0 2px 6px rgba(167,139,250,0.3));
        }

        .brule-field {
          margin-bottom: 24px;
          animation: fadeIn 0.8s ease-out;
          animation-fill-mode: both;
        }

        .brule-field:nth-child(1) { animation-delay: 0.2s; }
        .brule-field:nth-child(2) { animation-delay: 0.3s; }

        .brule-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 10px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        .brule-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .brule-input-icon {
          position: absolute;
          left: 16px;
          color: #a78bfa;
          font-size: 16px;
          pointer-events: none;
          z-index: 2;
          display: flex;
          align-items: center;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .brule-input {
          width: 100%;
          box-sizing: border-box;
          background: linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.05) 100%);
          border: 1.5px solid rgba(139,92,246,0.3);
          border-radius: 12px;
          padding: 14px 16px 14px 48px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          outline: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.05);
        }

        .brule-input:focus {
          border-color: #a78bfa;
          background: linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.1) 100%);
          box-shadow: 
            inset 0 1px 2px rgba(255,255,255,0.08),
            0 0 20px rgba(139,92,246,0.3);
        }

        .brule-input:-webkit-autofill,
        .brule-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(139,92,246,0.1) inset !important;
          box-shadow: 0 0 0px 1000px rgba(139,92,246,0.1) inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        .brule-input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .brule-btn {
          width: 100%;
          margin-top: 12px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 
            0 8px 24px rgba(167,139,250,0.4),
            0 4px 12px rgba(96,165,250,0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
          -webkit-appearance: none;
          appearance: none;
        }

        .brule-btn:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 32px rgba(167,139,250,0.5),
            0 6px 16px rgba(96,165,250,0.4),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .brule-btn:active:not(:disabled) {
          transform: translateY(-2px) scale(0.98);
        }

        .brule-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .brule-btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: bruleShimmer 2.6s infinite;
          pointer-events: none;
        }

        @keyframes bruleShimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }

        .brule-footer {
          margin-top: 24px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          text-align: center;
          line-height: 1.6;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .brule-card {
            padding: 48px 32px;
          }

          .brule-name {
            font-size: 32px;
          }

          .brule-form-title {
            font-size: 24px;
          }

          .brule-input {
            padding: 12px 14px 12px 44px;
            font-size: 16px;
            border-radius: 10px;
          }

          .brule-btn {
            padding: 12px 20px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="brule-root">
        <div className="brule-card">

          {/* ── Brand Section ── */}
          <div className="brule-brand">
            <div className="brule-icon">
              <svg width="40" height="40" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer glow circle */}
                <circle cx="28" cy="28" r="26" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.3" />
                
                {/* Mist/Fog waves */}
                <path d="M 12 28 Q 16 24 20 28 T 28 28 T 36 28 T 44 28" stroke="#a78bfa" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.9" />
                <path d="M 10 35 Q 14 31 18 35 T 26 35 T 34 35 T 42 35 T 50 35" stroke="#a78bfa" strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
                <path d="M 14 21 Q 18 17 22 21 T 30 21 T 38 21 T 46 21" stroke="#a78bfa" strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
                
                {/* Center accent dot */}
                <circle cx="28" cy="28" r="2.5" fill="#a78bfa" fillOpacity="0.6" />
                <circle cx="28" cy="28" r="4" stroke="#a78bfa" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
              </svg>
            </div>
            <h1 className="brule-name">IvoryMist</h1>
            <p className="brule-subtitle">Café Management System</p>
          </div>

          {/* ── Form Section ── */}
          <p className="brule-form-eyebrow">Artisan Dashboard</p>
          <h2 className="brule-form-title">
            Welcome to your<br /><em>sanctuary</em>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="brule-field">
              <label className="brule-label" htmlFor="brule-username">Username</label>
              <div className="brule-input-wrap">
                <span className="brule-input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="brule-username"
                  className="brule-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="brule-field">
              <label className="brule-label" htmlFor="brule-password">Password</label>
              <div className="brule-input-wrap">
                <span className="brule-input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="brule-password"
                  className="brule-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="brule-btn" type="submit" disabled={loading}>
              <span className="brule-btn-shimmer" />
              <span style={{ position: 'relative', zIndex: 1 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </span>
            </button>
          </form>

          <p className="brule-footer">
            IvoryMist Café Management System &copy; {new Date().getFullYear()}
          </p>

        </div>
      </div>
    </>
  );
};

export default Login;