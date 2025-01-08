import { Suspense, type Component } from 'solid-js';
import { A, useLocation } from '@solidjs/router';

const App: Component = (props: { children: Element }) => {
  const location = useLocation();
  return (
    // Ocean image background
    <div class="min-h-screen bg-[url('https://images.unsplash.com/photo-1564193379835-65b35cd78131')] bg-cover bg-center">
      {/* Navigation */}
      <nav class="bg-white/90 backdrop-blur shadow-lg">
        <ul class="flex items-center max-w-7xl mx-auto px-4">
          <li class="py-4 px-6">
            <A href="/" class="text-blue-900 font-semibold hover:text-blue-600">
              Dashboard
            </A>
          </li>
          <li class="py-4 px-6">
            <A href="/methodology" class="text-blue-900 font-semibold hover:text-blue-600">
              Methodology
            </A>
          </li>
          <li class="py-4 px-6">
            <A href="/why-betting-markets" class="text-blue-900 font-semibold hover:text-blue-600">
              Why Betting Markets
            </A>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div class="text-white mb-8">
          <h1 class="text-4xl font-bold mb-2">Market Predictions Dashboard</h1>
          <p class="text-blue-100">Real-time market sentiment and predictions</p>
        </div>

        {/* Dashboard Cards Container */}
        <div class="grid md:grid-cols-2 gap-6">
          {/* S&P 500 Predictions Card */}
          <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 class="text-xl font-semibold text-blue-900 mb-4">S&P 500 Predictions</h2>
            <div class="space-y-4">
              <div class="border-b border-blue-100 pb-4">
                <p class="text-sm text-blue-800">End of Year > 5000</p>
                <p class="text-2xl font-bold text-blue-900">65%</p>
                <p class="text-sm text-blue-600">Volume: $125K</p>
              </div>
            </div>
          </div>

          {/* NASDAQ Predictions Card */}
          <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 class="text-xl font-semibold text-blue-900 mb-4">NASDAQ Predictions</h2>
            <div class="space-y-4">
              <div class="border-b border-blue-100 pb-4">
                <p class="text-sm text-blue-800">End of Year > 16000</p>
                <p class="text-2xl font-bold text-blue-900">58%</p>
                <p class="text-sm text-blue-600">Volume: $143K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suspense for loading states */}
        <Suspense>{props.children}</Suspense>
      </main>
    </div>
  );
};

export default App;
