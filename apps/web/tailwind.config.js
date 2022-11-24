// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      fontFamily: {
        inter: ["var(--font-inter)", ...fontFamily.sans],
      },
      animation: {
        "loader-spin-1":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -36ms infinite",
        "loader-spin-2":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -72ms infinite",
        "loader-spin-3":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -108ms infinite",
        "loader-spin-4":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -144ms infinite",
        "loader-spin-5":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -180ms infinite",
        "loader-spin-6":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -216ms infinite",
        "loader-spin-7":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -252ms infinite",
        "loader-spin-8":
          "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) -288ms infinite",
      },
    },
  },
  plugins: [],
};
