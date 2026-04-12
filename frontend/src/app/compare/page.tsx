'use client';

import { useState } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import { LOCAL_CARDS } from '@/app/page';

export default function CompareEngine() {
  const [loading, setLoading] = useState(false);
  const [recommendedCards, setRecommendedCards] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    existing_card: LOCAL_CARDS[0].id,
    online_spend: 10000,
    travel_spend: 3000,
    fuel_spend: 2000,
    dining_spend: 4000,
    general_spend: 5000
  });

  const totalSpend = form.online_spend + form.travel_spend + form.fuel_spend + form.dining_spend + form.general_spend;

  const calculateRewards = (card: typeof LOCAL_CARDS[0], spend: typeof form) => {
    let totalRwd = 0;
    
    // Core reward approximation
    if (card.type === 'Cashback') {
      totalRwd += spend.online_spend * 0.04; 
      totalRwd += spend.general_spend * 0.01;
    } else if (card.type === 'Travel') {
      totalRwd += spend.travel_spend * 0.06;
      totalRwd += spend.general_spend * 0.01;
    } else if (card.type === 'Fuel') {
      totalRwd += spend.fuel_spend * 0.05;
      totalRwd += spend.general_spend * 0.01;
    } else { // Rewards
      totalRwd += spend.online_spend * 0.02;
      totalRwd += spend.dining_spend * 0.03;
      totalRwd += spend.general_spend * 0.015;
    }
    
    // Granular scoring adjustments from the simulated `sc` weights
    totalRwd += (card.sc.cashback * spend.online_spend * 0.001);
    totalRwd += (card.sc.rewards * spend.dining_spend * 0.001);
    totalRwd += (card.sc.travel * spend.travel_spend * 0.001);
    totalRwd += (card.sc.fuel * spend.fuel_spend * 0.001);

    const annualFee = parseInt(card.annual.replace(/[^0-9]/g, '') || '0');
    return (totalRwd * 12) - annualFee;
  };

  const runComparison = () => {
    setLoading(true);
    setRecommendedCards([]);
    
    setTimeout(() => {
      const currentCard = LOCAL_CARDS.find(c => c.id === form.existing_card) || LOCAL_CARDS[0];
      const baseReward = calculateRewards(currentCard, form);
      
      const alternatives = LOCAL_CARDS.map(card => {
        if (card.id === currentCard.id) return null;
        const newReward = calculateRewards(card, form);
        return {
          ...card,
          yearlyNet: newReward,
          difference: newReward - baseReward
        };
      }).filter(Boolean) as any[];
      
      alternatives.sort((a, b) => b.difference - a.difference);
      
      // Only returning cards that are strictly better
      const betterCards = alternatives.filter(c => c.difference > 0);
      setRecommendedCards(betterCards.length > 0 ? betterCards.slice(0, 3) : []);
      
      setLoading(false);
    }, 800);
  };

  const currentCardObj = LOCAL_CARDS.find(c => c.id === form.existing_card) || LOCAL_CARDS[0];

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1200, margin: '0 auto', minHeight: '80vh' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="sec-label" style={{ justifyContent: 'center' }}>AI Engine</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-hi)', lineHeight: 1 }}>
            CARD <span style={{ color: 'var(--magenta)' }}>UPGRADE</span>
          </h1>
          <p style={{ color: 'var(--ghost)', marginTop: 16, maxWidth: 600, margin: '16px auto 0' }}>
            Enter your current card and spending to see exactly how much you are leaving on the table. We calculate differences based on real rewards structures.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr)', gap: 40, maxWidth: 800, margin: '0 auto' }}>
          
          {/* Configuration Panel */}
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--ghost2)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Your Current Card</label>
              <select value={form.existing_card} onChange={(e) => setForm({...form, existing_card: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--ink3)', border: '1px solid var(--magenta)', borderRadius: 8, color: '#fff', fontSize: '1rem', outline: 'none' }}>
                {LOCAL_CARDS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.bank})</option>)}
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ color: 'var(--text-hi)', fontSize: '1.1rem' }}>Monthly Spending</h4>
                <div style={{ fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--display)' }}>Total: ₹{totalSpend.toLocaleString()}</div>
              </div>

              {[
                { label: 'Online Shopping', key: 'online_spend' },
                { label: 'Travel & Flights', key: 'travel_spend' },
                { label: 'Dining Out', key: 'dining_spend' },
                { label: 'Fuel', key: 'fuel_spend' },
                { label: 'General Spends', key: 'general_spend' },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px', alignItems: 'center', gap: 15, marginBottom: 12 }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ghost)' }}>{label}</label>
                  <input type="range" min="0" max="50000" step="1000" value={(form as any)[key]}
                    onChange={(e) => setForm({...form, [key]: parseInt(e.target.value)})} 
                    style={{ flex: 1, accentColor: 'var(--magenta)' }} />
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'var(--text-hi)', textAlign: 'right' }}>₹{(form as any)[key]}</div>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', textAlign: 'center', marginTop: 10 }}>
              <button onClick={runComparison} disabled={loading} style={{ 
                background: 'linear-gradient(135deg, var(--magenta), #e0267f)', color: '#fff',
                padding: '14px 40px', borderRadius: 50, fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1, 
                boxShadow: '0 0 20px rgba(255,45,149,0.25)', opacity: loading ? 0.7 : 1, width: '100%', cursor: 'pointer'
              }}>
                {loading ? 'ANALYZING CARDS...' : 'FIND BETTER CARDS'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          {recommendedCards.length > 0 && (
            <div className="ranked-panel" style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--display)', color: 'var(--text-hi)', marginBottom: 20, textAlign: 'center', letterSpacing: 1 }}>
                WE FOUND UPGRADES
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {recommendedCards.map((card, index) => (
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
                      <h4 style={{ fontSize: '1.2rem', color: 'var(--text-hi)', fontWeight: 600, marginBottom: 4 }}>{card.name}</h4>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--ghost)' }}>{card.bank} • {card.type}</div>
                      <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--magenta-dim)', borderRadius: 6, display: 'inline-block' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--magenta)' }}>💡 Saves you more on {card.type} spending</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: 120 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ghost)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>EXTRA GAIN</div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: '2.2rem', color: '#00b894', lineHeight: 1 }}>
                        +₹{Math.floor(card.difference).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ghost)', marginTop: 4 }}>yearly vs. {currentCardObj.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {recommendedCards.length === 0 && !loading && (
            <div style={{ textAlign: 'center', color: 'var(--ghost)', marginTop: 20 }}>
              Adjust your spending or run the AI to find matches.
            </div>
          )}

        </div>
      </div>
    </>
  );
}

