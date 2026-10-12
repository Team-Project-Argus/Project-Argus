/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { argus: { ink: "#101a31", navy: "#172a50", blue: "#a9c6ff", teal: "#65e2cf" } }, fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] } } },
  plugins: [],
};
