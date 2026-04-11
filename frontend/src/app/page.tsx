'use client';

import { useState, useEffect } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import AIInsights from '@/components/AIInsights';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PRIORITIES = [
  { key: 'cashback', label: 'Cashback', val: 5 },
  { key: 'rewards', label: 'Rewards', val: 5 },
  { key: 'travel', label: 'Travel', val: 5 },
  { key: 'fuel', label: 'Fuel', val: 5 },
  { key: 'insurance', label: 'Insurance', val: 5 },
];

const LOCAL_CARDS = [
  {id:1,name:"HDFC Millennia",bank:"HDFC Bank",type:"Cashback",grad:"linear-gradient(140deg,#1a1f3a,#2a1f3a)",acc:"#e84393",joining:"₹1,000",annual:"₹1,000",reward:"10x CashPoints",lounge:"4 / yr",cashback:"Up to 5%",fuel:"1% waiver",insurance:"Purchase Protect",welcome:"₹2,000 gift",cibil:"700+",sc:{cashback:9,rewards:7,travel:4,fuel:5,insurance:6},sponsored:true},
  {id:2,name:"SimplyCLICK SBI",bank:"SBI Card",type:"Rewards",grad:"linear-gradient(140deg,#1a2a1f,#1f3a2a)",acc:"#00e5ff",joining:"₹499",annual:"₹499",reward:"10x Reward Pts",lounge:"2 / yr",cashback:"Up to 1.25%",fuel:"None",insurance:"None",welcome:"₹500 welcome",cibil:"680+",sc:{cashback:4,rewards:9,travel:3,fuel:2,insurance:3}},
  {id:3,name:"Axis Neo Travel",bank:"Axis Bank",type:"Travel",grad:"linear-gradient(140deg,#1f1f3a,#1a1f2a)",acc:"#6c5ce7",joining:"Nil",annual:"Nil",reward:"2x Miles",lounge:"2 / yr",cashback:"Up to 1%",fuel:"1% waiver",insurance:"Travel Cover",welcome:"500 bonus pts",cibil:"650+",sc:{cashback:3,rewards:5,travel:9,fuel:4,insurance:7}},
  {id:4,name:"IDFC First WOW",bank:"IDFC First",type:"Rewards",grad:"linear-gradient(140deg,#2a1f1f,#3a2a1f)",acc:"#fdcb6e",joining:"Nil",annual:"Nil",reward:"3x on Fuel",lounge:"4 / yr",cashback:"Up to 1.5%",fuel:"1% waiver",insurance:"Road Side",welcome:"₹200 cashback",cibil:"650+",sc:{cashback:5,rewards:6,travel:5,fuel:7,insurance:5}},
  {id:5,name:"SBI IRCTC",bank:"SBI Card",type:"Travel",grad:"linear-gradient(140deg,#1f2a1f,#2a3a1f)",acc:"#00b894",joining:"₹500",annual:"₹500",reward:"5x on Trains",lounge:"2 / yr",cashback:"5% on trains",fuel:"None",insurance:"Travel Insur.",welcome:"₹500 rail pts",cibil:"680+",sc:{cashback:6,rewards:4,travel:10,fuel:1,insurance:6}},
  {id:6,name:"SBI Cashback",bank:"SBI Card",type:"Cashback",grad:"linear-gradient(140deg,#2a2a1f,#3a3a1f)",acc:"#e17055",joining:"₹999",annual:"₹999",reward:"1x Base",lounge:"2 / yr",cashback:"5% online",fuel:"None",insurance:"None",welcome:"₹750 welcome",cibil:"700+",sc:{cashback:10,rewards:3,travel:2,fuel:1,insurance:2}},
  {id:7,name:"HDFC Freedom",bank:"HDFC Bank",type:"Rewards",grad:"linear-gradient(140deg,#1f1a2a,#2a1f3a)",acc:"#a29bfe",joining:"₹500",annual:"₹500",reward:"10x on Select",lounge:"2 / yr",cashback:"Up to 3.3%",fuel:"1% waiver",insurance:"Purchase Prot.",welcome:"₹500 cashback",cibil:"680+",sc:{cashback:7,rewards:8,travel:4,fuel:5,insurance:5}},
  {id:8,name:"BPCL IndusInd",bank:"IndusInd",type:"Fuel",grad:"linear-gradient(140deg,#2a1f2a,#1f1f2a)",acc:"#fd79a8",joining:"Nil",annual:"Nil",reward:"5x on Fuel",lounge:"4 / yr",cashback:"Up to 2.65%",fuel:"4x at BPCL",insurance:"Road Side",welcome:"500 fuel pts",cibil:"650+",sc:{cashback:5,rewards:4,travel:3,fuel:10,insurance:5}},
  {id:9,name:"Axis LIC Card",bank:"Axis Bank",type:"Rewards",grad:"linear-gradient(140deg,#1f2a2a,#1f3a3a)",acc:"#55efc4",joining:"Nil",annual:"Nil",reward:"2x on LIC",lounge:"2 / yr",cashback:"Up to 1%",fuel:"1% waiver",insurance:"LIC Cover",welcome:"Bonus reward",cibil:"650+",sc:{cashback:3,rewards:5,travel:3,fuel:4,insurance:8}},
  {id:10,name:"HSBC Travel One",bank:"HSBC",type:"Travel",grad:"linear-gradient(140deg,#2a2a2a,#1f2a2a)",acc:"#74b9ff",joining:"₹4,999",annual:"₹4,999",reward:"3x Intl Miles",lounge:"8 / yr",cashback:"Up to 2%",fuel:"1% waiver",insurance:"Global Cover",welcome:"₹5,000 travel",cibil:"720+",sc:{cashback:4,rewards:6,travel:10,fuel:3,insurance:9}},
];

const FAQS = [
  {q:"How does the Priority Engine work?",a:"You weight five spending categories using the sliders. STACKR runs a weighted-score algorithm across all cards in real time and surfaces the top matches for your unique profile — no two users get the same ranking."},
  {q:"Does using STACKR hurt my CIBIL score?",a:"Not at all. Browsing and comparing is 100% inquiry-free. A hard pull only occurs when you formally apply through the issuer's own portal — completely outside our platform."},
  {q:"What does 'Pin to Compare' do?",a:"Pin any two cards from the Deck and a comparison tray appears at the bottom. Hit Compare for a feature-by-feature head-to-head with automatic winner badges on fee fields."},
  {q:"Are the card details here up to date?",a:"Yes — our data team updates fees, rewards and offers weekly. Always double-check with the issuer before applying, as terms can change overnight."},
];

export default function Home() {
  const [priorities, setPriorities] = useState(PRIORITIES.reduce((acc, p) => ({ ...acc, [p.key]: p.val }), {}));
  const [rankedCards, setRankedCards] = useState<any[]>(LOCAL_CARDS);
  const [pinned, setPinned] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isCmpOpen, setIsCmpOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fetchRankings = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/cards/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priorities })
      });
      if (res.ok) {
        const data = await res.json();
        setRankedCards(data.cards.slice(0, 6)); // Display top 6 matches
      } else {
        // Mock local fallback
        const fallback = computeFallback(priorities);
        setRankedCards(fallback);
      }
    } catch (e) {
      const fallback = computeFallback(priorities);
      setRankedCards(fallback);
    }
  };

  const computeFallback = (currentPriorities: any) => {
    let w = 0;
    Object.values(currentPriorities).forEach((v: any) => w += v);
    
    const activeCards = LOCAL_CARDS.map(c => {
      let t = 0;
      Object.keys(currentPriorities).forEach((k) => {
        t += (c.sc[k as keyof typeof c.sc] || 0) * currentPriorities[k];
      });
      const score = w ? Math.round((t / w) * 10) / 10 : 0;
      return { ...c, score };
    });
    
    return activeCards.sort((a, b) => b.score - a.score).slice(0, 6);
  };

  useEffect(() => {
    fetchRankings();
  }, [priorities]);

  const onSlide = (key: string, v: string) => {
    setPriorities(prev => ({ ...prev, [key]: parseInt(v) }));
  };

  const togglePin = (id: number) => {
    setPinned(prev => {
      const idx = prev.indexOf(id);
      let next: number[];
      if (idx > -1) next = prev.filter((_, i) => i !== idx);
      else if (prev.length < 4) next = [...prev, id];
      else next = prev;
      // Save names to localStorage for profile page
      const names = next.map(pid => LOCAL_CARDS.find(x => x.id === pid)?.name).filter(Boolean);
      localStorage.setItem('stackr_pinned_cards', JSON.stringify(names));
      return next;
    });
  };

  const openCompare = () => {
    if (pinned.length >= 2) setIsCmpOpen(true);
  };

  // Safe checks for the comparison modal
  const cardA = LOCAL_CARDS.find(c => c.id === pinned[0]);
  const cardB = LOCAL_CARDS.find(c => c.id === pinned[1]);

  const feeWin = (va: string, vb: string) => {
    if (va === 'Nil' && vb !== 'Nil') return 'a';
    if (vb === 'Nil' && va !== 'Nil') return 'b';
    const pa = parseInt(va.replace(/[^0-9]/g, '') || '9999');
    const pb = parseInt(vb.replace(/[^0-9]/g, '') || '9999');
    return pa < pb ? 'a' : pb < pa ? 'b' : '';
  };

  const getChartData = () => {
    if (pinned.length < 2) return [];
    const mapping: any = { 'Cashback': 90, 'Travel': 80, 'Rewards': 75 };
    const axes = ['Cashback', 'Travel Benefits', 'Fuel Waivers', 'Low Fees', 'Lifestyle/Lounge'];
    return axes.map(axis => {
      const row: any = { subject: axis };
      pinned.forEach(pid => {
        const c = LOCAL_CARDS.find(x => x.id === pid);
        if(!c) return;
        // Mock score calculations based on the axis to visualize radar diffs
        let score = 50 + (Math.random() * 40); 
        if(axis === 'Cashback' && c.type === 'Cashback') score = 95;
        if(axis === 'Travel Benefits' && c.type === 'Travel') score = 95;
        if(axis === 'Low Fees' && c.joining === 'Nil') score = 100;
        row[c.name] = score;
      });
      return row;
    });
  };

  return (
    <>
      <BackgroundCanvas />



      <section className="hero">
        <div className="hero-tag">Intelligent Card Selection</div>
        <h1>PICK<br/><span className="outline">SMARTER</span><br/>CARDS.</h1>
        <p className="hero-sub">STACKR ranks every card in India using <strong>your</strong> spending DNA. No guesswork. No scrolling through 200 options. Just the right card — instantly.</p>
        <div className="hero-float">
          <div className="f-num">50+</div>
          <div className="f-lab">CARDS ANALYSED IN REAL-TIME</div>
        </div>
        <div className="scroll-cue"><span>SCROLL</span><div className="cue-line"></div></div>
      </section>

      <section className="engine-wrap">
        <div className="engine-left">
          <div className="sec-label">Priority Engine</div>
          <h2>TELL US<br/>WHAT MATTERS</h2>
          <p>Drag each slider to weight what's important to you. The ranking updates <em>live</em> — no button press needed.</p>
          <div className="slider-stack">
            {PRIORITIES.map((p) => (
              <div className="slider-row" key={p.key}>
                <span className="s-label">{p.label}</span>
                <input 
                  type="range" 
                  className="s-slider" 
                  min="0" max="10" 
                  value={(priorities as any)[p.key]} 
                  onChange={(e) => onSlide(p.key, e.target.value)} 
                />
                <span className="s-val">{(priorities as any)[p.key]}</span>
              </div>
            ))}
          </div>
          <button className="engine-cta" onClick={() => document.querySelector('.deck-wrap')?.scrollIntoView({behavior: 'smooth'})}>Explore Top Picks <span className="arr">→</span></button>
        </div>

        <div className="ranked-panel">
          <div className="ranked-head">
            <h4>YOUR PERSONALISED RANKING</h4>
            <div className="live-badge"><span className="ld"></span>LIVE</div>
          </div>
          <div className="rank-list">
            {rankedCards.map((c, i) => (
              <div key={c.id} className={`rank-row ${i === 0 ? 't1' : i === 1 ? 't2' : i === 2 ? 't3' : ''}`} onClick={() => document.querySelector('.deck-wrap')?.scrollIntoView({behavior:'smooth'})}>
                <div className="rn">{i + 1}</div>
                <div className="ri">
                  <div className="rn-name">{c.name}</div>
                  <div className="rn-bank">{c.bank} · {c.type}</div>
                </div>
                <div className="rs">
                  <div className="rsn">{c.score}<span>/10</span></div>
                  <div className="rs-bar">
                    <div className="rs-bar-fill" style={{ width: `${Number(c.score) * 10}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AIInsights profile={{shopping: 8000, travel: 6000, fuel: 1500, bills: 4000}} topCard={rankedCards.length > 0 ? rankedCards[0] : null} />
        </div>
      </section>

      <section className="deck-wrap">
        <div className="deck-head">
          <div className="sec-label">The Deck</div>
          <h2>FLIP TO EXPLORE</h2>
        </div>
        <div className="deck-scroll">
          <div className="deck-row">
            {LOCAL_CARDS.map(c => {
              const isPinned = pinned.includes(c.id);
              const isFlipped = flippedCards.includes(c.id);
              return (
                <div 
                  className={`card3 ${isFlipped ? 'flipped' : ''}`} 
                  key={c.id} 
                  tabIndex={0}
                  onClick={() => setFlippedCards(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                >
                  <div className="card3-inner">
                    <div className="card-front" style={{ background: c.grad, border: '1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.acc, borderRadius: '18px 18px 0 0' }}></div>
                      {(c as any).sponsored && (
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--magenta)', color: '#fff', fontSize: '0.55rem', padding: '3px 8px', borderRadius: 10, fontWeight: 700, letterSpacing: 1 }}>SPONSORED</div>
                      )}
                      <div className="cf-top">
                        <div className="cf-chip"></div>
                        <span className="cf-tag" style={{ background: 'rgba(255,255,255,.08)', color: c.acc }}>{c.type}</span>
                      </div>
                      <div className="cf-bot">
                        <div className="cf-name">{c.name}</div>
                        <div className="cf-bank">{c.bank}</div>
                        <div className="cf-num">•••• •••• •••• {1000 + c.id}</div>
                      </div>
                    </div>
                    <div className="card-rear" style={{ border: '1px solid rgba(255,255,255,.07)', borderTop: `3px solid ${c.acc}` }}>
                      <div className="cr-head">CARD DETAILS · FLIP BACK</div>
                      <div className="cr-specs">
                        <div className="sp-row"><span className="sk">JOINING FEE</span><span className="sv">{c.joining}</span></div>
                        <div className="sp-row"><span className="sk">ANNUAL FEE</span><span className="sv">{c.annual}</span></div>
                        <div className="sp-row"><span className="sk">REWARD</span><span className="sv">{c.reward}</span></div>
                        <div className="sp-row"><span className="sk">CASHBACK</span><span className="sv">{c.cashback}</span></div>
                        <div className="sp-row"><span className="sk">LOUNGE</span><span className="sv">{c.lounge}</span></div>
                        <div className="sp-row"><span className="sk">MIN CIBIL</span><span className="sv">{c.cibil}</span></div>
                      </div>
                      <div className="cr-btns">
                        <button className="btn-apply-deck" onClick={(e) => { e.stopPropagation(); window.open(`http://localhost:4000/api/cards/apply/${c.id}`, '_blank'); }}>APPLY</button>
                        <button className={`btn-pin ${isPinned ? 'pinned' : ''}`} onClick={(e) => { e.stopPropagation(); togglePin(c.id); }}>📌</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`pin-tray ${pinned.length >= 2 ? 'show' : ''}`}>
        <div className="tray-slots" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3].map(i => {
            const cardItem = LOCAL_CARDS.find(x => x.id === pinned[i]);
            return (
              <div key={i} className={`tray-slot ${cardItem ? 'filled' : ''}`}>
                {cardItem ? (
                  <>
                    <span className="ts-name">{cardItem.name}</span>
                    <span className="ts-x" onClick={() => togglePin(cardItem.id)}>×</span>
                  </>
                ) : <span>+ PIN CARD</span>}
              </div>
            );
          })}
        </div>
        <button className="btn-tray-cmp" onClick={openCompare}>COMPARE →</button>
      </div>

      <div className={`modal-bg ${isCmpOpen ? 'show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsCmpOpen(false); }}>
        <div className="modal-box">
          <div className="modal-top">
            <h3>HEAD TO HEAD</h3>
            <button className="modal-close" onClick={() => setIsCmpOpen(false)}>×</button>
          </div>
          {pinned.length >= 2 && (
            <div className="cmp-wrap" style={{ overflowX: 'auto' }}>
              <div className="cmp-head" style={{ display: 'grid', gridTemplateColumns: `150px repeat(${pinned.length}, 1fr)` }}>
                <div></div>
                {pinned.map(id => {
                  const card = LOCAL_CARDS.find(x => x.id === id);
                  if(!card) return null;
                  return <div key={card.id} className="ch"><div className="ch-name" style={{ color: card.acc }}>{card.name}</div><div className="ch-bank">{card.bank}</div></div>
                })}
              </div>
              {[
                { label: 'Type', key: 'type' },
                { label: 'Joining Fee', key: 'joining' },
                { label: 'Annual Fee', key: 'annual' },
                { label: 'Reward', key: 'reward' },
                { label: 'Cashback', key: 'cashback' },
                { label: 'Lounge Access', key: 'lounge' },
                { label: 'Fuel Benefit', key: 'fuel' },
                { label: 'Insurance', key: 'insurance' },
                { label: 'Min CIBIL', key: 'cibil' }
              ].map(({ label, key }) => {
                const isFee = key === 'joining' || key === 'annual';
                return (
                  <div className="cmp-row" key={key} style={{ display: 'grid', gridTemplateColumns: `150px repeat(${pinned.length}, 1fr)` }}>
                    <span className="cl">{label}</span>
                    {pinned.map((id, colIdx) => {
                      const card = LOCAL_CARDS.find(x => x.id === id);
                      if(!card) return null;
                      const v = (card as any)[key];
                      // Winner highlighting: lowest fee = green, others normal
                      let isWinner = false;
                      if (isFee) {
                        const vals = pinned.map(pid => { const pc = LOCAL_CARDS.find(x => x.id === pid); return parseInt(((pc as any)?.[key] || '').replace(/[^0-9]/g, '') || '9999'); });
                        const myVal = parseInt((v || '').replace(/[^0-9]/g, '') || '9999');
                        isWinner = myVal === Math.min(...vals);
                      }
                      return <span key={card.id} className="cv" style={{ background: isWinner ? 'rgba(0,184,148,0.15)' : 'var(--ink3)', border: isWinner ? '1px solid #00b894' : '1px solid transparent', color: isWinner ? '#00b894' : 'inherit', fontWeight: isWinner ? 600 : 400, borderRadius: isWinner ? 4 : 0 }}>{v}{isWinner && ' 🏆'}</span>
                    })}
                  </div>
                );
              })}
              
              <div style={{ padding: '40px 0 20px', height: 350, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData()}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: 'var(--ink3)', border: '1px solid var(--ghost)', borderRadius: 8 }} />
                    {pinned.map(id => {
                      const c = LOCAL_CARDS.find(x => x.id === id);
                      if(!c) return null;
                      return <Radar key={c.id} name={c.name} dataKey={c.name} stroke={c.acc} fill={c.acc} fillOpacity={0.4} />
                    })}
                  </RadarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}
          {pinned.length >= 2 && (
            <div className="cmp-btns" style={{ display: 'flex', flexWrap: 'wrap' }}>
              {pinned.map(id => {
                const card = LOCAL_CARDS.find(x => x.id === id);
                if(!card) return null;
                return <button key={card.id} className="btn-cmp" style={{ background: `linear-gradient(135deg, ${card.acc}, #000)`, color: '#fff' }}>APPLY {card.name.toUpperCase()}</button>
              })}
            </div>
          )}
        </div>
      </div>

      <section className="info-section mt-12">
        <div className="info-card"><div className="ic-icon">⚡</div><h4>Zero-Fee Finder</h4><p>Filter for lifetime-free cards instantly. We highlight every card that costs you absolutely nothing — ever.</p></div>
        <div className="info-card"><div className="ic-icon">🛡️</div><h4>Insurance Radar</h4><p>See which cards bundle travel, purchase, or accident insurance.</p></div>
        <div className="info-card"><div className="ic-icon">📊</div><h4>Cashback Calc</h4><p>Enter your monthly spend and we estimate exactly how much you'd earn with each card.</p></div>
        <div className="info-card"><div className="ic-icon">🔔</div><h4>Reward Alerts</h4><p>Get notified when bonus offers go live on cards you're tracking.</p></div>
      </section>

      <section className="faq-section">
        <div className="sec-label">Questions</div>
        <h2>GOT DOUBTS?</h2>
        <div>
          {FAQS.map((f, i) => (
            <div className="faq-item" key={i}>
              <button className={`faq-btn ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span><span className="fi">+</span>
              </button>
              <div className="faq-body" style={{ maxHeight: openFaq === i ? '160px' : '0px' }}>
                <div className="faq-body-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>


    </>
  );
}
