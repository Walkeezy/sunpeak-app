module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Define animation class
      animation: {
        "move-background": "move-bg 120s linear infinite",
        "move-background-faster": "move-bg 60s linear infinite",
      },
      // Define keyframes
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
