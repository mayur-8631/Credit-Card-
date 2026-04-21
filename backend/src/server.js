require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb, connectRedis } = require('./db');
const { startCronJobs } = require('./services/cron');
const userStore = require('./db/user-store');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/timing', require('./routes/timing'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const startServer = async () => {
  // Non-blocking — server starts even if they fail
  connectRedis().catch(() => {});
  await initDb().catch(() => {});

  // Seed demo user if the JSON store is empty (runs only when Postgres is offline)
  await userStore.seedTestUser();

  startCronJobs();

  app.listen(PORT, () => {
    console.log(`[Credimatch] Server running at http://localhost:${PORT}`);
    console.log(`[Credimatch] Demo login → test@credimatch.com / password`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
