/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F1115',
        surface: '#171A21',
        primary: {
          DEFAULT: '#B88746',
          hover: '#C79A5C',
          muted: '#B8874633',
        },
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#9CA3AF',
        },
        border: {
          DEFAULT: '#252A34',
          subtle: '#1E222B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.4)',
        elevated: '0 8px 24px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.18s ease-out',
        popIn: 'popIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
};
