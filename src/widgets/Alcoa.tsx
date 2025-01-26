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

const Alcoa: Component = () => {
  const [quote, setQuote] = createSignal<Quote | null>(null);
  const [metrics, setMetrics] = createSignal<AlphaMetrics | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  // Function to get cached data
  const getCachedMetrics = () => {
    try {
      const cached = localStorage.getItem('alcoa-metrics');
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem('alcoa-metrics');
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
    const cached = getCachedMetrics();
    if (cached) {
      setMetrics(cached);
      return;
    }

    try {
      const [rsiResponse, overviewResponse] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=RSI&symbol=AA&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=AA&apikey=${ALPHA_KEY}`)
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

      localStorage.setItem('alcoa-metrics', JSON.stringify(metricsData));
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
        `https://finnhub.io/api/v1/quote?symbol=AA&token=${FINNHUB_KEY}`
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
    fetchAlphaMetrics();
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
    <div class="col-span-2 bg-gray-800/95 backdrop-blur rounded-lg shadow-xl p-4">
      {/* Alcoa Logo */}
      <div class="flex justify-center mb-4">
        <img src="/alcoa-logo.png" alt="Alcoa" class="h-16 -mt-4 -mb-4" />
      </div>
      
      {/* Digital Display Panel */}
      <div class="bg-black rounded-lg p-4 mb-6">
        {/* Main Price Display */}
        <Show when={quote()} fallback={
          <div class="text-center text-gray-500">Loading...</div>
        }>
          <div class="bg-[#1a1a1a] rounded border border-gray-700 p-3 mb-2">
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-500">CURRENT PRICE</div>
              <div class="text-xs text-gray-500 animate-pulse">LIVE</div>
            </div>
            <div class="font-mono text-4xl text-green-500 font-bold tracking-wider flex justify-center items-center h-12">
              {formatCurrency(quote()!.c)}
            </div>
            <div class={`font-mono text-lg font-bold tracking-wider text-center ${quote()!.dp >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {quote()!.dp >= 0 ? '+' : ''}{formatPercent(quote()!.dp)}
            </div>
          </div>
        </Show>
      </div>

      {/* Metrics Display */}
      <Show when={metrics()} fallback={
        <div class="text-center text-sm text-gray-500">Loading metrics...</div>
      }>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 p-2 rounded">
            <div class="text-gray-600 text-xs">52W High</div>
            <div class="font-medium">
              {formatCurrency(metrics()!.week52High)}
            </div>
          </div>
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 p-2 rounded">
            <div class="text-gray-600 text-xs">52W Low</div>
            <div class="font-medium">
              {formatCurrency(metrics()!.week52Low)}
            </div>
          </div>
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 p-2 rounded">
            <div class="text-gray-600 text-xs">RSI</div>
            <div class="font-medium" style={{ color: metrics()!.rsi > 70 ? '#EF4444' : metrics()!.rsi < 30 ? '#22C55E' : 'inherit' }}>
              {metrics()!.rsi.toFixed(2)}
            </div>
          </div>
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 p-2 rounded">
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

export default Alcoa;
