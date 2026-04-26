const express = require('express');
const router = express.Router();
const { getTimingRecommendation } = require('../services/timingIntelligence');
const authMiddleware = require('../middleware/auth');
const { query } = require('../db');
const userStore = require('../db/user-store');

const isDbAvailable = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch { return false; }
};

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

// ── Smart Timing Alerts (Pro-only deep analysis) ─────────────────────────────
const SMART_ALERTS = [
  {
    id: 1,
    card_name: 'HDFC Millennia',
    alert_type: 'festive_bonus',
    icon: '🎯',
    title: 'Diwali Mega Bonus Window Opening',
    summary: 'HDFC historically offers 2X welcome bonus during Oct-Nov. Current bonus: ₹2,000 → Expected: ₹4,000+',
    best_window: 'Oct 1 – Nov 15',
    potential_savings: '₹2,000+',
    confidence: 'HIGH',
    urgency: 'WAIT',
    days_away: 160,
    details: [
      'HDFC Millennia has offered Diwali welcome bonuses for 3 consecutive years',
      'Last year\'s festive bonus was 2.5X the standard welcome gift',
      'Apply in the first week of October for maximum benefit',
      'Pair with Amazon Great Indian Festival for stacked rewards'
    ]
  },
  {
    id: 2,
    card_name: 'SBI Cashback',
    alert_type: 'rate_increase',
    icon: '📈',
    title: 'Cashback Rate Increase Detected',
    summary: 'SBI typically raises online cashback from 5% to 7% during summer. Pattern repeats in May-June.',
    best_window: 'May 1 – Jun 30',
    potential_savings: '₹800/mo',
    confidence: 'MEDIUM',
    urgency: 'APPLY_SOON',
    days_away: 7,
    details: [
      'Summer cashback boost has occurred in 2 of the last 3 years',
      'Online shopping cashback increases from 5% to 7% on select categories',
      'Best paired with Flipkart and Amazon purchases',
      'No minimum spend requirement during promotional period'
    ]
  },
  {
    id: 3,
    card_name: 'Axis Neo Travel',
    alert_type: 'fee_waiver',
    icon: '✈️',
    title: 'Lifetime Free Upgrade Expected',
    summary: 'Axis Bank is running a limited period where joining fee is waived. Apply now before it reverts to ₹500.',
    best_window: 'Now – May 10',
    potential_savings: '₹500',
    confidence: 'HIGH',
    urgency: 'APPLY_NOW',
    days_away: 0,
    details: [
      'Current promotion: Zero joining fee (normally ₹500)',
      'Includes complimentary airport lounge access for first year',
      'Travel insurance cover activated from day one',
      'Offer ends in approximately 16 days based on historical patterns'
    ]
  },
  {
    id: 4,
    card_name: 'IDFC First WOW',
    alert_type: 'reward_multiplier',
    icon: '⚡',
    title: '3X Reward Points on Weekend Spends',
    summary: 'IDFC has launched weekend multiplier. Earn 3X points on all Saturday-Sunday transactions through June.',
    best_window: 'Weekends till Jun 30',
    potential_savings: '₹400/mo',
    confidence: 'HIGH',
    urgency: 'APPLY_NOW',
    days_away: 0,
    details: [
      'Weekend spending earns 3X reward points (up from standard 1X)',
      'Applies to all merchant categories including fuel and groceries',
      'Max reward cap: 5,000 points per weekend',
      'Points can be redeemed for statement credit at 1 point = ₹0.25'
    ]
  },
  {
    id: 5,
    card_name: 'HSBC Travel One',
    alert_type: 'miles_bonus',
    icon: '🌍',
    title: 'Double International Miles until July',
    summary: 'HSBC is offering 6X international miles (normally 3X) on all overseas transactions. Perfect for summer travel.',
    best_window: 'Now – Jul 31',
    potential_savings: '₹5,000+',
    confidence: 'HIGH',
    urgency: 'APPLY_NOW',
    days_away: 0,
    details: [
      '6X miles on international transactions (double the standard 3X)',
      'No foreign currency markup during promotional period (saves 3.5%)',
      'Includes complimentary Priority Pass access at 8 lounges/year',
      'Best card for international summer vacation bookings'
    ]
  }
];

router.get('/smart-alerts', authMiddleware, async (req, res) => {
  try {
    // Check subscription
    let isPro = false;
    if (await isDbAvailable()) {
      const result = await query(
        'SELECT plan_type, status FROM user_subscriptions WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1',
        [req.user.userId, 'active']
      );
      isPro = result.rows.length > 0 && result.rows[0].plan_type === 'pro';
    } else {
      const sub = userStore.getSubscription(req.user.userId);
      isPro = sub && sub.plan_type === 'pro' && sub.status === 'active';
    }

    if (!isPro) {
      // Free users: show 1 alert preview
      return res.json({
        isPro: false,
        alerts: SMART_ALERTS.slice(0, 1).map(a => ({
          ...a,
          details: [a.details[0] + '...'], // Truncated details
        })),
        total_alerts: SMART_ALERTS.length,
        message: 'Upgrade to Pro to see all smart timing alerts!'
      });
    }

    res.json({
      isPro: true,
      alerts: SMART_ALERTS,
      total_alerts: SMART_ALERTS.length
    });

  } catch (error) {
    console.error('Smart Alerts Error:', error);
    res.status(500).json({ error: 'Failed to fetch smart alerts' });
  }
});

module.exports = router;
