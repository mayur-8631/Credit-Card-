const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { query } = require('../db');
const authMiddleware = require('../middleware/auth');
const userStore = require('../db/user-store');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'credimatch_webhook_secret';

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const isDbAvailable = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch { return false; }
};

// ── GET Current Subscription ──────────────────────────────────────────────────
router.get('/status', authMiddleware, async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const result = await query(
        'SELECT plan_type, status, end_date FROM user_subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [req.user.userId]
      );
      if (result.rows.length > 0) {
        return res.json({ subscription: result.rows[0] });
      } else {
        return res.json({ subscription: { plan_type: 'free', status: 'active', end_date: null } });
      }
    } else {
      const sub = userStore.getSubscription(req.user.userId);
      return res.json({ subscription: sub || { plan_type: 'free', status: 'active', end_date: null } });
    }
  } catch (error) {
    console.error('Fetch Subscription Error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// ── Create Order ──────────────────────────────────────────────────────────────
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    // Pro plan is ₹199 / month or year
    const amount = 199 * 100; // in paise
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `receipt_order_${req.user.userId}`,
      payment_capture: 1 // Auto capture
    };

    const order = await razorpayInstance.orders.create(options);
    if (!order) return res.status(500).json({ error: 'Failed to create Razorpay order' });

    res.json(order);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to initiate payment', details: error.message });
  }
});

// ── Verify Payment ────────────────────────────────────────────────────────────
router.post('/verify-payment', authMiddleware, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment details' });
  }

  // Verify Signature
  const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ error: 'Transaction not legit!' });
  }

  // Calculate 1 year from now
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  try {
    if (await isDbAvailable()) {
      // Create or update subscription
      // Set previous active to inactive
      await query(
        'UPDATE user_subscriptions SET status = $1 WHERE user_id = $2 AND status = $3',
        ['inactive', req.user.userId, 'active']
      );

      await query(
        `INSERT INTO user_subscriptions 
        (user_id, plan_type, status, start_date, end_date, razorpay_payment_id, razorpay_order_id, razorpay_signature) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7)`,
        [req.user.userId, 'pro', 'active', endDate, razorpay_payment_id, razorpay_order_id, razorpay_signature]
      );
    } else {
      userStore.updateSubscription(req.user.userId, 'pro', 'active', endDate);
    }

    res.json({ success: true, message: 'Payment successful, Pro activated!' });
  } catch (error) {
    console.error('Payment DB Error:', error);
    res.status(500).json({ error: 'Failed to process successful payment internally' });
  }
});

// ── Webhook Handler ───────────────────────────────────────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac('sha256', secret);
  // verify using req.rawBody correctly
  if (req.rawBody) {
    shasum.update(req.rawBody);
  } else {
    shasum.update(JSON.stringify(req.body));
  }
  const digest = shasum.digest('hex');

  const providedSignature = req.headers['x-razorpay-signature'];

  if (digest === providedSignature) {
    console.log('Webhook validated successfully.');
    
    // Process Event
    const event = req.body;
    
    if (event.event === 'payment.captured') {
        const paymentData = event.payload.payment.entity;
        console.log(`Payment captured: ${paymentData.id} for amount ${paymentData.amount}`);
        // Can optionally log to db here if we identify the user (could pass user_id in notes)
    } else if (event.event === 'payment.failed') {
        const paymentData = event.payload.payment.entity;
        console.log(`Payment failed: ${paymentData.id}`);
    }

    res.status(200).json({ status: 'ok' });
  } else {
    console.warn('Webhook signature mismatch!');
    res.status(403).json({ error: 'Invalid webhook signature' });
  }
});

module.exports = router;
