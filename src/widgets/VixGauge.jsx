import { createSignal, onMount, onCleanup } from 'solid-js';

const ALPHA_VANTAGE_KEY = '5OXIQR1MY9ZYBDKO';
const CACHE_KEY = 'vix_cache';
const CACHE_TIMESTAMP_KEY = 'vix_cache_timestamp';

const VixGauge = () => {
  const [vixValue, setVixValue] = createSignal(null);
  const [rotation, setRotation] = createSignal(-90);

  const calculateRotation = (value) => {
    return -90 + (value * 180 / 50);
  };

  const getValueColor = (value) => {
    if (value === null) return 'text-gray-600';
    if (value < 20) return 'text-green-500';
    if (value <= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const shouldFetchNewData = () => {
    const now = new Date();
    const lastUpdate = new Date(localStorage.getItem(CACHE_TIMESTAMP_KEY));
    
    if (!lastUpdate || isNaN(lastUpdate.getTime())) return true;

    const lastClose = new Date();
    lastClose.setHours(16, 0, 0, 0); // 4 PM EST
    
    if (now.getHours() >= 16 && lastUpdate < lastClose) return true;
    if (lastUpdate < lastClose - 24 * 60 * 60 * 1000) return true;
    
    return false;
  };

  const fetchVixData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIX&apikey=${ALPHA_VANTAGE_KEY}`
      );
      const data = await response.json();
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = parseFloat(data['Global Quote']['05. price']);
        
        localStorage.setItem(CACHE_KEY, price.toString());
        localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
        
        setVixValue(price);
        setRotation(calculateRotation(price));
      }
    } catch (error) {
      console.error('Error fetching VIX:', error);
    }
  };

  onMount(() => {
    const cachedValue = localStorage.getItem(CACHE_KEY);
    if (cachedValue) {
      const value = parseFloat(cachedValue);
      setVixValue(value);
      setRotation(calculateRotation(value));
    }

    if (shouldFetchNewData()) {
      fetchVixData();
    }

    const interval = setInterval(() => {
      if (shouldFetchNewData()) {
        fetchVixData();
      }
    }, 60 * 60 * 1000); // Check every hour

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-3">
      <h2 class="text-sm font-semibold text-blue-800 mb-1">Fear Index</h2>
      <div class="flex flex-col items-center">
        <svg viewBox="-10 -10 220 140" class="w-32">
          <path
            d="M 0,100 A 100,100 0 0,1 200,100"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="18"
            stroke-linecap="round"
          />
          <path
            d="M 0,100 A 100,100 0 0,1 200,100"
            fill="none"
            stroke="#d1d5db"
            stroke-width="18"
            stroke-linecap="round"
          />
          <text x="-5" y="125" font-size="12" fill="#6b7280">Stable</text>
          <text x="165" y="125" font-size="12" fill="#6b7280">Chaos</text>
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
        <div class={getValueColor(vixValue())}>
          <span class="text-xl font-bold mt-1">
            {vixValue()?.toFixed(2) || '--'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VixGauge;
