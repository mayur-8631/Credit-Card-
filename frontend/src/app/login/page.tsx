'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('credimatch_token', data.token);
        window.location.href = '/profile';
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('Cannot reach server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="auth-page">
        <div className="auth-card">
          {/* Left decorative panel */}
          <div className="auth-side">
            <div className="auth-side-content">
              <div className="auth-logo">
                <div className="logo-mark" style={{ width: 32, height: 32 }}></div>
                <span>Credimatch<span style={{ color: 'var(--cyan)' }}>.</span></span>
              </div>
              <h2>Welcome<br/><span>Back</span></h2>
              <p>Sign in to access your personalised card recommendations, track rewards, and manage your Pro subscription.</p>
              <div className="auth-side-features">
                <div className="asf">✦ Priority Engine</div>
                <div className="asf">✦ Smart Timing Alerts</div>
                <div className="asf">✦ Partner Deals</div>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h3>Sign In</h3>
              <p>Enter your credentials to continue</p>
            </div>


            <form onSubmit={login}>
              <div className="auth-field">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {error && (
                <div className="auth-error">⚠ {error}</div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? 'SIGNING IN…' : 'SIGN IN'}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link href="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 40px;
        }
        .auth-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 860px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--ghost);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }

        /* ── Left Panel ── */
        .auth-side {
          background: linear-gradient(145deg, #0d1025, #1a1040, #0d1025);
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .auth-side::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 70% 30%, rgba(0, 229, 255, 0.06) 0%, transparent 50%),
                      radial-gradient(circle at 30% 70%, rgba(255, 45, 149, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .auth-side-content {
          position: relative;
          z-index: 1;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
          font-family: var(--display);
          font-size: 1.3rem;
          color: var(--text-hi);
          letter-spacing: 3px;
        }
        .auth-side h2 {
          font-family: var(--display);
          font-size: 3rem;
          color: var(--text-hi);
          line-height: 1;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }
        .auth-side h2 span {
          color: var(--cyan);
        }
        .auth-side p {
          font-size: 0.88rem;
          color: var(--ghost);
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .auth-side-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .asf {
          font-size: 0.8rem;
          color: var(--text);
          font-weight: 500;
        }

        /* ── Right Panel ── */
        .auth-form-wrap {
          background: var(--ink2);
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-form-header {
          margin-bottom: 28px;
        }
        .auth-form-header h3 {
          font-family: var(--display);
          font-size: 2rem;
          color: var(--text-hi);
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .auth-form-header p {
          font-size: 0.82rem;
          color: var(--ghost);
        }

        .auth-field {
          margin-bottom: 20px;
        }
        .auth-field label {
          display: block;
          font-family: var(--mono);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 1px;
          color: var(--ghost);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .auth-field input {
          width: 100%;
          padding: 13px 16px;
          background: var(--ink3);
          border: 1px solid var(--ghost);
          border-radius: 10px;
          color: #fff;
          font-size: 0.9rem;
          font-family: var(--body);
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-field input:focus {
          border-color: var(--cyan);
          box-shadow: 0 0 0 3px var(--cyan-dim);
        }
        .auth-field input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .auth-error {
          background: rgba(232, 67, 147, 0.1);
          border: 1px solid rgba(232, 67, 147, 0.35);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 20px;
          font-size: 0.82rem;
          color: var(--magenta);
          text-align: center;
        }
        .auth-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--cyan), #00bcd4);
          border: none;
          border-radius: 50px;
          color: var(--ink);
          font-family: var(--body);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: box-shadow 0.25s, opacity 0.2s;
        }
        .auth-submit:hover {
          box-shadow: 0 0 25px var(--cyan-glow);
        }
        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 0.85rem;
          color: var(--ghost);
        }
        .auth-footer :global(a) {
          color: var(--magenta);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .auth-footer :global(a):hover {
          color: var(--cyan);
        }

        @media (max-width: 700px) {
          .auth-card {
            grid-template-columns: 1fr;
          }
          .auth-side {
            padding: 32px 28px;
          }
          .auth-side h2 { font-size: 2rem; }
          .auth-side p { margin-bottom: 20px; }
          .auth-side-features { display: none; }
        }
      `}</style>
    </>
  );
}
