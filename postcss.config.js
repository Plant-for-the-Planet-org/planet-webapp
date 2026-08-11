// Sass runs before PostCSS, so .scss syntax continues to compile.
// Defining this file replaces Next.js's default PostCSS plugins,
// so preserve the required defaults alongside Tailwind.
module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        // Matches Next.js 14's own MODERN_BROWSERSLIST_TARGET (used when no
        // browserslist config exists), so autoprefixer output for existing
        // SCSS/CSS is unchanged from before this file was introduced.
        browsers: [
          'chrome 64',
          'edge 79',
          'firefox 67',
          'opera 51',
          'safari 12',
        ],
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
  ],
};
