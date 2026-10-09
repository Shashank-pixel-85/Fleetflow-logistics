/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#dceaff",
          500: "#3977ff",
          600: "#2862e8",
          700: "#1f4fc0"
        }
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
}
