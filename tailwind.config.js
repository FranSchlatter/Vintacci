/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage-bg': '#f5f5dc', // Color hueso/beige
        'vintage-accent': '#333333', // Color oscuro
        'navy-blue': '#1E3A8A',
      },
      fontFamily: {
        'vintage': ['"Your Vintage Font"', 'sans-serif'], // Cambia esto por la fuente que uses
      },
    },
  },
  plugins: [],
}
