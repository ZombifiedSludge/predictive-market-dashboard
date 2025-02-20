import { createSignal, onMount, onCleanup } from 'solid-js';
import OilGauge from './OilGauge';
import Tesla from './Tesla';
import SP500Prediction from './components/SP500Prediction';

const Dashboard = () => {
  const [fedRateData, setFedRateData] = createSignal(null);
  const [marketData, setMarketData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
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
      // Set Federal Funds Rate
      setFedRateData({
        rate: "4.33",
        date: "2025-01-10"
      });

      // Set Unemployment Rate
      setUnemploymentData({
        rate: "4.1",
        date: "2025-01-10"
      });

      // Set Durables Data
      setDurablesData({
        value: "284.712",
        date: "2025-01-06"
      });

      // Market data fetch function
      const fetchMarketData = async () => {
        try {
          const API_KEY = 'cu0ahohr01ql96gq5n0gcu0ahohr01ql96gq5n10';
          
          const [dowData, spData, nasdaqData, xlkData, xlfData, xleData, xlvData, xlyData] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/quote?symbol=DIA&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=ONEQ&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=XLK&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=XLF&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=XLE&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=XLV&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=XLY&token=${API_KEY}`).then(r => r.json())
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
    <main class="container mx-auto px-6 py-8">
      <div class="grid grid-cols-12 gap-6 mb-6">
        {/* Top section */}
        <div class="col-span-12">
          <div class="grid grid-cols-4 gap-6">
            {/* Left side - Main content */}
            <div class="col-span-3">
              <SP500Prediction />
              <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
                <h2 class="text-lg font-semibold text-navy-900 mb-4">NASDAQ End of Year Prediction</h2>
                {/* Your existing NASDAQ prediction content */}
              </div>
            </div>
            
            {/* Right side - Top Projections */}
            <div class="space-y-6">
              {/* NASDAQ Projections */}
              <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
                <h2 class="text-lg font-semibold text-blue-800 mb-3">Top NASDAQ Projections</h2>
                <div class="space-y-2">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} class="border-b border-blue-100 pb-2">
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-navy-900">Analyst {i + 1}</span>
                        <span class="text-sm text-gray-600">Projection</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle section */}
        <div class="col-span-12">
          <div class="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div class="col-span-2 space-y-6">
              <Tesla />
              <OilGauge />
            </div>
            
            {/* Market Overview Graph */}
            <div class="col-span-7">
              <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
                <h2 class="text-lg font-semibold text-blue-800 mb-3">Market Overview</h2>
                <div class="w-full h-[calc(100%-2rem)] bg-gray-50 rounded flex items-center justify-center">
                  <span class="text-gray-500">Graph Placeholder</span>
                </div>
              </div>
            </div>

            {/* Right column - ETF and News */}
            <div class="col-span-3 space-y-6">
              {/* Live Index ETF Tracking */}
              <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
                <h2 class="text-lg font-semibold text-blue-800 mb-3">Live Index ETF Tracking</h2>
                <div class="space-y-3">
                  <div class="flex justify-between items-center border-b border-blue-100 pb-2">
                    <span class="text-sm text-navy-900">Dow Jones Industrial Average ETF (DIA)</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-semibold text-gray-600">
                        ${marketIndexes().dowJones.value}
                      </span>
                      <span class={`text-xs ${marketIndexes().dowJones.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketIndexes().dowJones.change > 0 ? '+' : ''}{marketIndexes().dowJones.change}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center border-b border-blue-100 pb-2">
                    <span class="text-sm text-navy-900">S&P 500 ETF (SPY)</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-semibold text-gray-600">
                        ${marketIndexes().sp500.value}
                      </span>
                      <span class={`text-xs ${marketIndexes().sp500.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketIndexes().sp500.change > 0 ? '+' : ''}{marketIndexes().sp500.change}%
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center border-b border-blue-100 pb-2">
                    <span class="text-sm text-navy-900">NASDAQ Composite ETF (ONEQ)</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-semibold text-gray-600">
                        ${marketIndexes().nasdaq.value}
                      </span>
                      <span class={`text-xs ${marketIndexes().nasdaq.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {marketIndexes().nasdaq.change > 0 ? '+' : ''}{marketIndexes().nasdaq.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter/X Embed */}
              <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
                <h2 class="text-lg font-semibold text-blue-800 mb-3">Market News</h2>
                <div class="w-full" style={{ height: "152px", overflow: "hidden" }}>
                  <a 
                    class="twitter-timeline" 
                    data-height="152"
                    data-chrome="noheader nofooter noborders transparent"
                    data-tweet-limit="5"
                    data-show-replies="false"
                    data-show-retweets="false"
                    data-cards="hidden"
                    data-conversation="none"
                    data-media="false"
                    data-dnt="true"
                    data-link-color="#000000"
                    data-theme="light"
                    data-aria-polite="assertive"
                    data-components="timeline,follow-button"
                    tweet-style="linear"
                    hide-thread="true"
                    hide-media="true"
                    href="https://twitter.com/CNBC?ref_src=twsrc%5Etfw"
                    ref={(el) => {
                      if (window.twttr && window.twttr.widgets) {
                        window.twttr.widgets.load(el);
                      }
                    }}
                  >
                    <div class="flex items-center justify-center h-full">
                      <div class="text-blue-800 opacity-80 animate-pulse">
                        Loading latest market news...
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Industry-Specific ETF Tracking */}
              <div class="bg-gradient-to-r from-white to-blue-50/30 backdrop-blur rounded-lg shadow-xl p-4 border-l-4 border-blue-600/20">
                <h2 class="text-lg font-semibold text-blue-800 mb-3">Industry-Specific ETF Tracking 📈</h2>
                <div class="space-y-3">
                  {Object.entries(sectorETFs()).map(([key, data]) => (
                    <div class="flex justify-between items-center border-b border-blue-100 pb-2">
                      <span class="text-sm text-navy-900">{key.toUpperCase()} Select SPDR</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-semibold text-gray-600">
                          ${data.value}
                        </span>
                        <span class={`text-xs ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {data.change > 0 ? '+' : ''}{data.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
    {/* Bottom row for macro indicators */}
    <div className="col-span-12">
      <div className="grid grid-cols-3 gap-6">
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
