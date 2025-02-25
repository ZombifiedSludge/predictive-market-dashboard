import { createSignal, onMount } from 'solid-js';
import { formatCacheTimestamp } from './cacheUtils';

const NasdaqPrediction = () => {
  const [predictionData, setPredictionData] = createSignal(null);
  const [isDistributionOpen, setIsDistributionOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [lastUpdated, setLastUpdated] = createSignal(null);

  // Path to the cached JSON file from Python
  const CACHE_FILE_PATH = '/kalshi_cache/nasdaq_prediction.json';

  onMount(async () => {
    await fetchCachedData();
  });

  const fetchCachedData = async () => {
    try {
      setLoading(true);
      
      // Fetch the JSON file created by the Python script
      const response = await fetch(CACHE_FILE_PATH);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cached data: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update the component state
      setPredictionData(data);
      setLastUpdated(data.timestamp);
    } catch (err) {
      console.error('Error fetching cached data:', err);
      setError(err.message || 'Error loading prediction data');
    } finally {
      setLoading(false);
    }
  };
  
  // Manual refresh for testing - typically this would be handled by the Python script
  const refreshData = async () => {
    await fetchCachedData();
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
          {error()}
          <p class="text-xs text-gray-600 mt-2">
            Note: This component now requires a Python script to fetch data from Kalshi.
            Please run the kalshi_data_fetcher.py script to update the prediction data.
          </p>
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
                    <span class="text-sm">{item.probability.toFixed(1)}%</span>
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

export default NasdaqPrediction;
