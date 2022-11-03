const path = require('path');

module.exports = {
  i18n: {
    fallbackLng: 'en',
    defaultLocale: 'en',
    locales: ['en', 'de', 'cs', 'es', 'fr', 'it', 'pt-BR'],
    localeDetection: false,
  },
  localePath: path.resolve('./public/static/locales'),
  reloadOnPrerender: false,
};
