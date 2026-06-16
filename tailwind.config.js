/** @type {import('tailwindcss').Config} */
module.exports = {
  // Agora o Tailwind vai varrer todas as telas no app e todos os componentes
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        academicBlue: '#1E3A8A', // Mantendo as cores do EduToque
        eduOrange: '#F97316',
      }
    },
  },
  plugins: [],
}