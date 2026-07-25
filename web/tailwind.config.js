/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fex: {
          bg: "#0a0a0f",
          panel: "#12121a",
          border: "#1e1e2e",
          accent: "#6366f1",
          accentHover: "#818cf8",
          violet: "#8b5cf6",
          text: "#f4f4f5",
          muted: "#71717a",
          success: "#22c55e",
          error: "#ef4444"
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    }
  },
  plugins: []
};
