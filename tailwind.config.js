/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: '#08080A',
          deep: '#050507',
          surface: '#0F1014',
          input: '#0C0D10',
          hover: '#15171C',
        },
        hairline: {
          DEFAULT: '#22242A',
          light: '#2A2D35',
          muted: '#1A1B20',
          focus: '#EAEAEA',
        },
        stark: {
          DEFAULT: '#F4F4F6',
          off: '#E0E0E6',
          muted: '#A2A7B5',
          steel: '#7A7F8A',
          dim: '#484D58',
        },
        signal: {
          orange: '#FF3B00',
          'orange-dim': '#CC2F00',
          aluminum: '#D4D8E0',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '1px',
        DEFAULT: '0px',
        md: '2px',
        lg: '2px',
      },
      letterSpacing: {
        technical: '0.12em',
        tightest: '-0.035em',
        tight: '-0.02em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      transitionTimingFunction: {
        mechanical: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}
