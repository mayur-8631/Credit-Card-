'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const registerUser = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('stackr_token', data.token);
        window.location.href = '/profile';
      } else {
        alert('Invalid data or user exists');
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
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', color: 'var(--text-hi)', textAlign: 'center', marginBottom: 30 }}>JOIN <span style={{ color: 'var(--magenta)' }}>STACKR</span></h2>
          
          <form onSubmit={registerUser}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
            </div>
            
            <div style={{ marginBottom: 30 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text)' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
            </div>

            <button type="submit" className="cta-pill" style={{ width: '100%', padding: 14 }}>CREATE PROFILE</button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--magenta)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
