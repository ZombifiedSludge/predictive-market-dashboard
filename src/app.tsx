import { Component, createSignal, onMount } from 'solid-js';

const API_KEY = 'YY7OC6IG2C9BX8FR';

const App: Component = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [marketData, setMarketData] = createSignal(null);
  const [error, setError] = createSignal(null);

  // Fetch both Federal Funds Rate and Top Gainers/Losers data
  onMount(async () => {
    try {
      // Fetch Fed Rate
      const fedResponse = await fetch(
        `https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=monthly&apikey=${API_KEY}`
      );
      const fedData = await fedResponse.json();
      
      if (fedData['Error Message']) {
        throw new Error(fedData['Error Message']);
      }

      if (fedData['data']) {
        const latestRate = fedData['data'][0];
        setFedRateData({
          rate: parseFloat(latestRate.value).toFixed(2),
          date: new Date(latestRate.date).toLocaleDateString()
        });
      } else if (fedData['Time Series (Monthly)']) {
        const dates = Object.keys(fedData['Time Series (Monthly)']).sort().reverse();
        const latestDate = dates[0];
        const latestData = fedData['Time Series (Monthly)'][latestDate];
        setFedRateData({
          rate: parseFloat(latestData['value']).toFixed(2),
          date: new Date(latestDate).toLocaleDateString()
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

        <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
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
                <div className="text-sm text-gray-600 mt-4">
                  <p>The Federal Funds Rate is a crucial benchmark interest rate impacting the health of the macroeconomy.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Market Movers */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4 font-helvetica">Market Movers</h2>
            <div className="space-y-6">
              {/* Top Gainers */}
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Top Gainers</h3>
                {!marketData() ? (
                  <p className="text-navy-900">Loading...</p>
                ) : (
                  <div className="space-y-2">
                    {marketData().top_gainers?.slice(0, 3).map((stock) => (
                      <div className="border-b border-blue-100 pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-navy-900">{stock.ticker}</p>
                            <p className="text-sm text-gray-600">{stock.price}</p>
                          </div>
                          <p className="text-green-500 font-bold">+{stock.change_percentage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Losers */}
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Top Losers</h3>
                {!marketData() ? (
                  <p className="text-navy-900">Loading...</p>
                ) : (
                  <div className="space-y-2">
                    {marketData().top_losers?.slice(0, 3).map((stock) => (
                      <div className="border-b border-blue-100 pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-navy-900">{stock.ticker}</p>
                            <p className="text-sm text-gray-600">{stock.price}</p>
                          </div>
                          <p className="text-red-500 font-bold">{stock.change_percentage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Most Active */}
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Most Active</h3>
                {!marketData() ? (
                  <p className="text-navy-900">Loading...</p>
                ) : (
                  <div className="space-y-2">
                    {marketData().most_actively_traded?.slice(0, 3).map((stock) => (
                      <div className="border-b border-blue-100 pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-navy-900">{stock.ticker}</p>
                            <p className="text-sm text-gray-600">{stock.price}</p>
                          </div>
                          <p className={stock.change_percentage.startsWith('-') ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                            {stock.change_percentage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
