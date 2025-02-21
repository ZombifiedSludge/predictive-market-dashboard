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

  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/kalshi-proxy');
      const jsonData = await response.json();
      console.log('Raw API Response:', jsonData); // Log full response for debugging

      // Check the structure of the data we received
      if (jsonData && jsonData.markets) {
        // Process the API response - correct structure!
        const processedData = {
          timestamp: Date.now(),
          ranges: jsonData.markets
            .filter(market => {
              // Look for markets with titles containing range patterns
              const title = market.title || '';
              return title.match(/\d+-\d+/) !== null;
            })
            .map(market => {
              // Extract the range part from the title
              const title = market.title || '';
              const rangeMatch = title.match(/(\d+)-(\d+)/);
              const range = rangeMatch ? rangeMatch[0] : title;
              
              // Use yes_price as probability (multiply by 100 for percentage)
              const probability = (market.yes_price || 0) * 100;
              
              return { range, probability };
            })
            .sort((a, b) => {
              // Try to sort by range numerically
              const rangeA = parseRange(a.range);
              const rangeB = parseRange(b.range);
              if (rangeA && rangeB) {
                return rangeA.min - rangeB.min;
              }
              return 0;
            })
        };

        if (processedData.ranges.length > 0) {
          setData(processedData);
          setLoading(false);
          return;
        }
      }
      
      // If we reach here, we couldn't find the expected data structure
      console.error('Unexpected API response structure:', jsonData);
      throw new Error('Invalid data structure received from API');
    } catch (err) {
      console.error('Error fetching Kalshi data:', err);
      setError(err.message);
      setLoading(false);

      // Fallback data
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
