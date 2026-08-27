import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5EB',
          100: '#FFE6CC',
          200: '#FFCCA3',
          300: '#FFAA70',
          400: '#FF7F38',
          500: '#FF5722', // Main vibrant NovaRide orange
          600: '#E64A19',
          700: '#D84315',
          800: '#BF360C',
          900: '#872304',
          DEFAULT: '#FF5722',
        },
        dark: {
          50: '#F8FAFC',
          100: '#E2E8F0',
          800: '#1E293B',
          900: '#0F172A',
          950: '#080C14',
          surface: '#111726',
          card: '#161D2F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(255, 87, 34, 0.4)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 8px 12px -4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
