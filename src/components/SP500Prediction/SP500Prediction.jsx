// src/components/SP500Prediction/SP500Prediction.jsx
import { createSignal, Show, For } from 'solid-js';
import { useKalshiData } from './useKalshiData';

const SP500Prediction = () => {
  const [showFullDistribution, setShowFullDistribution] = createSignal(false);
  const { data, loading, error } = useKalshiData();

  return (
    <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
      <div class="flex">
        {/* Left side - Main prediction */}
        <div class="flex-1 pr-4">
          <div class="flex items-center mb-2">
            <h2 class="text-lg font-semibold text-navy-900">S&P 500 End of Year</h2>
          </div>
          <div class="text-3xl font-bold text-navy-900">
            ${data()?.expected_value.toLocaleString()}
          </div>
          <div class="text-sm text-gray-600">Expected Close 2025</div>
          <div class="mt-1 text-sm text-gray-700">
            Odds from Kalshi Prediction Markets
          </div>
        </div>

        {/* Right side - Distribution */}
        <div class="flex-1 pl-4 border-l">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-navy-900">Probability Distribution</span>
            <button 
              class="text-xs text-blue-600 hover:text-blue-800"
              onClick={() => setShowFullDistribution(true)}
            >
              View All
            </button>
          </div>

          {/* Top 4 ranges */}
          <div class="space-y-1.5">
            <Show when={!loading()} fallback={<div class="text-sm text-gray-600">Loading...</div>}>
              <For each={data()?.ranges.slice(0, 4)}>
                {(dist) => (
                  <div class="flex items-center text-sm">
                    <span class="w-20 text-navy-900">${dist.range}</span>
                    <div class="flex-1 mx-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-navy-600 rounded-full"
                        style={{ width: `${dist.probability}%` }}
                      />
                    </div>
                    <span class="w-8 text-navy-900 text-right">{dist.probability.toFixed(1)}%</span>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </div>
      </div>

      {/* Modal for full distribution */}
      <Show when={showFullDistribution()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={() => setShowFullDistribution(false)}>
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold text-navy-900">Full Probability Distribution</h3>
              <button 
                onClick={() => setShowFullDistribution(false)}
                class="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div class="space-y-2">
              <For each={data()?.ranges}>
                {(dist) => (
                  <div class="flex items-center text-sm">
                    <span class="w-24 text-navy-900">${dist.range}</span>
                    <div class="flex-1 mx-2 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-navy-600 rounded-full"
                        style={{ width: `${dist.probability}%` }}
                      />
                    </div>
                    <span class="w-12 text-navy-900 text-right">{dist.probability.toFixed(1)}%</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default SP500Prediction;
