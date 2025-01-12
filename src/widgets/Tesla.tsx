import { createSignal, createResource, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';

type Quote = {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  timestamp: number;
};

type BasicFinancials = {
  metric: {
    '52WeekHigh': number;
    '52WeekLow': number;
    currentRatioQuarterly: number;
    peRatio: number;
  };
  timestamp: number;
};

const FINNHUB_KEY = 'cu0ahohr01ql96gq5n0gcu0ahohr01ql96gq5n10';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const shouldFetchNewData = (lastFetchTimestamp: number): boolean => {
  const now = new Date();
  const lastFetch = new Date(lastFetchTimestamp);
  const lastMarketClose = new Date();
  lastMarketClose.setUTCHours(20, 0, 0, 0); // 4:00 PM EST in UTC
  if (now.getUTCHours() < 20) {
    lastMarketClose.setDate(lastMarketClose.getDate() - 1);
  }
  return lastFetch < lastMarketClose;
};

const getCachedData = (key: string) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION || shouldFetchNewData(timestamp)) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache setting error:', error);
  }
};

const fetchQuote = async () => {
  const cached = getCachedData('tesla-quote');
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=TSLA&token=${FINNHUB_KEY}`
    );
    const data = await response.json();
    const quoteData = { ...data, timestamp: Date.now() };
    setCachedData('tesla-quote', quoteData);
    return quoteData;
  } catch (error) {
    console.error('Quote fetch error:', error);
    throw error;
  }
};

const fetchFinancials = async () => {
  const cached = getCachedData('tesla-financials');
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/metric?symbol=TSLA&metric=all&token=${FINNHUB_KEY}`
    );
    const data = await response.json();
    const financialData = { ...data, timestamp: Date.now() };
    setCachedData('tesla-financials', financialData);
    return financialData;
  } catch (error) {
    console.error('Financials fetch error:', error);
    throw error;
  }
};

const Tesla: Component = () => {
  const [quote] = createResource<Quote>(fetchQuote);
  const [financials] = createResource<BasicFinancials>(fetchFinancials);

  createEffect(() => {
    const checkForUpdates = () => {
      const now = new Date();
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      if (hours === 20 && minutes === 0) {
        localStorage.removeItem('tesla-quote');
        localStorage.removeItem('tesla-financials');
        quote.refetch();
        financials.refetch();
      }
    };

    const interval = setInterval(checkForUpdates, 60000);
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
      <div class="flex justify-center mb-4">
        <img src="/tesla-logo.png" alt="Tesla" class="h-8" />
      </div>
      
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
              d="M20,0 
                 L80,0 
                 C90,0 90,10 90,10
                 L90,100
                 A30,30 0 0,1 10,100
                 L10,10
                 C10,10 10,0 20,0"
              fill="white"
              stroke="#E31937"
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
                font-size="15"
                font-family="'Space Grotesk', system-ui, sans-serif"
                font-weight="500"
                filter="url(#crisp-text)"
              >
                {formatCurrency(quote()!.c)}
              </text>
              <text 
                x="50" 
                y="65" 
                text-anchor="middle" 
                font-size="10"
                font-family="'Space Grotesk', system-ui, sans-serif"
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

<Show when={financials()} fallback={
  <div class="text-center text-sm text-gray-500">Loading metrics...</div>
}>
  <div class="grid grid-cols-2 gap-3 text-sm">
    <div class="bg-gray-50 p-2 rounded">
      <div class="text-gray-600 text-xs">52W High</div>
      <div class="font-medium">
        {formatCurrency(financials()!.metric['52WeekHigh'])}
      </div>
    </div>
    <div class="bg-gray-50 p-2 rounded">
      <div class="text-gray-600 text-xs">52W Low</div>
      <div class="font-medium">
        {formatCurrency(financials()!.metric['52WeekLow'])}
      </div>
    </div>
    <div class="bg-gray-50 p-2 rounded">
      <div class="text-gray-600 text-xs">Current Ratio</div>
      <div class="font-medium">
        {financials()!.metric.currentRatioQuarterly.toFixed(2)}
      </div>
    </div>
    <div class="bg-gray-50 p-2 rounded">
      <div class="text-gray-600 text-xs">P/E Ratio</div>
      <div class="font-medium">
        {financials()!.metric.peRatio.toFixed(2)}
      </div>
    </div>
  </div>
</Show>
</div>
);
};

export default Tesla;
