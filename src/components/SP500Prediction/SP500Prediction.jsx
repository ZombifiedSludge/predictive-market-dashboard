import { createSignal } from 'solid-js';

const SP500Prediction = () => {
  // Use a fixed prediction based on market consensus
  const expectedValue = 6450;
  const currentValue = 5088;
  const changePercent = ((expectedValue - currentValue) / currentValue * 100).toFixed(1);

  return (
    <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
      <h2 class="text-lg font-semibold text-navy-900 mb-2">S&P 500 End of Year</h2>
      
      <div class="flex items-center">
        <div class="mr-4">
          <div class="text-3xl font-bold text-navy-900">${expectedValue.toLocaleString()}</div>
          <div class="text-sm text-gray-600">Expected Close 2025</div>
        </div>
        
        <div class="bg-green-50 rounded-lg p-2">
          <div class="text-sm font-medium text-gray-700">From Current:</div>
          <div class="text-lg font-bold text-green-600">+{changePercent}%</div>
        </div>
      </div>
      
      <div class="mt-3 text-sm text-gray-700">
        Based on Kalshi Prediction Markets
      </div>
    </div>
  );
};

export default SP500Prediction;
