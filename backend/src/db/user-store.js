/**
 * Persistent JSON-file user store — used when PostgreSQL is offline.
 * Data is saved to backend/users.json so it survives server restarts.
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const STORE_PATH = path.join(__dirname, '../../users.json');

let users = [];
let nextId = 1;

// ── Load from disk ────────────────────────────────────────────────────────────
const load = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      users = data.users || [];
      nextId = data.nextId || (users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1);
    }
  } catch {
    users = [];
    nextId = 1;
  }
};

// ── Save to disk ──────────────────────────────────────────────────────────────
const save = () => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ users, nextId }, null, 2), 'utf8');
  } catch (err) {
    console.warn('[UserStore] Could not write users.json:', err.message);
  }
};

// ── Seed a demo account if the store is empty ─────────────────────────────────
const seedTestUser = async () => {
  if (users.length === 0) {
    const hash = await bcrypt.hash('password', 10);
    const user = {
      id: nextId++,
      name: 'Test User',
      email: 'test@stackr.com',
      password_hash: hash,
      monthly_income: 75000,
      credit_score: 750,
      spending_profile: {},
      subscription: { plan_type: 'free', status: 'active', end_date: null }
    };
    users.push(user);
    save();
    console.log('[UserStore] Demo account seeded → test@stackr.com / password');
  }
};

// ── CRUD helpers ──────────────────────────────────────────────────────────────
const findByEmail = (email) => users.find(u => u.email === email) || null;

const findById = (id) => users.find(u => u.id === id) || null;

const create = (name, email, passwordHash) => {
  if (findByEmail(email)) return null;           // duplicate e-mail
  const user = {
    id: nextId++,
    name,
    email,
    password_hash: passwordHash,
    monthly_income: 0,
    credit_score: 750,
    spending_profile: {},
    subscription: { plan_type: 'free', status: 'active', end_date: null }
  };
  users.push(user);
  save();
  return { id: user.id, name: user.name, email: user.email };
};

const update = (id, { monthly_income, credit_score, spending_profile }) => {
  const user = findById(id);
  if (!user) return false;
  user.monthly_income = monthly_income;
  user.credit_score = credit_score;
  user.spending_profile = spending_profile;
  save();
  return true;
};

const updateSubscription = (id, plan_type, status, end_date) => {
  const user = findById(id);
  if (!user) return false;
  user.subscription = { plan_type, status, end_date };
  save();
  return true;
};

const getSubscription = (id) => {
  const user = findById(id);
  return user ? user.subscription || { plan_type: 'free', status: 'active', end_date: null } : null;
};

// Load on module init
load();

module.exports = { seedTestUser, findByEmail, findById, create, update, updateSubscription, getSubscription };
