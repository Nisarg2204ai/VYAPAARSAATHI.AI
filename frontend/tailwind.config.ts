import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Plus Jakarta Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        amberTheme: {
          bg: '#121110',
          surface: '#1A1816',
          surfaceLight: '#262320',
          primary: '#DA7756', // Claude Amber Terracotta
          gold: '#D97706',
          amberGlow: '#F59E0B',
          sapphire: '#0F4C81',
          cream: '#F5F2EC',
          muted: '#A8A29E',
          border: 'rgba(218, 119, 86, 0.22)'
        },
        brand: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#DA7756',
          600: '#D97706',
          700: '#0F4C81',
          dark: '#121110',
          card: '#1A1816',
          accent: '#DA7756'
        }
      },
      backgroundImage: {
        'claude-amber': 'linear-gradient(135deg, #DA7756 0%, #D97706 50%, #0F4C81 100%)',
        'deepflow-mesh': 'radial-gradient(circle at 50% 0%, #DA7756 0%, #1A1816 65%, #121110 100%)',
        'amber-glass': 'linear-gradient(135deg, rgba(218, 119, 86, 0.15) 0%, rgba(26, 24, 22, 0.85) 100%)'
      },
      boxShadow: {
        'amber-glow': '0 0 25px rgba(218, 119, 86, 0.35)',
        'sapphire-glow': '0 0 25px rgba(15, 76, 129, 0.35)',
        'glass-hover': '0 12px 40px rgba(218, 119, 86, 0.25)'
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.04)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
