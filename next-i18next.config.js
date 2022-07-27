const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'fr', 'it', 'pt-Br'],
  },
  fallBackLang: 'en',
  localePath: path.resolve('./public/static/locales'),
};
