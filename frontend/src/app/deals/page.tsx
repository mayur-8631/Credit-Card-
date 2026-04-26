'use client';

import { useState, useEffect } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import useSubscription from '@/hooks/useSubscription';

interface Deal {
  id: number;
  merchant: string;
  logo: string;
  category: string;
  title: string;
  description: string;
  discount: string;
  max_savings: string;
  valid_till: string;
  terms: string;
  link: string;
  card_partners: string[];
  featured: boolean;
}

const CATEGORIES = ['All', 'Shopping', 'Food & Dining', 'Travel', 'Fashion', 'Fuel', 'Entertainment', 'Electronics', 'Insurance'];

export default function DealsPage() {
  const { isPro, loading: subLoading } = useSubscription();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [expandedDeal, setExpandedDeal] = useState<number | null>(null);

  useEffect(() => {
    fetchDeals();
  }, [activeCategory, isPro, subLoading]);

  const fetchDeals = async () => {
    const token = localStorage.getItem('credimatch_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const cat = activeCategory === 'All' ? 'all' : activeCategory;
      const res = await fetch(`http://localhost:4000/api/deals?category=${cat}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals);
        setTotalDeals(data.total_deals);
        if (data.categories) setCategories(['All', ...data.categories]);
      }
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="deals-page">
        <section className="deals-hero">
          <div className="hero-tag">Exclusive Partner Network</div>
          <h1>PARTNER<br/><span className="outline">DEALS</span><br/>HUB.</h1>
          <p className="hero-sub">
            Curated cashback offers, discounts & bonuses from <strong>top merchants</strong> — 
            matched to the credit cards in our database. Only for <strong>Credimatch Pro</strong> members.
          </p>
          <div className="deals-stat">
            <div className="ds-num">{totalDeals}</div>
            <div className="ds-label">ACTIVE DEALS RIGHT NOW</div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="deals-filters">
          <div className="filter-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Deals Grid */}
        <section className="deals-grid-wrap">
          {loading ? (
            <div className="deals-loading">Loading exclusive deals...</div>
          ) : (
            <>
              <div className="deals-grid">
                {deals.map((deal) => {
                  const daysLeft = getDaysRemaining(deal.valid_till);
                  const isExpanded = expandedDeal === deal.id;
                  return (
                    <div 
                      key={deal.id} 
                      className={`deal-card ${deal.featured ? 'featured' : ''} ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setExpandedDeal(isExpanded ? null : deal.id)}
                    >
                      {deal.featured && <div className="deal-featured-tag">🔥 HOT DEAL</div>}
                      <div className="deal-header">
                        <div className="deal-logo">{deal.logo}</div>
                        <div className="deal-meta">
                          <div className="deal-merchant">{deal.merchant}</div>
                          <div className="deal-category">{deal.category}</div>
                        </div>
                        <div className="deal-discount-badge">{deal.discount}</div>
                      </div>
                      
                      <h3 className="deal-title">{deal.title}</h3>
                      <p className="deal-desc">{deal.description}</p>
                      
                      <div className="deal-stats">
                        <div className="deal-stat-item">
                          <span className="dsi-label">MAX SAVINGS</span>
                          <span className="dsi-value">{deal.max_savings}</span>
                        </div>
                        <div className="deal-stat-item">
                          <span className="dsi-label">EXPIRES IN</span>
                          <span className={`dsi-value ${daysLeft <= 7 ? 'urgent' : ''}`}>{daysLeft} days</span>
                        </div>
                      </div>

                      <div className="deal-partners">
                        <span className="dp-label">Works with:</span>
                        <div className="dp-tags">
                          {deal.card_partners.map(card => (
                            <span key={card} className="dp-tag">{card}</span>
                          ))}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="deal-terms">
                          <div className="dt-head">Terms & Conditions</div>
                          <p>{deal.terms}</p>
                          <button className="deal-apply-btn" onClick={(e) => { e.stopPropagation(); if (deal.link) window.open(deal.link, '_blank'); }}>
                            CLAIM THIS DEAL →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Upgrade Prompt for Free Users */}
              {!isPro && (
                <div className="deals-upgrade-overlay">
                  <div className="upgrade-content">
                    <div className="upgrade-icon">🔒</div>
                    <h3>Unlock All {totalDeals} Exclusive Deals</h3>
                    <p>You're seeing a preview. Upgrade to Credimatch Pro to access all partner deals, cashback offers, and merchant discounts.</p>
                    <div className="upgrade-features">
                      <div className="uf">✦ {totalDeals} curated merchant deals</div>
                      <div className="uf">✦ Real-time offer tracking</div>
                      <div className="uf">✦ Matched to your cards</div>
                      <div className="uf">✦ Expiry alerts before you miss out</div>
                    </div>
                    <button className="upgrade-cta" onClick={() => window.location.href = '/profile'}>
                      UPGRADE TO PRO — ₹199/mo
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <style jsx>{`
        .deals-page {
          padding-top: 120px;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        .deals-hero {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 20px 40px;
          position: relative;
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
          color: var(--text-hi);
        }
        .outline {
          -webkit-text-stroke: 1.5px var(--text);
          color: transparent;
        }
        .hero-sub {
          max-width: 560px;
          margin: 0 auto;
          font-size: 1rem;
          color: var(--ghost);
          line-height: 1.6;
        }
        .hero-sub strong { color: var(--cyan); }
        .deals-stat {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 45, 149, 0.08);
          border: 1px solid rgba(255, 45, 149, 0.25);
          padding: 10px 24px;
          border-radius: 50px;
        }
        .ds-num {
          font-family: var(--display);
          font-size: 1.8rem;
          color: var(--magenta);
        }
        .ds-label {
          font-family: var(--mono);
          font-size: 0.6rem;
          color: var(--magenta);
          letter-spacing: 2px;
        }

        /* ── Category Filter ── */
        .deals-filters {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 20px 0;
        }
        .filter-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: thin;
          scrollbar-color: var(--ink4) transparent;
        }
        .filter-chip {
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--text);
          background: var(--ink3);
          border: 1px solid var(--ghost);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-family: var(--body);
        }
        .filter-chip:hover {
          border-color: var(--cyan);
          color: var(--cyan);
        }
        .filter-chip.active {
          background: linear-gradient(135deg, var(--magenta), #e0267f);
          color: #fff;
          border-color: var(--magenta);
        }

        /* ── Deals Grid ── */
        .deals-grid-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px 80px;
          position: relative;
        }
        .deals-loading {
          text-align: center;
          padding: 60px;
          font-family: var(--mono);
          color: var(--ghost);
          font-size: 0.85rem;
        }
        .deals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .deal-card {
          background: var(--ink2);
          border: 1px solid var(--ghost);
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .deal-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--cyan), var(--magenta));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .deal-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
        .deal-card:hover::before { opacity: 1; }
        .deal-card.featured {
          border-color: rgba(255, 45, 149, 0.3);
          background: linear-gradient(135deg, rgba(26, 31, 58, 0.9), rgba(42, 31, 58, 0.9));
        }
        .deal-featured-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--magenta);
          color: #fff;
          font-size: 0.55rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          letter-spacing: 1px;
        }
        .deal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .deal-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--ink3);
          border: 1px solid var(--ghost);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .deal-meta { flex: 1; }
        .deal-merchant {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-hi);
        }
        .deal-category {
          font-family: var(--mono);
          font-size: 0.6rem;
          color: var(--ghost);
          letter-spacing: 1px;
          margin-top: 2px;
        }
        .deal-discount-badge {
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          color: var(--cyan);
          padding: 6px 14px;
          border-radius: 8px;
          font-family: var(--mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .deal-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-hi);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .deal-desc {
          font-size: 0.82rem;
          color: var(--text);
          line-height: 1.55;
          margin-bottom: 16px;
        }
        .deal-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
        }
        .deal-stat-item {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .dsi-label {
          display: block;
          font-family: var(--mono);
          font-size: 0.5rem;
          color: var(--ghost);
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .dsi-value {
          font-family: var(--mono);
          font-size: 0.9rem;
          color: var(--text-hi);
          font-weight: 600;
        }
        .dsi-value.urgent {
          color: var(--magenta);
          animation: urgentPulse 1.5s infinite;
        }
        @keyframes urgentPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .deal-partners {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          flex-wrap: wrap;
        }
        .dp-label {
          font-family: var(--mono);
          font-size: 0.55rem;
          color: var(--ghost);
          letter-spacing: 0.5px;
          padding-top: 5px;
          flex-shrink: 0;
        }
        .dp-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .dp-tag {
          background: var(--ink3);
          border: 1px solid var(--ghost);
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.65rem;
          color: var(--text);
          font-weight: 500;
        }
        .deal-terms {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dt-head {
          font-family: var(--mono);
          font-size: 0.6rem;
          color: var(--cyan);
          letter-spacing: 1.5px;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .deal-terms p {
          font-size: 0.78rem;
          color: var(--ghost);
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .deal-apply-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, var(--cyan), #00bcd4);
          border: none;
          border-radius: 8px;
          color: var(--ink);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 1px;
          cursor: pointer;
          transition: box-shadow 0.25s;
          font-family: var(--body);
        }
        .deal-apply-btn:hover {
          box-shadow: 0 0 20px var(--cyan-glow);
        }

        /* ── Upgrade Overlay ── */
        .deals-upgrade-overlay {
          margin-top: 40px;
          position: relative;
        }
        .deals-upgrade-overlay::before {
          content: '';
          position: absolute;
          top: -120px;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to top, var(--ink), transparent);
          pointer-events: none;
          z-index: 1;
        }
        .upgrade-content {
          background: linear-gradient(135deg, #1a1f3a, #2a1f3a);
          border: 1px solid rgba(232, 67, 147, 0.4);
          border-radius: 20px;
          padding: 48px 32px;
          text-align: center;
          max-width: 560px;
          margin: 0 auto;
        }
        .upgrade-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .upgrade-content h3 {
          font-family: var(--display);
          font-size: 1.8rem;
          color: var(--text-hi);
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .upgrade-content p {
          color: var(--ghost);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .upgrade-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 28px;
          text-align: left;
        }
        .uf {
          font-size: 0.82rem;
          color: var(--text);
          display: flex;
          gap: 8px;
        }
        .uf::first-letter {
          color: var(--magenta);
        }
        .upgrade-cta {
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
        .upgrade-cta:hover {
          box-shadow: 0 0 25px rgba(255, 45, 149, 0.4);
        }

        @media (max-width: 700px) {
          .deals-grid {
            grid-template-columns: 1fr;
          }
          .upgrade-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
