import { createSignal, onMount, onCleanup } from 'solid-js';

const API_KEY = 'cu0ahohr01ql96gq5n0gcu0ahohr01ql96gq5n10';

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
