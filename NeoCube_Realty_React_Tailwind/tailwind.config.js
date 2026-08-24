/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fbf4f3',
          100: '#f5e7e5',
          200: '#ebcfcc',
          300: '#ddaead',
          400: '#c98283',
          500: '#a9555b',
          600: '#8c343b',
          700: '#7b2d34',
          800: '#66252b',
          900: '#512024',
        },
        ink: '#231f20',
        cream: '#fbf6f3',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(81, 32, 36, 0.12)',
      },
    },
  },
  plugins: [],
}
