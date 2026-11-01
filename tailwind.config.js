/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1A73E8',
          'blue-hover': '#1765CC',
          'blue-active': '#1557B0',
          'blue-bg': '#E8F0FE',
          'blue-border': '#AECBFA',
          'gray-bg': '#F8F9FA',
          card: '#FFFFFF',
          border: '#DADCE0',
          'border-hover': '#BDC1C6',
          'text-primary': '#202124',
          'text-secondary': '#5F6368',
          'text-tertiary': '#80868B',
          green: '#1E8E3E',
          'green-bg': '#E6F4EA',
          red: '#D93025',
          'red-bg': '#FCE8E6',
          amber: '#F9AB00',
        },
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          input: '#2D2D2D',
          border: '#3E3E3E',
          hover: '#2A2A2A',
          text: '#E3E3E3',
          'text-muted': '#9AA0A6',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'google-card': '0 1px 2px 0 rgba(60,64,67,0.1), 0 1px 3px 1px rgba(60,64,67,0.06)',
        'google-hover': '0 1px 3px 0 rgba(60,64,67,0.15), 0 4px 8px 3px rgba(60,64,67,0.08)',
        'google-nav': '0 1px 2px 0 rgba(60,64,67,0.08)',
      },
    },
  },
  plugins: [],
}