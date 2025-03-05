import { createSignal, onMount, onCleanup } from 'solid-js';
import OilGauge from './OilGauge';
import Tesla from './Tesla';
import { MarketNewsWidget } from "./MarketNewsWidget";

const Dashboard = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [unemploymentData, setUnemploymentData] = createSignal(null);
  const [durablesData, setDurablesData] = createSignal(null);
  const [marketIndexes, setMarketIndexes] = createSignal({
    dowJones: { value: '--', change: 0 },
    sp500: { value: '--', change: 0 },
    nasdaq: { value: '--', change: 0 }
  });
  const [sectorETFs, setSectorETFs] = createSignal({
    xlk: { value: '--', change: 0 },
    xlf: { value: '--', change: 0 },
    xle: { value: '--', change: 0 },
    xlv: { value: '--', change: 0 },
    xly: { value: '--', change: 0 }
  });

  onMount(() => {
    try {
      // Hard-coded macroeconomic indicators
      setFedRateData({
        rate: "4.33",
        date: "2025-02-25"
      });

      setUnemploymentData({
        rate: "4.0",
        date: "2025-02-25"
      });

      setDurablesData({
        value: "276.103",
        date: "2025-02-04"
      });

      // Market data fetch function - to be implemented later
      const fetchMarketData = async () => {
        try {
          // This section will be implemented later with backend API calls
          
          // Placeholder for market indexes
          setMarketIndexes({
            dowJones: { value: '--', change: 0 },
            sp500: { value: '--', change: 0 },
            nasdaq: { value: '--', change: 0 }
          });

          // Placeholder for sector ETFs
          setSectorETFs({
            xlk: { value: '--', change: 0 },
            xlf: { value: '--', change: 0 },
            xle: { value: '--', change: 0 },
            xlv: { value: '--', change: 0 },
            xly: { value: '--', change: 0 }
          });
        } catch (err) {
          console.error('Error fetching market data:', err);
          setError(err.message);
        }
      };

      // Initial fetch
      fetchMarketData();

      // Set up polling every 30 seconds
      const marketInterval = setInterval(fetchMarketData, 30000);

      // Cleanup
      onCleanup(() => clearInterval(marketInterval));
      
    } catch (err) {
      console.error('Error setting data:', err);
      setError(err.message);
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main dashboard grid */}
      <div className="grid grid-cols-12 gap-4 auto-rows-auto">
        
        {/* Top row: Tesla, Market Graph, and ETF tracking */}
        <div className="col-span-12 grid grid-cols-12 gap-4">
          
            {/* Left column - Tesla and Oil */}
          <div className="col-span-12 sm:col-span-2 grid grid-cols-2 sm:grid-cols-1 gap-4">
            <Tesla />
            <OilGauge />
          </div>
          
          {/* Middle column - Market Overview */}
          <div className="col-span-12 sm:col-span-7">
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Market Overview</h2>
              <div style={{ height: "352px", overflow: "hidden" }}>
                <img 
                  src="/SPYgraph2.png" 
                  alt="S&P 500 Market Overview" 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain",
                    maxHeight: "100%"
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Right column - ETF tracking */}
          <div className="col-span-12 sm:col-span-3 flex flex-col gap-4">
            {/* Live Index ETF Tracking */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Live Index ETF Tracking</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">Dow Jones Industrial Average ETF (DIA)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${marketIndexes().dowJones.value}
                    </span>
                    <span className={`text-xs ${marketIndexes().dowJones.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketIndexes().dowJones.change > 0 ? '+' : ''}{marketIndexes().dowJones.change}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">S&P 500 ETF (SPY)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${marketIndexes().sp500.value}
                    </span>
                    <span className={`text-xs ${marketIndexes().sp500.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketIndexes().sp500.change > 0 ? '+' : ''}{marketIndexes().sp500.change}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">NASDAQ Composite ETF (ONEQ)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${marketIndexes().nasdaq.value}
                    </span>
                    <span className={`text-xs ${marketIndexes().nasdaq.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketIndexes().nasdaq.change > 0 ? '+' : ''}{marketIndexes().nasdaq.change}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market News Widget */}
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl">
              <MarketNewsWidget />
            </div>

            {/* Industry-Specific ETF Tracking */}
            <div className="bg-gradient-to-r from-white to-blue-50/30 backdrop-blur rounded-lg shadow-xl p-4 border-l-4 border-blue-600/20">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Industry-Specific ETF Tracking 📈</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">Tech Select SPDR (XLK)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${sectorETFs().xlk.value}
                    </span>
                    <span className={`text-xs ${sectorETFs().xlk.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sectorETFs().xlk.change > 0 ? '+' : ''}{sectorETFs().xlk.change}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">Financial Select SPDR (XLF)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${sectorETFs().xlf.value}
                    </span>
                    <span className={`text-xs ${sectorETFs().xlf.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sectorETFs().xlf.change > 0 ? '+' : ''}{sectorETFs().xlf.change}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">Energy Select SPDR (XLE)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${sectorETFs().xle.value}
                    </span>
                    <span className={`text-xs ${sectorETFs().xle.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sectorETFs().xle.change > 0 ? '+' : ''}{sectorETFs().xle.change}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">Healthcare Select SPDR (XLV)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${sectorETFs().xlv.value}
                    </span>
                    <span className={`text-xs ${sectorETFs().xlv.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sectorETFs().xlv.change > 0 ? '+' : ''}{sectorETFs().xlv.change}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <span className="text-sm text-navy-900 truncate mr-2">Consumer Select SPDR (XLY)</span>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-600">
                      ${sectorETFs().xly.value}
                    </span>
                    <span className={`text-xs ${sectorETFs().xly.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {sectorETFs().xly.change > 0 ? '+' : ''}{sectorETFs().xly.change}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom row - Macroeconomic indicators */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* Federal Funds Rate */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Federal Funds Rate</h2>
            <div className="space-y-2">
              <div className="border-b border-blue-100 pb-2">
                <p className="text-sm text-blue-800">Current Rate</p>
                {error() ? (
                  <p className="text-red-500 text-sm">Error: {error()}</p>
                ) : !fedRateData() ? (
                  <p className="text-lg font-bold text-navy-900">Loading...</p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-navy-900">{fedRateData().rate}%</p>
                    <p className="text-xs text-blue-600">Last Updated: {fedRateData().date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Source: <a href="https://fred.stlouisfed.org/series/EFFR" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Federal Reserve Bank of St. Louis</a>
                    </p>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-600">
                <p>The Federal Funds Rate is a crucial benchmark interest rate impacting the health of the macroeconomy. Lowering rates often indicate reduced financing costs for businesses, homebuyers, loan-seeking students, and consumers with credit card debt.</p>
              </div>
            </div>
          </div>

          {/* Unemployment Rate */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Unemployment Rate</h2>
            <div className="space-y-2">
              <div className="border-b border-blue-100 pb-2">
                <p className="text-sm text-blue-800">Current Rate</p>
                {error() ? (
                  <p className="text-red-500 text-sm">Error: {error()}</p>
                ) : !unemploymentData() ? (
                  <p className="text-lg font-bold text-navy-900">Loading...</p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-navy-900">{unemploymentData().rate}%</p>
                    <p className="text-xs text-blue-600">Last Updated: {unemploymentData().date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Source: <a href="https://fred.stlouisfed.org/series/UNRATE" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Federal Reserve Bank of St. Louis</a>
                    </p>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-600">
                <p>The Unemployment Rate measures the percentage of jobseekers unable to find work. Higher rates suggest issues with labor market health and declining consumer spending power.</p>
              </div>
            </div>
          </div>

          {/* Durable Goods Orders */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Durable Goods Orders</h2>
            <div className="space-y-2">
              <div className="border-b border-blue-100 pb-2">
                <p className="text-sm text-blue-800">Latest Value (Billions)</p>
                {error() ? (
                  <p className="text-red-500 text-sm">Error: {error()}</p>
                ) : !durablesData() ? (
                  <p className="text-lg font-bold text-navy-900">Loading...</p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-navy-900">${durablesData().value}B</p>
                    <p className="text-xs text-blue-600">Last Updated: {durablesData().date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Source: <a href="https://fred.stlouisfed.org/series/DGORDER" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Federal Reserve Bank of St. Louis</a>
                    </p>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-600">
                <p>Durable Goods Orders measures the value of manufacturing orders for goods that last longer than three years, such as vehicles and equipment. Increasing orders suggest potential economic growth, strong business investment, and promising earnings in industrial sectors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
