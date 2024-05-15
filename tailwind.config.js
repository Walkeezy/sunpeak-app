module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sunpeak-yellow': '#FBB829',
      },
      fontFamily: {
        sans: ['var(--lexend-font)', 'sans-serif'],
      },
      animation: {
        'move-background': 'move-bg 120s linear infinite',
        'move-background-faster': 'move-bg 60s linear infinite',
      },
      keyframes: {
        'move-bg': {
          '0%': { 'background-position': '1000px 0' },
          '100%': { 'background-position': '0 0' },
        },
      },
    },
  },
  variants: {
    margin: ['first'],
  },
  plugins: [],
};
