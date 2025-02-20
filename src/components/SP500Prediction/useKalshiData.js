import { createSignal, createEffect } from 'solid-js';

export function useKalshiData() {
  const [data, setData] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/kalshi-proxy');
      const jsonData = await response.json();

      const processedData = {
        timestamp: Date.now(),
        ranges: jsonData.markets.map(market => ({
          range: market.title.replace('S&P 500 2025 Close: ', ''), // Clean up the title
          probability: (market.yes_price || 0) * 100 // Use yes_price for probability
        })).sort((a, b) => b.probability - a.probability)
      };

      setData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Kalshi data:', err);
      setError(err.message);
      setLoading(false);

      // Set fallback data in case of error
      setData({
        timestamp: Date.now(),
        ranges: [
          { range: '4800-5000', probability: 5 },
          { range: '5000-5200', probability: 8 },
          { range: '5200-5400', probability: 12 },
          { range: '5400-5600', probability: 15 },
          { range: '5600-5800', probability: 20 },
          { range: '5800-6000', probability: 25 },
          { range: '6000-6200', probability: 18 },
          { range: '6200-6400', probability: 15 },
          { range: '6400-6600', probability: 10 },
          { range: '6600-6800', probability: 7 },
          { range: '6800-7000', probability: 5 }
        ]
      });
    }
  };

  createEffect(() => {
    fetchData();
  });

  return { data, loading, error };
}
