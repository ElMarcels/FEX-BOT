/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fex: {
          bg: "#08090d",
          panel: "#11131a",
          border: "#252938",
          accent: "#38bdf8",
          violet: "#8b5cf6",
          text: "#f4f4f5",
          muted: "#8f96a3"
        }
      }
    }
  },
  plugins: []
};

