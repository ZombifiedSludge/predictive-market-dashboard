import { createSignal, onMount } from 'solid-js';

const App = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [marketData, setMarketData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const [unemploymentData, setUnemploymentData] = createSignal(null);
  const [durablesData, setDurablesData] = createSignal(null);

  // Cache management functions
  const shouldRefreshCache = (key, intervalHours) => {
    const cached = localStorage.getItem(key);
    if (!cached) return true;
    
    const { timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    return (now - timestamp) > (intervalHours * 60 * 60 * 1000);
  };

  const FRED_API_KEY = 'b12c1cced5c15f90f28f8f6aaeb331cd';

  const fetchFREDData = async () => {
    if (!shouldRefreshCache('fred_data', 96)) { // 4 days
      return JSON.parse(localStorage.getItem('fred_data')).data;
    }

   const [fedResponse, unemploymentResponse, durablesResponse] = await Promise.all([
  fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=lin`),
  fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=lin`),
  fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=DGORDER&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json&frequency=m&units=mil`)
]);

    const [fedData, unemploymentData, durablesData] = await Promise.all([
      fedResponse.json(),
      unemploymentResponse.json(),
      durablesResponse.json()
    ]);

    const data = { fedData, unemploymentData, durablesData };
    localStorage.setItem('fred_data', JSON.stringify({
      timestamp: new Date().getTime(),
      data
    }));

    return data;
  };

onMount(async () => {
  try {
    const fredData = await fetchFREDData();
    console.log('FRED API Response:', fredData);
    
    if (fredData.fedData.observations) {
      const latest = fredData.fedData.observations[0];
      setFedRateData({
        rate: parseFloat(latest.value).toFixed(2),
        date: new Date(latest.date).toLocaleDateString()
      });
    }

    if (fredData.unemploymentData.observations) {
      const latest = fredData.unemploymentData.observations[0];
      setUnemploymentData({
        rate: parseFloat(latest.value).toFixed(1),
        date: new Date(latest.date).toLocaleDateString()
      });
    }

    if (fredData.durablesData.observations) {
      const latest = fredData.durablesData.observations[0];
      setDurablesData({
        value: parseFloat(latest.value).toFixed(1),
        date: new Date(latest.date).toLocaleDateString()
      });
    }
  } catch (err) {
    console.error('Detailed error:', err);
    setError(err.message);
  }
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <img src="/omenifylogo.png" alt="Omenify" className="h-8" />
            
            {/* Navigation Links */}
            <div className="flex space-x-8">
              <a href="#dashboard" className="font-monaco font-bold text-blue-900 hover:text-blue-700">Dashboard</a>
              <a href="#bellwether" className="font-monaco font-bold text-blue-900 hover:text-blue-700">Bellwethers</a>
              <a href="#betting" className="font-monaco font-bold text-blue-900 hover:text-blue-700">Why Betting Markets</a>
              <a href="#sources" className="font-monaco font-bold text-blue-900 hover:text-blue-700">Sources</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Predictive Markets Dashboard</h1>
        <p className="text-lg text-blue-800 mb-8">Track today to capture tomorrow</p>

        <div className="grid grid-cols-4 gap-6">
          {/* Left side - Main content */}
          <div className="col-span-3">
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-navy-900 mb-4">S&P 500 End of Year Prediction</h2>
              {/* Your existing S&P prediction content */}
            </div>

            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-navy-900 mb-4">NASDAQ End of Year Prediction</h2>
              {/* Your existing NASDAQ prediction content */}
            </div>
          </div>

          {/* Right side - Projections */}
          <div className="space-y-6">
            {/* S&P 500 Projections */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Top S&P 500 Projections</h2>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <div className="border-b border-blue-100 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-navy-900">Analyst {i + 1}</span>
                      <span className="text-sm text-gray-600">Projection</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NASDAQ Projections */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Top NASDAQ Projections</h2>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <div className="border-b border-blue-100 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-navy-900">Analyst {i + 1}</span>
                      <span className="text-sm text-gray-600">Projection</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Movers */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Your existing market movers content */}
        </div>

        {/* Macroeconomic Indicators at the bottom */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          {/* Federal Funds Rate */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Federal Funds Rate</h2>
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
                    <p className="text-xs text-gray-500 mt-2">Source: Federal Reserve Bank of St. Louis</p>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>The Federal Funds Rate is a crucial benchmark interest rate impacting the health of the macroeconomy. Lowering rates often indicate reduced financing costs for businesses, homebuyers, loan-seeking students, and consumers with credit card debt.</p>
              </div>
            </div>
          </div>

       {/* Unemployment Rate */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Unemployment Rate</h2>
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
                    <p className="text-xs text-gray-500 mt-2">Source: Federal Reserve Bank of St. Louis</p>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>The Unemployment Rate measures the percentage of jobseekers unable to find work. Higher rates suggest issues with labor market health and declining consumer spending power.</p>
              </div>
            </div>
          </div>

          {/* Durable Goods Orders */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Durable Goods Orders</h2>
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
                    <p className="text-xs text-gray-500 mt-2">Source: Federal Reserve Bank of St. Louis</p>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>Durable Goods Orders measures the value of manufacturing orders for goods that last longer than three years, such as vehicles and equipment. Increasing orders suggest potential economy growth, strong business investment, and promising earnings in industrial sectors.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};      

export default App;
