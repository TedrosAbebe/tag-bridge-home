/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ethiopian-green': '#009639',
        'ethiopian-yellow': '#FFCD00',
        'ethiopian-red': '#DA020E',
        'ethiopian-blue': '#0F4C75',
        ethiopian: {
          green: '#009639',
          yellow: '#FFCD00',
          red: '#DA020E',
          blue: '#0F4C75',
        },
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        }
      },
      fontFamily: {
        'amharic': ['Noto Sans Ethiopic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}