/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: {
          500: '#4DAAE9',
          600: '#3B96D6',
        },
      },
      // ✨ Animated underline keyframes + animation
      keyframes: {
        underline: {
          '0%': { width: '0%', left: '0%' },
          '40%': { width: '100%', left: '0%' },
          '60%': { width: '100%', left: '0%' },
          '100%': { width: '0%', left: '100%' },
        },
      },
      animation: {
        underline: 'underline 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
