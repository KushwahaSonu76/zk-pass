/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#030509',
          900: '#060B14',
          850: '#0B1220',
          800: '#111B2E',
          700: '#1C2B45',
          600: '#2A3E60',
        },
        prism: {
          emerald: '#00FFB3',
          teal: '#00E5FF',
          purple: '#9D4EDD',
          indigo: '#5A189A',
          amber: '#FFC048',
          crimson: '#FF2E93',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'prism-emerald': '0 0 35px -5px rgba(0, 255, 179, 0.35)',
        'prism-purple': '0 0 35px -5px rgba(157, 78, 221, 0.35)',
        'prism-teal': '0 0 35px -5px rgba(0, 229, 255, 0.35)',
        'inner-glow': 'inset 0 0 20px rgba(0, 255, 179, 0.1)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at 50% 50%, rgba(0, 255, 179, 0.05) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
