/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#080b1a", navy: "#10162b", panel: "#151b35",
        electric: "#6685ff", violet: "#a78bfa", mint: "#54e2b7",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      boxShadow: { glow: "0 0 35px rgba(118,104,237,.22)" },
    },
  },
  plugins: [],
};
