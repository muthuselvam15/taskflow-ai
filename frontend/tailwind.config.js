/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151E2E',
          950: '#0B0F19',
        },
        indigo: {
          300: '#C95636',
          400: '#B94A31',
          500: '#CE5738',
          600: '#B94A31',
          700: '#9B3E29',
          950: '#F5E7DD',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
