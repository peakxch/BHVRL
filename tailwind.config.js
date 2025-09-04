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
    },
  },
  plugins: [],
};