module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "sunpeak-yellow": "#FBB829",
      },
      fontFamily: {
        sans: ['"Lexend"', "sans-serif"],
      },
      backgroundImage: {
        "loading-spinner": "url('/loading.svg')",
      },
      backgroundSize: {
        "50%": "50%",
      },
      animation: {
        "move-background": "move-bg 120s linear infinite",
        "move-background-faster": "move-bg 60s linear infinite",
      },
      keyframes: {
        "move-bg": {
          "0%": { "background-position": "1000px 0" },
          "100%": { "background-position": "0 0" },
        },
      },
    },
  },
  plugins: [],
};
