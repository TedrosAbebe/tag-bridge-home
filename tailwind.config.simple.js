/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ethiopian-green': '#009639',
        'ethiopian-blue': '#0F4C75',
        'ethiopian-yellow': '#FFCD00',
        'ethiopian-red': '#DA020E',
      },
    },
  },
  plugins: [],
}