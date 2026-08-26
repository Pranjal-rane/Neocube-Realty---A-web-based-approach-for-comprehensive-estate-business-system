/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#7A2E35",
          deep: "#5E2229",
          light: "#96444B",
        },
        cream: "#F2ECE6",
        offwhite: "#FAF8F5",
        ink: "#2A1E1F",
        muted: "#7A6E6C",
        sage: "#6B8F71",
        amber: "#C08A3E",
        rustred: "#B5473F",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,30,31,0.06), 0 1px 8px rgba(42,30,31,0.05)",
      },
    },
  },
  plugins: [],
};
