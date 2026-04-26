import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Source: docs/DESIGN.md (1:1)
        primary: {
          DEFAULT: '#0052FF',
          hover: '#0042CC',
        },
        'on-primary': '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFC',
        },
        'border-strong': '#CBD5E1',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        // Tokens consumed via next/font CSS variables set in app/layout.tsx
        serif: ['var(--font-source-serif)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        kohero: ['var(--font-pretendard)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      letterSpacing: {
        // Source: docs/DESIGN.md typography
        display: '-0.02em',
        h1: '-0.015em',
        caps: '0.06em',
      },
      spacing: {
        // Names mirror DESIGN.md spacing scale
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        xxl: '96px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
