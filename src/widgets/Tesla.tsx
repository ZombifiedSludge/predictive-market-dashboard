import { createSignal, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';

type Quote = {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
};

type AlphaMetrics = {
  rsi: number;
  eps: number;
  week52High: number;
  week52Low: number;
  timestamp: number;
};

const FINNHUB_KEY = 'cu0ahohr01ql96gq5n0gcu0ahohr01ql96gq5n10';
const ALPHA_KEY = 'WM4K3AZW1FX4LQ6M';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const Tesla: Component = () => {
  const [quote, setQuote] = createSignal<Quote | null>(null);
  const [metrics, setMetrics] = createSignal<AlphaMetrics | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  // Function to get cached data
  const getCachedMetrics = () => {
    try {
      const cached = localStorage.getItem('tesla-metrics');
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem('tesla-metrics');
        return null;
      }
      return data;
    } catch (err) {
      console.error('Cache read error:', err);
      return null;
    }
  };

  // Function to fetch and cache Alpha Vantage data
  const fetchAlphaMetrics = async () => {
    // Check cache first
    const cached = getCachedMetrics();
    if (cached) {
      setMetrics(cached);
      return;
    }

    try {
      // Fetch RSI and Company Overview in parallel
      const [rsiResponse, overviewResponse] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=RSI&symbol=TSLA&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=TSLA&apikey=${ALPHA_KEY}`)
      ]);

      const rsiData = await rsiResponse.json();
      const overviewData = await overviewResponse.json();

      const metricsData: AlphaMetrics = {
        rsi: parseFloat(Object.values(rsiData['Technical Analysis: RSI'])[0]['RSI']),
        eps: parseFloat(overviewData['EPS']),
        week52High: parseFloat(overviewData['52WeekHigh']),
        week52Low: parseFloat(overviewData['52WeekLow']),
        timestamp: Date.now()
      };

      // Cache the data
      localStorage.setItem('tesla-metrics', JSON.stringify(metricsData));
      setMetrics(metricsData);
    } catch (err) {
      console.error('Alpha Vantage fetch error:', err);
      setError('Error fetching metrics');
    }
  };

  // Function to fetch Finnhub price data
  const fetchQuote = async () => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=TSLA&token=${FINNHUB_KEY}`
      );
      const data = await response.json();
      if (data.c) {
        setQuote(data);
      }
    } catch (err) {
      console.error('Quote fetch error:', err);
      setError('Error fetching price');
    }
  };

  createEffect(() => {
    // Fetch Alpha metrics once per day
    fetchAlphaMetrics();

    // Fetch and update quote regularly
    fetchQuote();
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  });

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num / 100);
  };

  return (
  <div class="col-span-2 bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
    {/* Tesla Logo */}
    <div class="flex justify-center mb-4">
      <img src="/tesla-logo.png" alt="Tesla" class="h-16 -mt-4 -mb-4" />
    </div>
      
      {/* Price Display */}
      <div class="relative flex justify-center mb-6">
        <div class="w-48">
          <svg viewBox="0 0 100 160" class="w-full">
            <defs>
              <filter id="crisp-text">
                <feFlood flood-color="white" result="backgroundColor"/>
                <feBlend in="SourceGraphic" in2="backgroundColor" mode="normal"/>
              </filter>
            </defs>

            <path 
              d="M20,0 L80,0 C90,0 90,10 90,10 L90,100 A30,30 0 0,1 10,100 L10,10 C10,10 10,0 20,0"
              fill="white"
              stroke="#E82127"
              stroke-width="8"
              stroke-linejoin="round"
            />
            
            <Show when={quote()} fallback={
              <text x="50" y="50" text-anchor="middle" font-size="12">Loading...</text>
            }>
              <text 
                x="50" 
                y="50" 
                text-anchor="middle" 
                font-size="13"
                font-family="'Space Mono', monospace"
                font-weight="500"
                filter="url(#crisp-text)"
              >
                {formatCurrency(quote()!.c)}
              </text>
              <text 
                x="50" 
                y="65" 
                text-anchor="middle" 
                font-size="8"
                font-family="'Space Mono', monospace"
                fill={quote()!.dp > 0 ? "#22C55E" : "#EF4444"}
                font-weight="500"
                filter="url(#crisp-text)"
              >
                {quote()!.dp > 0 ? '+' : ''}{formatPercent(quote()!.dp)}
              </text>
            </Show>
          </svg>
        </div>
      </div>

      {/* Metrics Display */}
      <Show when={metrics()} fallback={
        <div class="text-center text-sm text-gray-500">Loading metrics...</div>
      }>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="bg-gray-50 p-2 rounded">
            <div class="text-gray-600 text-xs">52W High</div>
            <div class="font-medium">
              {formatCurrency(metrics()!.week52High)}
            </div>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <div class="text-gray-600 text-xs">52W Low</div>
            <div class="font-medium">
              {formatCurrency(metrics()!.week52Low)}
            </div>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <div class="text-gray-600 text-xs">RSI</div>
            <div class="font-medium" style={{ color: metrics()!.rsi > 70 ? '#EF4444' : metrics()!.rsi < 30 ? '#22C55E' : 'inherit' }}>
              {metrics()!.rsi.toFixed(2)}
            </div>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <div class="text-gray-600 text-xs">EPS</div>
            <div class="font-medium">
              {metrics()!.eps.toFixed(2)}
            </div>
          </div>
        </div>
      </Show>

      <Show when={error()}>
        <div class="text-center text-sm text-red-500 mt-2">
          {error()}
        </div>
      </Show>
    </div>
  );
};

export default Tesla;
