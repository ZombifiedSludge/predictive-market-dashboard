import { createSignal, onMount, onCleanup } from 'solid-js';

const OilGauge = () => {
  const [oilPrice, setOilPrice] = createSignal(null);
  const [priceChange, setPriceChange] = createSignal(null);
  const [lastUpdated, setLastUpdated] = createSignal(null);
  const [rotation, setRotation] = createSignal(0);

  // Calculate needle rotation based on price (0-160 range)
  const calculateRotation = (price) => {
    // Convert price to degrees (0-160 price maps to 0-180 degrees)
    return (price * 180 / 160) - 90; // -90 to start at left side
  };

  const fetchOilData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=WTI&interval=weekly&apikey=5OXIQR1MY9ZYBDKO`
      );
      const data = await response.json();
      
      if (data['data']) {
        // Get the two most recent weeks for price change calculation
        const [currentWeek, lastWeek] = data['data'];
        const currentPrice = parseFloat(currentWeek['value']);
        const lastPrice = parseFloat(lastWeek['value']);
        
        // Calculate percentage change
        const percentChange = ((currentPrice - lastPrice) / lastPrice) * 100;
        
        setOilPrice(currentPrice);
        setPriceChange(percentChange);
        setLastUpdated(currentWeek['date']);
        setRotation(calculateRotation(currentPrice));
        
        // Cache the data
        localStorage.setItem('oil_cache', JSON.stringify({
          price: currentPrice,
          change: percentChange,
          lastUpdated: currentWeek['date'],
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching oil price:', error);
    }
  };

  const shouldFetchNewData = () => {
    const cachedData = localStorage.getItem('oil_cache');
    if (!cachedData) return true;
    
    const { timestamp } = JSON.parse(cachedData);
    const lastFetch = new Date(timestamp);
    const now = new Date();
    
    // Check if it's been a week since last fetch
    return (now - lastFetch) > 7 * 24 * 60 * 60 * 1000;
  };

  onMount(() => {
    // Try to load cached value first
    const cachedData = localStorage.getItem('oil_cache');
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setOilPrice(data.price);
      setPriceChange(data.change);
      setLastUpdated(data.lastUpdated);
      setRotation(calculateRotation(data.price));
    }

    // Only fetch if we need new data
    if (shouldFetchNewData()) {
      fetchOilData();
    }
  });

  return (
    <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
      <h2 class="text-sm font-semibold text-blue-800 mb-1">Crude Oil (WTI)</h2>
      <div class="flex flex-col items-center">
        {/* Speedometer gauge */}
        <svg viewBox="-10 -10 220 140" class="w-32">
          {/* Gauge background */}
          <path
            d="M 0,100 A 100,100 0 0,1 200,100"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="8"
            stroke-linecap="round"
          />
          
          {/* Tick marks */}
          {[...Array(9)].map((_, i) => {
            const angle = -90 + (i * 180 / 8);
            const x1 = 100 + 85 * Math.cos((angle * Math.PI) / 180);
            const y1 = 100 + 85 * Math.sin((angle * Math.PI) / 180);
            const x2 = 100 + 95 * Math.cos((angle * Math.PI) / 180);
            const y2 = 100 + 95 * Math.sin((angle * Math.PI) / 180);
            return (
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                stroke-width="2"
              />
            );
          })}
          
          {/* Price markers */}
          <text x="0" y="115" font-size="10" fill="#64748b">0</text>
          <text x="190" y="115" font-size="10" fill="#64748b">160</text>
          
          {/* Needle */}
          <g transform={`rotate(${rotation()}, 100, 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="#1e293b"
              stroke-width="2"
            />
            <circle cx="100" cy="100" r="4" fill="#1e293b" />
          </g>
        </svg>
        
        {/* Price display */}
        <div class="flex items-baseline mt-2">
          <span class="text-xl font-bold text-gray-900">
            ${oilPrice()?.toFixed(2) || '--'}
          </span>
          <span class={`ml-2 text-sm ${priceChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({priceChange()?.toFixed(1)}%)
          </span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Last Updated: {lastUpdated() || '--'}
        </div>
      </div>
    </div>
  );
};

export default OilGauge;
