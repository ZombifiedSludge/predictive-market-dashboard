import { Component, createSignal, onMount } from 'solid-js';

const API_KEY = '40UQBGQGIB8R709O'; // Put your API key here

const App: Component = () => {
  const [fedRate, setFedRate] = createSignal(null);

  // Fetch the Federal Funds Rate data when the component is mounted
  onMount(async () => {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=monthly&apikey=${API_KEY}`);
      const data = await response.json();
      setFedRate(data);  // Set the fetched data in state
      console.log('Fed Rate Data:', data);  // Log the data to see its structure
    } catch (error) {
      console.error('Error fetching Fed Rate:', error);
    }
  });

  return (
    <div>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-white mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3 text-black font-helvetica">Predictive Markets Dashboard</h1>
          <p className="text-xl text-blue-400 font-mono">Track today to capture tomorrow.</p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
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

          {/* Federal Funds Rate Card */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">Federal Funds Rate</h2>
            <div className="space-y-4">
              <div className="border-b border-blue-100 pb-4">
                <p className="text-sm text-blue-800">Current Rate</p>
                <p className="text-2xl font-bold text-navy-900">
                  {/* Display the live rate */}
                  {fedRate() && fedRate().rate ? `${fedRate().rate}%` : "Loading..."}
                </p>
                <p className="text-sm text-blue-600">
                  {/* Display the last updated date */}
                  {fedRate() && fedRate().date ? `Last Updated: ${fedRate().date}` : "Loading..."}
                </p>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <p>The Federal Funds Rate is a crucial benchmark interest rate impacting the health of the macroeconomy. Lower rates usually indicate reduced financing costs for homebuyers, businesses, loan-seeking students, and consumers with credit card debt.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
