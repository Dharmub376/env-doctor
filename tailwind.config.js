/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6', // violet-500
          hover: '#7c3aed', // violet-600
        },
        secondary: '#6b7280', // gray-500
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c2d12',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      spacing: {
        'section': '2rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'purple-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
