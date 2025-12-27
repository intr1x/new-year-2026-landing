import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0245EE',
          light: '#4070FF',
          dark: '#0131A9',
        },
      },
      fontFamily: {
        display: ['var(--font-rubik)', 'sans-serif'],
        handwriting: ['var(--font-caveat)', 'cursive'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

