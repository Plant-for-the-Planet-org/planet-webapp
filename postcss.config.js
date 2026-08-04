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
