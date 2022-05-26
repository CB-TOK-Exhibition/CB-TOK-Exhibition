module.exports = {
  content: ['./public/**/*.html', './src/**/*.vue'],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'helvetica' : ['Helvetica']
      },
      fontSize:{
        '7xl':"8.75rem"
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    },
  },
  plugins: [],
}
