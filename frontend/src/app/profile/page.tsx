'use client';

import { useState, useEffect } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import RazorpayCheckout from '@/components/RazorpayCheckout';

const PINNED_KEY = 'credimatch_pinned_cards';

export default function ProfileDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ monthly_income: 0, credit_score: 750 });
  const [savedPins, setSavedPins] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [alertPrefs, setAlertPrefs] = useState({ expiry: true, bonus: true, weekly: false });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('credimatch_token');
    if (!token) { window.location.href = '/login'; return; }

    fetch('http://localhost:4000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(data => {
      setUser(data.user);
      setForm({ monthly_income: data.user.monthly_income || 0, credit_score: data.user.credit_score || 750 });
    }).catch(() => {
      // Decode token locally if API unreachable
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, name: payload.name, email: payload.email, monthly_income: 0, credit_score: 750 });
      } catch { window.location.href = '/login'; }
    }).finally(() => setLoading(false));

    // Load saved pinned cards from localStorage
    let pins = JSON.parse(localStorage.getItem(PINNED_KEY) || '[]');
    if (pins.length === 0) {
      pins = ['HDFC Millennia', 'SBI Cashback'];
      localStorage.setItem(PINNED_KEY, JSON.stringify(pins));
    }
    setSavedPins(pins);
  }, []);

  const savePreferences = async () => {
    const token = localStorage.getItem('credimatch_token');
    await fetch('http://localhost:4000/api/auth/me', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, spending_profile: {} })
    }).catch(() => {});
    setUser((u: any) => ({ ...u, ...form }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = () => { localStorage.removeItem('credimatch_token'); window.location.href = '/'; };

  if (loading) return <div style={{ padding: 120, textAlign: 'center', color: 'var(--ghost)' }}>Loading profile...</div>;
  if (!user) return null;

  const scoreColor = (form.credit_score || 750) >= 750 ? '#00b894' : (form.credit_score || 750) >= 650 ? '#fdcb6e' : 'var(--magenta)';

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1000, margin: '0 auto', minHeight: '80vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-hi)', lineHeight: 1 }}>
              HELLO, <span style={{ color: 'var(--cyan)' }}>{user.name?.split(' ')[0]?.toUpperCase()}</span>
            </h1>
            <p style={{ color: 'var(--ghost)', marginTop: 8 }}>{user.email}</p>
          </div>
          <button onClick={logout} style={{ padding: '10px 20px', background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontSize: '0.85rem' }}>
            Sign Out
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

          {/* Preferences */}
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: 'var(--text-hi)', fontSize: '1rem' }}>Financial Profile</h3>
              <button onClick={() => setEditing(!editing)} style={{ fontSize: '0.75rem', color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer' }}>{editing ? 'Cancel' : 'Edit'}</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ghost)', fontFamily: 'var(--mono)', marginBottom: 6 }}>CREDIT SCORE</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', color: scoreColor }}>{form.credit_score}</div>
              {editing && <input type="range" min="300" max="900" value={form.credit_score} onChange={e => setForm(f => ({ ...f, credit_score: +e.target.value }))} style={{ width: '100%', marginTop: 8 }} />}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ghost)', fontFamily: 'var(--mono)', marginBottom: 6 }}>MONTHLY INCOME</div>
              {editing ? (
                <input type="number" value={form.monthly_income} onChange={e => setForm(f => ({ ...f, monthly_income: +e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff', fontSize: '1rem' }} />
              ) : (
                <div style={{ fontSize: '1.2rem', color: '#fff' }}>₹{(form.monthly_income || 0).toLocaleString()}</div>
              )}
            </div>

            {editing && (
              <button onClick={savePreferences} className="cta-pill" style={{ width: '100%', padding: 12 }}>
                SAVE PROFILE
              </button>
            )}
            {saved && <div style={{ textAlign: 'center', marginTop: 12, color: '#00b894', fontSize: '0.85rem' }}>✓ Profile saved</div>}
          </div>

          {/* Alert Subscriptions */}
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 28 }}>
            <h3 style={{ color: 'var(--text-hi)', fontSize: '1rem', marginBottom: 8 }}>🔔 Alert Subscriptions</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ghost)', marginBottom: 24, lineHeight: 1.6 }}>Choose which notifications you want from Credimatch.</p>
            {[
              { key: 'expiry', label: 'Offer Expiry Alerts', desc: 'Get notified before tracked offers expire' },
              { key: 'bonus', label: 'New Sign-up Bonus Drops', desc: 'Instant alert for new welcome bonuses' },
              { key: 'weekly', label: 'Weekly Credit Score Tips', desc: 'Weekly email with score improvement tips' },
            ].map(({ key, label, desc }) => (
              <div key={key} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
                <div style={{ marginTop: 2 }}>
                  <input type="checkbox" checked={(alertPrefs as any)[key]}
                    onChange={e => setAlertPrefs(prev => ({ ...prev, [key]: e.target.checked }))} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-hi)' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ghost)', marginTop: 3 }}>{desc}</div>
                </div>
              </div>
            ))}
            <button className="cta-pill" style={{ width: '100%', padding: 10, fontSize: '0.8rem' }}>SAVE ALERT PREFS</button>
          </div>

          {/* Saved Pinned Cards */}
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 28, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ color: 'var(--text-hi)', fontSize: '1rem' }}>📌 Saved Cards</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ghost)', marginBottom: 20, lineHeight: 1.6 }}>Cards you pinned from the deck are saved here via localStorage.</p>
            {savedPins.length === 0 ? (
              <div style={{ color: 'var(--ghost)', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center' }}>
                No saved cards yet — pin cards from the homepage deck.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {savedPins.map((name: string) => (
                  <li key={name} style={{ background: 'var(--ink3)', padding: '10px 14px', borderRadius: 8, fontSize: '0.88rem', color: 'var(--text-hi)' }}>📌 {name}</li>
                ))}
              </ul>
            )}
            
            <div style={{ marginTop: 'auto', paddingTop: 10 }}>
              <button 
                onClick={() => window.location.href = '/compare'}
                className="cta-pill" 
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--magenta)', color: 'var(--magenta)' }}
              >
                Launch Upgrade Engine →
              </button>
            </div>
          </div>


          {/* Premium Upsell */}
          <div style={{ background: 'linear-gradient(135deg, #1a1f3a, #2a1f3a)', border: '1px solid rgba(232,67,147,0.4)', borderRadius: 'var(--r)', padding: 28 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--magenta)', letterSpacing: 2, marginBottom: 12 }}>Credimatch PREMIUM</div>
            <h3 style={{ color: 'var(--text-hi)', fontSize: '1.2rem', marginBottom: 12 }}>Unlock Advanced Analytics</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['Full credit health dashboard', 'Personalised card matching (AI)', 'Real-time reward tracking', 'Priority email alerts'].map(f => (
                <li key={f} style={{ fontSize: '0.85rem', color: 'var(--text)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--magenta)' }}>✦</span>{f}</li>
              ))}
            </ul>
            {!showCheckout ? (
              <button 
                onClick={() => setShowCheckout(true)}
                style={{ width: '100%', padding: '12px', background: 'var(--magenta)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: 1 }}>
                UPGRADE — ₹199/mo
              </button>
            ) : (
              <RazorpayCheckout 
                userId={user.id}
                token={localStorage.getItem('credimatch_token') || ''}
                onPaymentSuccess={() => {
                  alert('Premium Unlocked Successfully!');
                  setShowCheckout(false);
                }} 
              />
            )}
          </div>

        </div>
      </div>
    </>
  );
}
