module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
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
    extend: {},
  },
  plugins: [],
}
