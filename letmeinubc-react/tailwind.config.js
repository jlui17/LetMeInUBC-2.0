/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/*/.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        "ubc-blue": "#002145",
        "ubc-grey": "#888888",
      },
    },
  },
  plugins: [],
};