// API configuration file to securely store API keys
// Store this file outside of your source control (add to .gitignore)

export const API_KEYS = {
  KALSHI_API_KEY: '731c0410-6dbe-47a2-ac7f-bab9a4be1e0b',
  FINNHUB_API_KEY: 'cu0ahohr01ql96gq5n0gcu0ahohr01ql96gq5n10'
};

// Kalshi API base URL
export const KALSHI_API_BASE_URL = 'https://trading-api.kalshi.com/v1';

// Endpoints
export const ENDPOINTS = {
  // S&P 500 End of Year prediction
  SP500_PREDICTION: `${KALSHI_API_BASE_URL}/markets/kxinxy`,
  
  // NASDAQ End of Year prediction - replace 'ndxinxy' with the correct ticker if different
  NASDAQ_PREDICTION: `${KALSHI_API_BASE_URL}/markets/ndxinxy`
};

// Helper function to create headers with authentication
export const getKalshiHeaders = () => {
  return {
    'Authorization': `Bearer ${API_KEYS.KALSHI_API_KEY}`,
    'Content-Type': 'application/json'
  };
};

// Cache keys
export const CACHE_KEYS = {
  SP500: 'kalshi_sp500_prediction',
  NASDAQ: 'kalshi_nasdaq_prediction'
};

// Initialize 4 PM EST refresh scheduler
export const initializeDataRefreshScheduler = (refreshCallback) => {
  // Function to check if it's time to refresh (4 PM EST)
  const checkForRefreshTime = () => {
    const now = new Date();
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Check if it's 4 PM EST
    if (estNow.getHours() === 16 && estNow.getMinutes() === 0) {
      console.log("Scheduled refresh: It's 4 PM EST");
      
      // Call the refresh callback if provided
      if (typeof refreshCallback === 'function') {
        refreshCallback();
      }
      
      // Otherwise, just clear the cache to force refresh on next load
      else {
        localStorage.removeItem(CACHE_KEYS.SP500);
        localStorage.removeItem(CACHE_KEYS.NASDAQ);
      }
    }
  };
  
  // Check every minute
  const schedulerInterval = setInterval(checkForRefreshTime, 60000);
  
  // Return function to clear interval when needed
  return () => clearInterval(schedulerInterval);
};
