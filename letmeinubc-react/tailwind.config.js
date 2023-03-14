/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    borderRadius: {
      xl: "30px",
      md: "0.375rem",
      lg: "0.5rem",
      xlg: "0.75rem",
      "2xl": "1rem",
    },
    extend: {
      spacing: {
        128: "32rem",

        "almost-screen": "90vh",
        "half-screen": "50vh",
        ListH: "40vh",
        f20: "20%",
        n2: "-12px",
      },
      colors: {
        "ubc-blue": "#002145",
        "ubc-grey": "#888888",
        "cool-blue": "#071547",
        "highlight-blue": "#273250",
      },
      gridTemplateColumns: {
        14: "repeat(14, minmax(1fr))",
      },
    },
  },
  plugins: [],
};
