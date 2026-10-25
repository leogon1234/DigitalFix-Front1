/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '10': '10px',
        xs: '10px',
        sm: '10px',
        md: '10px',
        lg: '10px',
        xl: '10px',
        DEFAULT: '10px',
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
