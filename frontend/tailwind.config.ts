import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { green: '#0F766E', blue: '#2563EB', orange: '#EA580C' } } } },
  plugins: []
} satisfies Config;
