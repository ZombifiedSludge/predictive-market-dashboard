import { createSignal, createEffect } from 'solid-js';

const CurrentRate = () => {
  const [data, setData] = createSignal(null);
  const [error, setError] = createSignal(null);

  createEffect(async () => {
    try {
      // Step 1: Try to fetch the data
      const response = await fetch('/.netlify/functions/getFredData');
      console.log('Step 1 - Raw Response:', response);

      // Step 2: Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Step 3: Parse the JSON
      const jsonData = await response.json();
      console.log('Step 3 - Parsed JSON:', jsonData);

      // Step 4: Check the structure
      console.log('Step 4 - Data Structure:', {
        type: typeof jsonData,
        keys: Object.keys(jsonData),
        hasObservations: 'observations' in jsonData,
        fedData: jsonData.fedData // Check if data is nested under fedData
      });

      setData(jsonData);
    } catch (err) {
      console.error('Detailed Error:', err);
      setError(err.message);
    }
  });

  return (
    <div class="p-4">
      <h2>FRED API Debug Info:</h2>
      {error() && (
        <div class="text-red-500">
          <p>Error: {error()}</p>
        </div>
      )}
      {data() && (
        <pre class="bg-gray-100 p-4 mt-2 overflow-auto">
          {JSON.stringify(data(), null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CurrentRate;
