const historicalOffers = require('../db/historical_offers.json');

/**
 * Predicts the optimal time to apply for a credit card.
 * @param {number} cardId - The ID of the card.
 * @param {string} urgency - 'immediate' or 'flexible'.
 * @returns {object} Structured prediction response.
 */
function getTimingRecommendation(cardId, urgency = 'flexible') {
  const cardOffers = historicalOffers.filter(o => o.card_id === parseInt(cardId));
  
  // Default values for new cards or cards with no history
  let decision = "APPLY_NOW";
  let confidence = "LOW";
  let waitDays = 0;
  let reasoning = ["No sufficient historical data to suggest waiting."];
  let currentOfferScore = 50;
  let historicalAvgScore = 50;
  let nextBestWindow = "N/A";

  if (cardOffers.length > 0) {
    // Calculate historical average score
    const totalValue = cardOffers.reduce((acc, o) => acc + o.offer_value, 0);
    historicalAvgScore = Math.round(totalValue / cardOffers.length);
    
    // Simulate finding the "current" offer
    // In a real app, this would fetch from a 'live_offers' DB
    // For demo, we'll pick the 'regular' or most recent offer
    const currentOffer = cardOffers.find(o => o.season_tag === 'regular') || cardOffers[0];
    currentOfferScore = currentOffer.offer_value;

    // Detect seasonal pattern
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Check for upcoming festive season (Diwali is usually Oct/Nov)
    if (currentMonth >= 7 && currentMonth <= 9 && urgency === 'flexible') {
      const festiveOffer = cardOffers.find(o => o.season_tag === 'festive');
      if (festiveOffer && festiveOffer.offer_value > currentOfferScore) {
        decision = "WAIT";
        confidence = "HIGH";
        waitDays = (10 - currentMonth) * 30 + 15; // Rough estimate to mid-Oct
        reasoning = [
          `Festive season historically increases rewards by ${Math.round((festiveOffer.offer_value / currentOfferScore - 1) * 100)}%`,
          `Current offer is ${Math.round((1 - currentOfferScore / festiveOffer.offer_value) * 100)}% below yearly peak`
        ];
        nextBestWindow = "October - November";
      }
    } else if (currentOfferScore >= historicalAvgScore * 0.9) {
      decision = "APPLY_NOW";
      confidence = "MEDIUM";
      reasoning = ["Current offer is above or near historical average.", "No major reward spikes predicted in the next 30 days."];
    } else {
      decision = "WAIT";
      confidence = "MEDIUM";
      waitDays = 30;
      reasoning = ["Current offer is significantly below historical average.", "A better offer is statistically likely within the next month."];
    }
  }

  // Final adjustments based on urgency
  if (urgency === 'immediate') {
    decision = "APPLY_NOW";
    confidence = "HIGH";
    reasoning.unshift("User requires immediate application.");
  }

  return {
    decision,
    confidence,
    wait_days: waitDays,
    reasoning,
    current_offer_score: currentOfferScore,
    historical_avg_score: historicalAvgScore,
    next_best_window: nextBestWindow
  };
}

module.exports = { getTimingRecommendation };
