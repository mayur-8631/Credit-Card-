function calculateYearlyBenefit(card, profile) {
  // Simple heuristic for calculating cashback mapping.
  // Profile: { shopping: 10000, travel: 5000, fuel: 3000, bills: 4000 }
  // card.cashback_rules = {"amazon": 5, "travel": 1, "fuel": 1.5, "other": 0.5}
  let totalCashback = 0;
  
  const rules = card.cashback_rules || {};
  let totalSpend = 0;
  
  if (profile) {
    for (const [cat, spend] of Object.entries(profile)) {
      totalSpend += spend;
      
      // Match category to exact rule or fallback to "other", default 0.5%
      const pct = rules[cat] || rules['other'] || 0.5;
      totalCashback += (spend * 12) * (pct / 100);
    }
  }

  // Fees
  const fees = card.annual_fee;
  
  // Net Benefit
  const netBenefit = totalCashback - fees;
  return {
    totalCashback,
    fees,
    netBenefit
  };
}

function calculateScore(card, priorities, profile, income, creditScore) {
  // priorities = { cashback: 5, rewards: 5, travel: 5, fuel: 5, insurance: 5 }
  // Simulate an internal static scoring logic that uses weights and the dynamic inputs.
  let score = 0;
  
  // Static scores based on keywords in card type/details.
  const staticScores = {
    cashback: card.type.toLowerCase().includes('cashback') ? 9 : 3,
    rewards: card.type.toLowerCase().includes('rewards') ? 8 : 4,
    travel: card.type.toLowerCase().includes('travel') ? 8 : 2,
    fuel: card.type.toLowerCase().includes('fuel') || (card.fuel_benefits !== 'None') ? 8 : 2,
    insurance: card.insurance_details !== 'None' ? 7 : 1
  };

  let totalWeight = 0;
  for (const [key, weightVal] of Object.entries(priorities)) {
    const weight = parseInt(weightVal) || 0;
    score += (staticScores[key] || 0) * weight;
    totalWeight += weight;
  }
  
  let finalScore = totalWeight > 0 ? (score / totalWeight) : 0;
  
  // Eligibility match modifier
  if (creditScore && creditScore < card.eligibility_score_min) {
    finalScore -= 3; // Huge penalty for low scrobe
  }

  return Math.min(Math.max(finalScore, 0), 10);
}

const getRankedCards = (cards, preferences, profile, income, creditScore) => {
  return cards.map(card => {
    const calc = calculateYearlyBenefit(card, profile);
    const score = calculateScore(card, preferences, profile, income, creditScore);
    return {
      ...card,
      calc,
      score: score.toFixed(1)
    };
  }).sort((a, b) => b.score - a.score);
};

module.exports = {
  getRankedCards
};
