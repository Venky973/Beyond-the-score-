/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sports: {
          dark: '#0B132B',
          card: '#111C3A',
          border: '#1E2D54',
          accent: '#F97316',
          live: '#EF4444',
          success: '#10B981',
          gold: '#F59E0B',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Teko', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
