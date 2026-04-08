import React from 'react';

export default function AIInsights({ profile, topCard }: { profile: any, topCard: any }) {
  if (!topCard) return null;

  // Extremely basic "AI" heuristic for explainability
  let insight = "Based on your balanced spending, this card provides the best overall base reward rate.";
  
  if (profile.fuel && profile.fuel > 3000 && topCard.type === 'Fuel') {
    insight = `You spend over ₹${profile.fuel.toLocaleString()}/month on fuel. The ${topCard.name} ranks #1 because it perfectly covers your heavy fuel footprint with specialized surcharge waivers and multipliers.`;
  } else if (profile.travel && profile.travel > 5000 && topCard.type === 'Travel') {
    insight = `Your ₹${profile.travel.toLocaleString()}/month travel spend is your biggest expense. This card offers aggressive airmile conversion and lounge access which directly benefits your lifestyle.`;
  } else if (profile.shopping && profile.shopping > 10000 && topCard.type === 'Cashback') {
    insight = `You are a heavy shopper (₹${profile.shopping.toLocaleString()}/m). The high fixed cashback rate of the ${topCard.name} safely returns guaranteed money without complex reward tier caps.`;
  }

  return (
    <div style={{ padding: '24px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid var(--cyan)', borderRadius: 'var(--r)', marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: '1.5rem' }}>🧠</span>
        <h4 style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--cyan)', letterSpacing: 1 }}>AI INSIGHT</h4>
      </div>
      <p style={{ color: 'var(--text-hi)', fontSize: '1rem', lineHeight: 1.6 }}>{insight}</p>
    </div>
  );
}
