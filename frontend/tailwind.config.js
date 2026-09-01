/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#101622',
          800: '#161F30',
          700: '#212D42',
        },
        neon: {
          cyan: '#00F0FF',
          violet: '#7000FF',
          emerald: '#00FF9D',
          amber: '#FFB800',
          rose: '#FF0055',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.4)',
        'glow-violet': '0 0 25px -5px rgba(112, 0, 255, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(0, 255, 157, 0.4)',
      },
    },
  },
  plugins: [],
}
