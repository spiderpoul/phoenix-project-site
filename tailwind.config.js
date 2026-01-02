/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ember: {
          400: '#ff9b6a',
          500: '#ff7a3d',
          600: '#e85d24'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
