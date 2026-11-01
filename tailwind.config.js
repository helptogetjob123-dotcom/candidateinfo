/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0E17',
          card: '#111726',
          input: '#0D1322',
          border: '#1F293D',
          hover: '#182135',
        },
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          accent: '#FF4D12',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
