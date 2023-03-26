/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  // content: [
  //   './src/**/*.{js,jsx,ts,tsx}',
  //   './node_modules/applet-design/**/*.{js,jsx,ts,tsx}'
  // ],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/applet-design/dist/*.{js,jsx,ts,tsx,mjs}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('applet-design-utility')
  ]
}
