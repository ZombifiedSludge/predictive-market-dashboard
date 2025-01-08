import { Component } from 'solid-js';

const App: Component = () => {
  return (
    <div>
      <nav className="bg-white/90 backdrop-blur shadow-lg h-16">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-full">
          <img 
            src="/OmenifyLogo.png" 
            alt="OMENIFY" 
            className="h-20 w-auto -mt-2 -mb-2 object-contain" // Made logo bigger with negative margins
          />
          <ul className="flex items-center space-x-8">
            <li>
              <a href="/" className="text-navy-900 font-semibold hover:text-blue-600 font-mono">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/methodology" className="text-navy-900 font-semibold hover:text-blue-600 font-mono">
                Methodology
              </a>
            </li>
            <li>
              <a href="/why-betting-markets" className="text-navy-900 font-semibold hover:text-blue-600 font-mono">
                Why Betting Markets
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div class="text-white mb-12 text-center">
          <h1 class="text-5xl font-bold mb-3 text-black font-helvetica">Predictive Markets Dashboard</h1>
          <p class="text-xl text-blue-400 font-helvetica">Track today to capture tomorrow.</p>
        </div>
        {/* Single Column for Predictions */}
        <div class="space-y-6 max-w-3xl mx-auto">
          {/* S&P 500 Card */}
          <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 class="text-xl font-semibold text-navy-900 mb-4 font-helvetica">S&P 500 Predictions</h2>
            <div class="space-y-4">
              <div class="border-b border-blue-100 pb-4">
                <p class="text-sm text-blue-800">End of Year > 5000</p>
                <p class="text-2xl font-bold text-navy-900">65%</p>
                <p class="text-sm text-blue-600">Volume: $125K</p>
              </div>
            </div>
          </div>
          {/* NASDAQ Card */}
          <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 class="text-xl font-semibold text-navy-900 mb-4 font-helvetica">NASDAQ Predictions</h2>
            <div class="space-y-4">
              <div class="border-b border-blue-100 pb-4">
                <p class="text-sm text-blue-800">End of Year > 16000</p>
                <p class="text-2xl font-bold text-navy-900">58%</p>
                <p class="text-sm text-blue-600">Volume: $143K</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
