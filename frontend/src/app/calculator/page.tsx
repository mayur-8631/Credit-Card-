'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import BackgroundCanvas from '@/components/BackgroundCanvas';

const SPEND_COLORS = ['#00e5ff', '#e84393', '#fdcb6e', '#6c5ce7'];

export default function CalculatorPage() {
  const [profile, setProfile] = useState({ shopping: 10000, travel: 5000, fuel: 3000, bills: 4000 });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bestSaving, setBestSaving] = useState<number | null>(null);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/cards/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, priorities: { cashback: 8, rewards: 5, travel: 5, fuel: 5, insurance: 3 } })
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = data.cards.slice(0, 6).map((c: any) => {
          const totalSpend = Object.values(profile).reduce((a: any, b: any) => a + b, 0);
          const cashback = c.calc?.totalCashback || (totalSpend * 12 * 0.015);
          const fees = c.annual_fee || 0;
          const net = cashback - fees;
          return { name: c.name, Cashback: Math.round(cashback), Fees: fees, Net: Math.round(net) };
        });
        setResults(formatted);
        if (formatted.length >= 2) {
          setBestSaving(Math.round(formatted[0].Net - formatted[1].Net));
        }
      }
    } catch {
      // Fallback demo data
      const totalSpend = Object.values(profile).reduce((a: any, b: any) => a + b, 0);
      const demo = [
        { name: 'SBI Cashback', Cashback: Math.round(totalSpend * 12 * 0.05), Fees: 999, Net: Math.round(totalSpend * 12 * 0.05 - 999) },
        { name: 'HDFC Millennia', Cashback: Math.round(totalSpend * 12 * 0.03), Fees: 1000, Net: Math.round(totalSpend * 12 * 0.03 - 1000) },
        { name: 'IDFC First WOW', Cashback: Math.round(totalSpend * 12 * 0.015), Fees: 0, Net: Math.round(totalSpend * 12 * 0.015) },
        { name: 'Axis Neo Travel', Cashback: Math.round(totalSpend * 12 * 0.01), Fees: 0, Net: Math.round(totalSpend * 12 * 0.01) },
      ];
      setResults(demo);
      setBestSaving(Math.round(demo[0].Net - demo[1].Net));
    }
    setLoading(false);
  };

  const pieData = Object.entries(profile).map(([key, val]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value: val }));
  const totalSpend = Object.values(profile).reduce((a, b) => a + b, 0);

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--text-hi)' }}>
          CASHBACK <span style={{ color: 'var(--cyan)' }}>CALCULATOR</span>
        </h1>
        <p style={{ maxWidth: 600, marginTop: 12, lineHeight: 1.7, color: 'var(--text)' }}>
          Enter your average monthly spending. STACKR calculates your exact ₹ returns for every card — monthly and yearly.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginTop: 50 }}>

          {/* Input Panel */}
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 30 }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-hi)', marginBottom: 24 }}>📊 Monthly Spend (₹)</h3>
            {Object.keys(profile).map(cat => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: 'var(--text)' }}>{cat}</label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cyan)' }}>₹{(profile as any)[cat].toLocaleString()}</span>
                </div>
                <input
                  type="range" min="0" max="50000" step="500"
                  value={(profile as any)[cat]}
                  onChange={(e) => setProfile({ ...profile, [cat]: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            ))}

            {/* Spending Pie Chart */}
            <div style={{ height: 200, marginTop: 20 }}>
              <ResponsiveContainer width="99%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={SPEND_COLORS[i % SPEND_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val: any) => `₹${val.toLocaleString()}`} contentStyle={{ background: 'var(--ink3)', border: '1px solid var(--ghost)', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ghost)', marginTop: 4 }}>
              Total monthly spend: <strong style={{ color: '#fff' }}>₹{totalSpend.toLocaleString()}</strong>
            </div>

            <button onClick={calculate} disabled={loading} className="cta-pill" style={{ width: '100%', marginTop: 24, padding: 14 }}>
              {loading ? 'CALCULATING...' : 'CALCULATE MY RETURNS'}
            </button>
          </div>

          {/* Results Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Best saving callout */}
            {bestSaving !== null && bestSaving > 0 && (
              <div style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid var(--cyan)', borderRadius: 'var(--r)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '2rem' }}>🏆</span>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--cyan)', letterSpacing: 1 }}>TOP PICK ADVANTAGE</div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-hi)', marginTop: 4 }}>
                    Best card saves you <strong style={{ color: 'var(--cyan)' }}>₹{bestSaving.toLocaleString()} more</strong> per year than #2
                  </div>
                </div>
              </div>
            )}

            {/* Bar chart */}
            <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 24, flex: 1, minHeight: 380 }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-hi)', marginBottom: 20 }}>Annual Net Benefit (₹)</h3>
              {results.length > 0 ? (
                <ResponsiveContainer width="99%" height={300}>
                  <BarChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} angle={-40} textAnchor="end" />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                    <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} contentStyle={{ background: 'var(--ink3)', border: '1px solid var(--cyan)', borderRadius: 8 }} />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="Cashback" fill="var(--cyan)" radius={[4,4,0,0]} />
                    <Bar dataKey="Fees" fill="var(--magenta)" radius={[4,4,0,0]} />
                    <Bar dataKey="Net" fill="#00b894" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ghost)' }}>
                  Enter your spend and hit Calculate
                </div>
              )}
            </div>

            {/* Breakdown table */}
            {results.length > 0 && (
              <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--ghost)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--ghost)', fontWeight: 500 }}>Card</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ghost)', fontWeight: 500 }}>Monthly</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ghost)', fontWeight: 500 }}>Yearly</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ghost)', fontWeight: 500 }}>Net/yr</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i === 0 ? 'rgba(0,229,255,0.04)' : '' }}>
                        <td style={{ padding: '12px 16px', color: i === 0 ? 'var(--cyan)' : 'var(--text-hi)' }}>{i === 0 ? '🥇 ' : ''}{r.name}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)' }}>₹{Math.round(r.Cashback / 12).toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)' }}>₹{r.Cashback.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: r.Net >= 0 ? '#00b894' : 'var(--magenta)', fontWeight: 600 }}>₹{r.Net.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
