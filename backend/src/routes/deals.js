const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { query } = require('../db');
const userStore = require('../db/user-store');

const isDbAvailable = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch { return false; }
};

// ── Curated Partner Deals (Pro-only) ─────────────────────────────────────────
const PARTNER_DEALS = [
  {
    id: 1,
    merchant: 'Amazon India',
    logo: '🛒',
    category: 'Shopping',
    title: '10% Instant Discount up to ₹2,000',
    description: 'Get 10% instant discount on Amazon purchases using select HDFC credit cards. Minimum transaction ₹5,000.',
    discount: '10%',
    max_savings: '₹2,000',
    valid_till: '2026-05-31',
    terms: 'Min txn ₹5,000. Once per card per month.',
    link: 'https://www.amazon.in',
    card_partners: ['HDFC Millennia', 'HDFC Freedom'],
    featured: true
  },
  {
    id: 2,
    merchant: 'Swiggy',
    logo: '🍔',
    category: 'Food & Dining',
    title: '20% Off on Orders above ₹500',
    description: 'Flat 20% discount on Swiggy orders paid via SBI Credit Cards. Max discount ₹150 per order.',
    discount: '20%',
    max_savings: '₹150',
    valid_till: '2026-06-15',
    terms: 'Valid on orders above ₹500. Twice per user per month.',
    link: 'https://www.swiggy.com',
    card_partners: ['SimplyCLICK SBI', 'SBI Cashback', 'SBI IRCTC'],
    featured: true
  },
  {
    id: 3,
    merchant: 'MakeMyTrip',
    logo: '✈️',
    category: 'Travel',
    title: 'Flat ₹3,000 Off on Flights',
    description: 'Book domestic flights on MakeMyTrip and get flat ₹3,000 off using Axis Bank credit cards. Min booking ₹8,000.',
    discount: 'Flat ₹3,000',
    max_savings: '₹3,000',
    valid_till: '2026-05-20',
    terms: 'Min booking ₹8,000. Valid on domestic flights only.',
    link: 'https://www.makemytrip.com',
    card_partners: ['Axis Neo Travel', 'Axis LIC Card'],
    featured: false
  },
  {
    id: 4,
    merchant: 'Myntra',
    logo: '👗',
    category: 'Fashion',
    title: '15% Cashback on Fashion Spends',
    description: 'Earn 15% cashback on Myntra purchases using IDFC First Bank credit cards. Max cashback ₹1,000.',
    discount: '15%',
    max_savings: '₹1,000',
    valid_till: '2026-06-30',
    terms: 'Min purchase ₹2,000. Max cashback ₹1,000 per statement cycle.',
    link: 'https://www.myntra.com',
    card_partners: ['IDFC First WOW'],
    featured: false
  },
  {
    id: 5,
    merchant: 'BPCL Fuel Stations',
    logo: '⛽',
    category: 'Fuel',
    title: '5% Cashback + Fuel Surcharge Waiver',
    description: 'Get 5% cashback on all BPCL fuel transactions plus complete fuel surcharge waiver with IndusInd Bank cards.',
    discount: '5%',
    max_savings: '₹500/mo',
    valid_till: '2026-07-31',
    terms: 'Max cashback ₹500 per month. Auto-applied.',
    link: 'https://www.bharatpetroleum.in',
    card_partners: ['BPCL IndusInd'],
    featured: true
  },
  {
    id: 6,
    merchant: 'Flipkart',
    logo: '📦',
    category: 'Shopping',
    title: '₹750 Instant Discount on Electronics',
    description: 'Flat ₹750 off on electronics and appliances on Flipkart. Valid on HDFC Bank credit cards only.',
    discount: 'Flat ₹750',
    max_savings: '₹750',
    valid_till: '2026-05-25',
    terms: 'Min txn ₹10,000. Electronics category only.',
    link: 'https://www.flipkart.com',
    card_partners: ['HDFC Millennia', 'HDFC Freedom'],
    featured: false
  },
  {
    id: 7,
    merchant: 'BookMyShow',
    logo: '🎬',
    category: 'Entertainment',
    title: 'Buy 1 Get 1 Free on Movie Tickets',
    description: 'Enjoy BOGO on movie tickets every Friday & Saturday when paying with SBI credit cards via BookMyShow.',
    discount: 'BOGO',
    max_savings: '₹300',
    valid_till: '2026-06-30',
    terms: 'Valid on Fri & Sat. Max ticket value ₹300. Twice per month.',
    link: 'https://in.bookmyshow.com',
    card_partners: ['SimplyCLICK SBI', 'SBI Cashback'],
    featured: false
  },
  {
    id: 8,
    merchant: 'Croma',
    logo: '📱',
    category: 'Electronics',
    title: 'No-Cost EMI + ₹2,500 Off',
    description: 'Get no-cost EMI up to 12 months plus ₹2,500 instant discount on purchases above ₹25,000 at Croma.',
    discount: '₹2,500 + EMI',
    max_savings: '₹2,500',
    valid_till: '2026-05-15',
    terms: 'Min purchase ₹25,000. Valid on all major bank credit cards.',
    link: 'https://www.croma.com',
    card_partners: ['HDFC Millennia', 'SBI Cashback', 'Axis Neo Travel', 'IDFC First WOW'],
    featured: true
  },
  {
    id: 9,
    merchant: 'Zomato',
    logo: '🍕',
    category: 'Food & Dining',
    title: 'Free Zomato Gold for 3 Months',
    description: 'Get complimentary Zomato Gold membership for 3 months when you make your first transaction with HSBC cards.',
    discount: 'Free Gold',
    max_savings: '₹900',
    valid_till: '2026-06-01',
    terms: 'New HSBC cardholders only. First txn within 30 days.',
    link: 'https://www.zomato.com',
    card_partners: ['HSBC Travel One'],
    featured: false
  },
  {
    id: 10,
    merchant: 'LIC Premium',
    logo: '🛡️',
    category: 'Insurance',
    title: '2X Reward Points on LIC Premiums',
    description: 'Earn double reward points when you pay LIC insurance premiums using Axis LIC credit card. Points redeemable for flights.',
    discount: '2X Points',
    max_savings: '₹1,200',
    valid_till: '2026-12-31',
    terms: 'Auto-applied on LIC premium payments. No max cap on points.',
    link: 'https://licindia.in',
    card_partners: ['Axis LIC Card'],
    featured: false
  }
];

// GET /api/deals — returns curated partner deals (Pro-only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check subscription status
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
      // Return preview (2 deals) with a flag to prompt upgrade
      return res.json({
        isPro: false,
        deals: PARTNER_DEALS.filter(d => d.featured).slice(0, 2),
        total_deals: PARTNER_DEALS.length,
        message: 'Upgrade to Pro to unlock all exclusive partner deals!'
      });
    }

    // Pro users get all deals
    const { category } = req.query;
    let deals = PARTNER_DEALS;
    if (category && category !== 'all') {
      deals = deals.filter(d => d.category.toLowerCase() === category.toString().toLowerCase());
    }

    res.json({
      isPro: true,
      deals,
      total_deals: PARTNER_DEALS.length,
      categories: [...new Set(PARTNER_DEALS.map(d => d.category))]
    });

  } catch (error) {
    console.error('Deals Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

module.exports = router;
