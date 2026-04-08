'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';

const ALL_CARDS = [
  { id:1, name:'HDFC Millennia', bank:'HDFC Bank', type:'Cashback', joining:'₹1,000', lounge:'4 / yr', cibil:700, cashback_pct:5 },
  { id:2, name:'SimplyCLICK SBI', bank:'SBI Card', type:'Rewards', joining:'₹499', lounge:'2 / yr', cibil:680, cashback_pct:1.25 },
  { id:3, name:'Axis Neo Travel', bank:'Axis Bank', type:'Travel', joining:'Nil', lounge:'2 / yr', cibil:650, cashback_pct:1 },
  { id:4, name:'IDFC First WOW', bank:'IDFC First', type:'Rewards', joining:'Nil', lounge:'4 / yr', cibil:650, cashback_pct:1.5 },
  { id:5, name:'SBI IRCTC', bank:'SBI Card', type:'Travel', joining:'₹500', lounge:'2 / yr', cibil:680, cashback_pct:5 },
  { id:6, name:'SBI Cashback', bank:'SBI Card', type:'Cashback', joining:'₹999', lounge:'2 / yr', cibil:700, cashback_pct:5 },
  { id:7, name:'HDFC Freedom', bank:'HDFC Bank', type:'Rewards', joining:'₹500', lounge:'2 / yr', cibil:680, cashback_pct:3.3 },
  { id:8, name:'BPCL IndusInd', bank:'IndusInd', type:'Fuel', joining:'Nil', lounge:'4 / yr', cibil:650, cashback_pct:2.65 },
  { id:9, name:'Axis LIC Card', bank:'Axis Bank', type:'Rewards', joining:'Nil', lounge:'2 / yr', cibil:650, cashback_pct:1 },
  { id:10, name:'HSBC Travel One', bank:'HSBC', type:'Travel', joining:'₹4,999', lounge:'8 / yr', cibil:720, cashback_pct:2 },
];

const TYPE_COLORS: Record<string, string> = {
  Cashback: '#00e5ff', Travel: '#6c5ce7', Rewards: '#fdcb6e', Fuel: '#fd79a8',
};

export default function CardsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isLifetimeFree, setIsLifetimeFree] = useState(false);
  const [hasLounge, setHasLounge] = useState(false);
  const [maxCibil, setMaxCibil] = useState<number>(900);
  const [minCashback, setMinCashback] = useState<number>(0);

  const filtered = ALL_CARDS.filter(c => {
    const sMatch = c.name.toLowerCase().includes(search.toLowerCase()) || c.bank.toLowerCase().includes(search.toLowerCase());
    const tMatch = filterType === 'All' || c.type === filterType;
    const ltfMatch = !isLifetimeFree || c.joining === 'Nil';
    const loungeMatch = !hasLounge || (c.lounge && c.lounge !== 'None');
    const cibilMatch = c.cibil <= maxCibil;
    const cashbackMatch = c.cashback_pct >= minCashback;
    return sMatch && tMatch && ltfMatch && loungeMatch && cibilMatch && cashbackMatch;
  });

  return (
    <div style={{ padding: '120px clamp(28px, 6vw, 80px) 60px', maxWidth: 1200, margin: '0 auto', minHeight: '80vh' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-hi)', marginBottom: 8 }}>
        EXPLORE <span style={{ color: 'var(--cyan)' }}>ALL CARDS</span>
      </h1>
      <p style={{ color: 'var(--text)', marginBottom: 40 }}>{ALL_CARDS.length} cards · Use filters to narrow down your perfect match</p>

      {/* Search + Type Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280, display: 'flex', alignItems: 'center', background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: '0 16px' }}>
          <Search size={18} color="var(--ghost)" />
          <input
            type="text" placeholder="Search card name or bank..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '14px 12px', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: '0 20px' }}>
          <SlidersHorizontal size={16} color="var(--cyan)" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer', padding: '14px 0' }}>
            <option>All</option><option>Cashback</option><option>Travel</option><option>Rewards</option><option>Fuel</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: '20px 24px', marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--cyan)', letterSpacing: 1, marginBottom: 16 }}>ADVANCED FILTERS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-hi)' }}>
            <input type="checkbox" checked={isLifetimeFree} onChange={e => setIsLifetimeFree(e.target.checked)} />
            Lifetime Free
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-hi)' }}>
            <input type="checkbox" checked={hasLounge} onChange={e => setHasLounge(e.target.checked)} />
            Lounge Access
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>Max CIBIL Required: <strong style={{ color: 'var(--cyan)' }}>{maxCibil}</strong></div>
            <input type="range" min="600" max="900" step="10" value={maxCibil} onChange={e => setMaxCibil(+e.target.value)} style={{ width: 200 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>Min Cashback %: <strong style={{ color: 'var(--cyan)' }}>{minCashback}%</strong></div>
            <input type="range" min="0" max="5" step="0.25" value={minCashback} onChange={e => setMinCashback(+e.target.value)} style={{ width: 200 }} />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 20, fontSize: '0.85rem', color: 'var(--ghost)' }}>
        Showing <strong style={{ color: 'var(--text-hi)' }}>{filtered.length}</strong> of {ALL_CARDS.length} cards
      </div>

      {/* Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: 'var(--ink2)', border: '1px solid var(--ghost)', borderRadius: 'var(--r)', padding: 24, display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as any).style.transform = 'translateY(-4px)'; (e.currentTarget as any).style.borderColor = TYPE_COLORS[c.type] || 'var(--cyan)'; }}
            onMouseLeave={e => { (e.currentTarget as any).style.transform = ''; (e.currentTarget as any).style.borderColor = 'var(--ghost)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: TYPE_COLORS[c.type] || 'var(--cyan)', letterSpacing: 1 }}>{c.type.toUpperCase()}</div>
              {c.joining === 'Nil' && <div style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, fontFamily: 'var(--mono)' }}>FREE</div>}
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-hi)', marginBottom: 4 }}>{c.name}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ghost)', marginBottom: 16 }}>{c.bank}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['Joining', c.joining],
                ['Max Cashback', `${c.cashback_pct}%`],
                ['Lounge', c.lounge],
                ['Min CIBIL', c.cibil]
              ].map(([k, v]) => (
                <div key={k as string} style={{ background: 'var(--ink3)', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--ghost)', fontFamily: 'var(--mono)' }}>{k}</div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>

            <Link href={`/cards/${c.id}`} style={{ marginTop: 'auto', display: 'block', textAlign: 'center', padding: '10px', background: 'var(--ink4)', borderRadius: 8, fontSize: '0.8rem', color: '#fff', fontWeight: 600, letterSpacing: 0.5 }}>
              VIEW DETAILS →
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 80, color: 'var(--ghost)' }}>
            No cards match your filters. Try relaxing the criteria.
          </div>
        )}
      </div>
    </div>
  );
}
