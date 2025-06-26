/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        amber: {
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
      },
      boxShadow: {
        gold: "0 4px 14px 0 rgba(245, 158, 11, 0.1)",
      },
      animation: {
        "subtle-pulse": "subtlePulse 8s ease-in-out infinite",
      },
      keyframes: {
        subtlePulse: {
          "0%, 100%": { transform: "scale(1.0)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
