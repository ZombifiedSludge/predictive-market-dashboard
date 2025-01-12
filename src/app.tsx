import { createSignal, onMount, onCleanup } from 'solid-js';
import ThemeProvider from './components/ThemeProvider';
import OilGauge from './widgets/OilGauge';
import { Tesla } from "~/components/Tesla";

const App = () => {
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
          
          const [dowData, spData, nasdaqData] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/quote?symbol=DIA&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${API_KEY}`).then(r => r.json()),
            fetch(`https://finnhub.io/api/v1/quote?symbol=ONEQ&token=${API_KEY}`).then(r => r.json())
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
    <ThemeProvider>
      <div className="min-h-screen" onClick={createBubble}>
      <header className="bg-white shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <img src="/omenifylogo.png" alt="Omenify" className="h-8" />
            <div className="flex space-x-8">
              <a href="#dashboard" className="font-serif font-bold text-blue-900 hover:text-blue-700">Dashboard</a>
              <a href="#bellwether" className="font-serif font-bold text-blue-900 hover:text-blue-700">Bellwethers</a>
              <a href="#betting" className="font-serif font-bold text-blue-900 hover:text-blue-700">Why Betting Markets</a>
              <a href="#sources" className="font-serif font-bold text-blue-900 hover:text-blue-700">Sources</a>
            </div>
          </div>
        </nav>
      </header>

<main className="container mx-auto px-6 py-8">
  {/* Main content grid */}
  <div className="grid grid-cols-12 gap-6 mb-6">
    {/* Top section spans full width */}
    <div className="col-span-12">
      <div className="grid grid-cols-4 gap-6">
        {/* Left side - Main content */}
        <div className="col-span-3">
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">S&P 500 End of Year Prediction</h2>
            {/* Your existing S&P prediction content */}
          </div>

          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">NASDAQ End of Year Prediction</h2>
            {/* Your existing NASDAQ prediction content */}
          </div>
        </div>
        
        {/* Right side - Top Projections */}
        <div className="space-y-6">
          {/* S&P 500 Projections */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Top S&P 500 Projections</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="border-b border-blue-100 pb-2">
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
                <div key={i} className="border-b border-blue-100 pb-2">
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
    </div>

{/* Middle section with Tesla, Graph, and ETF/Music */}
<div class="col-span-12">
  <div class="grid grid-cols-12 gap-6">
    {/* Left Column with Tesla and Oil Gauge */}
    <div class="col-span-2 space-y-6">
      {/* Tesla Component replaces Market Movers */}
      <Tesla isDarkMode={isDarkMode()} />
      {/* Oil Gauge */}
      <OilGauge />
    </div>
    
        {/* Market Overview Graph */}
        <div className="col-span-7">
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Market Overview</h2>
            <div className="w-full h-[calc(100%-2rem)] bg-gray-50 rounded flex items-center justify-center">
              <span className="text-gray-500">Graph Placeholder</span>
            </div>
          </div>
        </div>

        {/* Right column - ETF and Music */}
        <div className="col-span-3 space-y-6">
          {/* Live Index ETF Tracking */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Live Index ETF Tracking</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-sm text-navy-900">Dow Jones Industrial Average ETF (DIA)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-600">
                    ${marketIndexes().dowJones.value}
                  </span>
                  <span className={`text-xs ${marketIndexes().dowJones.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketIndexes().dowJones.change > 0 ? '+' : ''}{marketIndexes().dowJones.change}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-sm text-navy-900">S&P 500 ETF (SPY)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-600">
                    ${marketIndexes().sp500.value}
                  </span>
                  <span className={`text-xs ${marketIndexes().sp500.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketIndexes().sp500.change > 0 ? '+' : ''}{marketIndexes().sp500.change}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-sm text-navy-900">NASDAQ Composite ETF (ONEQ)</span>
                <div className="flex items-center space-x-2">
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

          {/* Spotify Embed */}
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Market Mood Music</h2>
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              {/* Spotify embed will go here */}
              <span className="text-gray-500">Spotify Player Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  {/* Bottom row for macro indicators */}
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
         </main>
    </div>
  </ThemeProvider>  
  );
};


// Add bubble creation function here
const createBubble = (e: MouseEvent) => {
  const bubble = document.createElement('div');
  const size = Math.random() * 30 + 20;
  const left = e.clientX - size / 2;
  const top = e.clientY - size / 2;
  const travelDistance = Math.random() * 100 - 50;

  bubble.className = 'bubble';
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;
  bubble.style.setProperty('--travel-x', `${travelDistance}px`);
  bubble.style.animation = `float ${Math.random() * 2 + 3}s ease-in forwards`;

  document.body.appendChild(bubble);

  bubble.addEventListener('animationend', () => {
    document.body.removeChild(bubble);
  });
};

export default App;
