// MarketNewsWidget.tsx
import { createSignal, createEffect, onMount, Show } from "solid-js";

const NEWS_SOURCES = [
  { id: "CNBC", name: "CNBC", handle: "CNBC" },
  { id: "MarketWatch", name: "MarketWatch", handle: "MarketWatch" },
  { id: "WSJ", name: "Wall Street Journal", handle: "WSJ" }
];

export const MarketNewsWidget = () => {
  const [selectedSource, setSelectedSource] = createSignal(NEWS_SOURCES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen());
  
  const selectSource = (source) => {
    setSelectedSource(source);
    setIsDropdownOpen(false);
    setIsLoading(true);
  };

  const loadTwitterWidget = () => {
    if (window.twttr && window.twttr.widgets) {
      const container = document.getElementById('twitter-timeline-container');
      if (container) {
        // Clear previous timeline
        container.innerHTML = '';
        
        // Create a new anchor element for the Twitter timeline
        const a = document.createElement('a');
        a.className = 'twitter-timeline';
        a.setAttribute('data-height', '152');
        a.setAttribute('data-chrome', 'noheader nofooter noborders transparent');
        a.setAttribute('data-tweet-limit', '5');
        a.setAttribute('data-show-replies', 'false');
        a.setAttribute('data-show-retweets', 'false');
        a.setAttribute('data-cards', 'hidden');
        a.setAttribute('data-conversation', 'none');
        a.setAttribute('data-media', 'false');
        a.setAttribute('data-dnt', 'true');
        a.setAttribute('data-link-color', '#000000');
        a.setAttribute('data-theme', 'light');
        a.setAttribute('data-aria-polite', 'assertive');
        a.setAttribute('tweet-style', 'linear');
        a.setAttribute('hide-thread', 'true');
        a.setAttribute('hide-media', 'true');
        a.setAttribute('href', `https://twitter.com/${selectedSource().handle}?ref_src=twsrc%5Etfw`);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'flex items-center justify-center h-full';
        const loadingText = document.createElement('div');
        loadingText.className = 'text-blue-800 opacity-80 animate-pulse';
        loadingText.textContent = `Loading latest ${selectedSource().name} news...`;
        loadingDiv.appendChild(loadingText);
        a.appendChild(loadingDiv);
        
        // Append to container
        container.appendChild(a);
        
        // Load the widget
        window.twttr.widgets.load(container);
        
        // Set loading to false when widget is loaded
        window.twttr.widgets.load(container).then(() => {
          setIsLoading(false);
        });
      }
    }
  };

  createEffect(() => {
    // When selected source changes, reload the Twitter widget
    if (selectedSource()) {
      loadTwitterWidget();
    }
  });

  onMount(() => {
    // Initial load
    loadTwitterWidget();
  });

  return (
    <div class="bg-white/95 backdrop-blur rounded-lg shadow-xl p-4">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-semibold text-blue-800">Market News</h2>
        
        {/* Dropdown menu */}
        <div class="relative">
          <button 
            onClick={toggleDropdown}
            class="flex items-center gap-1 text-sm text-blue-800 hover:text-blue-600 focus:outline-none"
          >
            {selectedSource().name}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <Show when={isDropdownOpen()}>
            <div class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
              <ul class="py-1">
                {NEWS_SOURCES.map(source => (
                  <li>
                    <button
                      class={`block px-4 py-2 text-sm w-full text-left ${
                        selectedSource().id === source.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => selectSource(source)}
                    >
                      {source.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Show>
        </div>
      </div>
      
      <div class="w-full" style={{ height: "152px", overflow: "hidden" }} id="twitter-timeline-container">
        <Show when={isLoading()}>
          <div class="flex items-center justify-center h-full">
            <div class="text-blue-800 opacity-80 animate-pulse">
              Loading latest {selectedSource().name} news...
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default MarketNewsWidget;
