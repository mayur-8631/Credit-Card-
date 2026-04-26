'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('credimatch_token');
    setLoggedIn(!!token);
  }, []);

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <div className="logo-mark"></div>
        <div className="logo-word">
          <Link href="/">Credimatch<span>.</span></Link>
        </div>
      </div>
      <div className="topbar-center">CARD INTELLIGENCE PLATFORM</div>
      <div className="topbar-right">
        <Link href="/cards">Cards</Link>
        <Link href="/calculator">Cashback Calc</Link>
        <Link href="/simulator">Credit Score</Link>
        <Link href="/timing">Timing Intel</Link>
        <Link href="/deals" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          Deals
          <span style={{ 
            background: 'linear-gradient(135deg, #ff2d95, #e0267f)', 
            color: '#fff', 
            fontSize: '0.48rem', 
            padding: '2px 6px', 
            borderRadius: '50px', 
            fontWeight: 800, 
            letterSpacing: '1px',
            lineHeight: 1
          }}>PRO</span>
        </Link>
        <Link href="/upgrade" className="cta-pill" style={{ display: 'inline-block', background: 'var(--accent)', color: '#000', marginRight: '4px', border: 'none' }}>Upgrade Pro</Link>

        {loggedIn ? (
          <Link href="/profile" className="cta-pill" style={{ display: 'inline-block' }}>Profile</Link>
        ) : (
          <>
            <Link 
              href="/login" 
              style={{ 
                fontSize: '0.78rem', 
                color: 'var(--text-hi)', 
                fontWeight: 600, 
                letterSpacing: '0.5px',
                padding: '7px 16px',
                border: '1px solid var(--ghost2)',
                borderRadius: '50px',
                transition: 'border-color 0.2s, color 0.2s'
              }}
            >
              Login
            </Link>
            <Link href="/register" className="cta-pill" style={{ display: 'inline-block' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
