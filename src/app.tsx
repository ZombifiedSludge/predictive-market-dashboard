import { A } from '@solidjs/router';
import ThemeProvider from './components/ThemeProvider';

declare global {
  interface Window {
    twttr: any;
  }
}

const App = (props: { children?: any }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen" onClick={createBubble}>
        <header className="relative bg-white shadow-lg">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-blue-50 to-transparent z-0"></div>
          <nav className="container relative z-10 mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <A href="/" className="relative -ml-4 -my-3 transform hover:scale-105 transition-transform duration-300">
                  <img src="/omenifylogo.png" alt="Omenify" className="h-16" />
                </A>
                <div className="h-8 w-8 ml-2 rounded-full bg-yellow-400 opacity-50 animate-pulse hidden md:block"></div>
              </div>
              <div className="flex space-x-10">
                <A 
                  href="/" 
                  className="font-serif font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
                >
                  Dashboard
                </A>
                <A 
                  href="/blog" 
                  className="font-serif font-bold text-blue-900 hover:text-blue-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
                >
                  Blog
                </A>
              </div>
            </div>
          </nav>
        </header>
        {props.children}
      </div>
    </ThemeProvider>
  );
};

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
