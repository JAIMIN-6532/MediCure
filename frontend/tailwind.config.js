/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#0e82fd",
        "dark-blue": "#002578",
        "light-blue": "#e8f6ff",

        primary: "#0066FF",
        secondary: "#64748b",
      },
    },
  },
  plugins: [],
};
