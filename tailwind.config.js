/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        'anti-2/4': '-50%',
        '50': '12.5rem',
        '128': '32rem',
        'anti-0.5': '-0.125rem',
      },
    },
    borderWidth: {
      '3': '3px',
    },
    borderRadius: {
      '15': '15px',
      '30': '30px',
    },
    fontFamily: {
      'inter': ['Inter', 'sans-serif'],
      'jeju-gothic': ['jeju-gothic', 'sans-serif'],
    }
  },
  plugins: [],
}
