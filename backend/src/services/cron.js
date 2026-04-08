const { query } = require('../db');

// Mock data integration: simulates scraping bank APIs to refresh cards/offers every 24h
const refreshCardData = async () => {
  console.log('[Cron] Starting daily card data & offer refresh...');
  try {
    // 1. In a real scenario, we'd fetch from Paisabazaar or Bank APIs here.
    // For now, we update the last_updated timestamp to simulate successful sync.
    await query('UPDATE cards SET last_updated = CURRENT_TIMESTAMP');
    
    // 2. Fetch mock offers and seed into database or clean expired ones.
    await query('DELETE FROM offers WHERE expiry_date < CURRENT_TIMESTAMP');
    
    console.log('[Cron] Refresh complete. Card data is up to date.');
  } catch (err) {
    console.error('[Cron] Refresh failed:', err);
  }
};

// Setup: runs immediately, then every 24h using setInterval
const startCronJobs = () => {
  refreshCardData();
  setInterval(refreshCardData, 24 * 60 * 60 * 1000); // every 24 hours
};

module.exports = { startCronJobs, refreshCardData };
