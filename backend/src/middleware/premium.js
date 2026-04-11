const { query } = require('../db');
const userStore = require('../db/user-store');

const isDbAvailable = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch { return false; }
};

const verifyPro = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    if (await isDbAvailable()) {
      const result = await query(
        'SELECT plan_type, status, end_date FROM user_subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [req.user.userId]
      );
      
      let isPro = false;
      if (result.rows.length > 0) {
        const sub = result.rows[0];
        if (sub.plan_type === 'pro' && sub.status === 'active') {
          if (!sub.end_date || new Date(sub.end_date) > new Date()) {
            isPro = true;
          }
        }
      }
      
      if (!isPro) {
        return res.status(403).json({ error: 'Pro subscription required' });
      }
      
      next();
    } else {
      // Fallback JSON check
      const sub = userStore.getSubscription(req.user.userId);
      if (sub && sub.plan_type === 'pro' && sub.status === 'active') {
        if (!sub.end_date || new Date(sub.end_date) > new Date()) {
          return next();
        }
      }
      return res.status(403).json({ error: 'Pro subscription required' });
    }
  } catch (error) {
    console.error('[VerifyPro Middleware]', error);
    res.status(500).json({ error: 'Server error checking subscription status' });
  }
};

module.exports = verifyPro;
