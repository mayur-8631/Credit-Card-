/**
 * Persistent JSON-file user-cards store — used when PostgreSQL is offline.
 * Data is saved to backend/user_cards.json so it survives server restarts.
 */
const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../../user_cards.json');

let userCards = [];
let nextId = 1;

// ── Load from disk ────────────────────────────────────────────────────────────
const load = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      userCards = data.userCards || [];
      nextId = data.nextId || (userCards.length > 0 ? Math.max(...userCards.map(c => c.id)) + 1 : 1);
    }
  } catch {
    userCards = [];
    nextId = 1;
  }
};

// ── Save to disk ──────────────────────────────────────────────────────────────
const save = () => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ userCards, nextId }, null, 2), 'utf8');
  } catch (err) {
    console.warn('[UserCardsStore] Could not write user_cards.json:', err.message);
  }
};

// ── CRUD helpers ──────────────────────────────────────────────────────────────
const findByUserId = (userId) => userCards.filter(c => c.user_id === userId);

const create = (userId, cardData) => {
  const card = {
    id: nextId++,
    user_id: userId,
    card_name: cardData.card_name || 'My Card',
    bank: cardData.bank || 'Unknown Bank',
    card_type: cardData.card_type || 'Visa',
    credit_limit: parseInt(cardData.credit_limit) || 0,
    annual_fee: parseInt(cardData.annual_fee) || 0,
    interest_rate: parseFloat(cardData.interest_rate) || 0.0,
    billing_cycle_days: parseInt(cardData.billing_cycle_days) || 30,
    due_date: parseInt(cardData.due_date) || 1,
    reward_rates: cardData.reward_rates || { general: 0, online: 0, fuel: 0, travel: 0, dining: 0 },
    joining_date: cardData.joining_date || new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  userCards.push(card);
  save();
  return card;
};

// Load on module init
load();

module.exports = { findByUserId, create };
