/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        low: '#00FF00',
        medium: '#FFFF00',
        high: '#FFA500',
        critical: '#FF0000',
      }
    },
  },
  plugins: [],
}