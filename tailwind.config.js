/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}" // <--- Adicione esta linha!
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryColor: '#05ADA7',
        secondaryColor: '#0C1338',
      }
    },
  },
  plugins: [],
}