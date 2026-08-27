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
          50: '#F4F4F5',
          100: '#E4E4E7',
          200: '#D4D4D8',
          300: '#A1A1AA',
          400: '#71717A',
          500: '#18181B', // Pure dark zinc
          600: '#09090B',
          700: '#000000', // Pure black
          800: '#000000',
          900: '#000000',
          DEFAULT: '#000000',
        },
        dark: {
          50: '#F8FAFC',
          100: '#E2E8F0',
          800: '#18181B',
          900: '#09090B',
          950: '#000000',
          surface: '#0B0F17',
          card: '#121722',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px -3px rgba(0, 0, 0, 0.35)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.12), 0 8px 12px -4px rgba(0, 0, 0, 0.08)',
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
