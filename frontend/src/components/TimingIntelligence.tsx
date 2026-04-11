'use client';

import { useState, useEffect } from 'react';

const CARDS = [
  { id: 1, name: 'HDFC Millennia' },
  { id: 2, name: 'SimplyCLICK SBI' },
  { id: 3, name: 'Axis Neo Travel' },
  { id: 6, name: 'SBI Cashback' },
  { id: 10, name: 'HSBC Travel One' },
];

export default function TimingIntelligence() {
  const [selectedCard, setSelectedCard] = useState(CARDS[0].id);
  const [urgency, setUrgency] = useState('flexible');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/timing/intel?card_id=${selectedCard}&urgency=${urgency}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, [selectedCard, urgency]);

  return (
    <div className="intel-container">
      <div className="intel-controls">
        <div className="control-group">
          <label>SELECT CARD</label>
          <select value={selectedCard} onChange={(e) => setSelectedCard(Number(e.target.value))}>
            {CARDS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>URGENCY</label>
          <div className="toggle-switch">
            <button className={urgency === 'immediate' ? 'active' : ''} onClick={() => setUrgency('immediate')}>IMMEDIATE</button>
            <button className={urgency === 'flexible' ? 'active' : ''} onClick={() => setUrgency('flexible')}>FLEXIBLE</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="intel-loading">Analysing historical patterns...</div>
      ) : data ? (
        <div className="intel-result">
          <div className="result-header">
            <div className={`status-badge ${data.decision.toLowerCase()}`}>
              {data.decision === 'APPLY_NOW' ? '🟢 APPLY NOW' : '🟡 WAIT'}
            </div>
            <div className="confidence-meter">
              <span>Confidence</span>
              <div className="meter-bar">
                <div className={`meter-fill ${data.confidence.toLowerCase()}`} style={{ width: data.confidence === 'HIGH' ? '100%' : data.confidence === 'MEDIUM' ? '60%' : '30%' }}></div>
              </div>
              <span className="conf-label">{data.confidence}</span>
            </div>
          </div>

          <div className="prediction-grid">
            <div className="pred-item">
              <span className="pred-label">WAIT DURATION</span>
              <span className="pred-val">{data.wait_days} Days</span>
            </div>
            <div className="pred-item">
              <span className="pred-label">NEXT BEST WINDOW</span>
              <span className="pred-val">{data.next_best_window}</span>
            </div>
            <div className="pred-item">
                <span className="pred-label">CURRENT SCORE</span>
                <span className="pred-val">{data.current_offer_score}/100</span>
            </div>
            <div className="pred-item">
                <span className="pred-label">HISTORICAL AVG</span>
                <span className="pred-val">{data.historical_avg_score}/100</span>
            </div>
          </div>

          <div className="reasoning-box">
            <h4>WHY THIS DECISION?</h4>
            <ul>
              {data.reasoning.map((r: string, i: number) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <p className="intel-disclaimer">
            * Predictions are based on historical offer frequency and value normalized over 24 months. Actual bank offers may vary.
          </p>
        </div>
      ) : null}

      <style jsx>{`
        .intel-container {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(20px);
          max-width: 600px;
          margin: 0 auto;
        }
        .intel-controls {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 24px;
        }
        .control-group {
          flex: 1;
        }
        .control-group label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 10px;
        }
        select {
          width: 100%;
          background: var(--ink3);
          border: 1px solid var(--ghost);
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-family: var(--body);
          outline: none;
        }
        .toggle-switch {
          display: flex;
          background: var(--ink3);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid var(--ghost);
        }
        .toggle-switch button {
          flex: 1;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.6rem;
          font-weight: 700;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-switch button.active {
          background: var(--magenta);
          color: white;
        }
        .intel-loading {
          padding: 40px;
          text-align: center;
          font-family: var(--mono);
          color: var(--magenta);
          font-size: 0.8rem;
        }
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .status-badge {
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }
        .status-badge.apply_now { background: rgba(0, 184, 148, 0.15); color: #00b894; border: 1px solid #00b894; }
        .status-badge.wait { background: rgba(253, 203, 110, 0.15); color: #fdcb6e; border: 1px solid #fdcb6e; }
        
        .confidence-meter {
          text-align: right;
          width: 120px;
        }
        .confidence-meter span { font-size: 0.55rem; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; font-weight: 700; }
        .meter-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; margin: 4px 0; overflow: hidden; }
        .meter-fill { height: 100%; }
        .meter-fill.high { background: #00b894; }
        .meter-fill.medium { background: #fdcb6e; }
        .meter-fill.low { background: var(--magenta); }
        .conf-label { display: block; font-size: 0.6rem !important; color: white !important; }

        .prediction-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .pred-item {
          background: rgba(255,255,255,0.02);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .pred-label { display: block; font-size: 0.55rem; color: rgba(255, 255, 255, 0.45); font-weight: 700; margin-bottom: 4px; }
        .pred-val { font-family: var(--mono); font-size: 1.1rem; color: white; }

        .reasoning-box {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 24px;
        }
        .reasoning-box h4 { font-size: 0.65rem; color: var(--magenta); margin-bottom: 12px; font-weight: 800; }
        .reasoning-box ul { list-style: none; padding: 0; margin: 0; }
        .reasoning-box li { color: var(--text); font-size: 0.85rem; margin-bottom: 8px; position: relative; padding-left: 18px; line-height: 1.4; }
        .reasoning-box li::before { content: '→'; position: absolute; left: 0; color: var(--magenta); }

        .intel-disclaimer { font-size: 0.6rem; color: rgba(255, 255, 255, 0.4); font-style: italic; line-height: 1.5; }
      `}</style>
    </div>
  );
}
