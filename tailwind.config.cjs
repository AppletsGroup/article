/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/applet-design/dist/*.{js,jsx,ts,tsx,mjs}',
    './node_modules/applet-shell/dist/*.{js,jsx,ts,tsx,mjs}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('applet-design-utility')
  ]
}
