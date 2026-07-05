/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f5a38",
        secondary: "#3d9b50",
        accent: "#f59e0b",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 35px rgba(21, 128, 61, 0.25)",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(61,155,80,0.25), transparent 30%), radial-gradient(circle at 80% 0%, rgba(245,158,11,0.2), transparent 35%), linear-gradient(180deg, #f3fff8, #f9fffb 35%, #f6fef7)",
      },
    },
  },
  plugins: [],
};

