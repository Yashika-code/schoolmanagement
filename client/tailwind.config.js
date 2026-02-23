/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e9ff",
          200: "#b2d4ff",
          300: "#84b5ff",
          400: "#5190ff",
          500: "#2e6df2",
          600: "#1f52c9",
          700: "#173fa0",
          800: "#142f73",
          900: "#0d1f4a",
        },
      },
    },
  },
  plugins: [],
};
