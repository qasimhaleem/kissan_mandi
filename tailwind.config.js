/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#8FD19E',
        'primary-hover': '#6DBE82',
        cream: '#FAF6EA',
        dark: '#2B2B2B',
      },
    },
  },
  plugins: [],
};

