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
        <header className="bg-white shadow-lg">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <A href="/"><img src="/omenifylogo.png" alt="Omenify" className="h-8" /></A>
              <div className="flex space-x-8">
                <A href="/" className="font-serif font-bold text-blue-900 hover:text-blue-700">Dashboard</A>
                <A href="/blog" className="font-serif font-bold text-blue-900 hover:text-blue-700">Blog</A>
                <A href="#sources" className="font-serif font-bold text-blue-900 hover:text-blue-700">Sources</A>
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
