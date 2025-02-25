import { createSignal, createEffect, onMount } from 'solid-js';
import { API_KEYS, ENDPOINTS, getKalshiHeaders } from './apiConfig';
import { shouldRefreshCache, getCachedData, saveToCache, formatCacheTimestamp } from './cacheUtils';

const SPPrediction = () => {
  const [predictionData, setPredictionData] = createSignal(null);
  const [isDistributionOpen, setIsDistributionOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [lastUpdated, setLastUpdated] = createSignal(null);
  
  // Cache key for S&P data
  const CACHE_KEY = 'kalshi_sp500_prediction';

  onMount(async () => {
    await fetchPredictionData();
  });

  const fetchPredictionData = async () => {
    try {
      setLoading(true);
      
      // Check if we should use cached data
      if (!shouldRefreshCache(CACHE_KEY)) {
        const cachedResult = getCachedData(CACHE_KEY);
        if (cachedResult) {
          setPredictionData(cachedResult.data);
          setLastUpdated(cachedResult.timestamp);
          setLoading(false);
          return;
        }
      }
      
      // If we get here, we need fresh data
      const response = await fetch(ENDPOINTS.SP500_PREDICTION, {
        headers: getKalshiHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the data to get the distribution
      const processedData = processKalshiData(data);
      
      // Save to cache and update state
      saveToCache(CACHE_KEY, processedData);
      setPredictionData(processedData);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Error fetching Kalshi data:', err);
      setError(err.message);
      
      // Try to use cached data even if it's old when API fails
      const cachedResult = getCachedData(CACHE_KEY);
      if (cachedResult) {
        setPredictionData(cachedResult.data);
        setLastUpdated(cachedResult.timestamp);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh data
  const refreshData = async () => {
    await fetchPredictionData();
  };

  // Function to process Kalshi data into a distribution format
  const processKalshiData = (data) => {
    // This would need to be adjusted based on the actual Kalshi API response structure
    // For now using sample data structure
    if (!data || !data.contracts) {
      return {
        midpoint: '5200',
        distribution: []
      };
    }

    // Sort contracts by their probability
    const sortedContracts = [...data.contracts].sort(
      (a, b) => b.latest_price - a.latest_price
    );
    
    // Find the midpoint (highest probability contract)
    const midpointContract = sortedContracts[0];
    
    // Create the distribution
    const distribution = sortedContracts.map(contract => ({
      range: contract.title || contract.ticker,
      probability: (contract.latest_price * 100).toFixed(1),
      value: contract.latest_price
    }));
    
    return {
      midpoint: midpointContract?.title || '5200',
      distribution: distribution
    };
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
          Error loading prediction data: {error()}
          {lastUpdated() && (
            <div class="text-xs text-gray-500 mt-2">
              Showing cached data from {formatCacheTimestamp(lastUpdated())}
            </div>
          )}
        </div>
      ) : (
        <div class="flex flex-col">
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-navy-900">Most Probable Outcome</h3>
              <div class="mt-2 text-3xl font-bold text-blue-800">
                {predictionData()?.midpoint || 'N/A'}
              </div>
              <p class="text-sm text-gray-600 mt-1">
                Kalshi prediction market's highest probability range
              </p>
              <div class="text-xs text-gray-500 mt-1">
                Last updated: {formatCacheTimestamp(lastUpdated())}
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
              <h4 class="font-semibold mb-3">Full Probability Distribution</h4>
              <div class="space-y-2">
                {predictionData()?.distribution.map((item) => (
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{item.range}</span>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SPPrediction;
