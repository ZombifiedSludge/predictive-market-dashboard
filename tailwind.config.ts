import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',  // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        navy: {
          900: 'rgb(0, 27, 83)'  // Dark mode gradient color
        }
      }
    },
  },
  plugins: [],
};

export default config;
