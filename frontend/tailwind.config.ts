import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          dark: '#0B0F19',
          card: '#111827',
          accent: '#6366F1'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '28px' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
