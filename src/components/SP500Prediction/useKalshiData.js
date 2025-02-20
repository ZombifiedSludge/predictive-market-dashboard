import { createSignal, createEffect } from 'solid-js';

export function useKalshiData() {
  const [data, setData] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const parseRange = (title) => {
    // Extract numbers from strings like "6400-6600"
    const matches = title.match(/(\d+)-(\d+)/);
    if (matches) {
      return {
        min: parseInt(matches[1]),
        max: parseInt(matches[2])
      };
    }
    return null;
  };

  const calculateWeightedAverage = (data) => {
    if (!data || !data.length) return 0;
    
    let totalWeight = 0;
    let sum = 0;

    data.forEach(item => {
      const range = parseRange(item.range);
      if (range) {
        const midpoint = (range.min + range.max) / 2;
        sum += midpoint * item.probability;
        totalWeight += item.probability;
      }
    });

    return totalWeight > 0 ? sum / totalWeight : 0;
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/kalshi-proxy');
      const jsonData = await response.json();

      if (jsonData && jsonData.markets) {
        const processedData = {
          timestamp: Date.now(),
          ranges: jsonData.markets
            .filter(market => market.title.includes('-')) // Only get range markets
            .map(market => ({
              range: market.title.split(':').pop().trim(), // Get just the range part
              probability: (market.yes_price || 0) * 100
            }))
            .sort((a, b) => parseRange(b.range).min - parseRange(a.range).min)
        };

        setData(processedData);
      } else {
        throw new Error('Invalid data structure received from API');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Kalshi data:', err);
      setError(err.message);
      setLoading(false);

      // Fallback data that matches current market expectations
      setData({
        timestamp: Date.now(),
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
