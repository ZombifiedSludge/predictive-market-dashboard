import { createSignal, onMount, onCleanup } from 'solid-js';

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

  const fetchVixData = async () => {
    try {
      const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX');
      const data = await response.json();
      
      if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
        const price = data.chart.result[0].meta.regularMarketPrice;
        setVixValue(price);
        setRotation(calculateRotation(price));
        
        localStorage.setItem('vix_cache', price.toString());
        localStorage.setItem('vix_cache_timestamp', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error fetching VIX:', error);
    }
  };

  onMount(() => {
    const cachedValue = localStorage.getItem('vix_cache');
    if (cachedValue) {
      const value = parseFloat(cachedValue);
      setVixValue(value);
      setRotation(calculateRotation(value));
    }

    fetchVixData();

    // Update every 60 minutes during market hours
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      // Only fetch during market hours (9:30 AM - 4:00 PM EST)
      if (hour >= 9 && hour <= 16) {
        fetchVixData();
      }
    }, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds

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
