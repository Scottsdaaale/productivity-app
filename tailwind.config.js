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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
