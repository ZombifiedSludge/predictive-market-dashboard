import { createSignal, onMount, createEffect } from 'solid-js';

const MarketPredictionComponent = (props) => {
  const [marketData, setMarketData] = createSignal(null);
  const [isDistributionOpen, setIsDistributionOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [lastUpdated, setLastUpdated] = createSignal(null);
  
  // Cache keys for localStorage
  const CACHE_KEY = `av_${props.symbol}_data`;
  const CACHE_TIME_KEY = `av_${props.symbol}_updated`;
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Check if we should use cache or fetch fresh data
  const shouldFetchFreshData = () => {
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (!cachedTime) return true;
    
    const now = new Date();
    const cached = new Date(cachedTime);
    
    // Refresh after 4 PM or if cache is more than 24 hours old
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const isPastFourPM = estNow.getHours() >= 16;
    const cachedEstTime = new Date(cached.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const wasCachedBeforeFourPM = cachedEstTime.getHours() < 16;
    const isSameDay = cached.toDateString() === now.toDateString();
    
    return (isPastFourPM && wasCachedBeforeFourPM && isSameDay) || 
           ((now - cached) > 24 * 60 * 60 * 1000);
  };
  
  // Fetch data from Alpha Vantage
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      
      // Try to use cached data first
      if (!shouldFetchFreshData()) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        if (cachedData) {
          setMarketData(JSON.parse(cachedData));
          setLastUpdated(cachedTime);
          setLoading(false);
          return;
        }
      }
      
      // Alpha Vantage API key - get your free key at https://www.alphavantage.co/support/#api-key
      const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
      
      // Get time series data
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${props.symbol}&apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (!data['Time Series (Daily)']) {
        throw new Error('No data available');
      }
      
      // Get the latest date's data
      const dates = Object.keys(data['Time Series (Daily)']).sort().reverse();
      const latestDate = dates[0];
      const latestData = data['Time Series (Daily)'][latestDate];
      
      // Get the previous 20 trading days for distribution
      const last20Days = dates.slice(0, 20);
      const closingPrices = last20Days.map(date => 
        parseFloat(data['Time Series (Daily)'][date]['4. close'])
      );
      
      // Calculate EOY prediction based on recent trend
      const currentPrice = parseFloat(latestData['4. close']);
      
      // Simple end of year prediction based on current trend
      // This is a basic prediction model - could be made more sophisticated
      const tradingDaysLeft = props.symbol === 'SPY' ? 
        calculateTradingDaysLeftInYear() : calculateTradingDaysLeftInYear();
      
      // Calculate average daily change over the last 20 days
      const first = closingPrices[closingPrices.length - 1];
      const last = closingPrices[0];
      const avgDailyChange = (last - first) / closingPrices.length;
      
      // Project end of year price
      const projectedEOY = currentPrice + (avgDailyChange * tradingDaysLeft);
      const projectedEOYRounded = Math.round(projectedEOY / 10) * 10;
      
      // Create a simple distribution around the projected price
      const distribution = [];
      const midpoint = projectedEOYRounded;
      const range = props.symbol === 'SPY' ? 200 : 1000; // SPY has smaller ranges than QQQ
      const step = props.symbol === 'SPY' ? 20 : 100;
      
      for (let i = midpoint - range; i <= midpoint + range; i += step) {
        // Create a normal-like distribution around the midpoint
        const distance = Math.abs(i - midpoint);
        const probability = Math.max(
          5, 
          Math.round(100 * Math.exp(-0.5 * Math.pow(distance / (range/2), 2)))
        );
        
        distribution.push({
          range: i.toString(),
          probability: probability
        });
      }
      
      // Sort by probability descending
      distribution.sort((a, b) => b.probability - a.probability);
      
      // Normalize probabilities to sum to 100
      const totalProb = distribution.reduce((sum, item) => sum + item.probability, 0);
      distribution.forEach(item => {
        item.probability = Math.round((item.probability / totalProb) * 100);
      });
      
      const processedData = {
        price: currentPrice,
        midpoint: midpoint.toString(),
        distribution: distribution
      };
      
      // Save to localStorage cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(processedData));
      const now = new Date().toISOString();
      localStorage.setItem(CACHE_TIME_KEY, now);
      
      setMarketData(processedData);
      setLastUpdated(now);
      
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message);
      
      // Try to use cached data even if it's old
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      if (cachedData) {
        setMarketData(JSON.parse(cachedData));
        setLastUpdated(cachedTime);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate trading days left in the year
  const calculateTradingDaysLeftInYear = () => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.round((endOfYear - now) / millisecondsPerDay);
    
    // Approximate trading days (excluding weekends and holidays)
    return Math.round(daysLeft * (5/7)); // Roughly 5 trading days per 7 calendar days
  };
  
  // Load data on component mount
  onMount(() => {
    fetchMarketData();
  });
  
  // Refresh the data
  const refreshData = () => {
    // Clear cache to force refresh
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
    fetchMarketData();
  };
  
  const toggleDistribution = () => {
    setIsDistributionOpen(!isDistributionOpen());
  };

  return (
    <div class="w-full">
      {loading() ? (
        <div class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : error() ? (
        <div class="text-red-500 text-center p-4">
          Error loading market data: {error()}
          {lastUpdated() && (
            <div class="text-xs text-gray-500 mt-2">
              Showing cached data from {formatTimestamp(lastUpdated())}
            </div>
          )}
        </div>
      ) : (
        <div class="flex flex-col">
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-navy-900">End of Year Projection</h3>
              <div class="mt-2 text-3xl font-bold text-blue-800">
                {marketData()?.midpoint || 'N/A'}
              </div>
              <p class="text-sm text-gray-600 mt-1">
                Current price: ${marketData()?.price.toFixed(2)}
              </p>
              <div class="text-xs text-gray-500 mt-1">
                Last updated: {formatTimestamp(lastUpdated())}
                <button 
                  onClick={refreshData}
                  class="ml-2 text-blue-600 hover:underline"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div class="flex-1 flex justify-end">
              <button
                onClick={toggleDistribution}
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {isDistributionOpen() ? 'Hide Distribution' : 'Show Distribution'}
              </button>
            </div>
          </div>
          
          {isDistributionOpen() && (
            <div class="mt-4 p-4 bg-blue-50 rounded-lg overflow-auto max-h-96">
              <h4 class="font-semibold mb-3">Projected EOY Price Distribution</h4>
              <div class="space-y-2">
                {marketData()?.distribution.map((item) => (
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">${item.range}</span>
                    <div class="flex-1 mx-4">
                      <div
                        class="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${Math.max(5, item.probability)}%` }}
                      ></div>
                    </div>
                    <span class="text-sm">{item.probability}%</span>
                  </div>
                ))}
              </div>
              <p class="text-xs text-gray-500 mt-4">
                * This projection is based on recent market trends and should not be used as financial advice.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketPredictionComponent;
