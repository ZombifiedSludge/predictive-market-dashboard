// ThemeProvider.tsx
import { createSignal, createEffect, JSX } from 'solid-js';

interface ThemeProviderProps {
  children: JSX.Element;
}

const ThemeProvider = (props: ThemeProviderProps) => {
  const [isDark, setIsDark] = createSignal(localStorage.getItem('theme') === 'dark');

  createEffect(() => {
    document.documentElement.classList.toggle('dark', isDark());
    localStorage.setItem('theme', isDark() ? 'dark' : 'light');
  });

  return (
    <div class="min-h-screen transition-colors duration-300">
      <button
        onClick={() => setIsDark(!isDark())}
        class="fixed top-4 right-4 p-2 rounded-full bg-white/95"
        aria-label="Toggle theme"
      >
        {isDark() ? '🌕' : '🌑'}
      </button>
      {props.children}
    </div>
  );
};

export default ThemeProvider;
