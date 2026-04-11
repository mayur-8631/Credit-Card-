'use client';

import { useState, useEffect } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function CompareEngine() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [hasUserCards, setHasUserCards] = useState(true);
  
  const [form, setForm] = useState({
    category: 'Online',
    estimated_spend: 20000
  });

  const categories = ['Online', 'Travel', 'Fuel', 'Dining', 'General'];

  useEffect(() => {
    // Initial check if user has cards
    const token = localStorage.getItem('stackr_token');
    if (!token) { window.location.href = '/login'; return; }
    
    fetch('http://localhost:4000/api/cards/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (!data.cards || data.cards.length === 0) setHasUserCards(false);
    }).catch(() => setHasUserCards(false));
  }, []);

  const runComparison = async () => {
    setLoading(true);
    const token = localStorage.getItem('stackr_token');
    try {
      const res = await fetch('http://localhost:4000/api/cards/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setCards(data.cards || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1200, margin: '0 auto', minHeight: '80vh' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="sec-label" style={{ justifyContent: 'center' }}>AI Engine</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-hi)', lineHeight: 1 }}>
            CARD <span style={{ color: 'var(--magenta)' }}>COMPARISON</span>
          </h1>
          <p style={{ color: 'var(--ghost)', marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
            Discover which of your saved cards provides the highest savings based on AI-driven spend analysis.
          </p>
        </div>

        {!hasUserCards ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)' }}>
            <p style={{ color: 'var(--ghost)', marginBottom: 20 }}>You need to add cards to your wallet to run comparisons.</p>
            <button onClick={() => window.location.href = '/my-cards'} className="cta-pill">GO TO MY CARDS</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, maxWidth: 800, margin: '0 auto' }}>
            
            {/* Configuration Panel */}
            <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: '30px 40px', display: 'flex', flexWrap: 'wrap', gap: 30, alignItems: 'center' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text)', marginBottom: 12 }}>Primary Spend Category</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <button key={cat} 
                      onClick={() => setForm({...form, category: cat})}
                      style={{ 
                        padding: '8px 16px', borderRadius: 50, fontSize: '0.8rem', 
                        background: form.category === cat ? 'var(--magenta-dim)' : 'var(--ink3)',
                        border: `1px solid ${form.category === cat ? 'var(--magenta)' : 'var(--ghost)'}`,
                        color: form.category === cat ? 'var(--magenta)' : 'var(--text)'
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text)', marginBottom: 12 }}>Estimated Monthly Spend (₹)</label>
                <input type="number" step="1000" value={form.estimated_spend} onChange={e => setForm({...form, estimated_spend: +e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff', fontSize: '1.1rem' }} />
              </div>

              <div style={{ width: '100%', textAlign: 'center', marginTop: 10 }}>
                <button onClick={runComparison} disabled={loading} style={{ 
                  background: 'linear-gradient(135deg, var(--magenta), #e0267f)', color: '#fff',
                  padding: '14px 40px', borderRadius: 50, fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1, 
                  boxShadow: '0 0 20px rgba(255,45,149,0.25)', opacity: loading ? 0.7 : 1, width: '100%'
                }}>
                  {loading ? 'ANALYZING...' : 'RUN AI COMPARISON'}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            {cards.length > 0 && (
              <div className="ranked-panel" style={{ background: 'transparent', border: 'none' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--display)', color: 'var(--text-hi)', marginBottom: 20, textAlign: 'center', letterSpacing: 1 }}>TOP RECOMMENDATIONS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cards.slice(0, 3).map((card, index) => (
                    <div key={card.id} style={{ 
                      background: index === 0 ? 'linear-gradient(145deg, var(--ink2), #1a1525)' : 'var(--ink2)', 
                      border: `1px solid ${index === 0 ? 'var(--magenta)' : 'var(--ghost)'}`, 
                      borderRadius: 'var(--r)', padding: 24, paddingLeft: 30, position: 'relative', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap'
                    }}>
                      {index === 0 && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, background: 'var(--magenta)' }}></div>}
                      
                      <div style={{ width: 50, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--display)', fontSize: index === 0 ? '3rem' : '2rem', color: index === 0 ? 'var(--magenta)' : 'rgba(255,255,255,0.4)', lineHeight: 1 }}>#{index + 1}</div>
                      </div>

                      <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--text-hi)', fontWeight: 600, marginBottom: 4 }}>{card.card_name}</h4>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--ghost)' }}>{card.bank} • {card.card_type}</div>
                        <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--magenta-dim)', borderRadius: 6, display: 'inline-block' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--magenta)' }}>🤖 AI: {card.insight}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: 120 }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Est. Savings</div>
                        <div style={{ fontFamily: 'var(--display)', fontSize: '2.2rem', color: index === 0 ? '#00b894' : 'var(--text-hi)', lineHeight: 1 }}>
                          ₹{Math.floor(card.savings).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ghost)', marginTop: 4 }}>/ month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {cards.length === 0 && !loading && (
              <div style={{ textAlign: 'center', color: 'var(--ghost)', marginTop: 20 }}>
                Click 'Run AI Comparison' to rank your cards.
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
