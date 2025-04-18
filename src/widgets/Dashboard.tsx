import { createSignal, onMount, onCleanup } from 'solid-js';
import OilGauge from './OilGauge';
import Tesla from './Tesla';
import { MarketNewsWidget } from "./MarketNewsWidget";

const Dashboard = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [marketData, setMarketData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const [selectedGraph, setSelectedGraph] = createSignal('spy'); // Default to S&P 500
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen());
  };

  const selectGraph = (graph) => {
    setSelectedGraph(graph);
    setIsDropdownOpen(false);
  };

onMount(() => {
  try {
    // Hard-coded macroeconomic indicators
    setFedRateData({
      rate: "4.33",
      date: "2025-04-02"
    });

    setUnemploymentData({
      rate: "4.1",
      date: "2025-03-07"
    });

    setDurablesData({
      value: "289.499",
      date: "2025-04-02"
    });

    // Market data fetch function
    const fetchMarketData = async () => {
      try {
        // Use Netlify functions to avoid CORS issues
        const [dowData, spData, nasdaqData, xlkData, xlfData, xleData, xlvData, xlyData] = await Promise.all([
          fetch(`/.netlify/functions/market-data?symbol=DIA`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=SPY`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=ONEQ`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=XLK`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=XLF`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=XLE`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=XLV`).then(r => r.json()),
          fetch(`/.netlify/functions/market-data?symbol=XLY`).then(r => r.json())
        ]);

        setMarketIndexes({
          dowJones: {
            value: dowData.c.toFixed(2),
            change: ((dowData.c - dowData.pc) / dowData.pc * 100).toFixed(2)
          },
          sp500: {
            value: spData.c.toFixed(2),
            change: ((spData.c - spData.pc) / spData.pc * 100).toFixed(2)
          },
          nasdaq: {
            value: nasdaqData.c.toFixed(2),
            change: ((nasdaqData.c - nasdaqData.pc) / nasdaqData.pc * 100).toFixed(2)
          }
        });

        setSectorETFs({
          xlk: {
            value: xlkData.c.toFixed(2),
            change: ((xlkData.c - xlkData.pc) / xlkData.pc * 100).toFixed(2)
          },
          xlf: {
            value: xlfData.c.toFixed(2),
            change: ((xlfData.c - xlfData.pc) / xlfData.pc * 100).toFixed(2)
          },
          xle: {
            value: xleData.c.toFixed(2),
            change: ((xleData.c - xleData.pc) / xleData.pc * 100).toFixed(2)
          },
          xlv: {
            value: xlvData.c.toFixed(2),
            change: ((xlvData.c - xlvData.pc) / xlvData.pc * 100).toFixed(2)
          },
          xly: {
            value: xlyData.c.toFixed(2),
            change: ((xlyData.c - xlyData.pc) / xlyData.pc * 100).toFixed(2)
          }
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
  <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
  {/* Main content grid */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6">
      {/* Middle section with Tesla, Graph, and ETF/Music */}
      <div class="col-span-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column with Tesla and Oil Gauge */}
          <div class="col-span-12 lg:col-span-2 space-y-4 sm:space-y-6 flex flex-row lg:flex-col">
            <div class="w-1/2 lg:w-full pr-2 lg:pr-0">
              <Tesla />
            </div>
            <div class="w-1/2 lg:w-full pl-2 lg:pl-0">
              <OilGauge />
            </div>
          </div>
          
          {/* Market Overview Graph with Dropdown */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-800">Market Overview</h2>
                
                {/* Dropdown Menu */}
                <div className="relative">
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 text-sm font-medium text-blue-700 hover:text-blue-900 focus:outline-none"
                  >
                    <span>{selectedGraph() === 'spy' ? 'S&P 500' : 'NASDAQ Composite'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen() && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => selectGraph('spy')}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedGraph() === 'spy' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          S&P 500
                        </button>
                        <button
                          onClick={() => selectGraph('oneq')}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedGraph() === 'oneq' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          NASDAQ Composite
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Graph Content */}
              <div className="w-full">
                {selectedGraph() === 'spy' ? (
                  <img 
                    src="/SPYgraph2.png" 
                    alt="S&P 500 Market Overview" 
                    className="w-full" 
                  />
                ) : (
                  <img 
                    src="/ONEQGraph.png" 
                    alt="NASDAQ Composite Market Overview" 
                    className="w-full" 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right column - ETF and Music */}
          <div className="col-span-12 lg:col-span-3 space-y-4 sm:space-y-6">
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

            {/* Twitter/X Embed */}
            <div className="w-full">
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
 </div>

    {/* Bottom row for macro indicators */}
    <div className="col-span-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
</main>
);

};

export default Dashboard;
