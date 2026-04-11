'use client';

import TimingIntelligence from '@/components/TimingIntelligence';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export default function TimingPage() {
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
          padding: 40px 20px 100px;
        }
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
      `}</style>
    </>
  );
}
