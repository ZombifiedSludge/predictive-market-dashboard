import { createSignal, onMount, onCleanup } from 'solid-js';

const VixGauge = () => {
  const [vixValue, setVixValue] = createSignal(null);
  const [rotation, setRotation] = createSignal(-90);
  
  const calculateRotation = (value) => {
    return -90 + (value * 180 / 50);
  };
  
  onMount(() => {
    const fetchVix = async () => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=VIX&token=${API_KEY}`);
        const data = await response.json();
        setVixValue(data.c);
        setRotation(calculateRotation(data.c));
      } catch (error) {
        console.error('Error fetching VIX:', error);
      }
    };
    fetchVix();
    const interval = setInterval(fetchVix, 30000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-3">
      <h2 class="text-sm font-semibold text-blue-800 mb-1">Fear Index</h2>
      <div class="flex flex-col items-center">
        <svg viewBox="-10 -10 220 120" class="w-32">
          {/* Base track */}
          <path
            d="M 0,100 A 100,100 0 0,1 200,100"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="18"
            stroke-linecap="round"
          />
          {/* Color segments */}
          <path
            d="M 0,100 A 100,100 0 0,1 80,100"
            fill="none"
            stroke="#22c55e"
            stroke-width="18"
            stroke-linecap="round"
          />
          <path
            d="M 80,100 A 100,100 0 0,1 140,100"
            fill="none"
            stroke="#eab308"
            stroke-width="18"
            stroke-linecap="round"
          />
          <path
            d="M 140,100 A 100,100 0 0,1 200,100"
            fill="none"
            stroke="#dc2626"
            stroke-width="18"
            stroke-linecap="round"
          />
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
        <div class="text-xl font-bold mt-1">
          {vixValue()?.toFixed(2) || '--'}
        </div>
      </div>
    </div>
  );
};

export default VixGauge;
