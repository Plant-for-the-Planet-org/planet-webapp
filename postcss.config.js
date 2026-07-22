// PostCSS config for Tailwind CSS v3.
// Next.js runs sass-loader before PostCSS, so existing .scss files keep working.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
