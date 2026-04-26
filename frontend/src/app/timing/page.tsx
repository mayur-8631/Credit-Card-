'use client';

import { useState, useEffect } from 'react';
import TimingIntelligence from '@/components/TimingIntelligence';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import useSubscription from '@/hooks/useSubscription';

interface SmartAlert {
  id: number;
  card_name: string;
  alert_type: string;
  icon: string;
  title: string;
  summary: string;
  best_window: string;
  potential_savings: string;
  confidence: string;
  urgency: string;
  days_away: number;
  details: string[];
}

export default function TimingPage() {
  const { isPro, loading: subLoading } = useSubscription();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('credimatch_token');
    if (!token) {
      setAlertsLoading(false);
      return;
    }

    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/timing/smart-alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAlerts(data.alerts);
          setTotalAlerts(data.total_alerts);
        }
      } catch {
        // offline fallback
      } finally {
        setAlertsLoading(false);
      }
    };
    fetchAlerts();
  }, [isPro, subLoading]);

  const getUrgencyColor = (urg: string) => {
    if (urg === 'APPLY_NOW') return '#00b894';
    if (urg === 'APPLY_SOON') return '#fdcb6e';
    return 'var(--ghost)';
  };

  const getUrgencyLabel = (urg: string) => {
    if (urg === 'APPLY_NOW') return '🟢 APPLY NOW';
    if (urg === 'APPLY_SOON') return '🟡 APPLY SOON';
    return '⏳ WAIT FOR BETTER';
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="timing-page-wrap">
        <section className="timing-hero">
          <div className="hero-tag">Timing Intelligence Engine</div>
          <h1>BEAT THE<br/><span className="outline">SYSTEM</span><br/>APPLY RIGHT.</h1>
          <p className="hero-sub">
            Banks change credit card offers every 30-45 days. Our <strong>TIE Engine</strong> analyses 24 months of historical reward data to predict if you should apply now or wait for a better bonus.
          </p>
        </section>

        <section className="timing-main">
          <TimingIntelligence />
        </section>

        {/* ── Smart Timing Alerts (Pro Feature) ── */}
        <section className="smart-alerts-section">
          <div className="sa-header">
            <div>
              <div className="sa-tag">
                <span className="sa-pro-badge">PRO</span>
                SMART TIMING ALERTS
              </div>
              <h2>NEVER MISS<br/>A WINDOW.</h2>
              <p className="sa-desc">
                AI-powered alerts that track offer cycles across all banks. Know exactly when to apply for the best welcome bonuses, fee waivers, and reward multipliers.
              </p>
            </div>
            {!isPro && (
              <div className="sa-count-badge">
                <span className="scb-num">{totalAlerts}</span>
                <span className="scb-label">ALERTS AVAILABLE</span>
              </div>
            )}
          </div>

          {alertsLoading ? (
            <div className="sa-loading">Scanning bank offer cycles...</div>
          ) : (
            <div className="sa-grid">
              {alerts.map((alert) => {
                const isExpanded = expandedAlert === alert.id;
                return (
                  <div 
                    key={alert.id} 
                    className={`alert-card ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  >
                    <div className="ac-top">
                      <div className="ac-icon">{alert.icon}</div>
                      <div className="ac-meta">
                        <div className="ac-card-name">{alert.card_name}</div>
                        <div className="ac-type">{alert.alert_type.replace(/_/g, ' ').toUpperCase()}</div>
                      </div>
                      <div 
                        className="ac-urgency"
                        style={{ 
                          background: `${getUrgencyColor(alert.urgency)}15`,
                          borderColor: getUrgencyColor(alert.urgency),
                          color: getUrgencyColor(alert.urgency)
                        }}
                      >
                        {getUrgencyLabel(alert.urgency)}
                      </div>
                    </div>

                    <h4 className="ac-title">{alert.title}</h4>
                    <p className="ac-summary">{alert.summary}</p>

                    <div className="ac-stats">
                      <div className="acs-item">
                        <span className="acs-k">BEST WINDOW</span>
                        <span className="acs-v">{alert.best_window}</span>
                      </div>
                      <div className="acs-item">
                        <span className="acs-k">POTENTIAL SAVINGS</span>
                        <span className="acs-v savings">{alert.potential_savings}</span>
                      </div>
                      <div className="acs-item">
                        <span className="acs-k">CONFIDENCE</span>
                        <span className={`acs-v conf-${alert.confidence.toLowerCase()}`}>{alert.confidence}</span>
                      </div>
                      {alert.days_away > 0 && (
                        <div className="acs-item">
                          <span className="acs-k">DAYS AWAY</span>
                          <span className="acs-v">{alert.days_away}</span>
                        </div>
                      )}
                    </div>

                    {isExpanded && isPro && (
                      <div className="ac-details">
                        <div className="acd-label">DEEP ANALYSIS</div>
                        <ul>
                          {alert.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Upgrade Prompt for Free Users */}
          {!isPro && !alertsLoading && (
            <div className="sa-upgrade">
              <div className="sau-inner">
                <div className="sau-lock">🔒</div>
                <h3>Unlock {totalAlerts} Smart Timing Alerts</h3>
                <p>You're seeing 1 preview alert. Pro members get real-time AI analysis on every card's optimal application window.</p>
                <div className="sau-features">
                  <span>✦ {totalAlerts} active alerts</span>
                  <span>✦ Deep AI analysis</span>
                  <span>✦ Savings predictions</span>
                  <span>✦ Festive season tracking</span>
                </div>
                <button className="sau-cta" onClick={() => window.location.href = '/profile'}>
                  UPGRADE TO PRO — ₹199/mo
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="timing-info">
            <div className="info-grid">
                <div className="info-card">
                    <h3>Seasonal Trends</h3>
                    <p>Detects annual spikes like Diwali cashback, New Year welcome bonuses, and Summer travel rewards.</p>
                </div>
                <div className="info-card">
                    <h3>Reward Normalisation</h3>
                    <p>We convert points, vouchers, and cashbacks into a standard 1-100 score for objective comparison.</p>
                </div>
                <div className="info-card">
                    <h3>Urgency Calibration</h3>
                    <p>Choose 'Flexible' for the highest rewards, or 'Immediate' if you need the card right now for an expense.</p>
                </div>
            </div>
        </section>
      </div>

      <style jsx>{`
        .timing-page-wrap {
          padding-top: 120px;
          min-height: 100vh;
        }
        .timing-hero {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          padding: 80px 20px;
        }
        .hero-tag {
          font-family: var(--mono);
          color: var(--magenta);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        h1 {
          font-family: var(--display);
          font-size: clamp(3.5rem, 8vw, 7rem);
          line-height: 0.9;
          margin-bottom: 32px;
        }
        .outline {
          -webkit-text-stroke: 1.5px var(--text);
          color: transparent;
        }
        .hero-sub {
          max-width: 600px;
          margin: 0 auto;
          font-size: 1.1rem;
          color: var(--ghost);
          line-height: 1.6;
        }
        .timing-main {
          padding: 40px 20px 60px;
        }

        /* ── Smart Alerts Section ── */
        .smart-alerts-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .sa-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .sa-tag {
          font-family: var(--mono);
          font-size: 0.65rem;
          color: var(--magenta);
          letter-spacing: 2px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sa-pro-badge {
          background: linear-gradient(135deg, var(--magenta), #e0267f);
          color: #fff;
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 1.5px;
        }
        .sa-header h2 {
          font-family: var(--display);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text-hi);
          letter-spacing: 1px;
          line-height: 1;
          margin-bottom: 12px;
        }
        .sa-desc {
          color: var(--ghost);
          font-size: 0.88rem;
          line-height: 1.6;
          max-width: 500px;
        }
        .sa-count-badge {
          background: rgba(255, 45, 149, 0.08);
          border: 1px solid rgba(255, 45, 149, 0.25);
          padding: 16px 24px;
          border-radius: 16px;
          text-align: center;
        }
        .scb-num {
          display: block;
          font-family: var(--display);
          font-size: 2.5rem;
          color: var(--magenta);
        }
        .scb-label {
          font-family: var(--mono);
          font-size: 0.55rem;
          color: var(--magenta);
          letter-spacing: 2px;
        }
        .sa-loading {
          text-align: center;
          padding: 40px;
          font-family: var(--mono);
          font-size: 0.8rem;
          color: var(--magenta);
        }

        /* ── Alert Cards ── */
        .sa-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 20px;
        }
        .alert-card {
          background: var(--ink2);
          border: 1px solid var(--ghost);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .alert-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
        .ac-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .ac-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--ink3);
          border: 1px solid var(--ghost);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .ac-meta { flex: 1; }
        .ac-card-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-hi);
        }
        .ac-type {
          font-family: var(--mono);
          font-size: 0.55rem;
          color: var(--ghost);
          letter-spacing: 1px;
          margin-top: 2px;
        }
        .ac-urgency {
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.65rem;
          font-weight: 700;
          border: 1px solid;
          white-space: nowrap;
        }
        .ac-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-hi);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .ac-summary {
          font-size: 0.82rem;
          color: var(--text);
          line-height: 1.55;
          margin-bottom: 16px;
        }
        .ac-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .acs-item {
          background: rgba(255, 255, 255, 0.02);
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .acs-k {
          display: block;
          font-family: var(--mono);
          font-size: 0.5rem;
          color: var(--ghost);
          letter-spacing: 1px;
          margin-bottom: 3px;
        }
        .acs-v {
          font-family: var(--mono);
          font-size: 0.85rem;
          color: var(--text-hi);
          font-weight: 600;
        }
        .acs-v.savings { color: var(--cyan); }
        .acs-v.conf-high { color: #00b894; }
        .acs-v.conf-medium { color: #fdcb6e; }
        .acs-v.conf-low { color: var(--magenta); }

        /* ── Expanded Details ── */
        .ac-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          animation: fadeSlide 0.3s ease;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .acd-label {
          font-family: var(--mono);
          font-size: 0.6rem;
          color: var(--cyan);
          letter-spacing: 1.5px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .ac-details ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .ac-details li {
          color: var(--text);
          font-size: 0.82rem;
          margin-bottom: 8px;
          padding-left: 18px;
          position: relative;
          line-height: 1.45;
        }
        .ac-details li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--cyan);
        }

        /* ── Upgrade Prompt ── */
        .sa-upgrade {
          margin-top: 40px;
        }
        .sau-inner {
          background: linear-gradient(135deg, #1a1f3a, #2a1f3a);
          border: 1px solid rgba(232, 67, 147, 0.35);
          border-radius: 20px;
          padding: 48px 32px;
          text-align: center;
          max-width: 560px;
          margin: 0 auto;
        }
        .sau-lock { font-size: 2.5rem; margin-bottom: 16px; }
        .sau-inner h3 {
          font-family: var(--display);
          font-size: 1.6rem;
          color: var(--text-hi);
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .sau-inner p {
          color: var(--ghost);
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 20px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .sau-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .sau-features span {
          font-size: 0.78rem;
          color: var(--text);
        }
        .sau-cta {
          padding: 14px 32px;
          background: var(--magenta);
          border: none;
          border-radius: 50px;
          color: #fff;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1px;
          cursor: pointer;
          transition: box-shadow 0.25s;
          font-family: var(--body);
        }
        .sau-cta:hover {
          box-shadow: 0 0 25px rgba(255, 45, 149, 0.4);
        }

        /* ── Info Section ── */
        .timing-info {
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 20px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
        }
        .info-card {
            background: var(--ink2);
            padding: 40px;
            border-radius: 24px;
            border: 1px solid var(--ghost);
        }
        .info-card h3 {
            font-size: 1.2rem;
            margin-bottom: 16px;
            color: white;
        }
        .info-card p {
            color: var(--text);
            line-height: 1.6;
        }

        @media (max-width: 700px) {
          .sa-grid {
            grid-template-columns: 1fr;
          }
          .sa-header {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
