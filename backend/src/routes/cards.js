const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { getRankedCards } = require('../services/recommendation');
const authMiddleware = require('../middleware/auth');
const userCardsStore = require('../db/user-cards-store');

// Full local card data as fallback when DB is unavailable
const FALLBACK_CARDS = [
  {id:1,name:'HDFC Millennia',bank:'HDFC Bank',type:'Cashback',joining_fee:1000,annual_fee:1000,reward_rate:'10x CashPoints',cashback_rules:{amazon:5,flipkart:5,other:1},lounge_access:'4 / yr',fuel_benefits:'1% waiver',insurance_details:'Purchase Protect',eligibility_score_min:700,affiliate_link:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card',sponsored:true},
  {id:2,name:'SimplyCLICK SBI',bank:'SBI Card',type:'Rewards',joining_fee:499,annual_fee:499,reward_rate:'10x Reward Pts',cashback_rules:{amazon:1.25,other:0.25},lounge_access:'2 / yr',fuel_benefits:'None',insurance_details:'None',eligibility_score_min:680,affiliate_link:'https://www.sbicard.com/en/personal/credit-cards/shopping/simplyclick-sbi-card.page'},
  {id:3,name:'Axis Neo Travel',bank:'Axis Bank',type:'Travel',joining_fee:0,annual_fee:0,reward_rate:'2x Miles',cashback_rules:{travel:1,other:0.5},lounge_access:'2 / yr',fuel_benefits:'1% waiver',insurance_details:'Travel Cover',eligibility_score_min:650,affiliate_link:'https://www.axisbank.com/retail/cards/credit-card/axis-bank-neo-card'},
  {id:4,name:'IDFC First WOW',bank:'IDFC First',type:'Rewards',joining_fee:0,annual_fee:0,reward_rate:'3x on Fuel',cashback_rules:{fuel:1.5,other:0.5},lounge_access:'4 / yr',fuel_benefits:'1% waiver',insurance_details:'Road Side',eligibility_score_min:650,affiliate_link:'https://www.idfcfirstbank.com/personal-banking/cards/credit-card/wow-credit-card'},
  {id:5,name:'SBI IRCTC',bank:'SBI Card',type:'Travel',joining_fee:500,annual_fee:500,reward_rate:'5x on Trains',cashback_rules:{trains:5,other:0.5},lounge_access:'2 / yr',fuel_benefits:'None',insurance_details:'Travel Insur.',eligibility_score_min:680,affiliate_link:'https://www.sbicard.com/en/personal/credit-cards/travel/irctc-sbi-platinum-card.page'},
  {id:6,name:'SBI Cashback',bank:'SBI Card',type:'Cashback',joining_fee:999,annual_fee:999,reward_rate:'5% Online',cashback_rules:{online:5,other:1},lounge_access:'2 / yr',fuel_benefits:'None',insurance_details:'None',eligibility_score_min:700,affiliate_link:'https://www.sbicard.com/en/personal/credit-cards/shopping/cashback-sbi-card.page'},
  {id:7,name:'HDFC Freedom',bank:'HDFC Bank',type:'Rewards',joining_fee:500,annual_fee:500,reward_rate:'10x on Select',cashback_rules:{grocery:3.3,other:0.5},lounge_access:'2 / yr',fuel_benefits:'1% waiver',insurance_details:'Purchase Prot.',eligibility_score_min:680,affiliate_link:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/freedom-credit-card'},
  {id:8,name:'BPCL IndusInd',bank:'IndusInd',type:'Fuel',joining_fee:0,annual_fee:0,reward_rate:'5x on Fuel',cashback_rules:{fuel:2.65,other:0.5},lounge_access:'4 / yr',fuel_benefits:'4x at BPCL',insurance_details:'Road Side',eligibility_score_min:650,affiliate_link:'https://www.indusind.com/in/en/personal/cards/credit-cards/bpcl-platinum-credit-card.html'},
  {id:9,name:'Axis LIC Card',bank:'Axis Bank',type:'Rewards',joining_fee:0,annual_fee:0,reward_rate:'2x on LIC',cashback_rules:{bills:1,other:0.5},lounge_access:'2 / yr',fuel_benefits:'1% waiver',insurance_details:'LIC Cover',eligibility_score_min:650,affiliate_link:'https://www.axisbank.com/retail/cards/credit-card/lic-axis-bank-signature-credit-card'},
  {id:10,name:'HSBC Travel One',bank:'HSBC',type:'Travel',joining_fee:4999,annual_fee:4999,reward_rate:'3x Intl Miles',cashback_rules:{travel:2,other:0.5},lounge_access:'8 / yr',fuel_benefits:'1% waiver',insurance_details:'Global Cover',eligibility_score_min:720,affiliate_link:'https://www.hsbc.co.in/credit-cards/products/travel-one/'},
];

const isDbAvailable = async () => {
  try { await query('SELECT 1'); return true; } catch { return false; }
};

// GET /api/cards/user -> fetch custom cards
router.get('/user', authMiddleware, async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const result = await query('SELECT * FROM user_cards WHERE user_id = $1', [req.user.userId]);
      return res.json({ cards: result.rows });
    }
    const cards = userCardsStore.findByUserId(req.user.userId);
    res.json({ cards });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user cards' });
  }
});

// POST /api/cards/user -> add new custom card
router.post('/user', authMiddleware, async (req, res) => {
  const c = req.body;
  try {
    if (await isDbAvailable()) {
      const result = await query(
        `INSERT INTO user_cards (user_id, card_name, bank, card_type, credit_limit, annual_fee, interest_rate, billing_cycle_days, due_date, reward_rates, joining_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [req.user.userId, c.card_name, c.bank, c.card_type, c.credit_limit, c.annual_fee, c.interest_rate, c.billing_cycle_days, c.due_date, JSON.stringify(c.reward_rates), c.joining_date]
      );
      return res.json({ card: result.rows[0] });
    }
    const card = userCardsStore.create(req.user.userId, c);
    res.json({ card });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save card' });
  }
});

// POST /api/cards/compare -> evaluate users saved cards based on spend and mathematical formula
router.post('/compare', authMiddleware, async (req, res) => {
  const { category, estimated_spend } = req.body;
  const categoryWeight = 1;
  try {
    let cards = [];
    if (await isDbAvailable()) {
      const result = await query('SELECT * FROM user_cards WHERE user_id = $1', [req.user.userId]);
      cards = result.rows;
    } else {
      cards = userCardsStore.findByUserId(req.user.userId);
    }
    
    // Core Engine Logic (LoginBenefits.mb requirement)
    // score = (reward_rate * estimated_monthly_spend * category_weight) - (annual_fee / 12) - (interest_rate_risk_factor)
    const ranked = cards.map(c => {
      let rRates = c.reward_rates;
      if (typeof rRates === 'string') {
        try { rRates = JSON.parse(rRates); }
        catch { rRates = {}; }
      }
      const rate = (rRates[category.toLowerCase()] || rRates['general'] || 0) / 100;
      const interestRisk = parseFloat(c.interest_rate) > 3.0 ? 50 : 0; // arbitrary penalty for high interest > 3%
      
      const monFee = (c.annual_fee || 0) / 12;
      const score = (rate * estimated_spend * categoryWeight) - monFee - interestRisk;
      const savings = Math.max(0, (rate * estimated_spend) - monFee);
      
      // AI insights strings
      let insight = '';
      if (rate >= 0.05) insight = `Excellent 5%+ rewards on ${category}.`;
      else if (rate >= 0.02) insight = `Decent rewards on ${category}.`;
      else insight = `Underutilizing rewards potential in ${category}.`;
      
      if (savings > 500) insight += ` High savings of ₹${savings.toFixed(0)}/mo achievable.`;
      
      return { ...c, score, savings, insight };
    });
    
    ranked.sort((a, b) => b.score - a.score);
    res.json({ cards: ranked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to compare cards' });
  }
});

// POST /api/cards/rank
router.post('/rank', async (req, res) => {
  const { priorities, profile, income, creditScore } = req.body;
  try {
    let cards = FALLBACK_CARDS;
    if (await isDbAvailable()) {
      const result = await query('SELECT * FROM cards');
      if (result.rows.length > 0) cards = result.rows;
    }
    const ranked = getRankedCards(cards, priorities || {}, profile || {}, income, creditScore);
    res.json({ cards: ranked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to rank cards' });
  }
});

// GET /api/cards/:id
router.get('/:id', async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const result = await query('SELECT * FROM cards WHERE id = $1', [req.params.id]);
      if (result.rows.length) return res.json({ card: result.rows[0] });
    }
    const card = FALLBACK_CARDS.find(c => c.id === parseInt(req.params.id));
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ card });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/cards/apply/:id — affiliate redirect with tracking
router.get('/apply/:id', async (req, res) => {
  try {
    let affiliate_link = null;
    if (await isDbAvailable()) {
      const cardRes = await query('SELECT affiliate_link FROM cards WHERE id = $1', [req.params.id]);
      if (cardRes.rows.length) affiliate_link = cardRes.rows[0].affiliate_link;
      const userId = req.query.uid || null;
      await query(
        'INSERT INTO applications (user_id, card_id, status, affiliate_source) VALUES ($1, $2, $3, $4)',
        [userId, req.params.id, 'redirected', 'stackr']
      ).catch(() => {});
    }
    if (!affiliate_link) {
      const card = FALLBACK_CARDS.find(c => c.id === parseInt(req.params.id));
      affiliate_link = card?.affiliate_link || 'https://stackr.in';
    }
    const userId = req.query.uid || null;
    res.redirect(`${affiliate_link}?utm_source=stackr${userId ? '&user_id='+userId : ''}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Redirect failed');
  }
});

module.exports = router;
