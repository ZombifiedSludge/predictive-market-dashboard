import { createSignal, createEffect } from 'solid-js';

const CurrentRate = () => {
  const [data, setData] = createSignal(null);
  const [error, setError] = createSignal(null);

  createEffect(async () => {
    try {
      const response = await fetch('/.netlify/functions/getFredData');
      console.log('Raw Response Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('Actual Response Data:', jsonData);  // Let's see the exact data

      // Check if we have data and handle both possible structures
      const observations = jsonData.observations || (jsonData.fedData && jsonData.fedData.observations);
      
      if (!observations) {
        throw new Error('No observations data found in response');
      }

      setData(observations);
    } catch (err) {
      console.error('Detailed Error:', err);
      setError(err.message);
    }
  });

  return (
    <div class="p-4">
      <h2>Current Federal Funds Rate:</h2>
      {error() && (
        <div class="text-red-500">
          Error: {error()}
        </div>
      )}
      {data() && data()[0] && (
        <div class="text-2xl font-bold mt-2">
          {data()[0].value}%
        </div>
      )}
      <div class="mt-4 text-sm text-gray-600">
        Debug Info:
        <pre class="bg-gray-100 p-2 mt-1 rounded">
          {JSON.stringify(data(), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CurrentRate;
