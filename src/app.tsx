import { createSignal, onMount } from 'solid-js';

const App = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [marketData, setMarketData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const [unemploymentData, setUnemploymentData] = createSignal(null);
  const [durablesData, setDurablesData] = createSignal(null);
  const [projectionsSP, setProjectionsSP] = createSignal([
    { name: '', projection: '' },
    { name: '', projection: '' },
    { name: '', projection: '' },
    { name: '', projection: '' }
  ]);
  const [projectionsNASDAQ, setProjectionsNASDAQ] = createSignal([
    { name: '', projection: '' },
    { name: '', projection: '' },
    { name: '', projection: '' },
    { name: '', projection: '' }
  ]);

  const FRED_API_KEY = 'b12c1cced5c15f90f28f8f6aaeb331cd';
  const AV_API_KEY = 'YY7OC6IG2C9BX8FR';

  // Cache management functions
  const shouldRefreshCache = (key, intervalHours) => {
    const cached = localStorage.getItem(key);
    if (!cached) return true;
    
    const { timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    return (now - timestamp) > (intervalHours * 60 * 60 * 1000);
  };

  const isAfterMarketClose = () => {
    const now = new Date();
    const marketCloseET = new Date(now);
    marketCloseET.setHours(16, 0, 0, 0); // 4:00 PM ET
    return now > marketCloseET;
  };

  const fetchFREDData = async (series) => {
    const cacheKey = `fred_${series}`;
    if (!shouldRefreshCache(cacheKey, 96)) { // 4 days = 96 hours
      return JSON.parse(localStorage.getItem(cacheKey)).data;
    }

    const response = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${FRED_API_KEY}&sort_order=desc&limit=1&file_type=json`
    );
    const data = await response.json();
    
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: new Date().getTime(),
      data: data
    }));
    
    return data;
  };

  const fetchMarketData = async () => {
    const cacheKey = 'market_movers';
    if (!shouldRefreshCache(cacheKey, 24) && !isAfterMarketClose()) {
      return JSON.parse(localStorage.getItem(cacheKey)).data;
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${AV_API_KEY}`
    );
    const data = await response.json();
    
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: new Date().getTime(),
      data: data
    }));
    
    return data;
  };

  onMount(async () => {
    try {
      // Fetch all FRED data
      const [fedData, unemploymentData, durablesData] = await Promise.all([
        fetchFREDData('FEDFUNDS'),
        fetchFREDData('UNRATE'),
        fetchFREDData('DGORDER')
      ]);

      if (fedData.observations) {
        const latest = fedData.observations[0];
        setFedRateData({
          rate: parseFloat(latest.value).toFixed(2),
          date: new Date(latest.date).toLocaleDateString()
        });
      }

      if (unemploymentData.observations) {
        const latest = unemploymentData.observations[0];
        setUnemploymentData({
          rate: parseFloat(latest.value).toFixed(1),
          date: new Date(latest.date).toLocaleDateString()
        });
      }

      if (durablesData.observations) {
        const latest = durablesData.observations[0];
        setDurablesData({
          value: parseFloat(latest.value).toFixed(1),
          date: new Date(latest.date).toLocaleDateString()
        });
      }

      // Fetch market movers
      const moversData = await fetchMarketData();
      setMarketData(moversData);

    } catch (err) {
      setError(err.message);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <a href="#dashboard" className="text-blue-800 hover:text-blue-600">Dashboard</a>
              <a href="#bellwether" className="text-blue-800 hover:text-blue-600">Bellwether</a>
              <a href="#betting" className="text-blue-800 hover:text-blue-600">Why Betting Markets</a>
              <a href="#sources" className="text-blue-800 hover:text-blue-600">Sources</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Economic Indicators */}
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
            </div>
          </div>

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
            </div>
          </div>

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
            </div>
          </div>
        </div>

        {/* Projections Section */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* S&P 500 Projections */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Top S&P 500 Projections</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm text-blue-800 pb-2">Name</th>
                  <th className="text-right text-sm text-blue-800 pb-2">Projection</th>
                </tr>
              </thead>
              <tbody>
                {projectionsSP().map((projection, index) => (
                  <tr className="border-b border-blue-50">
                    <td className="py-2">{projection.name || '--'}</td>
                    <td className="py-2 text-right">{projection.projection || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NASDAQ Projections */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Top NASDAQ Projections</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm text-blue-800 pb-2">Name</th>
                  <th className="text-right text-sm text-blue-800 pb-2">Projection</th>
                </tr>
              </thead>
              <tbody>
                {projectionsNASDAQ().map((projection, index) => (
                  <tr className="border-b border-blue-50">
                    <td className="py-2">{projection.name || '--'}</td>
                    <td className="py-2 text-right">{projection.projection || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Movers Section */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Top Gainers */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Top Gainers</h2>
            {!marketData() ? (
              <p className="text-navy-900">Loading...</p>
            ) : (
              <div className="space-y-3">
                {marketData().top_gainers?.slice(0, 3).map((stock) => (
                  <div className="border-b border-blue-100 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-navy-900">{stock.ticker}</span>
                      <div className="text-right">
                        <span className="text-gray-600">${stock.price}</span>
                        <span className="block text-green-500">+{stock.change_percentage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Losers */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Top Losers</h2>
            {!marketData() ? (
              <p className="text-navy-900">Loading...</p>
            ) : (
              <div className="space-y-3">
                {marketData().top_losers?.slice(0, 3).map((stock) => (
                  <div className="border-b border-blue-100 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-navy-900">{stock.ticker}</span>
                      <div className="text-right">
                        <span className="text-gray-600">${stock.price}</span>
                        <span className="block text-red-500">{stock.change_percentage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
