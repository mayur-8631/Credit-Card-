'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function Login() {
  const [target, setTarget] = useState({ email: '', password: '' });

  const login = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('stackr_token', data.token);
        window.location.href = '/profile';
      } else {
        alert('Invalid credentials');
      }
    } catch {
      alert('Network error');
    }
  };

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 40, width: '100%', maxWidth: 450 }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', color: 'var(--text-hi)', textAlign: 'center', marginBottom: 30 }}>WELCOME <span style={{ color: 'var(--cyan)' }}>BACK</span></h2>
          
          <form onSubmit={login}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Email</label>
              <input type="email" required value={target.email} onChange={e => setTarget({...target, email: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
            </div>
            
            <div style={{ marginBottom: 30 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Password</label>
              <input type="password" required value={target.password} onChange={e => setTarget({...target, password: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
            </div>

            <button type="submit" className="cta-pill" style={{ width: '100%', padding: 14 }}>SIGN IN</button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem' }}>
            New to STACKR? <Link href="/register" style={{ color: 'var(--cyan)' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
}
