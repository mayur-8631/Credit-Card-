const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'stackr_super_secret';

// In-memory user store as fallback when Postgres is offline
const memUsers = [];
let memNextId = 1;

const isDbAvailable = async () => {
  try {
    await query('SELECT 1');
    return true;
  } catch { return false; }
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

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
      // In-memory fallback
      if (memUsers.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
      const user = { id: memNextId++, name, email, password_hash: hash, credit_score: 750, monthly_income: 0, spending_profile: {} };
      memUsers.push(user);
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: user.id, name, email }, token });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    if (await isDbAvailable()) {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } else {
      // In-memory fallback
      const user = memUsers.find(u => u.email === email);
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (await isDbAvailable()) {
      const result = await query(
        'SELECT id, name, email, monthly_income, credit_score, spending_profile FROM users WHERE id = $1',
        [req.user.userId]
      );
      return res.json({ user: result.rows[0] });
    } else {
      // Return decoded token payload
      const user = memUsers.find(u => u.id === req.user.userId) || {
        id: req.user.userId, name: req.user.name, email: req.user.email,
        monthly_income: 0, credit_score: 750, spending_profile: {}
      };
      return res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  const { monthly_income, credit_score, spending_profile } = req.body;
  try {
    if (await isDbAvailable()) {
      await query(
        'UPDATE users SET monthly_income = $1, credit_score = $2, spending_profile = $3 WHERE id = $4',
        [monthly_income, credit_score, JSON.stringify(spending_profile), req.user.userId]
      );
    } else {
      const user = memUsers.find(u => u.id === req.user.userId);
      if (user) { user.monthly_income = monthly_income; user.credit_score = credit_score; user.spending_profile = spending_profile; }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
