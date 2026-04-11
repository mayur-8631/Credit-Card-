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
        localStorage.setItem('stackr_token', data.token);
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
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 40, width: '100%', maxWidth: 450 }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', color: 'var(--text-hi)', textAlign: 'center', marginBottom: 30 }}>JOIN <span style={{ color: 'var(--magenta)' }}>STACKR</span></h2>

          <form onSubmit={registerUser}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            {/* Inline error message */}
            {error && (
              <div style={{
                background: 'rgba(232,67,147,0.12)',
                border: '1px solid rgba(232,67,147,0.4)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 20,
                fontSize: '0.83rem',
                color: 'var(--magenta)',
                textAlign: 'center'
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="cta-pill"
              disabled={loading}
              style={{ width: '100%', padding: 14, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'CREATING PROFILE…' : 'CREATE PROFILE'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--magenta)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
