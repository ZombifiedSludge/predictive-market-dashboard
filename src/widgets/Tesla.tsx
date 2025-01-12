import { createSignal, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';

const FINNHUB_KEY = 'cu0ahohr01ql96gq5n0gcu0ahohr01ql96gq5n10';

const Tesla: Component = () => {
  const [quoteData, setQuoteData] = createSignal({
    value: '--',
    change: 0,
    previousClose: 0
  });

  const fetchTeslaData = async () => {
    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=TSLA&token=${FINNHUB_KEY}`);
      const data = await response.json();
      
      if (data && data.c) {
        setQuoteData({
          value: data.c.toFixed(2),
          change: ((data.c - data.pc) / data.pc * 100).toFixed(2),
          previousClose: data.pc
        });
      }
    } catch (err) {
      console.error('Error fetching Tesla data:', err);
    }
  };

  createEffect(() => {
    // Initial fetch
    fetchTeslaData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchTeslaData, 30000);
    return () => clearInterval(interval);
  });

  const formatCurrency = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

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
            
            <text 
              x="50" 
              y="50" 
              text-anchor="middle" 
              font-size="15"
              font-family="'Space Grotesk', system-ui, sans-serif"
              font-weight="500"
              filter="url(#crisp-text)"
            >
              {formatCurrency(quoteData().value)}
            </text>
            <text 
              x="50" 
              y="65" 
              text-anchor="middle" 
              font-size="10"
              font-family="'Space Grotesk', system-ui, sans-serif"
              fill={parseFloat(quoteData().change) >= 0 ? "#22C55E" : "#EF4444"}
              font-weight="500"
              filter="url(#crisp-text)"
            >
              {parseFloat(quoteData().change) >= 0 ? '+' : ''}{quoteData().change}%
            </text>
          </svg>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="bg-gray-50 p-2 rounded">
          <div class="text-gray-600 text-xs">Day Range</div>
          <div class="font-medium">
            {formatCurrency(quoteData().value)} - {formatCurrency(quoteData().previousClose)}
          </div>
        </div>
        <div class="bg-gray-50 p-2 rounded">
          <div class="text-gray-600 text-xs">Previous Close</div>
          <div class="font-medium">
            {formatCurrency(quoteData().previousClose)}
          </div>
        </div>
        <div class="bg-gray-50 p-2 rounded">
          <div class="text-gray-600 text-xs">Change ($)</div>
          <div class="font-medium">
            {formatCurrency(parseFloat(quoteData().value) - quoteData().previousClose)}
          </div>
        </div>
        <div class="bg-gray-50 p-2 rounded">
          <div class="text-gray-600 text-xs">Change (%)</div>
          <div class="font-medium">
            {quoteData().change}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tesla;
