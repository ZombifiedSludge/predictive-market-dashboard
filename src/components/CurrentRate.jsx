import { createSignal, createEffect } from 'solid-js';

const fetchFREDData = async () => {
  const cacheKey = 'fred_data';
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < 96 * 60 * 60 * 1000) {
      return data;
    }
  }

  try {
    const response = await fetch('/.netlify/functions/getFredData');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('FRED API Response:', data);
    
    if (!data || !data.observations) {
      throw new Error('Invalid FRED API response structure');
    }

    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
    
    return data;
  } catch (error) {
    console.error('FRED API Error:', error);
    throw new Error(`FRED API Error: ${error.message} at ${new Date().toISOString()}`);
  }
};

const CurrentRate = () => {
  const [fedData, setFedData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(true);

  createEffect(async () => {
    try {
      setLoading(true);
      const data = await fetchFREDData();
      setFedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="p-4">
      {loading() && <div class="text-gray-600">Loading current rate...</div>}
      {error() && <div class="text-red-500">Error: {error()}</div>}
      {fedData() && (
        <div class="text-2xl font-bold">
          Current Fed Rate: {fedData().observations[0].value}%
        </div>
      )}
    </div>
  );
};

export default CurrentRate;
