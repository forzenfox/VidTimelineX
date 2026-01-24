/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans SC", "sans-serif"],
        serif: ["Noto Serif SC", "serif"],
        poppins: ["Poppins", "sans-serif"],
        fredoka: ["Fredoka One", "cursive"],
        zcool: ["ZCOOLKuaiLe", "cursive"],
        "zcool-huangyou": ["ZCOOLQingKeHuangYou", "cursive"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
      },
      boxShadow: {
        custom: "var(--shadow-custom)",
      },
    },
  },
  plugins: [],
};
