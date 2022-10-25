/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'error': {
          DEFAULT: '#FFD1D1'
        },
        'warning': {
          DEFAULT: '#FFD384'
        },
        'convention': {
          DEFAULT: '#FFF6BF'
        },
        'black': '#000000'
      },
    },
  }, 
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
