import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052FF',
          light: '#E8EFFF',
          50: '#E8EFFF',
          100: '#D6E2FF',
          500: '#0052FF',
          600: '#0044D6',
          700: '#0038AD',
        },
        surface: '#F5F8FF',
        'surface-alt': '#F8FAFC',
        dark: '#0A0F1E',
        'op-red': '#FF0420',
        amber: {
          500: '#F59E0B',
        },
        success: {
          500: '#10B981',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        'gradient-mesh':
          'radial-gradient(at 0% 0%, rgba(0,82,255,.05) 0%, transparent 50%), radial-gradient(at 100% 0%, rgba(0,82,255,.03) 0%, transparent 50%), radial-gradient(at 50% 50%, #fff 0%, transparent 100%)',
      },
      backgroundSize: {
        'dot-grid': '32px 32px',
      },
    },
  },
  plugins: [],
};

export default config;
