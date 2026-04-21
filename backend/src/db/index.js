const { Pool } = require('pg');
const { createClient } = require('redis');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'credimatch_user',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'credimatch_db',
  password: process.env.POSTGRES_PASSWORD || 'credimatch_password',
  port: process.env.POSTGRES_PORT || 5432,
});

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let redisAvailable = false;

// Redis is OPTIONAL — server starts fine without it
redisClient.on('error', () => { redisAvailable = false; });
redisClient.on('connect', () => {
  redisAvailable = true;
  console.log('[Redis] Connected');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.warn('[Redis] Not available — running without cache (Docker may be offline)');
    redisAvailable = false;
  }
};

const initDb = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
    await pool.query(schemaSql);
    console.log('[DB] PostgreSQL initialized successfully');
  } catch (error) {
    console.warn('[DB] PostgreSQL not available — some features may be limited:', error.message);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  redisClient,
  redisAvailable: () => redisAvailable,
  connectRedis,
  initDb,
  pool
};
