'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function MyCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCard, setAddingCard] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    card_name: '', bank: '', card_type: 'Visa',
    credit_limit: 0, annual_fee: 0, interest_rate: 0, billing_cycle_days: 30,
    due_date: 1, joining_date: new Date().toISOString().split('T')[0],
    reward_rates: { general: 0, online: 0, fuel: 0, travel: 0, dining: 0 }
  });

  useEffect(() => {
    const token = localStorage.getItem('credimatch_token');
    if (!token) { window.location.href = '/login'; return; }

    fetch('http://localhost:4000/api/cards/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setCards(data.cards || []); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    const token = localStorage.getItem('credimatch_token');
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/cards/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCards([...cards, data.card]);
      setAddingCard(false);
      setStep(1);
    } catch (e: any) {
      setError(e.message || 'Failed to add card');
    }
  };

  const nextStep = () => {
    if (step === 1 && (!form.card_name || !form.bank)) return setError('Please enter Card Name and Bank');
    setError('');
    if (step < 4) setStep(step + 1);
    else handleCreate();
  };

  if (loading) return <div style={{ padding: 120, textAlign: 'center', color: 'var(--ghost)' }}>Loading your cards...</div>;

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1200, margin: '0 auto', minHeight: '80vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <div className="sec-label">My Wallet</div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: '3rem', color: 'var(--text-hi)', lineHeight: 1 }}>
              ACTIVE <span style={{ color: 'var(--cyan)' }}>CARDS</span>
            </h1>
          </div>
          {!addingCard && (
            <button onClick={() => setAddingCard(true)} className="cta-pill" style={{ padding: '12px 24px' }}>
              + ADD NEW CARD
            </button>
          )}
        </div>

        {addingCard ? (
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 40, maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-hi)' }}>Add New Credit Card</h2>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--cyan)' }}>Step {step} of 4</div>
            </div>

            {error && <div style={{ color: 'var(--magenta)', fontSize: '0.85rem', marginBottom: 20 }}>⚠ {error}</div>}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Card Name</label>
                  <input type="text" value={form.card_name} onChange={e => setForm({...form, card_name: e.target.value})} placeholder="e.g. HDFC Millennia"
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Bank</label>
                  <input type="text" value={form.bank} onChange={e => setForm({...form, bank: e.target.value})} placeholder="e.g. HDFC Bank"
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Card Type</label>
                  <select value={form.card_type} onChange={e => setForm({...form, card_type: e.target.value})} 
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }}>
                    <option>Visa</option>
                    <option>MasterCard</option>
                    <option>RuPay</option>
                    <option>Amex</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Credit Limit (₹)</label>
                  <input type="number" value={form.credit_limit} onChange={e => setForm({...form, credit_limit: +e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Annual Fee (₹)</label>
                  <input type="number" value={form.annual_fee} onChange={e => setForm({...form, annual_fee: +e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Interest Rate (% per month)</label>
                  <input type="number" step="0.1" value={form.interest_rate} onChange={e => setForm({...form, interest_rate: +e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--ghost)', marginBottom: 10 }}>Estimate your reward / cashback percentages.</p>
                {['general', 'online', 'fuel', 'travel', 'dining'].map(cat => (
                  <div key={cat} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: 10 }}>
                    <label style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{cat}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="range" min="0" max="10" step="0.1" value={(form.reward_rates as any)[cat]} 
                        onChange={e => setForm({...form, reward_rates: {...form.reward_rates, [cat]: +e.target.value}})} 
                        style={{ flex: 1 }} />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', width: '40px' }}>{(form.reward_rates as any)[cat]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Billing Cycle (Days)</label>
                  <input type="number" value={form.billing_cycle_days} onChange={e => setForm({...form, billing_cycle_days: +e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Due Date (Day of Month)</label>
                  <input type="number" min="1" max="31" value={form.due_date} onChange={e => setForm({...form, due_date: +e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8 }}>Joining Date</label>
                  <input type="date" value={form.joining_date} onChange={e => setForm({...form, joining_date: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--ghost2)', borderRadius: 8, color: '#fff' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
              <button 
                onClick={() => step === 1 ? setAddingCard(false) : setStep(step - 1)} 
                style={{ padding: '10px 20px', color: 'var(--ghost)', fontSize: '0.88rem' }}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button onClick={nextStep} className="cta-pill" style={{ padding: '12px 30px' }}>
                {step === 4 ? 'SAVE CARD' : 'CONTINUE'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {cards.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', border: '1px dashed var(--ghost2)', borderRadius: 'var(--r)' }}>
                <p style={{ color: 'var(--ghost)', marginBottom: 20 }}>You have not added any cards yet.</p>
                <button onClick={() => setAddingCard(true)} className="cta-pill">ADD A CARD</button>
              </div>
            ) : (
              cards.map((c) => {
                const rRates = typeof c.reward_rates === 'string' ? JSON.parse(c.reward_rates) : c.reward_rates;
                const maxReward = Math.max(...Object.values(rRates as Record<string, number>));
                const maxCat = Object.keys(rRates).find(k => rRates[k] === maxReward);
                
                return (
                  <div key={c.id} style={{ background: 'linear-gradient(145deg, var(--ink2), var(--ink3))', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 24, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: 'var(--cyan-dim)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-hi)', fontFamily: 'var(--display)', letterSpacing: 1 }}>{c.card_name}</h3>
                        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--mono)', color: 'var(--cyan)', marginTop: 4 }}>{c.bank} • {c.card_type}</p>
                      </div>
                      <div style={{ width: 32, height: 24, borderRadius: 4, background: 'linear-gradient(135deg, #c9a84c, #e8d48b)' }}></div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: 1 }}>Limit</div>
                        <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600 }}>₹{c.credit_limit}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: 1 }}>Fee</div>
                        <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600 }}>₹{c.annual_fee}</div>
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--ink)', padding: '12px 15px', borderRadius: 8, display: 'flex', gap: 15, alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--ghost)' }}>Best For</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--magenta)', fontWeight: 600, textTransform: 'capitalize' }}>{maxCat || 'General'}</div>
                      </div>
                      <div style={{ fontSize: '1.2rem', color: 'var(--text-hi)', fontFamily: 'var(--display)' }}>{maxReward}% <span style={{fontSize:'0.6rem', color:'var(--ghost)'}}>RATE</span></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}
