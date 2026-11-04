// Next.js already runs PostCSS on all CSS, after Sass, so .scss syntax still compiles.
// This file's presence replaces Next.js's default PostCSS plugins, so it repeats those defaults alongside Tailwind.
module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        // Matches Next.js 15's default targets (MODERN_BROWSERSLIST_TARGET), so prefixes on existing SCSS stay the same.
        // Next.js 16 changes these defaults, so update this list when upgrading.
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
