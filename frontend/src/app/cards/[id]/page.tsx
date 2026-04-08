'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '@/components/BackgroundCanvas';

const CARD_DATA: Record<number, any> = {
  1: {
    id: 1, name: 'HDFC Millennia', bank: 'HDFC Bank', type: 'Cashback',
    joining: '₹1,000', annual: '₹999 (waived on ₹1L spend)', cibil: '700+',
    cashback: 'Flat 5% on Amazon, Flipkart, Myntra, Swiggy; 1% on all others',
    lounge: '4 domestic visits / year', fuel: '1% surcharge waiver at all stations',
    insurance: 'Purchase protection up to ₹50,000',
    desc: "Built for India's digital generation — heavy hitters on e-commerce get the most out of this card. Especially powerful paired with Amazon Pay ICICI for layered cashback.",
    pros: ['5% flat cashback on top apps', 'Lounge access included', 'Milestone benefits up to ₹1,000 extra', 'Wide acceptance'],
    cons: ['1% cashback on non-partner merchants is below average', 'Cap on cashback per quarter (₹1,000)', '₹1,000 joining fee', 'High CIBIL requirement'],
    useCase: 'Best for heavy Amazon / Flipkart / Swiggy users spending ₹8,000+ monthly on these platforms.',
    cashback_rate: 0.03, welcome: '₹2,000 gift voucher', sponsored: true,
  },
  2: {
    id: 2, name: 'SimplyCLICK SBI', bank: 'SBI Card', type: 'Rewards',
    joining: '₹499', annual: '₹499 (waived on ₹1L spend)', cibil: '680+',
    cashback: '10x reward points on Amazon, BookMyShow, Cleartrip; 5x on dining and groceries',
    lounge: '2 domestic visits / year', fuel: 'None', insurance: 'None',
    desc: 'India\'s most popular e-commerce rewards card. Simple to use, widely accepted, and the 10x rewards on Amazon make it a no-brainer for online shoppers.',
    pros: ['10x reward multiplier on top apps', 'Affordable fee waiver', 'Strong welcome benefit', 'Dining rewards'],
    cons: ['No fuel benefit', 'No insurance coverage', 'Rewards hard to redeem (points-based)'],
    useCase: 'Perfect for users who spend ₹5,000–₹15,000/month on Amazon and dining.',
    cashback_rate: 0.0125,
  },
  3: {
    id: 3, name: 'Axis Neo Travel', bank: 'Axis Bank', type: 'Travel',
    joining: 'Nil', annual: 'Nil', cibil: '650+',
    cashback: '2x Miles on travel bookings; 1% on all transactions',
    lounge: '2 domestic visits / year', fuel: '1% surcharge waiver', insurance: 'Travel cover up to ₹5L',
    desc: 'A zero-fee travel card that punches way above its weight. If you fly domestically 2–4 times a year, this card pays for itself and then some.',
    pros: ['Absolutely zero fee — forever', 'Free lounge access', 'Travel insurance included', 'Low CIBIL requirement'],
    cons: ['2x Miles is modest vs premium travel cards', 'Miles redemption requires Axis portal', 'No dining benefits'],
    useCase: 'Great entry-level travel card for users taking 3–6 domestic flights per year.',
    cashback_rate: 0.01,
  },
  4: {
    id: 4, name: 'IDFC First WOW', bank: 'IDFC First', type: 'Rewards',
    joining: 'Nil', annual: 'Nil', cibil: '650+',
    cashback: '3x reward points on fuel; 1.5% cashback on all spends',
    lounge: '4 domestic visits / year', fuel: '1% surcharge waiver + 3x points', insurance: 'Road side assistance',
    desc: 'Exceptional zero-fee card with surprisingly strong rewards. For users new to credit cards, this offers massive value without any annual cost.',
    pros: ['No fee ever', 'Best-in-class fuel rewards for a free card', '4 lounge visits/year', 'Roadside assistance'],
    cons: ['1.5% general cashback is modest', 'Spend more to get max value from lounge', 'No international acceptance focus'],
    useCase: 'Ideal as a primary free card for salaried professionals commuting daily.',
    cashback_rate: 0.015,
  },
  // ... shortened for brevity — all 10 cards would be here
};

export default function CardDetail({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [card, setCard] = useState<any>(null);
  const [monthlySpend, setMonthlySpend] = useState(15000);
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    const cardId = parseInt(params.id);
    // Try fetching from API first, fallback to local data
    fetch(`http://localhost:4000/api/cards/${cardId}`)
      .then(r => r.json())
      .then(data => {
        const local = CARD_DATA[cardId];
        setCard({ ...data.card, ...local });
      })
      .catch(() => {
        setCard(CARD_DATA[cardId] || { id: cardId, name: 'Card not found', bank: '', type: '' });
      });
  }, [params.id]);

  const runSimulation = () => {
    if (!card) return;
    const rate = card.cashback_rate || 0.01;
    const monthlyEarn = monthlySpend * rate;
    const yearlyEarn = monthlyEarn * 12;
    const annualFee = parseInt(card.annual?.replace(/[^0-9]/g, '') || '0');
    const net = yearlyEarn - annualFee;
    setSimResult({ monthlyEarn: Math.round(monthlyEarn), yearlyEarn: Math.round(yearlyEarn), net: Math.round(net), annualFee });
  };

  if (!card) return (
    <div style={{ padding: 120, textAlign: 'center', color: 'var(--ghost)' }}>Loading card data...</div>
  );

  return (
    <>
      <BackgroundCanvas />
      <div style={{ position: 'relative', zIndex: 1, padding: '100px clamp(28px, 6vw, 80px) 60px', maxWidth: 1000, margin: '0 auto', minHeight: '80vh' }}>
        <Link href="/cards" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32, color: 'var(--cyan)', fontSize: '0.9rem' }}>
          ← Back to All Cards
        </Link>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(140deg, #1a1f3a, #2a1f3a)', borderRadius: 'var(--r)', padding: '50px 40px', marginBottom: 32, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {card.sponsored && (
            <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--magenta)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1 }}>SPONSORED</div>
          )}
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--cyan)', letterSpacing: 2, marginBottom: 10 }}>{card.type?.toUpperCase()} • {card.bank}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-hi)', lineHeight: 1, marginBottom: 20 }}>{card.name}</h1>
          {card.desc && <p style={{ color: 'var(--text)', lineHeight: 1.7, maxWidth: 600 }}>{card.desc}</p>}
          <button className="cta-pill" style={{ marginTop: 24 }} onClick={() => window.open(`http://localhost:4000/api/cards/apply/${card.id}`, '_blank')}>
            APPLY NOW →
          </button>
        </div>

        {/* Quick Specs + Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 28 }}>
            <h3 style={{ color: 'var(--text-hi)', fontSize: '1rem', marginBottom: 20, borderBottom: '1px solid var(--ghost)', paddingBottom: 12 }}>Quick Specs</h3>
            {[
              ['Joining Fee', card.joining],
              ['Annual Fee', card.annual],
              ['Min CIBIL', card.cibil],
              ['Cashback', card.cashback],
              ['Lounge', card.lounge],
              ['Fuel', card.fuel],
              ['Insurance', card.insurance],
              ['Welcome Bonus', card.welcome],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--ghost)', flexShrink: 0 }}>{k}</span>
                <span style={{ color: '#fff', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Pros */}
            <div style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid var(--cyan)', borderRadius: 'var(--r)', padding: 24 }}>
              <h3 style={{ color: 'var(--cyan)', fontSize: '1rem', marginBottom: 16 }}>✅ Pros</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(card.pros || []).map((p: string) => (
                  <li key={p} style={{ fontSize: '0.88rem', color: 'var(--text-hi)', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#00b894', flexShrink: 0 }}>+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            {/* Cons */}
            <div style={{ background: 'rgba(232,67,147,0.05)', border: '1px solid var(--magenta)', borderRadius: 'var(--r)', padding: 24 }}>
              <h3 style={{ color: 'var(--magenta)', fontSize: '1rem', marginBottom: 16 }}>❌ Cons</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(card.cons || []).map((c: string) => (
                  <li key={c} style={{ fontSize: '0.88rem', color: 'var(--text-hi)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--magenta)', flexShrink: 0 }}>−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Best Use-Case */}
        {card.useCase && (
          <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 28, marginBottom: 24 }}>
            <h3 style={{ color: 'var(--text-hi)', fontSize: '1rem', marginBottom: 12 }}>🎯 Best Use-Case</h3>
            <p style={{ color: 'var(--text)', lineHeight: 1.7 }}>{card.useCase}</p>
          </div>
        )}

        {/* Mini Cashback Simulator */}
        <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 28 }}>
          <h3 style={{ color: 'var(--text-hi)', fontSize: '1rem', marginBottom: 20 }}>🧮 Real Cashback Simulation</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span style={{ color: 'var(--text)' }}>Your monthly spend</span>
                <span style={{ color: 'var(--cyan)' }}>₹{monthlySpend.toLocaleString()}</span>
              </div>
              <input type="range" min="1000" max="100000" step="500" value={monthlySpend} onChange={e => setMonthlySpend(+e.target.value)} style={{ width: '100%' }} />
            </div>
            <button onClick={runSimulation} className="cta-pill" style={{ padding: '10px 24px', fontSize: '0.85rem', flexShrink: 0 }}>SIMULATE</button>
          </div>
          {simResult && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 24 }}>
              {[
                { label: 'Monthly Earn', value: `₹${simResult.monthlyEarn.toLocaleString()}`, color: 'var(--cyan)' },
                { label: 'Yearly Earn', value: `₹${simResult.yearlyEarn.toLocaleString()}`, color: 'var(--cyan)' },
                { label: 'Annual Fee', value: `₹${simResult.annualFee.toLocaleString()}`, color: 'var(--magenta)' },
                { label: 'Net Benefit/yr', value: `₹${simResult.net.toLocaleString()}`, color: simResult.net >= 0 ? '#00b894' : 'var(--magenta)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'var(--ink3)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ghost)', marginBottom: 8, fontFamily: 'var(--mono)' }}>{label}</div>
                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--display)', color }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
