/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5B4DFF',
        surface: '#F8F9FF',
      },
      boxShadow: {
        soft: '0 18px 35px rgba(93, 76, 255, 0.08)',
        card: '0 12px 28px rgba(18, 22, 55, 0.08)',
      },
      borderRadius: {
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

