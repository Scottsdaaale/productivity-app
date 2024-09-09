const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        light: '#1f2937',
        dark: '#e5e7eb',
        gray: {
          // You can name this whatever you want
          50: '#f3f3f3',
          100: '#dcdcdc',
          200: '#bebebe',
          300: '#a4a4a4',
          400: '#8c8c8c',
          500: '#6f6f6f',
          600: '#565656',
          700: '#3d3d3d',
          800: '#282828',
          900: '#171717',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
