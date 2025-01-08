const App: Component = () => {
  return (
    <div class="min-h-screen bg-[url('https://images.unsplash.com/photo-1564193379835-65b35cd78131')] bg-cover bg-center">
      {/* Navigation */}
      <nav class="bg-white/90 backdrop-blur shadow-lg">
        <div class="flex items-center justify-between max-w-7xl mx-auto px-6">
          {/* Logo */}
          <img 
            src="/src/OmenifyLogo.png" 
            alt="OMENIFY" 
            class="h-14 w-auto py-3"
          />
          {/* Nav Items pushed to right */}
          <ul class="flex items-center space-x-8">
            <li>
              <a href="/" class="text-navy-900 font-semibold hover:text-blue-600 font-helvetica">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/methodology" class="text-navy-900 font-semibold hover:text-blue-600 font-helvetica">
                Methodology
              </a>
            </li>
            <li>
              <a href="/why-betting-markets" class="text-navy-900 font-semibold hover:text-blue-600 font-helvetica">
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
          <h1 class="text-5xl font-bold mb-3 font-helvetica">Predictive Markets Dashboard</h1>
          <p class="text-xl text-blue-100 font-helvetica">Track today to capture tomorrow.</p>
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
