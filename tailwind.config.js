/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url('/src/Assets/hero_image.png')",
      },
    },
  },
  plugins: [],
}

