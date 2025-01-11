import { createSignal, onMount, onCleanup } from 'solid-js';

const CopperIndicator = () => {
  const [copperPrice, setCopperPrice] = createSignal(null);
  const [priceChange, setPriceChange] = createSignal(null);
  const [lastUpdated, setLastUpdated] = createSignal(null);
  const [ytdHigh, setYtdHigh] = createSignal(null);
  const [ytdLow, setYtdLow] = createSignal(null);

  const fetchCopperData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=COPPER&interval=monthly&apikey=5OXIQR1MY9ZYBDKO`
      );
      const data = await response.json();
      
      if (data['data']) {
        // Get the two most recent months for price change calculation
        const [currentMonth, lastMonth] = data['data'];
        const currentPrice = parseFloat(currentMonth['value']);
        const lastPrice = parseFloat(lastMonth['value']);
        
        // Calculate percentage change
        const percentChange = ((currentPrice - lastPrice) / lastPrice) * 100;
        
        // Get YTD data for high/low
        const currentYear = new Date().getFullYear();
        const ytdData = data['data'].filter(item => 
          item['date'].startsWith(currentYear.toString())
        );
        const ytdHighValue = Math.max(...ytdData.map(item => parseFloat(item['value'])));
        const ytdLowValue = Math.min(...ytdData.map(item => parseFloat(item['value'])));
        
        setCopperPrice(currentPrice);
        setPriceChange(percentChange);
        setLastUpdated(currentMonth['date']);
        setYtdHigh(ytdHighValue);
        setYtdLow(ytdLowValue);
        
        // Cache the data
        localStorage.setItem('copper_cache', JSON.stringify({
          price: currentPrice,
          change: percentChange,
          lastUpdated: currentMonth['date'],
          ytdHigh: ytdHighValue,
          ytdLow: ytdLowValue,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching copper price:', error);
    }
  };

  const shouldFetchNewData = () => {
    const cachedData = localStorage.getItem('copper_cache');
    if (!cachedData) return true;
    
    const { timestamp } = JSON.parse(cachedData);
    const lastFetch = new Date(timestamp);
    const now = new Date();
    
    // Check if it's been a month since last fetch
    const monthDiff = (now.getFullYear() - lastFetch.getFullYear()) * 12 + 
                     (now.getMonth() - lastFetch.getMonth());
    return monthDiff >= 1;
  };

  onMount(() => {
    // Try to load cached value first
    const cachedData = localStorage.getItem('copper_cache');
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setCopperPrice(data.price);
      setPriceChange(data.change);
      setLastUpdated(data.lastUpdated);
      setYtdHigh(data.ytdHigh);
      setYtdLow(data.ytdLow);
    }

    // Only fetch if we need new data
    if (shouldFetchNewData()) {
      fetchCopperData();
    }
  });

  return (
    <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg shadow-xl p-4">
      <h2 class="text-lg font-semibold text-orange-100 mb-2">Copper</h2>
      <div class="flex flex-col items-start space-y-2">
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-orange-50">
            ${copperPrice()?.toFixed(2) || '--'}
          </span>
          <span class={`ml-2 text-lg ${priceChange() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ({priceChange()?.toFixed(1)}%)
          </span>
        </div>
        <div class="text-sm text-orange-200">
          YTD High: ${ytdHigh()?.toFixed(2) || '--'}
        </div>
        <div class="text-sm text-orange-200">
          YTD Low: ${ytdLow()?.toFixed(2) || '--'}
        </div>
        <div class="text-xs text-orange-300 mt-2">
          Last Updated: {lastUpdated() || '--'}
        </div>
      </div>
    </div>
  );
};

export default CopperIndicator;
