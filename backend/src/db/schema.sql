CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  monthly_income INTEGER DEFAULT 0,
  credit_score INTEGER DEFAULT 750,
  spending_profile JSONB DEFAULT '{"shopping": 0, "travel": 0, "fuel": 0, "bills": 0}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  bank VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- (cashback, travel, fuel, rewards)
  joining_fee INTEGER DEFAULT 0,
  annual_fee INTEGER DEFAULT 0,
  reward_rate VARCHAR(100),
  cashback_rules JSONB,
  lounge_access VARCHAR(100),
  fuel_benefits VARCHAR(100),
  insurance_details VARCHAR(255),
  eligibility_score_min INTEGER DEFAULT 650,
  affiliate_link VARCHAR(500),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  expiry_date TIMESTAMP,
  bonus_value INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- (viewed, compared, applied)
  card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'clicked', -- (clicked, redirected, approved)
  affiliate_source VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Basic data for testing)
INSERT INTO cards (name, bank, type, joining_fee, annual_fee, reward_rate, cashback_rules, lounge_access, fuel_benefits, insurance_details, eligibility_score_min, affiliate_link) VALUES 
('HDFC Millennia', 'HDFC Bank', 'Cashback', 1000, 1000, '10x CashPoints', '{"amazon": 5, "flipkart": 5, "other": 1}', '4 / yr', '1% waiver', 'Purchase Protect', 700, 'https://hdfc.com/apply/millennia'),
('SimplyCLICK SBI', 'SBI Card', 'Rewards', 499, 499, '10x Reward Pts', '{"amazon": 1.25, "other": 0.25}', '2 / yr', 'None', 'None', 680, 'https://sbicard.com/apply/simplyclick'),
('Axis Neo Travel', 'Axis Bank', 'Travel', 0, 0, '2x Miles', '{"travel": 1, "other": 0.5}', '2 / yr', '1% waiver', 'Travel Cover', 650, 'https://axisbank.com/apply/neo'),
('IDFC First WOW', 'IDFC First', 'Rewards', 0, 0, '3x on Fuel', '{"fuel": 1.5, "other": 0.5}', '4 / yr', '1% waiver', 'Road Side', 650, 'https://idfcfirstbank.com/apply/wow'),
('SBI IRCTC', 'SBI Card', 'Travel', 500, 500, '5x on Trains', '{"trains": 5, "other": 0.5}', '2 / yr', 'None', 'Travel Insur.', 680, 'https://sbicard.com/apply/irctc'),
('SBI Cashback', 'SBI Card', 'Cashback', 999, 999, '1x Base', '{"online": 5, "other": 1}', '2 / yr', 'None', 'None', 700, 'https://sbicard.com/apply/cashback')
ON CONFLICT DO NOTHING;
