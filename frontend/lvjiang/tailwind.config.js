/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans SC', 'sans-serif'],
        'serif': ['Noto Serif SC', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'fredoka': ['Fredoka One', 'cursive'],
        'zcool': ['ZCOOLKuaiLe', 'cursive'],
        'zcool-huangyou': ['ZCOOLQingKeHuangYou', 'cursive'],
      },
    },
  },
  plugins: [],
}