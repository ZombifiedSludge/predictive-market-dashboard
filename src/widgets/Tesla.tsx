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

const fetchQuote = async () => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=TSLA&token=${FINNHUB_KEY}`
    );
    const data = await response.json();
    return { ...data, timestamp: Date.now() };
  } catch (error) {
    console.error('Quote fetch error:', error);
    throw error;
  }
};

const fetchFinancials = async () => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/metric?symbol=TSLA&metric=all&token=${FINNHUB_KEY}`
    );
    const data = await response.json();
    return { ...data, timestamp: Date.now() };
  } catch (error) {
    console.error('Financials fetch error:', error);
    throw error;
  }
};

const Tesla: Component = () => {
  const [quote] = createResource<Quote>(fetchQuote);
  const [financials] = createResource<BasicFinancials>(fetchFinancials);

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

  createEffect(() => {
    const interval = setInterval(() => {
      quote.refetch();
      financials.refetch();
    }, 30000); // Refresh every 30 seconds like in your App.tsx

    return () => clearInterval(interval);
  });

  return (
    <div class="col-span-2 bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
      <div class="flex justify-center mb-4">
        <svg class="h-8" viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7h24zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h24v27.6h6.7V7h24.1V0H85.3z" fill="#E82127"/>
          <path d="M311.5 0h-21.4v6.8h14.6v21.1h6.8V0zm-50.7 7h-23.3v27.6h6.8v-7h24.3a9.5 9.5 0 0 0 6-6.8h-30.3V7h23.3A9.5 9.5 0 0 0 261 .1v34.8h6.8V0h-6.8z" fill="#E82127"/>
        </svg>
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
