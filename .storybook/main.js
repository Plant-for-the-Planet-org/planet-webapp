module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  webpackFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve || {}).fallback,
        fs: false,
        path: require.resolve('path-browserify'),
      },
    };

    return config;
  },

  staticDirs: ['../public'],

  env: (config) => ({
    ...config,
    STORYBOOK_IS_STORYBOOK: true,
  }),
};
