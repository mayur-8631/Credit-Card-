'use client';

import { useState } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function SimulatorPage() {
  const [currentScore, setCurrentScore] = useState(720);
  const [creditLimit, setCreditLimit] = useState(100000);
  const [monthlySpend, setMonthlySpend] = useState(40000);
  const [missedPayments, setMissedPayments] = useState(0);

  const calculateImpact = () => {
    let utilization = (monthlySpend / creditLimit) * 100;
    let impact = 0;

    // Utilization impact
    if (utilization > 50) impact -= 25;
    else if (utilization > 30) impact -= 10;
    else if (utilization < 10) impact += 5;
    else impact += 15;

    // Payment history impact
    if (missedPayments > 0) impact -= (missedPayments * 40);
    else impact += 20;

    const projected = Math.max(300, Math.min(900, currentScore + impact));
    return projected;
  };

  const projectedScore = calculateImpact();
  const diff = projectedScore - currentScore;

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-hi)' }}>
          CREDIT SCORE <span style={{ color: 'var(--magenta)' }}>SIMULATOR</span>
        </h1>
        <p style={{ marginTop: 16, lineHeight: 1.6 }}>Play with different credit habits to see how they impact your CIBIL score in the next 6 months.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 60 }}>
          
          {/* Inputs */}
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 30 }}>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span>Current Score</span><span style={{ color: 'var(--cyan)' }}>{currentScore}</span>
              </label>
              <input type="range" min="300" max="900" value={currentScore} onChange={e => setCurrentScore(+e.target.value)} style={{ width: '100%' }}/>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span>Total Credit Limit</span><span style={{ color: 'var(--cyan)' }}>₹{creditLimit.toLocaleString()}</span>
              </label>
              <input type="range" min="10000" max="1000000" step="10000" value={creditLimit} onChange={e => setCreditLimit(+e.target.value)} style={{ width: '100%' }}/>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span>Monthly Spend (Utilization)</span><span style={{ color: 'var(--cyan)' }}>₹{monthlySpend.toLocaleString()} ({Math.round(monthlySpend/creditLimit*100)}%)</span>
              </label>
              <input type="range" min="0" max={creditLimit} step="1000" value={monthlySpend} onChange={e => setMonthlySpend(+e.target.value)} style={{ width: '100%' }}/>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span>Missed Payments (Last 6 Months)</span><span style={{ color: 'var(--magenta)' }}>{missedPayments}</span>
              </label>
              <input type="range" min="0" max="6" value={missedPayments} onChange={e => setMissedPayments(+e.target.value)} style={{ width: '100%' }}/>
            </div>

          </div>

          {/* Results */}
          <div style={{ background: 'var(--ink2)', border: `1px solid ${diff >= 0 ? 'var(--cyan)' : 'var(--magenta)'}`, borderRadius: 'var(--r)', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-hi)', marginBottom: 10 }}>Projected Score (6 Months)</h3>
            <div style={{ fontFamily: 'var(--display)', fontSize: '5rem', color: diff >= 0 ? 'var(--cyan)' : 'var(--magenta)', lineHeight: 1 }}>
              {projectedScore}
            </div>
            <div style={{ fontSize: '1.1rem', marginTop: 10, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Change: <span style={{ color: diff >= 0 ? 'var(--cyan)' : 'var(--magenta)' }}>{diff > 0 ? '+' : ''}{diff}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: 30, maxWidth: 280 }}>
              {utilizationText(monthlySpend, creditLimit)}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

function utilizationText(spend: number, limit: number) {
  const p = spend/limit;
  if(p > 0.5) return 'Your credit utilization is critically high (>50%). This is damaging your score significantly.';
  if(p > 0.3) return 'Your credit utilization is above 30%. Paying balances twice a month can help lower this reporting.';
  return 'Your utilization is in the healthy zone! Keep maintaining timely payments.';
}
