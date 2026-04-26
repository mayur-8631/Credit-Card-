'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('credimatch_token', data.token);
        window.location.href = '/profile';
      } else {
        setError(data.error || 'Registration failed. Please try again.');
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
                <span>Credimatch<span style={{ color: 'var(--magenta)' }}>.</span></span>
              </div>
              <h2>Join<br/><span>Credimatch</span></h2>
              <p>Create your free account to unlock personalised credit card recommendations, compare cards side-by-side, and track your rewards.</p>
              <div className="auth-side-stats">
                <div className="as-stat">
                  <div className="as-num">50+</div>
                  <div className="as-label">CARDS ANALYSED</div>
                </div>
                <div className="as-stat">
                  <div className="as-num">10K+</div>
                  <div className="as-label">USERS MATCHED</div>
                </div>
                <div className="as-stat">
                  <div className="as-num">₹0</div>
                  <div className="as-label">FREE TO START</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h3>Create Account</h3>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={registerUser}>
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Pravin Kamble"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

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
                  minLength={6}
                  placeholder="Min 6 characters"
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
                {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="auth-terms">
              By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>

            <div className="auth-footer">
              Already have an account? <Link href="/login">Sign in</Link>
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
          background: radial-gradient(circle at 30% 30%, rgba(255, 45, 149, 0.06) 0%, transparent 50%),
                      radial-gradient(circle at 70% 70%, rgba(0, 229, 255, 0.05) 0%, transparent 50%);
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
          color: var(--magenta);
        }
        .auth-side p {
          font-size: 0.88rem;
          color: var(--ghost);
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .auth-side-stats {
          display: flex;
          gap: 20px;
        }
        .as-stat {
          text-align: center;
        }
        .as-num {
          font-family: var(--display);
          font-size: 1.8rem;
          color: var(--text-hi);
          line-height: 1;
        }
        .as-label {
          font-family: var(--mono);
          font-size: 0.5rem;
          color: var(--cyan);
          letter-spacing: 1.5px;
          margin-top: 4px;
        }

        /* ── Right Panel ── */
        .auth-form-wrap {
          background: var(--ink2);
          padding: 44px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-form-header {
          margin-bottom: 24px;
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
          margin-bottom: 18px;
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
          border-color: var(--magenta);
          box-shadow: 0 0 0 3px var(--magenta-dim);
        }
        .auth-field input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .auth-error {
          background: rgba(232, 67, 147, 0.1);
          border: 1px solid rgba(232, 67, 147, 0.35);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 18px;
          font-size: 0.82rem;
          color: var(--magenta);
          text-align: center;
        }
        .auth-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--magenta), #e0267f);
          border: none;
          border-radius: 50px;
          color: #fff;
          font-family: var(--body);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: box-shadow 0.25s, opacity 0.2s;
        }
        .auth-submit:hover {
          box-shadow: 0 0 25px rgba(255, 45, 149, 0.4);
        }
        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-terms {
          text-align: center;
          margin-top: 18px;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.5;
        }
        .auth-terms :global(a) {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: underline;
        }
        .auth-footer {
          text-align: center;
          margin-top: 16px;
          font-size: 0.85rem;
          color: var(--ghost);
        }
        .auth-footer :global(a) {
          color: var(--cyan);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .auth-footer :global(a):hover {
          color: var(--magenta);
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
          .auth-side-stats { gap: 14px; }
        }
      `}</style>
    </>
  );
}
