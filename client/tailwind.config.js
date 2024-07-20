/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar::-webkit-scrollbar': {
          'width': '12px',
        },
        '.custom-scrollbar::-webkit-scrollbar-track': {
          'background': '#1a1a1a',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          'background-color': '#1E3A8A',
          'border-radius': '6px',
          'border': '3px solid #1a1a1a',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          'background-color': '#2563EB',
        },
      })
    }
  ],
}