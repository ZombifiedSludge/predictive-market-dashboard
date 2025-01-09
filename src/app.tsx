import { Component, createSignal, onMount } from 'solid-js';

const App: Component = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [marketData, setMarketData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const [unemploymentData, setUnemploymentData] = createSignal(null);
const [durablesData, setDurablesData] = createSignal(null);

  
  const API_KEY = 'YY7OC6IG2C9BX8FR';

  // Toggle dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen());

  // Close dropdown when clicking outside
  const closeDropdown = () => setIsDropdownOpen(false);

 onMount(async () => {
    try {
      // Fetch Fed Rate, Unemployment, and Durables data
      const [fedResponse, unemploymentResponse, durablesResponse] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=monthly&apikey=${API_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${API_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=DURABLES&apikey=${API_KEY}`)
      ]);

      const [fedData, unemploymentData, durablesData] = await Promise.all([
        fedResponse.json(),
        unemploymentResponse.json(),
        durablesResponse.json()
      ]);

      // Process unemployment data
      if (unemploymentData.data) {
        const latestUnemployment = unemploymentData.data[0];
        setUnemploymentData({
          rate: parseFloat(latestUnemployment.value).toFixed(1),
          date: new Date(latestUnemployment.date).toLocaleDateString()
        });
      }

      // Process durables data
      if (durablesData.data) {
        const latestDurables = durablesData.data[0];
        setDurablesData({
          value: parseFloat(latestDurables.value).toFixed(1),
          date: new Date(latestDurables.date).toLocaleDateString()
        });
      }

      // Fetch Top Gainers/Losers
      const marketResponse = await fetch(
        `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
      );
      const marketData = await marketResponse.json();
      
      if (marketData['Error Message']) {
        throw new Error(marketData['Error Message']);
      }

      setMarketData(marketData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    }
  });

  return (
    <div onClick={closeDropdown}>
      <nav className="bg-white/90 backdrop-blur shadow-lg h-16">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-full">
          <img 
            src="/OmenifyLogo.png" 
            alt="OMENIFY" 
            className="h-20 w-auto -mt-2 -mb-2 object-contain"
          />
          <ul className="flex items-center space-x-8">
            <li>
              <a href="/" className="text-navy-900 font-semibold hover:text-blue-600 font-mono">
                Dashboard
              </a>
            </li>
            <li className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
                className="text-navy-900 font-semibold hover:text-blue-600 font-mono flex items-center"
              >
                Bellwethers
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen() ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen() && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1" role="menu">
                    <a
                      href="/bellwethers/googl"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Alphabet Inc. (GOOGL)
                    </a>
                    <a
                      href="/bellwethers/jbht"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      J.B. Hunt Transport (JBHT)
                    </a>
                  </div>
                </div>
              )}
            </li>
            <li>
              <a href="/why-betting-markets" className="text-navy-900 font-semibold hover:text-blue-600 font-mono">
                Why Betting Markets
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-white mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3 text-black font-helvetica">Predictive Markets Dashboard</h1>
          <p className="text-xl text-blue-400 font-mono">Track today to capture tomorrow.</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Main Content Area (3 columns) */}
          <div className="col-span-3 space-y-6">
            {/* S&P 500 Card */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">S&P 500 Predictions</h2>
              <div className="space-y-4">
                <div className="border-b border-blue-100 pb-4">
                  <p className="text-sm text-blue-800">End of Year > 5000</p>
                  <p className="text-2xl font-bold text-navy-900">65%</p>
                  <p className="text-sm text-blue-600">Volume: $125K</p>
                </div>
              </div>
            </div>

            {/* NASDAQ Card */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">NASDAQ Predictions</h2>
              <div className="space-y-4">
                <div className="border-b border-blue-100 pb-4">
                  <p className="text-sm text-blue-800">End of Year > 16000</p>
                  <p className="text-2xl font-bold text-navy-900">58%</p>
                  <p className="text-sm text-blue-600">Volume: $143K</p>
                </div>
              </div>
            </div>

  {/* Economic Indicators Grid */}
<div className="grid grid-cols-3 gap-6">
  {/* Federal Funds Rate Card */}
  <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
    <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">Federal Funds Rate</h2>
    <div className="space-y-4">
      <div className="border-b border-blue-100 pb-4">
        <p className="text-sm text-blue-800">Current Rate</p>
        {error() ? (
          <p className="text-red-500 text-sm">Error: {error()}</p>
        ) : !fedRateData() ? (
          <p className="text-2xl font-bold text-navy-900">Loading...</p>
        ) : (
          <>
            <p className="text-2xl font-bold text-navy-900">{fedRateData().rate}%</p>
            <p className="text-sm text-blue-600">Last Updated: {fedRateData().date}</p>
          </>
        )}
      </div>
      <div className="text-xs text-gray-600 mt-4">
        <p>The Federal Funds Rate is a crucial benchmark interest rate impacting the health of the macroeconomy. Lowering rates often indicate reduced financing costs for businesses, homebuyers, loan-seeking students, and consumers with credit card debt.</p>
      </div>
    </div>
  </div>

  {/* Unemployment Rate Card */}
  <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
    <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">Unemployment Rate</h2>
    <div className="space-y-4">
      <div className="border-b border-blue-100 pb-4">
        <p className="text-sm text-blue-800">Current Rate</p>
        {error() ? (
          <p className="text-red-500 text-sm">Error: {error()}</p>
        ) : !unemploymentData() ? (
          <p className="text-2xl font-bold text-navy-900">Loading...</p>
        ) : (
          <>
            <p className="text-2xl font-bold text-navy-900">{unemploymentData().rate}%</p>
            <p className="text-sm text-blue-600">Last Updated: {unemploymentData().date}</p>
          </>
        )}
      </div>
      <div className="text-xs text-gray-600 mt-4">
        <p>The Unemployment Rate measures the percentage of jobseekers unable to find work. Higher rates suggest issues with labor market health and declining consumer spending power.</p>
      </div>
    </div>
  </div>

  {/* Durable Goods Orders Card */}
  <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
    <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">Durable Goods Orders</h2>
    <div className="space-y-4">
      <div className="border-b border-blue-100 pb-4">
        <p className="text-sm text-blue-800">Latest Value (Billions)</p>
        {error() ? (
          <p className="text-red-500 text-sm">Error: {error()}</p>
        ) : !durablesData() ? (
          <p className="text-2xl font-bold text-navy-900">Loading...</p>
        ) : (
          <>
            <p className="text-2xl font-bold text-navy-900">${durablesData().value}B</p>
            <p className="text-sm text-blue-600">Last Updated: {durablesData().date}</p>
          </>
        )}
      </div>
      <div className="text-xs text-gray-600 mt-4">
        <p>Durable Goods Orders measures the value of manufacturing orders for goods that last longer than three years, such as vehicles and equipment. Increasing orders suggest potential economy growth, strong business investment, and promising earnings in industrial sectors.</p>
      </div>
    </div>
  </div>
</div>
            
          {/* Right Column - Market Movers */}
          <div className="space-y-6">
            {/* Top Gainers */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Top Gainers</h2>
              {!marketData() ? (
                <p className="text-navy-900">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {marketData().top_gainers?.slice(0, 3).map((stock) => (
                    <div className="border-b border-blue-100 pb-2">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-navy-900">{stock.ticker}</span>
                          <span className="text-gray-600">${stock.price}</span>
                        </div>
                        <span className="text-green-500 font-bold">+{stock.change_percentage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Losers */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Top Losers</h2>
              {!marketData() ? (
                <p className="text-navy-900">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {marketData().top_losers?.slice(0, 3).map((stock) => (
                    <div className="border-b border-blue-100 pb-2">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-navy-900">{stock.ticker}</span>
                          <span className="text-gray-600">${stock.price}</span>
                        </div>
                        <span className="text-red-500 font-bold">{stock.change_percentage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
