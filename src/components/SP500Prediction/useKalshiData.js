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
          range: market.title,
          probability: market.probability * 100
        })).sort((a, b) => b.probability - a.probability)
      };

      setData(processedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  return { data, loading, error };
}
