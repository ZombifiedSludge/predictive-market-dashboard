// src/components/SP500Prediction/useKalshiData.js
import { createSignal, createEffect } from 'solid-js';

export function useKalshiData() {
  const [data, setData] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const fetchData = async () => {
    try {
      // Try to fetch the JSON file (we'll create this later)
      const response = await fetch('/sp500_predictions.json');
      const jsonData = await response.json();
      
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError(err.message);
      setLoading(false);

      // Fallback data if the file doesn't exist or has errors
      setData({
        timestamp: new Date().toISOString(),
        expected_value: 6450,
        ranges: [
          { range: '6400-6600', probability: 35 },
          { range: '6200-6400', probability: 25 },
          { range: '6600-6800', probability: 20 },
          { range: '6000-6200', probability: 15 },
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
