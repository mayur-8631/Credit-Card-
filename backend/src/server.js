require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb, connectRedis } = require('./db');
const { startCronJobs } = require('./services/cron');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cards', require('./routes/cards'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const startServer = async () => {
  // These are non-blocking — server will start even if they fail
  connectRedis().catch(() => {});
  await initDb().catch(() => {});
  startCronJobs();

  app.listen(PORT, () => {
    console.log(`[STACKR] Server running at http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
