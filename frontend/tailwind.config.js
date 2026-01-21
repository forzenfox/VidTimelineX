/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f8f8f6',
        ink: '#0a0a08',
        muted: '#666666',
        accent: '#111111',
        'card-bg': '#ffffff',
        'ink-blue': '#3a4a5a',
        'light-brown': '#d4a76a',
        'light-cyan': '#a8c686',
        'shadow-light': 'rgba(0, 0, 0, 0.08)',
        'shadow-medium': 'rgba(0, 0, 0, 0.12)',
        'shadow-heavy': 'rgba(0, 0, 0, 0.18)',
      },
      fontFamily: {
        'noto-serif': ['"Noto Serif SC"', 'serif'],
        'zcool': ['"ZCOOL KuaiLe"', 'cursive'],
      },
    },
  },
  plugins: [],
}