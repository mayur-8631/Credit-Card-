const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const authMiddleware = require('../middleware/auth');
const userStore = require('../db/user-store');

const JWT_SECRET = process.env.JWT_SECRET || 'credimatch_super_secret';

const isDbAvailable = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch { return false; }
};

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    if (await isDbAvailable()) {
      const result = await query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hash]
      );
      const user = result.rows[0];
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user, token });
    } else {
      // Persistent JSON file fallback
      const newUser = userStore.create(name, email, hash);
      if (!newUser) return res.status(400).json({ error: 'Email already registered' });
      const token = jwt.sign({ userId: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: newUser, token });
    }
  } catch (error) {
    console.error('[Register]', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    if (await isDbAvailable()) {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      let user = result.rows[0];
      
      if (!user) {
        // Auto-register
        const hash = await bcrypt.hash(password, 10);
        const name = email.split('@')[0] || 'User';
        const resInsert = await query(
          'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
          [name, email, hash]
        );
        user = resInsert.rows[0];
      } else {
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid email or password' });
      }
      
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } else {
      // Persistent JSON file fallback
      let user = userStore.findByEmail(email);
      
      if (!user) {
        const hash = await bcrypt.hash(password, 10);
        const name = email.split('@')[0] || 'User';
        user = userStore.create(name, email, hash);
      } else {
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid email or password' });
      }
      
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    }
  } catch (error) {
    console.error('[Login]', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ── GET /me ───────────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const result = await query(
        'SELECT id, name, email, monthly_income, credit_score, spending_profile FROM users WHERE id = $1',
        [req.user.userId]
      );
      return res.json({ user: result.rows[0] });
    } else {
      const user = userStore.findById(req.user.userId) || {
        id: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        monthly_income: 0,
        credit_score: 750,
        spending_profile: {}
      };
      return res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /me ───────────────────────────────────────────────────────────────────
router.put('/me', authMiddleware, async (req, res) => {
  const { monthly_income, credit_score, spending_profile } = req.body || {};
  try {
    if (await isDbAvailable()) {
      await query(
        'UPDATE users SET monthly_income = $1, credit_score = $2, spending_profile = $3 WHERE id = $4',
        [monthly_income, credit_score, JSON.stringify(spending_profile), req.user.userId]
      );
    } else {
      userStore.update(req.user.userId, { monthly_income, credit_score, spending_profile });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
