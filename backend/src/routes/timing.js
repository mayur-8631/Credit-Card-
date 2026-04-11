const express = require('express');
const router = express.Router();
const { getTimingRecommendation } = require('../services/timingIntelligence');

// GET /api/timing-intelligence?card_id=123&urgency=flexible
router.get('/intel', (req, res) => {
  const { card_id, urgency } = req.query;

  if (!card_id) {
    return res.status(400).json({ error: 'card_id is required' });
  }

  try {
    const recommendation = getTimingRecommendation(card_id, urgency);
    res.json(recommendation);
  } catch (error) {
    console.error('Error in timing-intelligence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
